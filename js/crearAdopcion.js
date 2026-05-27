/*
  crearAdopcion.js — Inyecta el modal "Registrar Adopción" en el DOM.
  Patrón IIFE: evita contaminar el scope global.

  Versión mejorada: permite ingresar datos del adoptante manualmente
  (identificación, nombre, whatsapp) y seleccionar la mascota disponible.
*/

(() => {
  if (document.getElementById("createAdopcionModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="createAdopcionModal" hidden aria-hidden="true" aria-label="Formulario Registrar Adopción">
      <div class="modalDialog modalDialog--form modalDialog--adopcion" role="dialog" aria-modal="true" aria-labelledby="createAdopcionTitle">

        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="createAdopcionTitle">❤️ Registrar Adopción</h2>
          <span class="modalDialog__counter" id="createAdopcionCountBadge">#Adopciones 0000</span>
        </div>

        <form id="createAdopcionForm" novalidate aria-describedby="createAdopcionHelp">
          <p class="formHelp" id="createAdopcionHelp">
            Los campos marcados con <span class="requiredMark" aria-label="obligatorio">*</span> son obligatorios.
            Solo se muestran mascotas disponibles (no adoptadas aún).
          </p>

          <div class="createClientBodyContainer">
            <div class="formGrid">

              <!-- Identificación del adoptante -->
              <div class="formField">
                <label class="formLabel" for="adopcionIdentificacionInput" data-tooltip="Número de identificación del adoptante.">
                  Identificación <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="adopcionIdentificacionInput"
                  name="adopcionIdentificacion"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  maxlength="15"
                  required
                  aria-describedby="adopcionIdentificacionError"
                  placeholder="Ej: 1000123456"
                  title="Solo números (5 a 15 dígitos)."
                />
                <p class="fieldError" id="adopcionIdentificacionError" aria-live="polite"></p>
              </div>

              <!-- Nombre completo del adoptante -->
              <div class="formField">
                <label class="formLabel" for="adopcionNombreInput" data-tooltip="Nombre completo del adoptante.">
                  Nombre Completo <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="adopcionNombreInput"
                  name="adopcionNombre"
                  type="text"
                  autocomplete="off"
                  maxlength="80"
                  required
                  aria-describedby="adopcionNombreError"
                  placeholder="Ej: Juan David Gómez"
                  title="Nombres y apellidos (solo letras y espacios)."
                />
                <p class="fieldError" id="adopcionNombreError" aria-live="polite"></p>
              </div>

              <!-- WhatsApp -->
              <div class="formField">
                <label class="formLabel" for="adopcionWhatsappInput" data-tooltip="Número de WhatsApp del adoptante.">
                  WhatsApp <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="adopcionWhatsappInput"
                  name="adopcionWhatsapp"
                  type="text"
                  inputmode="tel"
                  autocomplete="off"
                  maxlength="10"
                  required
                  aria-describedby="adopcionWhatsappError"
                  placeholder="Ej: 3001234567"
                  title="10 dígitos numéricos."
                />
                <p class="fieldError" id="adopcionWhatsappError" aria-live="polite"></p>
              </div>

              <!-- Fecha de adopción -->
              <div class="formField">
                <label class="formLabel" for="adopcionFechaInput" data-tooltip="Fecha en que se formaliza la adopción.">
                  Fecha de Adopción <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="adopcionFechaInput"
                  name="fechaAdopcion"
                  type="date"
                  required
                  aria-describedby="adopcionFechaError"
                  title="Seleccione la fecha de adopción."
                />
                <p class="fieldError" id="adopcionFechaError" aria-live="polite"></p>
              </div>

              <!-- Mascota disponible -->
              <div class="formField formField--full">
                <label class="formLabel" for="adopcionMascotaSelect" data-tooltip="Seleccione la mascota disponible para adoptar.">
                  Mascota a Adoptar <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <select
                  class="formSelect"
                  id="adopcionMascotaSelect"
                  name="idMascota"
                  required
                  aria-describedby="adopcionMascotaError"
                  title="Seleccione la mascota disponible."
                ></select>
                <p class="fieldError" id="adopcionMascotaError" aria-live="polite"></p>
              </div>

              <!-- Observaciones opcionales -->
              <div class="formField formField--full">
                <label class="formLabel" for="adopcionObsInput" data-tooltip="Notas adicionales (opcional).">
                  Observaciones
                </label>
                <textarea
                  class="formTextarea"
                  id="adopcionObsInput"
                  name="observaciones"
                  maxlength="300"
                  aria-describedby="adopcionObsError"
                  title="Observaciones opcionales (máximo 300 caracteres)."
                  rows="3"
                  placeholder="Ej: Adoptante con experiencia, tiene patio amplio..."
                ></textarea>
                <p class="fieldError" id="adopcionObsError" aria-live="polite"></p>
              </div>

            </div>
          </div>

          <div class="formActions">
            <button class="button button--success" type="submit" id="createAdopcionSaveButton" disabled data-tooltip="Registra la adopción cuando todo esté válido">
              Registrar
            </button>
            <button class="button button--danger" type="button" id="createAdopcionCancelButton" data-tooltip="Cancelar y cerrar el formulario">
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
