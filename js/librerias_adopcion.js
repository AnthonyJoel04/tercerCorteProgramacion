/* ============================================================
   LIBRERIAS_ADOPCION.JS
   Funciones globales adicionales para AdoptaMascotasApp.
   Extiende librerias.js sin modificarlo (se carga después).

   RESUMEN DE RESPONSABILIDADES:
     - closeAllAppModals / syncWelcomePanelVisibility:
         Cierra todos los modales activos y sincroniza la visibilidad
         del panel de bienvenida (#welcomePanel).
     - openModal / closeModal (override):
         Envuelve las funciones originales para mantener sincronizado
         el panel de bienvenida al abrir/cerrar cualquier modal.
     - Helpers de especies y razas:
         getEspecieNombreById, getRazaNombreById, getEspecieIdByRazaId,
         getRazasByEspecieId — acceso rápido a los catálogos de ENV.js.
     - Helpers de mascotas:
         isMascotaChipRegistered, getNextMascotaId, isMascotaAdoptada,
         getMascotasDisponibles, getEspecieClass.
     - Helpers de adopciones:
         getNextAdopcionId, getNextMascotaAdoptadaId.
     - Módulo Crear Mascota:
         initializeCreateMascotaFeature y sus handlers/validadores.
     - Módulo Listar Mascotas:
         initializeListMascotasFeature y renderListMascotas.
     - Módulo Crear Adopción:
         initializeCreateAdopcionFeature y sus handlers/validadores.
         Al guardar, crea el cliente automáticamente si no existe.
     - Módulo Listar Adopciones:
         initializeListAdopcionesFeature y renderListAdopciones.
     - Panel de bienvenida:
         updateWelcomeStats actualiza los contadores en tiempo real.
   ============================================================ */
"use strict";

/* ----------------------------------------------------------
   OVERRIDE: closeAllAppModals
   Incluye todos los modales nuevos y sincroniza el panel de
   bienvenida para evitar superposición visual.
   ---------------------------------------------------------- */
function closeAllAppModals(exceptModalNode) {
  const allModals = [
    createClientUiContext?.modal    ?? null,
    listClientsUiContext?.modal     ?? null,
    createMascotaUiContext?.modal   ?? null,
    listMascotasUiContext?.modal    ?? null,
    createAdopcionUiContext?.modal  ?? null,
    listAdopcionesUiContext?.modal  ?? null,
    appUiContext?.logoutModal       ?? null,
  ];
  allModals.forEach((m) => {
    if (m && m !== exceptModalNode && isModalOpen(m)) closeModal(m, null);
  });
  syncWelcomePanelVisibility(exceptModalNode);
}

/* Muestra/oculta el panel de bienvenida según si hay modal de contenido abierto */
function syncWelcomePanelVisibility(openingModalNode) {
  const panel = document.getElementById("welcomePanel");
  if (!panel) return;
  /* El modal de logout no es pantalla de contenido: no ocultar el panel */
  if (openingModalNode === (appUiContext?.logoutModal ?? null)) return;
  panel.style.display = openingModalNode ? "none" : "";
}

/* ----------------------------------------------------------
   OVERRIDE: openModal / closeModal
   Al cerrar un modal de contenido, vuelve a mostrar el panel
   de bienvenida si no queda ningún otro modal abierto.
   ---------------------------------------------------------- */
const _origOpenModal  = openModal;
const _origCloseModal = closeModal;

// eslint-disable-next-line no-global-assign
openModal = function(modalNode, focusNode) {
  _origOpenModal(modalNode, focusNode);
  syncWelcomePanelVisibility(modalNode);
};

// eslint-disable-next-line no-global-assign
closeModal = function(modalNode, focusNode) {
  _origCloseModal(modalNode, focusNode);
  const contentModals = [
    createClientUiContext?.modal   ?? null,
    listClientsUiContext?.modal    ?? null,
    createMascotaUiContext?.modal  ?? null,
    listMascotasUiContext?.modal   ?? null,
    createAdopcionUiContext?.modal ?? null,
    listAdopcionesUiContext?.modal ?? null,
  ];
  const anyOpen = contentModals.some((m) => m && isModalOpen(m));
  const panel = document.getElementById("welcomePanel");
  if (panel && !anyOpen) panel.style.display = "";
};


/* ============================================================
   HELPERS: ESPECIES Y RAZAS
   ============================================================ */

