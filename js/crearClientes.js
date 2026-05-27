(() => {
  if (document.getElementById("createClientModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="createClientModal" hidden aria-hidden="true" aria-label="Formulario Crear Cliente">
      <div class="modalDialog modalDialog--form" role="dialog" aria-modal="true" aria-labelledby="createClientTitle">
        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="createClientTitle">Crear Cliente</h2>
          <span class="modalDialog__counter" id="createClientCountBadge">#Clientes 0000</span>
        </div>

        <form id="createClientForm" novalidate aria-describedby="createClientHelp">
          <p class="formHelp" id="createClientHelp">
            Los campos marcados con <span class="requiredMark" aria-label="obligatorio">*</span> son obligatorios. Teléfono es opcional.
          </p>

          <div class="createClientBodyContainer">
            <div class="formGrid">
            <div class="formField">
              <label class="formLabel" for="identificacionInput" data-tooltip="Digite solo números. Ejemplo: 1000123456">
                Identificación <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <input
                class="formControl"
                id="identificacionInput"
                name="identificacion"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                maxlength="15"
                required
                aria-describedby="identificacionError"
                title="Digite solo números (mínimo 5, máximo 15)."
              />
              <p class="fieldError" id="identificacionError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="nombresInput" data-tooltip="Digite nombres y apellidos. Evite caracteres especiales.">
                Nombres <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <input
                class="formControl"
                id="nombresInput"
                name="nombres"
                type="text"
                autocomplete="off"
                maxlength="80"
                required
                aria-describedby="nombresError"
                title="Digite nombres y apellidos (solo letras y espacios)."
              />
              <p class="fieldError" id="nombresError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="departamentoSelect" data-tooltip="Seleccione el departamento.">
                Departamento <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <select
                class="formSelect"
                id="departamentoSelect"
                name="idDepartamento"
                required
                aria-describedby="departamentoError"
                title="Seleccione el departamento."
              ></select>
              <p class="fieldError" id="departamentoError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="municipioSelect" data-tooltip="Seleccione el municipio. La lista depende del departamento.">
                Municipio <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <select
                class="formSelect"
                id="municipioSelect"
                name="idMunicipio"
                required
                aria-describedby="municipioError"
                title="Seleccione el municipio (filtrado por departamento)."
              ></select>
              <p class="fieldError" id="municipioError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="barrioSelect" data-tooltip="Seleccione el barrio. La lista depende del municipio.">
                Barrio <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <select
                class="formSelect"
                id="barrioSelect"
                name="idBarrio"
                required
                aria-describedby="barrioError"
                title="Seleccione el barrio (filtrado por municipio)."
              ></select>
              <p class="fieldError" id="barrioError" aria-live="polite"></p>
            </div>

            <div class="formField formField--full">
              <label class="formLabel" for="direccionInput" data-tooltip="Ejemplo: Calle 10 # 12-34 Apto 202.">
                Dirección <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <input
                class="formControl"
                id="direccionInput"
                name="direccion"
                type="text"
                autocomplete="off"
                maxlength="120"
                required
                aria-describedby="direccionError"
                title="Digite dirección (letras, números, espacios y # -)."
              />
              <p class="fieldError" id="direccionError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="whatsappInput" data-tooltip="Digite el número de WhatsApp con 10 dígitos.">
                WhatsApp <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <input
                class="formControl"
                id="whatsappInput"
                name="whatsapp"
                type="text"
                inputmode="tel"
                autocomplete="off"
                maxlength="15"
                required
                aria-describedby="whatsappError"
                title="Digite el número de WhatsApp (solo números; 10 a 15)."
              />
              <p class="fieldError" id="whatsappError" aria-live="polite"></p>
            </div>

            <div class="formField">
              <label class="formLabel" for="telefonoInput" data-tooltip="Digite un número telefónico fijo de 7 dígitos.">
                Teléfono
              </label>
              <input
                class="formControl"
                id="telefonoInput"
                name="telefono"
                type="text"
                inputmode="tel"
                autocomplete="off"
                maxlength="15"
                aria-describedby="telefonoError"
                title="Digite un número telefónico fijo de 7 dígitos."
              />
              <p class="fieldError" id="telefonoError" aria-live="polite"></p>
            </div>

            <div class="formField formField--full">
              <label class="formLabel" for="emailInput" data-tooltip="Ejemplo: estudiante@correo.com">
                Email <span class="requiredMark" aria-hidden="true">*</span>
              </label>
              <input
                class="formControl"
                id="emailInput"
                name="email"
                type="email"
                autocomplete="off"
                maxlength="120"
                required
                aria-describedby="emailError"
                title="Digite un correo válido (ejemplo@dominio.com)."
              />
              <p class="fieldError" id="emailError" aria-live="polite"></p>
            </div>
            </div>
          </div>

          <div class="formActions">
            <button class="button button--success" type="submit" id="createClientSaveButton" disabled data-tooltip="Guarda el cliente cuando todo esté válido">
              Guardar
            </button>
            <button class="button button--danger" type="button" id="createClientCancelButton" data-tooltip="Cancelar y cerrar el formulario">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `.trim();

  const logoutModal = document.getElementById("logoutModal");
  if (logoutModal) {
    logoutModal.insertAdjacentHTML("beforebegin", html);
    return;
  }

  document.body.insertAdjacentHTML("beforeend", html);
})();
