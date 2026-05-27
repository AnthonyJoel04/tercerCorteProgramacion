/*
  listarMascotas.js — Inyecta el modal "Listar Mascotas" en el DOM.
  Patrón IIFE: evita contaminar el scope global.

  Funcionalidad:
  - Muestra todas las mascotas registradas.
  - Permite filtrar por especie y buscar por nombre/chip.
  - Ordena por nombre, chip o fecha de nacimiento.
  - Indica visualmente si la mascota ya fue adoptada.
*/

(() => {
  if (document.getElementById("listMascotasModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="listMascotasModal" hidden aria-hidden="true" aria-label="Listado de mascotas">
      <div class="modalDialog modalDialog--list" role="dialog" aria-modal="true" aria-labelledby="listMascotasTitle">

        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="listMascotasTitle">🐾 Listar Mascotas</h2>
          <span class="modalDialog__counter" id="listMascotasCountBadge">#Mascotas 0000</span>
        </div>

        <form id="listMascotasForm" novalidate aria-describedby="listMascotasHelp">
          <p class="formHelp" id="listMascotasHelp">
            Use los filtros para encontrar mascotas. Las tarjetas indican si están disponibles o ya adoptadas.
          </p>

          <!-- Barra de herramientas: filtros y búsqueda -->
          <div class="listToolbar">
            <div class="formField">
              <label class="formLabel" for="listMascotasSortSelect" data-tooltip="Criterio de ordenamiento.">
                Ordenar por
              </label>
              <select class="formSelect" id="listMascotasSortSelect" name="listMascotasSort" title="Criterio de ordenamiento.">
                <option value="nombre">Nombre (A-Z)</option>
                <option value="chip">Chip (A-Z)</option>
                <option value="fechaNacimiento">Fecha Nacimiento</option>
                <option value="especie">Especie</option>
              </select>
            </div>

            <div class="formField">
              <label class="formLabel" for="listMascotasEspecieFilter" data-tooltip="Filtrar por especie.">
                Especie
              </label>
              <select class="formSelect" id="listMascotasEspecieFilter" name="listMascotasEspecie" title="Filtrar por especie.">
                <option value="">— Todas —</option>
              </select>
            </div>

            <div class="formField">
              <label class="formLabel" for="listMascotasSearchInput" data-tooltip="Buscar por nombre o chip.">
                Búsqueda
              </label>
              <input
                class="formControl"
                id="listMascotasSearchInput"
                name="listMascotasSearch"
                type="text"
                autocomplete="off"
                maxlength="80"
                title="Buscar por nombre o chip (parcial o total)."
              />
            </div>
          </div>

          <!-- Contenedor de tarjetas de mascotas -->
          <div class="clientsListContainer" id="mascotasListContainer" aria-label="Listado de mascotas con scroll">
            <div class="mascota-grid" id="mascotasList" role="list" aria-label="Mascotas"></div>
          </div>

          <!-- Pie: botón cerrar -->
          <div class="listFooter">
            <button class="button button--success listCloseButton" type="button" id="listMascotasCloseButton" data-tooltip="Cerrar listado">
              Cerrar
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