/** Devuelve el nombre de una especie por su id */
function getEspecieNombreById(idEspecie) {
  const especie = especies.find((e) => e.idEspecie === idEspecie);
  return especie ? especie.nombre : "—";
}

/** Devuelve el nombre de una raza por su id */
function getRazaNombreById(idRaza) {
  const raza = razas.find((r) => r.idRaza === idRaza);
  return raza ? raza.nombre : "—";
}

/** Devuelve el idEspecie de una raza */
function getEspecieIdByRazaId(idRaza) {
  const raza = razas.find((r) => r.idRaza === idRaza);
  return raza ? raza.idEspecie : null;
}

/** Filtra razas por especie */
function getRazasByEspecieId(idEspecie) {
  return razas.filter((r) => r.idEspecie === idEspecie);
}

/** Comprueba si un chip ya está registrado */
function isMascotaChipRegistered(chip) {
  const normalized = chip.trim().toUpperCase();
  return mascotas.some((m) => m.chipIdentificacion.toUpperCase() === normalized);
}

/** Devuelve el siguiente idMascota correlativo */
function getNextMascotaId() {
  if (mascotas.length === 0) return 1;
  return Math.max(...mascotas.map((m) => m.idMascota)) + 1;
}

/** Devuelve el siguiente idAdopcion correlativo */
function getNextAdopcionId() {
  if (adopciones.length === 0) return 1;
  return Math.max(...adopciones.map((a) => a.idAdopcion)) + 1;
}

/** Devuelve el siguiente idMascotaAdoptada correlativo */
function getNextMascotaAdoptadaId() {
  if (mascotasAdoptadas.length === 0) return 1;
  return Math.max(...mascotasAdoptadas.map((m) => m.idMascotaAdoptada)) + 1;
}

/** Verifica si una mascota ya fue adoptada */
function isMascotaAdoptada(idMascota) {
  return mascotasAdoptadas.some((ma) => ma.idMascota === idMascota);
}

/** Devuelve las mascotas que aún están disponibles (no adoptadas) */
function getMascotasDisponibles() {
  return mascotas.filter((m) => !isMascotaAdoptada(m.idMascota));
}

/** Badge de especie (devuelve clase CSS según especie) */
function getEspecieClass(idEspecie) {
  const map = { 1: "canino", 2: "felino", 3: "ave", 4: "roedor" };
  return map[idEspecie] || "otro";
}

/** Formatea label de contador de mascotas */
function formatMascotasCountLabel() {
  const count = mascotas.length;
  return `#Mascotas ${String(count).padStart(4, "0")}`;
}

/** Formatea label de contador de adopciones */
function formatAdopcionesCountLabel() {
  const count = adopciones.length;
  return `#Adopciones ${String(count).padStart(4, "0")}`;
}

/** Actualiza todos los badges de mascotas */
function updateMascotasCountBadges() {
  const label = formatMascotasCountLabel();
  const createBadge = document.getElementById("createMascotaCountBadge");
  const listBadge   = document.getElementById("listMascotasCountBadge");
  if (createBadge) setSafeText(createBadge, label);
  if (listBadge)   setSafeText(listBadge, label);
  updateWelcomeStats();
}

/** Actualiza todos los badges de adopciones */
function updateAdopcionesCountBadges() {
  const label = formatAdopcionesCountLabel();
  const createBadge = document.getElementById("createAdopcionCountBadge");
  const listBadge   = document.getElementById("listAdopcionesCountBadge");
  if (createBadge) setSafeText(createBadge, label);
  if (listBadge)   setSafeText(listBadge, label);
  updateWelcomeStats();
}

/** Actualiza las estadísticas del panel de bienvenida */
function updateWelcomeStats() {
  const statMascotas   = document.getElementById("statMascotas");
  const statClientes   = document.getElementById("statClientes");
  const statAdopciones = document.getElementById("statAdopciones");
  if (statMascotas)   setSafeText(statMascotas,   String(mascotas.length));
  if (statClientes)   setSafeText(statClientes,   String(clientes.length));
  if (statAdopciones) setSafeText(statAdopciones, String(adopciones.length));
}

/* ============================================================
   MÓDULO: CREAR MASCOTA
   ============================================================ */

/**
 * Inicializa el módulo Crear Mascota.
 * @param {Object} els - Elementos del DOM pasados desde app.js
 */
