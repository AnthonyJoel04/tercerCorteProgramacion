"use strict";

/*
  LIBRERÍAS (FUNCIONES GLOBALES DEL PROYECTO)

  Propósito:
  - Centralizar TODAS las funciones globales del proyecto (requisito estricto).
  - Mantener el código modularizado por responsabilidades, pero sin POO.

  Convenciones:
  - Notación camelCase para variables y funciones.
  - Nomenclatura nemotécnica (nombres descriptivos, sin i/j/k/l como control de ciclos).
  - Sin break/continue en ciclos (se usan métodos de arrays o ciclos sin interrupciones).

  Seguridad y buenas prácticas:
  - No se usa innerHTML para renderizar valores del usuario (mitigación XSS/DOM Injection).
  - Todas las entradas se sanitizan y validan antes de guardarse.
  - Se respetan restricciones de accesibilidad (ARIA, focus, mensajes en vivo).

  Documentación de vulnerabilidades mitigadas (requisito):

  1) Vulnerabilidad: DOM XSS / Inyección HTML
     Detalle: Si se inserta input del usuario con innerHTML, un atacante podría inyectar etiquetas
              <script> o atributos onerror/onload.
     Explotación: Ejemplo: nombres = "<img src=x onerror=alert(1)>"
                  Si se renderiza con innerHTML, el navegador ejecuta el payload.
     Criticidad: Alta.
     Mitigación: Se sanitizan entradas y, al mostrar texto, se usa textContent.

  2) Vulnerabilidad: Stored XSS (persistencia en datos)
     Detalle: Si se guardan valores sin validar y posteriormente se listan con HTML no seguro, el payload
              queda “almacenado” en memoria y ejecuta al listar.
     Explotación: Similar a DOM XSS, pero persistente.
     Criticidad: Alta.
     Mitigación: Se valida/sanitiza ANTES de guardar en el array clientes.

  3) Vulnerabilidad: ReDoS (Regular Expression Denial of Service)
     Detalle: Expresiones regulares complejas con cuantificadores anidados pueden causar consumo elevado
              de CPU con ciertos inputs largos.
     Explotación: En formularios, el atacante pega un string diseñado para disparar backtracking.
     Criticidad: Media.
     Mitigación: Regex simples y límites de longitud (maxlength + sanitización).
*/

let createClientDuplicateResetTimeoutId = null;

/*
  ========= UTILIDADES DE DOM (SEGURAS) =========
*/

/* Asigna texto seguro a un nodo, evitando inyección HTML */
function setSafeText(targetNode, textValue) {
  const finalText = typeof textValue === "string" ? textValue : String(textValue ?? "");
  if (!targetNode) return;
  targetNode.textContent = finalText;
}

/* Crea un elemento option seguro (texto con textContent) */
function createSafeOption({ value, labelText }) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = labelText;
  return option;
}

/* Elimina todas las opciones de un <select> sin romper el nodo */
function clearSelectOptions(selectNode) {
  if (!selectNode) return;
  selectNode.textContent = "";
}

/*
  ========= SANITIZACIÓN (ENTRADAS) =========
*/

/* Sanitiza texto general: recorta, colapsa espacios y elimina caracteres de control */
function sanitizeGeneralText(rawValue, maxLength) {
  const baseText = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
  const trimmedText = baseText.trim();
  const withoutControls = trimmedText.replace(/[\u0000-\u001F\u007F]/g, "");
  const collapsedSpaces = withoutControls.replace(/\s+/g, " ");
  const limitedText = typeof maxLength === "number" ? collapsedSpaces.slice(0, maxLength) : collapsedSpaces;
  const withoutAngleBrackets = limitedText.replace(/[<>]/g, "");
  return withoutAngleBrackets;
}

function sanitizeGeneralTextForTyping(rawValue, maxLength) {
  const baseText = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
  const withoutControls = baseText.replace(/[\u0000-\u001F\u007F]/g, "");
  const collapsedSpaces = withoutControls.replace(/\s+/g, " ");
  const limitedText = typeof maxLength === "number" ? collapsedSpaces.slice(0, maxLength) : collapsedSpaces;
  const withoutAngleBrackets = limitedText.replace(/[<>]/g, "");
  const withoutLeadingSpaces = withoutAngleBrackets.replace(/^\s+/, "");
  return withoutLeadingSpaces;
}

/* Sanitiza números: elimina todo excepto dígitos */
function sanitizeDigitsOnly(rawValue, maxLength) {
  const baseText = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
  const onlyDigits = baseText.replace(/[^0-9]/g, "");
  const limitedDigits = typeof maxLength === "number" ? onlyDigits.slice(0, maxLength) : onlyDigits;
  return limitedDigits;
}

/* Sanitiza email: recorta y baja a minúsculas (sin “arreglar” la estructura) */
function sanitizeEmail(rawValue, maxLength) {
  const cleanEmail = sanitizeGeneralText(rawValue, maxLength);
  return cleanEmail.toLowerCase();
}

/*
  ========= VALIDACIÓN (FORMULARIO CREAR CLIENTE) =========
*/

function setFieldError({ inputNode, errorNode, message }) {
  if (inputNode) inputNode.setAttribute("aria-invalid", "true");
  setSafeText(errorNode, message);
}

function clearFieldError({ inputNode, errorNode }) {
  if (inputNode) inputNode.removeAttribute("aria-invalid");
  setSafeText(errorNode, "");
}

