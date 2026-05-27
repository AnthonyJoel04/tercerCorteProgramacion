/*
  menuPrincipal.js — Inyecta el sidebar (menú lateral) en el DOM.
  Se ejecuta como IIFE para no contaminar el scope global.

  Estructura del menú:
  - Sección Mascotas: Crear Mascota, Listar Mascotas
  - Sección Clientes: Crear Cliente, Listar Clientes
  - Sección Adopciones: Registrar Adopción, Listar Adopciones
  - Perfil de usuario (logo, avatar, tema, cerrar sesión)
*/

(() => {
  /* Evitar doble inyección si el script se carga más de una vez */
  if (document.getElementById("sidebar")) return;

  const mountNode = document.getElementById("menuPrincipalMount");
  if (!mountNode) return;

  const html = `
    <aside class="sidebar" id="sidebar" aria-label="Menú lateral">
      <div class="sidebar__header">
        <h2 class="sidebar__heading">🐾 Menú</h2>
      </div>

      <nav class="nav" aria-label="Navegación principal">

        <!-- ── SECCIÓN: MASCOTAS ── -->
        <details class="nav__group" open>
          <summary class="nav__item nav__item--primary" data-tooltip="Sección: Mascotas">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
              <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
              <path d="M8 14v.5"/>
              <path d="M16 14v.5"/>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
            </svg>
            <span class="nav__label">Mascotas</span>
          </summary>

          <ul class="nav__sublist" aria-label="Opciones de mascotas">
            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="createMascotaMenuButton"
                aria-label="Registrar nueva mascota"
                data-tooltip="Abrir formulario: registrar mascota"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span class="nav__text">Crear Mascota</span>
              </button>
            </li>

            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="listMascotasMenuButton"
                aria-label="Ver listado de mascotas"
                data-tooltip="Abrir listado de mascotas"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <span class="nav__text">Listar Mascotas</span>
              </button>
            </li>
          </ul>
        </details>

        <!-- ── SECCIÓN: CLIENTES ── -->
        <details class="nav__group">
          <summary class="nav__item nav__item--primary" data-tooltip="Sección: Clientes">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M16 11a4 4 0 1 0-8 0a4 4 0 0 0 8 0ZM4 20a8 8 0 0 1 16 0" />
            </svg>
            <span class="nav__label">Clientes</span>
          </summary>

          <ul class="nav__sublist" aria-label="Opciones de clientes">
            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="createClientMenuButton"
                aria-label="Crear nuevo cliente"
                data-tooltip="Abrir formulario: crear cliente"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span class="nav__text">Crear Cliente</span>
              </button>
            </li>

            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="listClientsMenuButton"
                aria-label="Ver listado de clientes"
                data-tooltip="Abrir listado de clientes"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <span class="nav__text">Listar Clientes</span>
              </button>
            </li>
          </ul>
        </details>

        <!-- ── SECCIÓN: ADOPCIONES ── -->
        <details class="nav__group">
          <summary class="nav__item nav__item--primary" data-tooltip="Sección: Adopciones">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span class="nav__label">Adopciones</span>
          </summary>

          <ul class="nav__sublist" aria-label="Opciones de adopciones">
            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="createAdopcionMenuButton"
                aria-label="Registrar nueva adopción"
                data-tooltip="Abrir formulario: registrar adopción"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span class="nav__text">Registrar Adopción</span>
              </button>
            </li>

            <li class="nav__subitem">
              <button
                class="nav__action button"
                type="button"
                id="listAdopcionesMenuButton"
                aria-label="Ver listado de adopciones"
                data-tooltip="Abrir listado de adopciones"
              >
                <svg class="icon nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <span class="nav__text">Listar Adopciones</span>
              </button>
            </li>
          </ul>
        </details>

      </nav>

      <div class="sidebar__divider" role="separator" aria-hidden="true"></div>

      <!-- ── PERFIL DE USUARIO ── -->
      <section class="profile" aria-label="Perfil de usuario">
        <h3 class="profile__title" id="appVersionProfileTitle">AdoptaMascotasApp</h3>

        <!-- Logo corporativo (doble clic para cambiar) -->
        <div class="profile__row profile__row--center">
          <div
            class="avatar avatar--circle avatar--clickable"
            id="corporateLogoTrigger"
            role="button"
            tabindex="0"
            aria-label="Logo corporativo (doble clic para cambiar)"
            data-tooltip="Doble clic para cambiar el logo corporativo"
          >
            <img class="avatar__img" id="corporateLogoPreview" alt="Logo corporativo" src="./assets/logo CIAF-1.png" />
            <span class="avatar__fallback" id="corporateLogoFallback" aria-hidden="true">LOGO</span>
          </div>
          <input class="sr-only" id="corporateLogoInput" type="file" accept="image/*" />
        </div>

        <!-- Avatar de usuario (doble clic para cambiar) -->
        <div class="profile__row profile__row--center">
          <div
            class="avatar avatar--circle avatar--clickable"
            id="userAvatarTrigger"
            role="button"
            tabindex="0"
            aria-label="Imagen de usuario (doble clic para cambiar)"
            data-tooltip="Doble clic para cambiar la imagen de usuario"
          >
            <img class="avatar__img" id="userAvatarPreview" alt="Foto de usuario" src="./assets/logo CIAF-1.png" />
            <span class="avatar__fallback" id="userAvatarFallback" aria-hidden="true">U</span>
          </div>
          <p class="profile__preview" data-tooltip="Nombre de usuario (solo visual en v1)">
            <span class="profile__previewLabel">Usuario:</span>
            <span id="userNamePreview"> User 1</span>
          </p>
        </div>

        <!-- Toggle de tema oscuro / claro -->
        <div class="profile__row profile__row--center">
          <span class="profile__label" id="themeLabel" data-tooltip="Estado del tema actual">Modo oscuro</span>
          <label class="switch" aria-label="Cambiar tema oscuro o claro" data-tooltip="Cambiar entre modo oscuro y claro">
            <input id="themeToggle" type="checkbox" role="switch" aria-labelledby="themeLabel" checked />
            <span class="switch__track" aria-hidden="true"></span>
          </label>
        </div>

        <!-- Cerrar sesión -->
        <div class="profile__row">
          <button
            class="button button--danger"
            type="button"
            id="logoutButton"
            aria-label="Cerrar sesión"
            data-tooltip="Cerrar sesión (se solicita confirmación)"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </aside>
  `.trimEnd();

  mountNode.insertAdjacentHTML("afterend", html);
  mountNode.remove();
})();