function initializeCreateMascotaFeature(els) {
  createMascotaUiContext = els;

  /* Poblar select de especies */
  populateMascotaEspecieSelect();

  /* Eventos */
  els.menuButton.addEventListener("click",  handleOpenCreateMascota);
  els.cancelButton.addEventListener("click", handleCancelCreateMascota);
  els.form.addEventListener("submit",       handleSubmitCreateMascota);
  els.especieSelect.addEventListener("change", handleMascotaEspecieChange);

  /* Validación en tiempo real */
  [els.chipInput, els.nombreInput, els.colorInput].forEach((input) => {
    input.addEventListener("input", handleCreateMascotaInput);
  });
  els.fechaNacInput.addEventListener("change", handleCreateMascotaInput);
  els.razaSelect.addEventListener("change",    handleCreateMascotaInput);

  /* Estado inicial */
  updateMascotasCountBadges();
}

function handleOpenCreateMascota() {
  createMascotaHasAttemptedSubmit = false;
  resetCreateMascotaFormControls();
  resetCreateMascotaFormState();
  populateMascotaEspecieSelect();
  openExclusiveModal(createMascotaUiContext.modal, createMascotaUiContext.chipInput);
  updateMascotasCountBadges();
}

function handleCancelCreateMascota() {
  closeModal(createMascotaUiContext.modal, createMascotaUiContext.menuButton);
  resetCreateMascotaFormState();
}

function handleCreateMascotaInput() {
  /* Validar siempre en tiempo real para habilitar el botón Guardar */
  validateCreateMascotaFormAndToggleSave();
}

function handleMascotaEspecieChange() {
  selectedEspecieId = Number(createMascotaUiContext.especieSelect.value) || null;
  populateMascotaRazaSelect();
  validateCreateMascotaFormAndToggleSave();
}

function handleSubmitCreateMascota(submitEvent) {
  submitEvent.preventDefault();
  createMascotaHasAttemptedSubmit = true;

  const isValid = validateCreateMascotaFormAndToggleSave();
  if (!isValid) return;

  const record = buildMascotaRecordFromForm();
  mascotas.push(record);

  updateMascotasCountBadges();
  closeModal(createMascotaUiContext.modal, createMascotaUiContext.menuButton);
  resetCreateMascotaFormControls();
  resetCreateMascotaFormState();

  showToast({
    toastNode: document.getElementById("toast"),
    message:   `✅ Mascota "${record.nombre}" registrada exitosamente (ID: ${record.idMascota}).`,
  });
}

function buildMascotaRecordFromForm() {
  const chip   = createMascotaUiContext.chipInput.value.trim().toUpperCase();
  const nombre = createMascotaUiContext.nombreInput.value.trim().toUpperCase();
  const color  = createMascotaUiContext.colorInput.value.trim().toUpperCase();
  const obs    = createMascotaUiContext.obsInput.value.trim();
  const fecha  = createMascotaUiContext.fechaNacInput.value;
  const idRaza = Number(createMascotaUiContext.razaSelect.value);
  const hoy    = new Date().toISOString().slice(0, 10);

  return {
    idMascota:          getNextMascotaId(),
    chipIdentificacion: chip,
    nombre,
    idRaza,
    fechaNacimiento:    fecha,
    color,
    observaciones:      obs || null,
    fechaCreacion:      hoy,
  };
}

function resetCreateMascotaFormState() {
  createMascotaHasAttemptedSubmit = false;
  selectedEspecieId = null;
  selectedRazaId    = null;

  /* Limpiar errores */
  const ctx = createMascotaUiContext;
  [
    { inputNode: ctx.chipInput,    errorNode: ctx.chipError    },
    { inputNode: ctx.nombreInput,  errorNode: ctx.nombreError  },
    { inputNode: ctx.colorInput,   errorNode: ctx.colorError   },
    { inputNode: ctx.fechaNacInput,errorNode: ctx.fechaNacError},
    { inputNode: ctx.razaSelect,   errorNode: ctx.razaError    },
    { inputNode: ctx.especieSelect,errorNode: ctx.especieError },
  ].forEach(clearFieldError);

  if (ctx.saveButton) ctx.saveButton.disabled = true;
}

function resetCreateMascotaFormControls() {
  createMascotaUiContext.form.reset();
  clearSelectOptions(createMascotaUiContext.razaSelect);
  const defaultOpt = createSafeOption({ value: "", labelText: "— Seleccione especie primero —" });
  createMascotaUiContext.razaSelect.appendChild(defaultOpt);
}

