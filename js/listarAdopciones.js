/*
  listarAdopciones.js — Inyecta el modal "Listar Adopciones" en el DOM.
  Patrón IIFE: evita contaminar el scope global.
*/

(() => {
  if (document.getElementById("listAdopcionesModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="listAdopcionesModal" hidden aria-hidden="true" aria-label="Listado de adopciones">
      <div class="modalDialog modalDialog--list" role="dialog" aria-modal="true" aria-labelledby="listAdopcionesTitle">

        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="listAdopcionesTitle">❤️ Listar Adopciones</h2>
          <span class="modalDialog__counter" id="listAdopcionesCountBadge">#Adopciones 0000</span>
        </div>

        <form id="listAdopcionesForm" novalidate aria-describedby="listAdopcionesHelp">
          <p class="formHelp" id="listAdopcionesHelp">
            Historial completo de adopciones registradas. Use la búsqueda para filtrar por cliente o mascota.
          </p>

          <div class="listToolbar">
            <div class="formField">
              <label class="formLabel" for="listAdopcionesSortSelect" data-tooltip="Criterio de ordenamiento.">
                Ordenar por
              </label>
              <select class="formSelect" id="listAdopcionesSortSelect" name="listAdopcionesSort" title="Criterio de ordenamiento.">
                <option value="fecha">Fecha (reciente)</option>
                <option value="cliente">Cliente (A-Z)</option>
                <option value="mascota">Mascota (A-Z)</option>
              </select>
            </div>

            <div class="formField">
              <label class="formLabel" for="listAdopcionesSearchInput" data-tooltip="Buscar por nombre de cliente o mascota.">
                Búsqueda
              </label>
              <input
                class="formControl"
                id="listAdopcionesSearchInput"
                name="listAdopcionesSearch"
                type="text"
                autocomplete="off"
                maxlength="80"
                title="Buscar por nombre de cliente o mascota."
              />
            </div>
          </div>

          <div class="clientsListContainer" id="adopcionesListContainer" aria-label="Listado de adopciones con scroll">
            <div class="clientsTable" id="adopcionesList" role="table" aria-label="Adopciones"></div>
          </div>

          <div class="listFooter">
            <button class="button button--success listCloseButton" type="button" id="listAdopcionesCloseButton" data-tooltip="Cerrar listado">
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
