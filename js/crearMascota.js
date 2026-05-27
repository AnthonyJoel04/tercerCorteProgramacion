/*
  crearMascota.js — Inyecta el modal "Crear Mascota" en el DOM.
  Patrón IIFE: evita contaminar el scope global.

  Entidad: Mascotas
  Atributos del formulario:
    - chipIdentificacion (obligatorio, alfanumérico 5-20)
    - nombre             (obligatorio, texto 2-60)
    - idEspecie          (obligatorio, select → filtra razas)
    - idRaza             (obligatorio, select dependiente de especie)
    - fechaNacimiento    (obligatorio, date)
    - color              (obligatorio, texto 2-40)
    - observaciones      (opcional, textarea)
*/

(() => {
  /* Evita doble inyección */
  if (document.getElementById("createMascotaModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="createMascotaModal" hidden aria-hidden="true" aria-label="Formulario Crear Mascota">
      <div class="modalDialog modalDialog--form" role="dialog" aria-modal="true" aria-labelledby="createMascotaTitle">

        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="createMascotaTitle">🐾 Crear Mascota</h2>
          <span class="modalDialog__counter" id="createMascotaCountBadge">#Mascotas 0000</span>
        </div>

        <form id="createMascotaForm" novalidate aria-describedby="createMascotaHelp">
          <p class="formHelp" id="createMascotaHelp">
            Los campos marcados con <span class="requiredMark" aria-label="obligatorio">*</span> son obligatorios.
            Observaciones es opcional.
          </p>

          <div class="createClientBodyContainer">
            <div class="formGrid">

              <!-- Chip de identificación -->
              <div class="formField">
                <label class="formLabel" for="mascotaChipInput" data-tooltip="Código único del chip. Ej: COL0010011">
                  Chip Identificación <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="mascotaChipInput"
                  name="chipIdentificacion"
                  type="text"
                  autocomplete="off"
                  maxlength="20"
                  required
                  aria-describedby="mascotaChipError"
                  title="Código alfanumérico único del chip (5 a 20 caracteres)."
                />
                <p class="fieldError" id="mascotaChipError" aria-live="polite"></p>
              </div>

              <!-- Nombre de la mascota -->
              <div class="formField">
                <label class="formLabel" for="mascotaNombreInput" data-tooltip="Nombre de la mascota. Ej: Toby">
                  Nombre <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="mascotaNombreInput"
                  name="nombre"
                  type="text"
                  autocomplete="off"
                  maxlength="60"
                  required
                  aria-describedby="mascotaNombreError"
                  title="Nombre de la mascota (solo letras y espacios, 2 a 60 caracteres)."
                />
                <p class="fieldError" id="mascotaNombreError" aria-live="polite"></p>
              </div>

              <!-- Especie (filtra razas) -->
              <div class="formField">
                <label class="formLabel" for="mascotaEspecieSelect" data-tooltip="Seleccione la especie de la mascota.">
                  Especie <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <select
                  class="formSelect"
                  id="mascotaEspecieSelect"
                  name="idEspecie"
                  required
                  aria-describedby="mascotaEspecieError"
                  title="Seleccione la especie."
                ></select>
                <p class="fieldError" id="mascotaEspecieError" aria-live="polite"></p>
              </div>

              <!-- Raza (dependiente de especie) -->
              <div class="formField">
                <label class="formLabel" for="mascotaRazaSelect" data-tooltip="Seleccione la raza. La lista depende de la especie.">
                  Raza <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <select
                  class="formSelect"
                  id="mascotaRazaSelect"
                  name="idRaza"
                  required
                  aria-describedby="mascotaRazaError"
                  title="Seleccione la raza (filtrada por especie)."
                ></select>
                <p class="fieldError" id="mascotaRazaError" aria-live="polite"></p>
              </div>

              <!-- Fecha de nacimiento -->
              <div class="formField">
                <label class="formLabel" for="mascotaFechaNacInput" data-tooltip="Fecha de nacimiento de la mascota.">
                  Fecha Nacimiento <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="mascotaFechaNacInput"
                  name="fechaNacimiento"
                  type="date"
                  required
                  aria-describedby="mascotaFechaNacError"
                  title="Seleccione la fecha de nacimiento."
                />
                <p class="fieldError" id="mascotaFechaNacError" aria-live="polite"></p>
              </div>

              <!-- Color -->
              <div class="formField">
                <label class="formLabel" for="mascotaColorInput" data-tooltip="Color del pelaje. Ej: Dorado, Negro/Blanco">
                  Color <span class="requiredMark" aria-hidden="true">*</span>
                </label>
                <input
                  class="formControl"
                  id="mascotaColorInput"
                  name="color"
                  type="text"
                  autocomplete="off"
                  maxlength="40"
                  required
                  aria-describedby="mascotaColorError"
                  title="Color del pelaje (letras, espacios y / - )."
                />
                <p class="fieldError" id="mascotaColorError" aria-live="polite"></p>
              </div>

              <!-- Observaciones (full-width, opcional) -->
              <div class="formField formField--full">
                <label class="formLabel" for="mascotaObsInput" data-tooltip="Notas adicionales sobre la mascota (opcional).">
                  Observaciones
                </label>
                <textarea
                  class="formTextarea"
                  id="mascotaObsInput"
                  name="observaciones"
                  maxlength="300"
                  aria-describedby="mascotaObsError"
                  title="Observaciones opcionales (máximo 300 caracteres)."
                  rows="3"
                ></textarea>
                <p class="fieldError" id="mascotaObsError" aria-live="polite"></p>
              </div>

            </div>
          </div>

          <div class="formActions">
            <button class="button button--success" type="submit" id="createMascotaSaveButton" disabled data-tooltip="Guarda la mascota cuando todo esté válido">
              Guardar
            </button>
            <button class="button button--danger" type="button" id="createMascotaCancelButton" data-tooltip="Cancelar y cerrar el formulario">
              Cancelar
            </button>
          </div>
        </form>

      </div>
    </div>
  `.trim();

  /* Insertar antes del modal de logout (si existe), sino al final del body */
  const logoutModal = document.getElementById("logoutModal");
  if (logoutModal) {
    logoutModal.insertAdjacentHTML("beforebegin", html);
    return;
  }
  document.body.insertAdjacentHTML("beforeend", html);
})();