function populateMascotaEspecieSelect() {
  const sel = createMascotaUiContext.especieSelect;
  clearSelectOptions(sel);
  const defaultOpt = createSafeOption({ value: "", labelText: "— Seleccione especie —" });
  sel.appendChild(defaultOpt);
  getSortedByNombre(especies).forEach((esp) => {
    sel.appendChild(createSafeOption({ value: String(esp.idEspecie), labelText: esp.nombre }));
  });
}

function populateMascotaRazaSelect() {
  const sel = createMascotaUiContext.razaSelect;
  clearSelectOptions(sel);
  if (!selectedEspecieId) {
    sel.appendChild(createSafeOption({ value: "", labelText: "— Seleccione especie primero —" }));
    return;
  }
  const filtered = getRazasByEspecieId(selectedEspecieId);
  const defaultOpt = createSafeOption({ value: "", labelText: "— Seleccione raza —" });
  sel.appendChild(defaultOpt);
  getSortedByNombre(filtered).forEach((raza) => {
    sel.appendChild(createSafeOption({ value: String(raza.idRaza), labelText: raza.nombre }));
  });
}

function validateCreateMascotaFormAndToggleSave() {
  const ctx = createMascotaUiContext;
  let allValid = true;

  /* Chip */
  const chip = ctx.chipInput.value.trim().toUpperCase();
  if (!regexChip.test(chip)) {
    setFieldError({ inputNode: ctx.chipInput, errorNode: ctx.chipError, message: "Chip inválido (5-20 caracteres alfanuméricos)." });
    allValid = false;
  } else if (isMascotaChipRegistered(chip)) {
    setFieldError({ inputNode: ctx.chipInput, errorNode: ctx.chipError, message: "Este chip ya está registrado." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.chipInput, errorNode: ctx.chipError });
  }

  /* Nombre */
  const nombre = ctx.nombreInput.value.trim().toUpperCase();
  if (!regexNombreMascota.test(nombre)) {
    setFieldError({ inputNode: ctx.nombreInput, errorNode: ctx.nombreError, message: "Nombre inválido (2-60 letras y espacios)." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.nombreInput, errorNode: ctx.nombreError });
  }

  /* Especie */
  if (!ctx.especieSelect.value) {
    setFieldError({ inputNode: ctx.especieSelect, errorNode: ctx.especieError, message: "Seleccione una especie." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.especieSelect, errorNode: ctx.especieError });
  }

  /* Raza */
  if (!ctx.razaSelect.value) {
    setFieldError({ inputNode: ctx.razaSelect, errorNode: ctx.razaError, message: "Seleccione una raza." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.razaSelect, errorNode: ctx.razaError });
  }

  /* Fecha de nacimiento */
  if (!ctx.fechaNacInput.value) {
    setFieldError({ inputNode: ctx.fechaNacInput, errorNode: ctx.fechaNacError, message: "Ingrese la fecha de nacimiento." });
    allValid = false;
  } else {
    const selectedDate = new Date(ctx.fechaNacInput.value);
    const today        = new Date();
    if (selectedDate > today) {
      setFieldError({ inputNode: ctx.fechaNacInput, errorNode: ctx.fechaNacError, message: "La fecha no puede ser futura." });
      allValid = false;
    } else {
      clearFieldError({ inputNode: ctx.fechaNacInput, errorNode: ctx.fechaNacError });
    }
  }

  /* Color */
  const color = ctx.colorInput.value.trim().toUpperCase();
  if (!regexColor.test(color)) {
    setFieldError({ inputNode: ctx.colorInput, errorNode: ctx.colorError, message: "Color inválido (2-40 letras, espacios, / -)." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.colorInput, errorNode: ctx.colorError });
  }

  ctx.saveButton.disabled = !allValid;
  return allValid;
}

/* ============================================================
   MÓDULO: LISTAR MASCOTAS
   ============================================================ */

function initializeListMascotasFeature(els) {
  listMascotasUiContext = els;

  /* Poblar filtro de especies */
  populateListMascotasEspecieFilter();

  els.menuButton.addEventListener("click",       handleOpenListMascotas);
  els.closeButton.addEventListener("click",      handleCloseListMascotas);
  els.sortSelect.addEventListener("change",      handleListMascotasChange);
  els.especieFilter.addEventListener("change",   handleListMascotasChange);
  els.searchInput.addEventListener("input",      handleListMascotasChange);

  updateMascotasCountBadges();
}

function handleOpenListMascotas() {
  resetListMascotasUi();
  openExclusiveModal(listMascotasUiContext.modal, listMascotasUiContext.searchInput);
  renderListMascotas();
  updateMascotasCountBadges();
}