function validateIdentificacionField(identificacionValue) {
  const valueToValidate = sanitizeDigitsOnly(identificacionValue, 15);
  const isValid = regexIdentificacion.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function validateNombresField(nombresValue) {
  const sanitizedValue = sanitizeGeneralText(nombresValue, 80);
  const valueToValidate = sanitizedValue.toLocaleUpperCase("es-CO");
  const isValid = regexNombres.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function validateDireccionField(direccionValue) {
  const sanitizedValue = sanitizeGeneralText(direccionValue, 120);
  const valueToValidate = sanitizedValue.toLocaleUpperCase("es-CO");
  const isValid = regexDireccion.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function validateWhatsappField(whatsappValue) {
  const valueToValidate = sanitizeDigitsOnly(whatsappValue, 15);
  const isValid = regexWhatsapp.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function validateTelefonoField(telefonoValue) {
  const valueToValidate = sanitizeDigitsOnly(telefonoValue, 15);
  const isEmpty = valueToValidate.length === 0;
  if (isEmpty) return { isValid: true, value: "" };
  const isValid = regexTelefono.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function validateEmailField(emailValue) {
  const valueToValidate = sanitizeEmail(emailValue, 120);
  const isValid = regexEmail.test(valueToValidate);
  return { isValid, value: valueToValidate };
}

function isClienteIdentificacionRegistered(identificacionValue) {
  const cleanIdentificacion = typeof identificacionValue === "string" ? identificacionValue : String(identificacionValue ?? "");
  if (!cleanIdentificacion) return false;
  const alreadyExists = clientes.some((clienteRegistro) => String(clienteRegistro?.identificacion ?? "") === cleanIdentificacion);
  return alreadyExists;
}

function formatClientesCountLabel() {
  const clientesCount = Array.isArray(clientes) ? clientes.length : 0;
  const paddedCount = String(clientesCount).padStart(4, "0");
  return `#Clientes ${paddedCount}`;
}

function updateClientesCountBadges() {
  const labelText = formatClientesCountLabel();
  setSafeText(createClientUiContext?.countBadge ?? null, labelText);
  setSafeText(listClientsUiContext?.countBadge ?? null, labelText);
}

function getDepartamentoNombreById(idDepartamento) {
  const idDepartamentoNumber = typeof idDepartamento === "number" ? idDepartamento : Number(idDepartamento);
  const registro = departamentos.find((departamentoRegistro) => departamentoRegistro.idDepartamento === idDepartamentoNumber);
  return typeof registro?.nombre === "string" ? registro.nombre : "";
}

function getMunicipioNombreById(idMunicipio) {
  const idMunicipioNumber = typeof idMunicipio === "number" ? idMunicipio : Number(idMunicipio);
  const registro = municipios.find((municipioRegistro) => municipioRegistro.idMunicipio === idMunicipioNumber);
  return typeof registro?.nombre === "string" ? registro.nombre : "";
}

function getBarrioNombreById(idBarrio) {
  const idBarrioNumber = typeof idBarrio === "number" ? idBarrio : Number(idBarrio);
  const registro = barrios.find((barrioRegistro) => barrioRegistro.idBarrio === idBarrioNumber);
  return typeof registro?.nombre === "string" ? registro.nombre : "";
}

/*
  ========= ORDENAMIENTO Y FILTRADO (LISTAS) =========
*/

function getSortedByNombre(sourceArray) {
  const safeArray = Array.isArray(sourceArray) ? sourceArray.slice() : [];
  safeArray.sort((registroA, registroB) => {
    const nombreA = typeof registroA?.nombre === "string" ? registroA.nombre : "";
    const nombreB = typeof registroB?.nombre === "string" ? registroB.nombre : "";
    return nombreA.localeCompare(nombreB, "es", { sensitivity: "base" });
  });
  return safeArray;
}

function getMunicipiosByDepartamentoId(idDepartamento) {
  const idDepartamentoNumber = typeof idDepartamento === "number" ? idDepartamento : Number(idDepartamento);
  const filteredMunicipios = municipios.filter((municipioRegistro) => municipioRegistro.idDepartamento === idDepartamentoNumber);
  return getSortedByNombre(filteredMunicipios);
}

function getBarriosByMunicipioId(idMunicipio) {
  const idMunicipioNumber = typeof idMunicipio === "number" ? idMunicipio : Number(idMunicipio);
  const filteredBarrios = barrios.filter((barrioRegistro) => barrioRegistro.idMunicipio === idMunicipioNumber);
  return getSortedByNombre(filteredBarrios);
}

/*
  ========= TOAST (MENSAJE TEMPORAL) =========
*/

function showToast({ toastNode, message }) {
  if (!toastNode) return;

  if (toastTimeoutId) {
    window.clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }

  setSafeText(toastNode, message);
  toastNode.hidden = false;

  toastTimeoutId = window.setTimeout(() => {
    toastNode.hidden = true;
    setSafeText(toastNode, "");
    toastTimeoutId = null;
  }, uiToastDurationMs);
}

/*
  ========= VERSIÓN (UI) =========

  Requisito:
  - No “quemar” la versión directamente en el HTML.
  - Usar la constante global appVersion (de ENV.js) como única fuente de verdad.
*/
function initializeAppVersionUi({ appVersionBadgeNode, profileTitleNode, appName }) {
  const baseAppName = typeof appName === "string" && appName.trim() ? appName.trim() : "ClientesApp";
  const safeVersion = typeof appVersion === "string" ? appVersion.trim() : String(appVersion ?? "");
  const versionLabel = safeVersion ? `v${safeVersion}` : "v--";

  document.title = `${baseAppName} ${versionLabel} - Crear Clientes`;
  setSafeText(appVersionBadgeNode, versionLabel);
  setSafeText(profileTitleNode, `${baseAppName} ${versionLabel}`);
}

/*
  ========= MODAL (ABRIR/CERRAR) =========
*/

function openModal(modalNode, focusNode) {
  if (!modalNode) return;
  modalNode.hidden = false;
  modalNode.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (focusNode) focusNode.focus();
}

function closeModal(modalNode, focusNode) {
  if (!modalNode) return;
  modalNode.hidden = true;
  modalNode.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (focusNode) focusNode.focus();
}

function isModalOpen(modalNode) {
  if (!modalNode) return false;
  return modalNode.hidden === false;
}

function closeAllAppModals(exceptModalNode) {
  const createClientModalNode = createClientUiContext?.modal ?? null;
  const listClientsModalNode = listClientsUiContext?.modal ?? null;
  const logoutModalNode = appUiContext?.logoutModal ?? null;

  const shouldCloseCreateClient = createClientModalNode && createClientModalNode !== exceptModalNode && isModalOpen(createClientModalNode);
  if (shouldCloseCreateClient) closeModal(createClientModalNode, null);

  const shouldCloseListClients = listClientsModalNode && listClientsModalNode !== exceptModalNode && isModalOpen(listClientsModalNode);
  if (shouldCloseListClients) closeModal(listClientsModalNode, null);

  const shouldCloseLogout = logoutModalNode && logoutModalNode !== exceptModalNode && isModalOpen(logoutModalNode);
  if (shouldCloseLogout) closeModal(logoutModalNode, null);
}

function openExclusiveModal(modalNode, focusNode) {
  if (!modalNode) return;
  closeAllAppModals(modalNode);
  openModal(modalNode, focusNode);
}

/*
  ========= CREAR CLIENTE (UI + LÓGICA) =========
*/

function initializeCreateClientFeature(createClientElements) {
  if (!createClientElements) return;

  createClientUiContext = {
    menuButton: createClientElements.menuButton ?? null,
    modal: createClientElements.modal ?? null,
    form: createClientElements.form ?? null,
    toast: createClientElements.toast ?? null,
    saveButton: createClientElements.saveButton ?? null,
    cancelButton: createClientElements.cancelButton ?? null,
    countBadge: createClientElements.countBadge ?? null,
    identificacionInput: createClientElements.identificacionInput ?? null,
    nombresInput: createClientElements.nombresInput ?? null,
    direccionInput: createClientElements.direccionInput ?? null,
    whatsappInput: createClientElements.whatsappInput ?? null,
    telefonoInput: createClientElements.telefonoInput ?? null,
    emailInput: createClientElements.emailInput ?? null,
    departamentoSelect: createClientElements.departamentoSelect ?? null,
    municipioSelect: createClientElements.municipioSelect ?? null,
    barrioSelect: createClientElements.barrioSelect ?? null,
    identificacionError: createClientElements.identificacionError ?? null,
    nombresError: createClientElements.nombresError ?? null,
    direccionError: createClientElements.direccionError ?? null,
    whatsappError: createClientElements.whatsappError ?? null,
    telefonoError: createClientElements.telefonoError ?? null,
    emailError: createClientElements.emailError ?? null,
    departamentoError: createClientElements.departamentoError ?? null,
    municipioError: createClientElements.municipioError ?? null,
    barrioError: createClientElements.barrioError ?? null,
  };

  if (createClientUiContext.menuButton) createClientUiContext.menuButton.addEventListener("click", handleOpenCreateClient);
  if (createClientUiContext.cancelButton) createClientUiContext.cancelButton.addEventListener("click", handleCancelCreateClient);

  if (createClientUiContext.form) createClientUiContext.form.addEventListener("submit", handleSubmitCreateClient);

  if (createClientUiContext.identificacionInput) createClientUiContext.identificacionInput.addEventListener("input", handleCreateClientInput);
  if (createClientUiContext.nombresInput) createClientUiContext.nombresInput.addEventListener("input", handleCreateClientInput);
  if (createClientUiContext.direccionInput) createClientUiContext.direccionInput.addEventListener("input", handleCreateClientInput);
  if (createClientUiContext.whatsappInput) createClientUiContext.whatsappInput.addEventListener("input", handleCreateClientInput);
  if (createClientUiContext.telefonoInput) createClientUiContext.telefonoInput.addEventListener("input", handleCreateClientInput);
  if (createClientUiContext.emailInput) createClientUiContext.emailInput.addEventListener("input", handleCreateClientInput);

  if (createClientUiContext.departamentoSelect) createClientUiContext.departamentoSelect.addEventListener("change", handleDepartamentoChange);
  if (createClientUiContext.municipioSelect) createClientUiContext.municipioSelect.addEventListener("change", handleMunicipioChange);
  if (createClientUiContext.barrioSelect) createClientUiContext.barrioSelect.addEventListener("change", handleBarrioChange);

  resetCreateClientFormState();
}

function handleOpenCreateClient() {
  if (!createClientUiContext) return;
  resetCreateClientFormState();
  updateClientesCountBadges();
  openExclusiveModal(createClientUiContext.modal, createClientUiContext.identificacionInput);
}

function handleCancelCreateClient() {
  if (!createClientUiContext) return;
  closeModal(createClientUiContext.modal, createClientUiContext.menuButton);
  resetCreateClientFormState();
}

function handleCreateClientInput(event) {
  if (!createClientUiContext) return;
  const targetInput = event?.target ?? null;

  if (targetInput === createClientUiContext.identificacionInput) {
    if (createClientDuplicateResetTimeoutId) {
      window.clearTimeout(createClientDuplicateResetTimeoutId);
      createClientDuplicateResetTimeoutId = null;
    }
    if (createClientUiContext.countBadge) createClientUiContext.countBadge.hidden = false;

    targetInput.value = sanitizeDigitsOnly(targetInput.value, 15);
    createClientIdentificacionDuplicated = false;
    clearFieldError({ inputNode: createClientUiContext.identificacionInput, errorNode: createClientUiContext.identificacionError });

    const identificacionValidated = validateIdentificacionField(targetInput.value);
    const shouldCheckDuplicate = identificacionValidated.isValid;
    if (shouldCheckDuplicate && isClienteIdentificacionRegistered(identificacionValidated.value)) {
      createClientIdentificacionDuplicated = true;
      setFieldError({
        inputNode: createClientUiContext.identificacionInput,
        errorNode: createClientUiContext.identificacionError,
        message: "El cliente ya existe. Digite otra identificación.",
      });
      if (createClientUiContext.countBadge) createClientUiContext.countBadge.hidden = true;
      createClientDuplicateResetTimeoutId = window.setTimeout(() => {
        createClientDuplicateResetTimeoutId = null;
        if (!createClientUiContext) return;

        createClientIdentificacionDuplicated = false;
        if (createClientUiContext.identificacionInput) createClientUiContext.identificacionInput.value = "";
        clearFieldError({ inputNode: createClientUiContext.identificacionInput, errorNode: createClientUiContext.identificacionError });
        if (createClientUiContext.countBadge) createClientUiContext.countBadge.hidden = false;
        validateCreateClientFormAndToggleSave();
        if (createClientUiContext.identificacionInput) createClientUiContext.identificacionInput.focus();
      }, 5000);
      validateCreateClientFormAndToggleSave();
      return;
    }
  }

  if (targetInput === createClientUiContext.whatsappInput) {
    targetInput.value = sanitizeDigitsOnly(targetInput.value, 15);
  }

  if (targetInput === createClientUiContext.telefonoInput) {
    targetInput.value = sanitizeDigitsOnly(targetInput.value, 15);
  }

  if (targetInput === createClientUiContext.emailInput) {
    targetInput.value = sanitizeEmail(targetInput.value, 120);
  }

  if (targetInput === createClientUiContext.nombresInput) {
    const sanitizedValue = sanitizeGeneralTextForTyping(targetInput.value, 80);
    targetInput.value = sanitizedValue.toLocaleUpperCase("es-CO");
  }

  if (targetInput === createClientUiContext.direccionInput) {
    const sanitizedValue = sanitizeGeneralTextForTyping(targetInput.value, 120);
    targetInput.value = sanitizedValue.toLocaleUpperCase("es-CO");
  }

  validateCreateClientFormAndToggleSave();
}

function handleDepartamentoChange() {
  if (!createClientUiContext) return;

  const selectedValue = createClientUiContext.departamentoSelect?.value ?? "";
  selectedDepartamentoId = selectedValue ? Number(selectedValue) : null;
  selectedMunicipioId = null;
  selectedBarrioId = null;

  populateMunicipioSelect();
  populateBarrioSelect();
  validateCreateClientFormAndToggleSave();
}

function handleMunicipioChange() {
  if (!createClientUiContext) return;

  const selectedValue = createClientUiContext.municipioSelect?.value ?? "";
  selectedMunicipioId = selectedValue ? Number(selectedValue) : null;
  selectedBarrioId = null;

  populateBarrioSelect();
  validateCreateClientFormAndToggleSave();
}

function handleBarrioChange() {
  if (!createClientUiContext) return;

  const selectedValue = createClientUiContext.barrioSelect?.value ?? "";
  selectedBarrioId = selectedValue ? Number(selectedValue) : null;

  validateCreateClientFormAndToggleSave();
}

function handleSubmitCreateClient(submitEvent) {
  if (submitEvent) submitEvent.preventDefault();
  if (!createClientUiContext) return;

  createClientHasAttemptedSubmit = true;

  const isFormValid = validateCreateClientFormAndToggleSave();
  if (!isFormValid) return;

  let newClientRecord = buildClientRecordFromForm();
  if (!newClientRecord) return;

  clientes.push(newClientRecord);
  updateClientesCountBadges();
  if (isModalOpen(listClientsUiContext?.modal ?? null)) renderListClients();

  showToast({ toastNode: createClientUiContext.toast, message: "El cliente ha sido guardado correctamente." });
  closeModal(createClientUiContext.modal, createClientUiContext.menuButton);
  resetCreateClientFormState();

  /* Liberación explícita de referencia local (ayuda al GC y evita retener objetos por accidente) */
  newClientRecord = null;
}

function buildClientRecordFromForm() {
  if (!createClientUiContext) return null;

  const identificacionValue = createClientUiContext.identificacionInput?.value ?? "";
  const nombresValue = createClientUiContext.nombresInput?.value ?? "";
  const direccionValue = createClientUiContext.direccionInput?.value ?? "";
  const whatsappValue = createClientUiContext.whatsappInput?.value ?? "";
  const telefonoValue = createClientUiContext.telefonoInput?.value ?? "";
  const emailValue = createClientUiContext.emailInput?.value ?? "";

  const identificacionValidated = validateIdentificacionField(identificacionValue);
  const nombresValidated = validateNombresField(nombresValue);
  const direccionValidated = validateDireccionField(direccionValue);
  const whatsappValidated = validateWhatsappField(whatsappValue);
  const telefonoValidated = validateTelefonoField(telefonoValue);
  const emailValidated = validateEmailField(emailValue);

  const idDepartamentoValue = selectedDepartamentoId;
  const idMunicipioValue = selectedMunicipioId;
  const idBarrioValue = selectedBarrioId;

  const isSelectionValid =
    typeof idDepartamentoValue === "number" && typeof idMunicipioValue === "number" && typeof idBarrioValue === "number";

  const isAllValid =
    identificacionValidated.isValid &&
    nombresValidated.isValid &&
    direccionValidated.isValid &&
    whatsappValidated.isValid &&
    telefonoValidated.isValid &&
    emailValidated.isValid &&
    isSelectionValid;

  if (!isAllValid) return null;

  const nextIdCliente = getNextClienteId();

  const clientRecord = {
    idCliente: nextIdCliente,
    identificacion: identificacionValidated.value,
    nombres: nombresValidated.value,
    idDepartamento: idDepartamentoValue,
    idMunicipio: idMunicipioValue,
    idBarrio: idBarrioValue,
    direccion: direccionValidated.value,
    whatsapp: whatsappValidated.value,
    telefono: telefonoValidated.value ? telefonoValidated.value : null,
    email: emailValidated.value,
  };

  return clientRecord;
}

function getNextClienteId() {
  const currentMaxId = clientes.reduce((maxId, clienteRegistro) => {
    const currentId = typeof clienteRegistro?.idCliente === "number" ? clienteRegistro.idCliente : 0;
    return currentId > maxId ? currentId : maxId;
  }, 0);
  return currentMaxId + 1;
}

function resetCreateClientFormState() {
  if (createClientDuplicateResetTimeoutId) {
    window.clearTimeout(createClientDuplicateResetTimeoutId);
    createClientDuplicateResetTimeoutId = null;
  }
  if (createClientUiContext?.countBadge) createClientUiContext.countBadge.hidden = false;

  createClientHasAttemptedSubmit = false;
  createClientIdentificacionDuplicated = false;
  selectedDepartamentoId = null;
  selectedMunicipioId = null;
  selectedBarrioId = null;

  resetCreateClientFormControls();
  populateDepartamentoSelect();
  populateMunicipioSelect();
  populateBarrioSelect();
  validateCreateClientFormAndToggleSave();
  updateClientesCountBadges();
}

function resetCreateClientFormControls() {
  if (!createClientUiContext) return;

  if (createClientUiContext.form) createClientUiContext.form.reset();

  clearFieldError({ inputNode: createClientUiContext.identificacionInput, errorNode: createClientUiContext.identificacionError });
  clearFieldError({ inputNode: createClientUiContext.nombresInput, errorNode: createClientUiContext.nombresError });
  clearFieldError({ inputNode: createClientUiContext.departamentoSelect, errorNode: createClientUiContext.departamentoError });
  clearFieldError({ inputNode: createClientUiContext.municipioSelect, errorNode: createClientUiContext.municipioError });
  clearFieldError({ inputNode: createClientUiContext.barrioSelect, errorNode: createClientUiContext.barrioError });
  clearFieldError({ inputNode: createClientUiContext.direccionInput, errorNode: createClientUiContext.direccionError });
  clearFieldError({ inputNode: createClientUiContext.whatsappInput, errorNode: createClientUiContext.whatsappError });
  clearFieldError({ inputNode: createClientUiContext.telefonoInput, errorNode: createClientUiContext.telefonoError });
  clearFieldError({ inputNode: createClientUiContext.emailInput, errorNode: createClientUiContext.emailError });
}

function populateDepartamentoSelect() {
  if (!createClientUiContext?.departamentoSelect) return;

  clearSelectOptions(createClientUiContext.departamentoSelect);
  createClientUiContext.departamentoSelect.appendChild(createSafeOption({ value: "", labelText: "Seleccione..." }));

  const departamentosOrdenados = getSortedByNombre(departamentos);
  departamentosOrdenados.forEach((departamentoRegistro) => {
    const optionValue = String(departamentoRegistro.idDepartamento);
    const labelText = `${departamentoRegistro.idDepartamento} - ${departamentoRegistro.nombre}`;
    createClientUiContext.departamentoSelect.appendChild(createSafeOption({ value: optionValue, labelText }));
  });
}

function populateMunicipioSelect() {
  if (!createClientUiContext?.municipioSelect) return;

  clearSelectOptions(createClientUiContext.municipioSelect);
  createClientUiContext.municipioSelect.appendChild(createSafeOption({ value: "", labelText: "Seleccione..." }));

  if (typeof selectedDepartamentoId !== "number") return;

  const municipiosOrdenados = getMunicipiosByDepartamentoId(selectedDepartamentoId);
  municipiosOrdenados.forEach((municipioRegistro) => {
    const optionValue = String(municipioRegistro.idMunicipio);
    const labelText = `${municipioRegistro.idMunicipio} - ${municipioRegistro.nombre}`;
    createClientUiContext.municipioSelect.appendChild(createSafeOption({ value: optionValue, labelText }));
  });
}

function populateBarrioSelect() {
  if (!createClientUiContext?.barrioSelect) return;

  clearSelectOptions(createClientUiContext.barrioSelect);
  createClientUiContext.barrioSelect.appendChild(createSafeOption({ value: "", labelText: "Seleccione..." }));

  if (typeof selectedMunicipioId !== "number") return;

  const barriosOrdenados = getBarriosByMunicipioId(selectedMunicipioId);
  barriosOrdenados.forEach((barrioRegistro) => {
    const optionValue = String(barrioRegistro.idBarrio);
    const labelText = `${barrioRegistro.idBarrio} - ${barrioRegistro.nombre}`;
    createClientUiContext.barrioSelect.appendChild(createSafeOption({ value: optionValue, labelText }));
  });
}

function validateCreateClientFormAndToggleSave() {
  if (!createClientUiContext) return false;

  const identificacionRaw = createClientUiContext.identificacionInput?.value ?? "";
  const identificacionValidated = validateIdentificacionField(identificacionRaw);
  const identificacionHasValue = identificacionValidated.value.length > 0;
  if (createClientIdentificacionDuplicated) {
    setFieldError({
      inputNode: createClientUiContext.identificacionInput,
      errorNode: createClientUiContext.identificacionError,
      message: "El cliente ya existe. Digite otra identificación.",
    });
    if (createClientUiContext.saveButton) createClientUiContext.saveButton.disabled = true;
    return false;
  }
  if (!identificacionValidated.isValid && (createClientHasAttemptedSubmit || identificacionHasValue)) {
    setFieldError({
      inputNode: createClientUiContext.identificacionInput,
      errorNode: createClientUiContext.identificacionError,
      message: "Identificación inválida. Use solo números (5 a 15).",
    });
  } else if (identificacionValidated.isValid || !createClientHasAttemptedSubmit) {
    clearFieldError({ inputNode: createClientUiContext.identificacionInput, errorNode: createClientUiContext.identificacionError });
  }

  const nombresRaw = createClientUiContext.nombresInput?.value ?? "";
  const nombresValidated = validateNombresField(nombresRaw);
  const nombresHasValue = nombresValidated.value.length > 0;
  if (!nombresValidated.isValid && (createClientHasAttemptedSubmit || nombresHasValue)) {
    setFieldError({
      inputNode: createClientUiContext.nombresInput,
      errorNode: createClientUiContext.nombresError,
      message: "Nombres inválidos. Use letras y espacios (mínimo 3).",
    });
  } else if (nombresValidated.isValid || !createClientHasAttemptedSubmit) {
    clearFieldError({ inputNode: createClientUiContext.nombresInput, errorNode: createClientUiContext.nombresError });
  }

  const direccionRaw = createClientUiContext.direccionInput?.value ?? "";
  const direccionValidated = validateDireccionField(direccionRaw);
  const direccionHasValue = direccionValidated.value.length > 0;
  if (!direccionValidated.isValid && (createClientHasAttemptedSubmit || direccionHasValue)) {
    setFieldError({
      inputNode: createClientUiContext.direccionInput,
      errorNode: createClientUiContext.direccionError,
      message: "Dirección inválida. Use letras, números, espacios y # - (mínimo 5).",
    });
  } else if (direccionValidated.isValid || !createClientHasAttemptedSubmit) {
    clearFieldError({ inputNode: createClientUiContext.direccionInput, errorNode: createClientUiContext.direccionError });
  }

  const whatsappRaw = createClientUiContext.whatsappInput?.value ?? "";
  const whatsappValidated = validateWhatsappField(whatsappRaw);
  const whatsappHasValue = whatsappValidated.value.length > 0;
  if (!whatsappValidated.isValid && (createClientHasAttemptedSubmit || whatsappHasValue)) {
    setFieldError({
      inputNode: createClientUiContext.whatsappInput,
      errorNode: createClientUiContext.whatsappError,
      message: "WhatsApp inválido. Use solo números (10 a 15).",
    });
  } else if (whatsappValidated.isValid || !createClientHasAttemptedSubmit) {
    clearFieldError({ inputNode: createClientUiContext.whatsappInput, errorNode: createClientUiContext.whatsappError });
  }

  const telefonoRaw = createClientUiContext.telefonoInput?.value ?? "";
  const telefonoValidated = validateTelefonoField(telefonoRaw);
  const telefonoHasValue = telefonoValidated.value.length > 0;
  if (!telefonoValidated.isValid && telefonoHasValue) {
    setFieldError({
      inputNode: createClientUiContext.telefonoInput,
      errorNode: createClientUiContext.telefonoError,
      message: "Teléfono inválido. Use solo números (7 a 15) o deje vacío.",
    });
  } else {
    clearFieldError({ inputNode: createClientUiContext.telefonoInput, errorNode: createClientUiContext.telefonoError });
  }

  const emailRaw = createClientUiContext.emailInput?.value ?? "";
  const emailValidated = validateEmailField(emailRaw);
  const emailHasValue = emailValidated.value.length > 0;
  if (!emailValidated.isValid && (createClientHasAttemptedSubmit || emailHasValue)) {
    setFieldError({
      inputNode: createClientUiContext.emailInput,
      errorNode: createClientUiContext.emailError,
      message: "Email inválido. Use formato ejemplo@dominio.com.",
    });
  } else if (emailValidated.isValid || !createClientHasAttemptedSubmit) {
    clearFieldError({ inputNode: createClientUiContext.emailInput, errorNode: createClientUiContext.emailError });
  }

  const isDepartamentoSelected = typeof selectedDepartamentoId === "number";
  if (!isDepartamentoSelected && createClientHasAttemptedSubmit) {
    setFieldError({
      inputNode: createClientUiContext.departamentoSelect,
      errorNode: createClientUiContext.departamentoError,
      message: "Seleccione un departamento.",
    });
  } else {
    clearFieldError({ inputNode: createClientUiContext.departamentoSelect, errorNode: createClientUiContext.departamentoError });
  }

  const isMunicipioSelected = typeof selectedMunicipioId === "number";
  if (!isMunicipioSelected && createClientHasAttemptedSubmit) {
    setFieldError({ inputNode: createClientUiContext.municipioSelect, errorNode: createClientUiContext.municipioError, message: "Seleccione un municipio." });
  } else {
    clearFieldError({ inputNode: createClientUiContext.municipioSelect, errorNode: createClientUiContext.municipioError });
  }

  const isBarrioSelected = typeof selectedBarrioId === "number";
  if (!isBarrioSelected && createClientHasAttemptedSubmit) {
    setFieldError({ inputNode: createClientUiContext.barrioSelect, errorNode: createClientUiContext.barrioError, message: "Seleccione un barrio." });
  } else {
    clearFieldError({ inputNode: createClientUiContext.barrioSelect, errorNode: createClientUiContext.barrioError });
  }

  const isFormValid =
    identificacionValidated.isValid &&
    nombresValidated.isValid &&
    direccionValidated.isValid &&
    whatsappValidated.isValid &&
    telefonoValidated.isValid &&
    emailValidated.isValid &&
    isDepartamentoSelected &&
    isMunicipioSelected &&
    isBarrioSelected;

  if (createClientUiContext.saveButton) createClientUiContext.saveButton.disabled = !isFormValid;
  return isFormValid;
}

function initializeListClientsFeature(listClientsElements) {
  if (!listClientsElements) return;

  listClientsUiContext = {
    menuButton: listClientsElements.menuButton ?? null,
    modal: listClientsElements.modal ?? null,
    form: listClientsElements.form ?? null,
    countBadge: listClientsElements.countBadge ?? null,
    sortSelect: listClientsElements.sortSelect ?? null,
    searchInput: listClientsElements.searchInput ?? null,
    listContainer: listClientsElements.listContainer ?? null,
    listNode: listClientsElements.listNode ?? null,
    closeButton: listClientsElements.closeButton ?? null,
  };

  if (listClientsUiContext.menuButton) listClientsUiContext.menuButton.addEventListener("click", handleOpenListClients);
  if (listClientsUiContext.closeButton) listClientsUiContext.closeButton.addEventListener("click", handleCloseListClients);
  if (listClientsUiContext.sortSelect) listClientsUiContext.sortSelect.addEventListener("change", handleListClientsChange);
  if (listClientsUiContext.searchInput) listClientsUiContext.searchInput.addEventListener("input", handleListClientsChange);
  if (listClientsUiContext.form) listClientsUiContext.form.addEventListener("submit", handleListClientsSubmit);
  if (listClientsUiContext.listContainer) listClientsUiContext.listContainer.addEventListener("scroll", handleListClientsScroll);

  resetListClientsUi();
}

function handleOpenListClients() {
  resetListClientsUi();
  updateClientesCountBadges();
  openExclusiveModal(listClientsUiContext?.modal ?? null, listClientsUiContext?.searchInput ?? null);
  renderListClients();
}

function handleCloseListClients() {
  closeModal(listClientsUiContext?.modal ?? null, listClientsUiContext?.menuButton ?? null);
}

function handleListClientsSubmit(event) {
  if (event) event.preventDefault();
}

function handleListClientsChange() {
  renderListClients();
}

function handleListClientsScroll() {
  const container = listClientsUiContext?.listContainer ?? null;
  if (!container) return;
  const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
  if (isAtBottom) container.scrollTop = 0;
}

function resetListClientsUi() {
  if (!listClientsUiContext) return;
  if (listClientsUiContext.form) listClientsUiContext.form.reset();
  if (listClientsUiContext.sortSelect && !listClientsUiContext.sortSelect.value) listClientsUiContext.sortSelect.value = "identificacion";
  if (listClientsUiContext.searchInput) listClientsUiContext.searchInput.value = "";
  clearClientsListUi();
  updateClientesCountBadges();
}

function clearClientsListUi() {
  const listNode = listClientsUiContext?.listNode ?? null;
  if (!listNode) return;
  listNode.textContent = "";
}

function renderListClients() {
  if (!listClientsUiContext) return;

  const sortKey = listClientsUiContext.sortSelect?.value ?? "identificacion";
  const rawSearch = listClientsUiContext.searchInput?.value ?? "";
  const sanitizedSearch = sanitizeGeneralText(rawSearch, 80);
  const searchUpper = sanitizedSearch.toLocaleUpperCase("es-CO");
  const searchDigits = sanitizeDigitsOnly(sanitizedSearch, 20);

  const filteredClientes = clientes.filter((clienteRegistro) => {
    if (!sanitizedSearch) return true;
    const identificacionValue = String(clienteRegistro?.identificacion ?? "");
    const nombresValue = String(clienteRegistro?.nombres ?? "");
    const hasMatchIdentificacion = searchDigits ? identificacionValue.includes(searchDigits) : false;
    const hasMatchNombres = searchUpper ? nombresValue.toLocaleUpperCase("es-CO").includes(searchUpper) : false;
    return hasMatchIdentificacion || hasMatchNombres;
  });

  const sortedClientes = filteredClientes.slice();
  if (sortKey === "identificacion") {
    sortedClientes.sort((registroA, registroB) => {
      const valueA = Number(String(registroA?.identificacion ?? "0")) || 0;
      const valueB = Number(String(registroB?.identificacion ?? "0")) || 0;
      return valueA - valueB;
    });
  } else if (sortKey === "email") {
    sortedClientes.sort((registroA, registroB) => {
      const emailA = String(registroA?.email ?? "");
      const emailB = String(registroB?.email ?? "");
      return emailA.localeCompare(emailB, "es", { sensitivity: "base" });
    });
  } else {
    sortedClientes.sort((registroA, registroB) => {
      const nombresA = String(registroA?.nombres ?? "");
      const nombresB = String(registroB?.nombres ?? "");
      return nombresA.localeCompare(nombresB, "es", { sensitivity: "base" });
    });
  }

  clearClientsListUi();

  const listNode = listClientsUiContext.listNode;
  if (!listNode) return;

  if (sortedClientes.length === 0) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "clientsTable__empty";
    emptyItem.textContent = "No hay clientes registrados o no hay coincidencias para la búsqueda.";
    listNode.appendChild(emptyItem);
    return;
  }

  const headerRow = document.createElement("div");
  headerRow.className = "clientsTable__header";
  headerRow.setAttribute("role", "row");
  [
    "ID",
    "Identificación",
    "Nombres",
    "Email",
    "Departamento",
    "Municipio",
    "Barrio",
    "Dirección",
    "WhatsApp",
    "Teléfono",
  ].forEach((headerText) => {
    const cell = document.createElement("div");
    cell.className = "clientsTable__cell";
    cell.setAttribute("role", "columnheader");
    cell.textContent = headerText;
    headerRow.appendChild(cell);
  });
  listNode.appendChild(headerRow);

  sortedClientes.forEach((clienteRegistro) => {
    const departamentoNombre = getDepartamentoNombreById(clienteRegistro?.idDepartamento);
    const municipioNombre = getMunicipioNombreById(clienteRegistro?.idMunicipio);
    const barrioNombre = getBarrioNombreById(clienteRegistro?.idBarrio);

    const rowNode = document.createElement("div");
    rowNode.className = "clientsTable__row";
    rowNode.setAttribute("role", "row");

    const telefonoValue = clienteRegistro?.telefono ? String(clienteRegistro.telefono) : "";

    [
      String(clienteRegistro?.idCliente ?? ""),
      String(clienteRegistro?.identificacion ?? ""),
      String(clienteRegistro?.nombres ?? ""),
      String(clienteRegistro?.email ?? ""),
      departamentoNombre,
      municipioNombre,
      barrioNombre,
      String(clienteRegistro?.direccion ?? ""),
      String(clienteRegistro?.whatsapp ?? ""),
      telefonoValue,
    ].forEach((cellValue) => {
      const cellNode = document.createElement("div");
      cellNode.className = "clientsTable__cell";
      cellNode.setAttribute("role", "cell");
      cellNode.textContent = cellValue;
      rowNode.appendChild(cellNode);
    });

    listNode.appendChild(rowNode);
  });
}

/*
  ========= UI BASE (SIDEBAR, TEMA, AVATARES, LOGOUT) =========
*/

function initializeAppUi(appElements) {
  if (!appElements) return;

  appUiContext = {
    appRoot: appElements.appRoot ?? null,
    sidebarToggleButton: appElements.sidebarToggleButton ?? null,
    sidebar: appElements.sidebar ?? null,
    overlay: appElements.overlay ?? null,
    themeToggle: appElements.themeToggle ?? null,
    themeLabel: appElements.themeLabel ?? null,
    corporateLogoInput: appElements.corporateLogoInput ?? null,
    corporateLogoPreview: appElements.corporateLogoPreview ?? null,
    corporateLogoFallback: appElements.corporateLogoFallback ?? null,
    corporateLogoTrigger: appElements.corporateLogoTrigger ?? null,
    userAvatarInput: appElements.userAvatarInput ?? null,
    userAvatarPreview: appElements.userAvatarPreview ?? null,
    userAvatarFallback: appElements.userAvatarFallback ?? null,
    userAvatarTrigger: appElements.userAvatarTrigger ?? null,
    logoutButton: appElements.logoutButton ?? null,
    logoutModal: appElements.logoutModal ?? null,
    logoutNoButton: appElements.logoutNoButton ?? null,
    logoutYesButton: appElements.logoutYesButton ?? null,
    mobileMediaQuery: appElements.mobileMediaQuery ?? null,
  };

  const canInitializeLayout =
    appUiContext.appRoot &&
    appUiContext.sidebarToggleButton &&
    appUiContext.sidebar &&
    appUiContext.overlay &&
    appUiContext.themeToggle &&
    appUiContext.themeLabel &&
    appUiContext.mobileMediaQuery;

  if (canInitializeLayout) {
    initializeThemeFromDom();
    syncSidebarAriaExpanded();
    syncOverlayVisibility();
    initializeAvatarState();
    appUiContext.sidebarToggleButton.addEventListener("click", handleSidebarToggle);
    appUiContext.overlay.addEventListener("click", closeMobileSidebar);
    window.addEventListener("keydown", handleGlobalKeydown);
    appUiContext.mobileMediaQuery.addEventListener("change", handleViewportChange);
    appUiContext.themeToggle.addEventListener("change", handleThemeToggle);
  }

  if (appUiContext.corporateLogoTrigger && appUiContext.corporateLogoInput) {
    appUiContext.corporateLogoTrigger.addEventListener("dblclick", openCorporateLogoPicker);
  }

  if (appUiContext.userAvatarTrigger && appUiContext.userAvatarInput) {
    appUiContext.userAvatarTrigger.addEventListener("dblclick", openUserAvatarPicker);
  }

  if (appUiContext.corporateLogoInput && appUiContext.corporateLogoPreview && appUiContext.corporateLogoFallback) {
    appUiContext.corporateLogoInput.addEventListener("change", handleCorporateLogoInputChange);
  }

  if (appUiContext.userAvatarInput && appUiContext.userAvatarPreview && appUiContext.userAvatarFallback) {
    appUiContext.userAvatarInput.addEventListener("change", handleUserAvatarInputChange);
  }

  if (appUiContext.logoutButton && appUiContext.logoutModal && appUiContext.logoutNoButton && appUiContext.logoutYesButton) {
    appUiContext.logoutButton.addEventListener("click", openLogoutModal);
    appUiContext.logoutNoButton.addEventListener("click", closeLogoutModal);
    appUiContext.logoutYesButton.addEventListener("click", confirmLogout);
    appUiContext.logoutModal.addEventListener("click", handleLogoutOverlayClick);
  }
}

function initializeThemeFromDom() {
  const currentTheme = appUiContext.appRoot.getAttribute("data-theme");
  const isDark = currentTheme === "dark";
  appUiContext.themeToggle.checked = isDark;
  updateThemeLabel(isDark ? "dark" : "light");
}

function handleThemeToggle() {
  const nextTheme = appUiContext.themeToggle.checked ? "dark" : "light";
  appUiContext.appRoot.setAttribute("data-theme", nextTheme);
  updateThemeLabel(nextTheme);
}

function updateThemeLabel(theme) {
  const labelText = theme === "dark" ? "Modo oscuro" : "Modo claro";
  setSafeText(appUiContext.themeLabel, labelText);
}

function handleSidebarToggle() {
  if (appUiContext.mobileMediaQuery.matches) {
    appUiContext.appRoot.classList.toggle("is-open");
    syncSidebarAriaExpanded();
    syncOverlayVisibility();
    focusFirstNavItemIfOpen();
    return;
  }

  appUiContext.appRoot.classList.toggle("is-collapsed");
  syncSidebarAriaExpanded();
}

function closeMobileSidebar() {
  if (!appUiContext.mobileMediaQuery.matches) return;
  appUiContext.appRoot.classList.remove("is-open");
  syncSidebarAriaExpanded();
  syncOverlayVisibility();
}

function syncSidebarAriaExpanded() {
  const isExpandedMobile = appUiContext.mobileMediaQuery.matches && appUiContext.appRoot.classList.contains("is-open");
  const isExpandedDesktop = !appUiContext.mobileMediaQuery.matches && !appUiContext.appRoot.classList.contains("is-collapsed");
  const isExpanded = appUiContext.mobileMediaQuery.matches ? isExpandedMobile : isExpandedDesktop;
  appUiContext.sidebarToggleButton.setAttribute("aria-expanded", String(isExpanded));
}

function syncOverlayVisibility() {
  const shouldShowOverlay = appUiContext.mobileMediaQuery.matches && appUiContext.appRoot.classList.contains("is-open");
  appUiContext.overlay.hidden = !shouldShowOverlay;
  appUiContext.overlay.setAttribute("aria-hidden", String(!shouldShowOverlay));
}

function handleGlobalKeydown(event) {
  if (event?.key !== "Escape") return;

  if (isLogoutModalOpen()) {
    closeLogoutModal();
    return;
  }

  if (isModalOpen(createClientUiContext?.modal ?? null)) {
    handleCancelCreateClient();
    return;
  }

  if (isModalOpen(listClientsUiContext?.modal ?? null)) {
    handleCloseListClients();
    return;
  }

  closeMobileSidebar();
}

function handleViewportChange() {
  if (!appUiContext.mobileMediaQuery.matches) {
    appUiContext.appRoot.classList.remove("is-open");
    syncOverlayVisibility();
  }
  syncSidebarAriaExpanded();
}

function focusFirstNavItemIfOpen() {
  if (!appUiContext.appRoot.classList.contains("is-open")) return;
  const firstLink = appUiContext.sidebar.querySelector("a, button, summary, input, [tabindex]:not([tabindex='-1'])");
  if (firstLink) firstLink.focus();
}

function initializeAvatarState() {
  if (appUiContext.corporateLogoPreview && appUiContext.corporateLogoFallback) {
    appUiContext.corporateLogoPreview.addEventListener("load", () => showAvatarImage(appUiContext.corporateLogoPreview, appUiContext.corporateLogoFallback));
    appUiContext.corporateLogoPreview.addEventListener("error", () =>
      showAvatarFallback(appUiContext.corporateLogoPreview, appUiContext.corporateLogoFallback)
    );
    syncAvatarFromCurrentSrc(appUiContext.corporateLogoPreview, appUiContext.corporateLogoFallback);
  }

  if (appUiContext.userAvatarPreview && appUiContext.userAvatarFallback) {
    appUiContext.userAvatarPreview.addEventListener("load", () => showAvatarImage(appUiContext.userAvatarPreview, appUiContext.userAvatarFallback));
    appUiContext.userAvatarPreview.addEventListener("error", () => showAvatarFallback(appUiContext.userAvatarPreview, appUiContext.userAvatarFallback));
    syncAvatarFromCurrentSrc(appUiContext.userAvatarPreview, appUiContext.userAvatarFallback);
  }
}

function syncAvatarFromCurrentSrc(img, fallback) {
  const src = typeof img.src === "string" ? img.src.trim() : "";
  if (!src) {
    showAvatarFallback(img, fallback);
    return;
  }

  if (img.complete) {
    if (img.naturalWidth === 0) {
      showAvatarFallback(img, fallback);
      return;
    }
    showAvatarImage(img, fallback);
    return;
  }

  showAvatarFallback(img, fallback);
}

function showAvatarImage(img, fallback) {
  img.style.display = "block";
  fallback.style.display = "none";
}

function showAvatarFallback(img, fallback) {
  img.style.display = "none";
  fallback.style.display = "grid";
}

function openCorporateLogoPicker() {
  appUiContext.corporateLogoInput.value = "";
  appUiContext.corporateLogoInput.click();
}

function openUserAvatarPicker() {
  appUiContext.userAvatarInput.value = "";
  appUiContext.userAvatarInput.click();
}

function handleCorporateLogoInputChange() {
  corporateLogoObjectUrl = setImagePreview({
    fileInput: appUiContext.corporateLogoInput,
    img: appUiContext.corporateLogoPreview,
    fallback: appUiContext.corporateLogoFallback,
    previousObjectUrl: corporateLogoObjectUrl,
  });
}

function handleUserAvatarInputChange() {
  userAvatarObjectUrl = setImagePreview({
    fileInput: appUiContext.userAvatarInput,
    img: appUiContext.userAvatarPreview,
    fallback: appUiContext.userAvatarFallback,
    previousObjectUrl: userAvatarObjectUrl,
  });
}

function openLogoutModal() {
  openExclusiveModal(appUiContext.logoutModal, appUiContext.logoutNoButton);
}

function closeLogoutModal() {
  closeModal(appUiContext.logoutModal, appUiContext.logoutButton);
}

function isLogoutModalOpen() {
  return isModalOpen(appUiContext.logoutModal);
}

function confirmLogout() {
  closeLogoutModal();
  try {
    window.close();
  } catch (error) {}
  window.location.replace("about:blank");
}

function handleLogoutOverlayClick(event) {
  if (event?.target === appUiContext.logoutModal) closeLogoutModal();
}

function setImagePreview({ fileInput, img, fallback, previousObjectUrl }) {
  const file = fileInput?.files && fileInput.files[0] ? fileInput.files[0] : null;
  if (!file) return previousObjectUrl;
  if (!file.type.startsWith("image/")) {
    fileInput.value = "";
    return previousObjectUrl;
  }
  if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;
  showAvatarImage(img, fallback);
  return objectUrl;
}

