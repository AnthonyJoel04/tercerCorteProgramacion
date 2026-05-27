(() => {
  if (document.getElementById("listClientsModal")) return;

  const html = `
    <div class="modalOverlay modalOverlay--main" id="listClientsModal" hidden aria-hidden="true" aria-label="Listado de clientes">
      <div class="modalDialog modalDialog--list" role="dialog" aria-modal="true" aria-labelledby="listClientsTitle">
        <div class="modalDialog__titleRow" aria-label="Título y contador">
          <h2 class="modalDialog__title" id="listClientsTitle">Listar Clientes</h2>
          <span class="modalDialog__counter" id="listClientsCountBadge">#Clientes 0000</span>
        </div>

        <form id="listClientsForm" novalidate aria-describedby="listClientsHelp">
          <p class="formHelp" id="listClientsHelp">
            Use el ordenamiento y la búsqueda para filtrar. El listado hace scroll vertical; al llegar al final vuelve al inicio.
          </p>

          <div class="listToolbar">
            <div class="formField">
              <label class="formLabel" for="listClientsSortSelect" data-tooltip="Seleccione el criterio de ordenamiento.">
                Ordenar por
              </label>
              <select
                class="formSelect"
                id="listClientsSortSelect"
                name="listClientsSort"
                title="Seleccione el criterio de ordenamiento."
              >
                <option value="identificacion">Identificación (0-9)</option>
                <option value="nombres">Nombres (A-Z)</option>
                <option value="email">Email (A-Z)</option>
              </select>
            </div>

            <div class="formField">
              <label class="formLabel" for="listClientsSearchInput" data-tooltip="Busque por identificación o nombres (parcial o total).">
                Búsqueda
              </label>
              <input
                class="formControl"
                id="listClientsSearchInput"
                name="listClientsSearch"
                type="text"
                autocomplete="off"
                maxlength="80"
                title="Busque por identificación o nombres (parcial o total)."
              />
            </div>
          </div>

          <div class="clientsListContainer" id="clientsListContainer" aria-label="Listado de clientes con scroll">
            <div class="clientsTable" id="clientsList" role="table" aria-label="Clientes"></div>
          </div>

          <div class="listFooter">
            <button class="button button--success listCloseButton" type="button" id="listClientsCloseButton" data-tooltip="Cerrar listado">
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