function handleCloseListMascotas() {
  closeModal(listMascotasUiContext.modal, listMascotasUiContext.menuButton);
}

function handleListMascotasChange() {
  renderListMascotas();
}

function resetListMascotasUi() {
  listMascotasUiContext.searchInput.value = "";
  listMascotasUiContext.sortSelect.value  = "nombre";
  listMascotasUiContext.especieFilter.value = "";
}

function populateListMascotasEspecieFilter() {
  const sel = listMascotasUiContext.especieFilter;
  clearSelectOptions(sel);
  sel.appendChild(createSafeOption({ value: "", labelText: "— Todas —" }));
  getSortedByNombre(especies).forEach((e) => {
    sel.appendChild(createSafeOption({ value: String(e.idEspecie), labelText: e.nombre }));
  });
}

function renderListMascotas() {
  const ctx         = listMascotasUiContext;
  const sortBy      = ctx.sortSelect.value;
  const filterEsp   = ctx.especieFilter.value ? Number(ctx.especieFilter.value) : null;
  const searchTerm  = ctx.searchInput.value.trim().toLowerCase();
  const listNode    = ctx.listNode;

  /* Filtrar */
  let filtered = mascotas.filter((m) => {
    const idEspecie = getEspecieIdByRazaId(m.idRaza);
    if (filterEsp && idEspecie !== filterEsp) return false;
    if (searchTerm) {
      const inNombre = m.nombre.toLowerCase().includes(searchTerm);
      const inChip   = m.chipIdentificacion.toLowerCase().includes(searchTerm);
      if (!inNombre && !inChip) return false;
    }
    return true;
  });

  /* Ordenar */
  filtered.sort((a, b) => {
    if (sortBy === "nombre")          return a.nombre.localeCompare(b.nombre, "es-CO");
    if (sortBy === "chip")            return a.chipIdentificacion.localeCompare(b.chipIdentificacion);
    if (sortBy === "fechaNacimiento") return a.fechaNacimiento.localeCompare(b.fechaNacimiento);
    if (sortBy === "especie") {
      const espA = getEspecieNombreById(getEspecieIdByRazaId(a.idRaza));
      const espB = getEspecieNombreById(getEspecieIdByRazaId(b.idRaza));
      return espA.localeCompare(espB, "es-CO");
    }
    return 0;
  });

  /* Renderizar */
  listNode.textContent = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "formHelp";
    empty.style.padding = "16px";
    setSafeText(empty, "No se encontraron mascotas con los filtros aplicados.");
    listNode.appendChild(empty);
    return;
  }

  filtered.forEach((m) => {
    const idEspecie   = getEspecieIdByRazaId(m.idRaza);
    const espNombre   = getEspecieNombreById(idEspecie);
    const razaNombre  = getRazaNombreById(m.idRaza);
    const adoptada    = isMascotaAdoptada(m.idMascota);
    const espClass    = getEspecieClass(idEspecie);

    const card = document.createElement("div");
    card.className  = "mascota-card";
    card.setAttribute("role", "listitem");

    /* Header */
    const header = document.createElement("div");
    header.className = "mascota-card__header";

    const nameSpan = document.createElement("span");
    nameSpan.className = "mascota-card__name";
    setSafeText(nameSpan, m.nombre);

    const statusSpan = document.createElement("span");
    statusSpan.className = adoptada ? "adopted-tag" : "available-tag";
    setSafeText(statusSpan, adoptada ? "Adoptada" : "Disponible");

    header.appendChild(nameSpan);
    header.appendChild(statusSpan);
    card.appendChild(header);

    /* Chip */
    const chipP = document.createElement("p");
    chipP.className = "mascota-card__chip";
    setSafeText(chipP, `Chip: ${m.chipIdentificacion}`);
    card.appendChild(chipP);

    /* Badge especie */
    const espBadge = document.createElement("span");
    espBadge.className = `especie-badge especie-badge--${espClass}`;
    setSafeText(espBadge, espNombre);
    card.appendChild(espBadge);

    /* Datos */
    [
      ["Raza",       razaNombre],
      ["Color",      m.color],
      ["Nacimiento", m.fechaNacimiento],
    ].forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "mascota-card__row";
      const strong = document.createElement("strong");
      setSafeText(strong, `${label}: `);
      const span = document.createElement("span");
      setSafeText(span, value);
      row.appendChild(strong);
      row.appendChild(span);
      card.appendChild(row);
    });

    if (m.observaciones) {
      const obsRow = document.createElement("div");
      obsRow.className = "mascota-card__row";
      obsRow.style.flexDirection = "column";
      const label = document.createElement("strong");
      setSafeText(label, "Observaciones:");
      const obsText = document.createElement("span");
      setSafeText(obsText, m.observaciones);
      obsRow.appendChild(label);
      obsRow.appendChild(obsText);
      card.appendChild(obsRow);
    }

    listNode.appendChild(card);
  });

  /* Actualizar badge con el conteo filtrado */
  setSafeText(ctx.countBadge, `#Mascotas ${String(filtered.length).padStart(4, "0")}`);
}

/* ============================================================
   MÓDULO: CREAR ADOPCIÓN
   ============================================================ */

function initializeCreateAdopcionFeature(els) {
  createAdopcionUiContext = els;

  els.menuButton.addEventListener("click",    handleOpenCreateAdopcion);
  els.cancelButton.addEventListener("click",  handleCancelCreateAdopcion);
  els.form.addEventListener("submit",         handleSubmitCreateAdopcion);

  /* Validación en tiempo real en todos los campos */
  [els.identificacionInput, els.nombreInput, els.whatsappInput].forEach((el) => {
    el.addEventListener("input", handleCreateAdopcionInput);
  });
  [els.mascotaSelect, els.fechaInput].forEach((el) => {
    el.addEventListener("change", handleCreateAdopcionInput);
  });

  updateAdopcionesCountBadges();
}

function handleOpenCreateAdopcion() {
  resetCreateAdopcionFormControls();
  resetCreateAdopcionFormState();
  populateAdopcionMascotaSelect();
  openExclusiveModal(createAdopcionUiContext.modal, createAdopcionUiContext.identificacionInput);
  updateAdopcionesCountBadges();
}

function handleCancelCreateAdopcion() {
  closeModal(createAdopcionUiContext.modal, createAdopcionUiContext.menuButton);
  resetCreateAdopcionFormState();
}

function handleCreateAdopcionInput() {
  validateCreateAdopcionFormAndToggleSave();
}

function handleSubmitCreateAdopcion(submitEvent) {
  submitEvent.preventDefault();

  const isValid = validateCreateAdopcionFormAndToggleSave();
  if (!isValid) return;

  const records = buildAdopcionRecordsFromForm();
  adopciones.push(records.adopcion);
  mascotasAdoptadas.push(records.mascotaAdoptada);

  updateAdopcionesCountBadges();
  updateMascotasCountBadges();

  const mascota = mascotas.find((m) => m.idMascota === records.mascotaAdoptada.idMascota);
  const mascotaNombre = mascota ? mascota.nombre : "Mascota";
  const adoptanteNombre = createAdopcionUiContext.nombreInput.value.trim();

  closeModal(createAdopcionUiContext.modal, createAdopcionUiContext.menuButton);
  resetCreateAdopcionFormControls();
  resetCreateAdopcionFormState();

  showToast({
    toastNode: document.getElementById("toast"),
    message:   `✅ Adopción registrada: ${mascotaNombre} ahora es de ${adoptanteNombre}.`,
  });
}

function buildAdopcionRecordsFromForm() {
  const ctx       = createAdopcionUiContext;
  const idMascota = Number(ctx.mascotaSelect.value);
  const fecha     = ctx.fechaInput.value;
  const obs       = ctx.obsInput.value.trim();
  const hoy       = new Date().toISOString().slice(0, 10);
  const newAdopcionId = getNextAdopcionId();

  /* Buscar si el adoptante ya existe en clientes[] por identificación */
  const identificacion = sanitizeDigitsOnly
    ? sanitizeDigitsOnly(ctx.identificacionInput.value, 15)
    : ctx.identificacionInput.value.trim();
  const nombre = ctx.nombreInput.value.trim().toUpperCase();
  const whatsapp = ctx.whatsappInput.value.trim();

  let idCliente = null;
  const clienteExistente = clientes.find((c) => c.identificacion === identificacion);
  if (clienteExistente) {
    idCliente = clienteExistente.idCliente;
  } else {
    /* Crear cliente nuevo automáticamente */
    const nuevoCliente = {
      idCliente:      getNextClienteId ? getNextClienteId() : (Math.max(0, ...clientes.map(c => c.idCliente)) + 1),
      identificacion,
      nombres:        nombre,
      nombre:         nombre,
      idDepartamento: 66,
      idMunicipio:    66001,
      idBarrio:       1,
      direccion:      "Sin registrar",
      whatsapp,
      telefono:       null,
      email:          `${identificacion}@adopcion.com`,
      fechaCreacion:  hoy,
    };
    clientes.push(nuevoCliente);
    idCliente = nuevoCliente.idCliente;
  }

  return {
    adopcion: {
      idAdopcion:    newAdopcionId,
      idUsuario:     1,
      fechaAdopcion: fecha,
      idCliente,
      observaciones: obs || null,
      fechaRegistro: hoy,
    },
    mascotaAdoptada: {
      idMascotaAdoptada: getNextMascotaAdoptadaId(),
      idAdopcion:        newAdopcionId,
      idMascota,
      observaciones:     obs || null,
      fechaRegistro:     hoy,
    },
  };
}

function populateAdopcionMascotaSelect() {
  const sel = createAdopcionUiContext.mascotaSelect;
  clearSelectOptions(sel);
  const disponibles = getMascotasDisponibles();
  if (disponibles.length === 0) {
    sel.appendChild(createSafeOption({ value: "", labelText: "— No hay mascotas disponibles —" }));
    return;
  }
  sel.appendChild(createSafeOption({ value: "", labelText: "— Seleccione mascota —" }));
  disponibles
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CO"))
    .forEach((m) => {
      const espNombre  = getEspecieNombreById(getEspecieIdByRazaId(m.idRaza));
      const razaNombre = getRazaNombreById(m.idRaza);
      sel.appendChild(createSafeOption({
        value:     String(m.idMascota),
        labelText: `${m.nombre} — ${espNombre} (${razaNombre})`,
      }));
    });
}

function resetCreateAdopcionFormState() {
  const ctx = createAdopcionUiContext;
  [
    { inputNode: ctx.identificacionInput, errorNode: ctx.identificacionError },
    { inputNode: ctx.nombreInput,         errorNode: ctx.nombreError         },
    { inputNode: ctx.whatsappInput,       errorNode: ctx.whatsappError       },
    { inputNode: ctx.mascotaSelect,       errorNode: ctx.mascotaError        },
    { inputNode: ctx.fechaInput,          errorNode: ctx.fechaError          },
  ].forEach(clearFieldError);
  if (ctx.saveButton) ctx.saveButton.disabled = true;
}

function resetCreateAdopcionFormControls() {
  createAdopcionUiContext.form.reset();
}

function validateCreateAdopcionFormAndToggleSave() {
  const ctx = createAdopcionUiContext;
  let allValid = true;

  /* Identificación */
  const id = ctx.identificacionInput.value.trim();
  if (!regexIdentificacion.test(id)) {
    setFieldError({ inputNode: ctx.identificacionInput, errorNode: ctx.identificacionError, message: "Solo números (5 a 15 dígitos)." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.identificacionInput, errorNode: ctx.identificacionError });
  }

  /* Nombre */
  const nombre = ctx.nombreInput.value.trim();
  if (!regexNombres.test(nombre)) {
    setFieldError({ inputNode: ctx.nombreInput, errorNode: ctx.nombreError, message: "Solo letras y espacios (mínimo 3 caracteres)." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.nombreInput, errorNode: ctx.nombreError });
  }

  /* WhatsApp */
  const ws = ctx.whatsappInput.value.trim();
  if (!regexWhatsapp.test(ws)) {
    setFieldError({ inputNode: ctx.whatsappInput, errorNode: ctx.whatsappError, message: "10 dígitos numéricos." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.whatsappInput, errorNode: ctx.whatsappError });
  }

  /* Mascota */
  if (!ctx.mascotaSelect.value) {
    setFieldError({ inputNode: ctx.mascotaSelect, errorNode: ctx.mascotaError, message: "Seleccione una mascota disponible." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.mascotaSelect, errorNode: ctx.mascotaError });
  }

  /* Fecha */
  if (!ctx.fechaInput.value) {
    setFieldError({ inputNode: ctx.fechaInput, errorNode: ctx.fechaError, message: "Ingrese la fecha de adopción." });
    allValid = false;
  } else {
    clearFieldError({ inputNode: ctx.fechaInput, errorNode: ctx.fechaError });
  }

  ctx.saveButton.disabled = !allValid;
  return allValid;
}

/* ============================================================
   MÓDULO: LISTAR ADOPCIONES
   ============================================================ */

function initializeListAdopcionesFeature(els) {
  listAdopcionesUiContext = els;

  els.menuButton.addEventListener("click",  handleOpenListAdopciones);
  els.closeButton.addEventListener("click", handleCloseListAdopciones);
  els.sortSelect.addEventListener("change", handleListAdopcionesChange);
  els.searchInput.addEventListener("input", handleListAdopcionesChange);

  updateAdopcionesCountBadges();
}

function handleOpenListAdopciones() {
  listAdopcionesUiContext.searchInput.value = "";
  listAdopcionesUiContext.sortSelect.value  = "fecha";
  openExclusiveModal(listAdopcionesUiContext.modal, listAdopcionesUiContext.searchInput);
  renderListAdopciones();
  updateAdopcionesCountBadges();
}

function handleCloseListAdopciones() {
  closeModal(listAdopcionesUiContext.modal, listAdopcionesUiContext.menuButton);
}

function handleListAdopcionesChange() {
  renderListAdopciones();
}

function renderListAdopciones() {
  const ctx        = listAdopcionesUiContext;
  const sortBy     = ctx.sortSelect.value;
  const searchTerm = ctx.searchInput.value.trim().toLowerCase();
  const listNode   = ctx.listNode;

  /* Unir adopciones con mascotas adoptadas para mostrar info completa */
  let rows = adopciones.map((a) => {
    const mascotaAdoptada = mascotasAdoptadas.find((ma) => ma.idAdopcion === a.idAdopcion);
    const mascota  = mascotaAdoptada ? mascotas.find((m) => m.idMascota === mascotaAdoptada.idMascota) : null;
    const cliente  = clientes.find((c) => c.idCliente === a.idCliente);
    return {
      ...a,
      clienteNombre: cliente  ? (cliente.nombres || cliente.nombre || "—") : "—",
      mascotaNombre: mascota  ? mascota.nombre  : "—",
      idMascota:     mascotaAdoptada ? mascotaAdoptada.idMascota : null,
    };
  });

  /* Filtrar por búsqueda */
  if (searchTerm) {
    rows = rows.filter((r) =>
      r.clienteNombre.toLowerCase().includes(searchTerm) ||
      r.mascotaNombre.toLowerCase().includes(searchTerm)
    );
  }

  /* Ordenar */
  rows.sort((a, b) => {
    if (sortBy === "fecha")   return b.fechaAdopcion.localeCompare(a.fechaAdopcion);
    if (sortBy === "cliente") return a.clienteNombre.localeCompare(b.clienteNombre, "es-CO");
    if (sortBy === "mascota") return a.mascotaNombre.localeCompare(b.mascotaNombre, "es-CO");
    return 0;
  });

  /* Renderizar */
  listNode.textContent = "";

  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "formHelp";
    empty.style.padding = "16px";
    setSafeText(empty, "No se encontraron adopciones.");
    listNode.appendChild(empty);
    setSafeText(ctx.countBadge, "#Adopciones 0000");
    return;
  }

  /* Cabecera de tabla */
  const headerRow = document.createElement("div");
  headerRow.className = "adopcion-row";
  headerRow.setAttribute("role", "row");
  headerRow.style.fontWeight = "700";
  headerRow.style.borderBottom = "2px solid var(--primary)";
  ["ID", "Cliente", "Mascota", "Fecha"].forEach((label) => {
    const cell = document.createElement("div");
    cell.setAttribute("role", "columnheader");
    setSafeText(cell, label);
    headerRow.appendChild(cell);
  });
  listNode.appendChild(headerRow);

  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "adopcion-row";
    row.setAttribute("role", "row");

    const idCell = document.createElement("div");
    idCell.className = "adopcion-row__id";
    setSafeText(idCell, `#${String(r.idAdopcion).padStart(4, "0")}`);

    const clienteCell = document.createElement("div");
    setSafeText(clienteCell, r.clienteNombre);

    const mascotaCell = document.createElement("div");
    setSafeText(mascotaCell, r.mascotaNombre);

    const fechaCell = document.createElement("div");
    setSafeText(fechaCell, r.fechaAdopcion);

    row.appendChild(idCell);
    row.appendChild(clienteCell);
    row.appendChild(mascotaCell);
    row.appendChild(fechaCell);
    listNode.appendChild(row);
  });

  setSafeText(ctx.countBadge, `#Adopciones ${String(rows.length).padStart(4, "0")}`);
}
