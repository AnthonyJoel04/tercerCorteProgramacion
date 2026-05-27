/* ============================================================
   APP.JS — Arranque principal de AdoptaMascotasApp
   
   Propósito:
   - Consultar elementos del DOM.
   - Delegar toda la lógica a funciones globales centralizadas
     en librerias.js y librerias_adopcion.js (requisito).
   
   Nota:
   - Este archivo NO define funciones propias.
   - Sigue el mismo patrón del proyecto base ClientesApp.
   ============================================================ */
"use strict";

/* ============================================================
   PASO 1: Cargar datos guardados ANTES de inicializar módulos.
   Así los arrays globales (clientes, mascotas, adopciones…)
   ya tienen los datos reales cuando cada módulo llama a
   updateClientesCountBadges(), updateMascotasCountBadges(), etc.
   ============================================================ */
cargarDatosDesdeLocalStorage();

/* ── Elementos base del layout ── */
const appRoot            = document.querySelector(".app");
const sidebarToggleBtn   = document.getElementById("sidebarToggle");
const sidebar            = document.getElementById("sidebar");
const overlay            = document.getElementById("overlay");

/* ── Versión ── */
const appVersionBadge        = document.getElementById("appVersionBadge");
const appVersionProfileTitle = document.getElementById("appVersionProfileTitle");
initializeAppVersionUi({
  appVersionBadgeNode: appVersionBadge,
  profileTitleNode:    appVersionProfileTitle,
  appName:             "AdoptaMascotasApp",
});

/* ── Tema ── */
const themeToggle = document.getElementById("themeToggle");
const themeLabel  = document.getElementById("themeLabel");

/* ── Logo corporativo ── */
const corporateLogoInput   = document.getElementById("corporateLogoInput");
const corporateLogoPreview = document.getElementById("corporateLogoPreview");
const corporateLogoFallback = document.getElementById("corporateLogoFallback");
const corporateLogoTrigger  = document.getElementById("corporateLogoTrigger");

/* ── Avatar usuario ── */
const userAvatarInput   = document.getElementById("userAvatarInput");
const userAvatarPreview = document.getElementById("userAvatarPreview");
const userAvatarFallback = document.getElementById("userAvatarFallback");
const userAvatarTrigger  = document.getElementById("userAvatarTrigger");

/* ── Logout ── */
const logoutButton = document.getElementById("logoutButton");
const logoutModal  = document.getElementById("logoutModal");
const logoutNo     = document.getElementById("logoutNo");
const logoutYes    = document.getElementById("logoutYes");

/* ── Responsive ── */
const mobileMediaQuery = window.matchMedia("(max-width: 860px)");

/* ── Inicialización de la UI base (sidebar, tema, avatares, logout) ── */
initializeAppUi({
  appRoot,
  sidebarToggleButton: sidebarToggleBtn,
  sidebar,
  overlay,
  themeToggle,
  themeLabel,
  corporateLogoInput,
  corporateLogoPreview,
  corporateLogoFallback,
  corporateLogoTrigger,
  userAvatarInput,
  userAvatarPreview,
  userAvatarFallback,
  userAvatarTrigger,
  logoutButton,
  logoutModal,
  logoutNoButton:  logoutNo,
  logoutYesButton: logoutYes,
  mobileMediaQuery,
});

/* ============================================================
   MÓDULO: CREAR CLIENTE (heredado del proyecto base)
   ============================================================ */
const createClientMenuButton  = document.getElementById("createClientMenuButton");
const createClientModal       = document.getElementById("createClientModal");
const createClientForm        = document.getElementById("createClientForm");
const toast                   = document.getElementById("toast");
const createClientSaveButton  = document.getElementById("createClientSaveButton");
const createClientCancelButton = document.getElementById("createClientCancelButton");
const createClientCountBadge  = document.getElementById("createClientCountBadge");

const identificacionInput = document.getElementById("identificacionInput");
const nombresInput        = document.getElementById("nombresInput");
const direccionInput      = document.getElementById("direccionInput");
const whatsappInput       = document.getElementById("whatsappInput");
const telefonoInput       = document.getElementById("telefonoInput");
const emailInput          = document.getElementById("emailInput");

const departamentoSelect = document.getElementById("departamentoSelect");
const municipioSelect    = document.getElementById("municipioSelect");
const barrioSelect       = document.getElementById("barrioSelect");

const identificacionError = document.getElementById("identificacionError");
const nombresError        = document.getElementById("nombresError");
const direccionError      = document.getElementById("direccionError");
const whatsappError       = document.getElementById("whatsappError");
const telefonoError       = document.getElementById("telefonoError");
const emailError          = document.getElementById("emailError");
const departamentoError   = document.getElementById("departamentoError");
const municipioError      = document.getElementById("municipioError");
const barrioError         = document.getElementById("barrioError");

initializeCreateClientFeature({
  menuButton:    createClientMenuButton,
  modal:         createClientModal,
  form:          createClientForm,
  toast,
  saveButton:    createClientSaveButton,
  cancelButton:  createClientCancelButton,
  countBadge:    createClientCountBadge,
  identificacionInput,
  nombresInput,
  direccionInput,
  whatsappInput,
  telefonoInput,
  emailInput,
  departamentoSelect,
  municipioSelect,
  barrioSelect,
  identificacionError,
  nombresError,
  direccionError,
  whatsappError,
  telefonoError,
  emailError,
  departamentoError,
  municipioError,
  barrioError,
});

/* ============================================================
   MÓDULO: LISTAR CLIENTES (heredado del proyecto base)
   ============================================================ */
const listClientsMenuButton  = document.getElementById("listClientsMenuButton");
const listClientsModal       = document.getElementById("listClientsModal");
const listClientsForm        = document.getElementById("listClientsForm");
const listClientsSortSelect  = document.getElementById("listClientsSortSelect");
const listClientsSearchInput = document.getElementById("listClientsSearchInput");
const clientsListContainer   = document.getElementById("clientsListContainer");
const clientsList            = document.getElementById("clientsList");
const listClientsCloseButton = document.getElementById("listClientsCloseButton");
const listClientsCountBadge  = document.getElementById("listClientsCountBadge");

initializeListClientsFeature({
  menuButton:    listClientsMenuButton,
  modal:         listClientsModal,
  form:          listClientsForm,
  sortSelect:    listClientsSortSelect,
  searchInput:   listClientsSearchInput,
  listContainer: clientsListContainer,
  listNode:      clientsList,
  closeButton:   listClientsCloseButton,
  countBadge:    listClientsCountBadge,
});

/* ============================================================
   MÓDULO: CREAR MASCOTA (nuevo en AdoptaMascotasApp)
   ============================================================ */
const createMascotaMenuButton  = document.getElementById("createMascotaMenuButton");
const createMascotaModal       = document.getElementById("createMascotaModal");
const createMascotaForm        = document.getElementById("createMascotaForm");
const createMascotaSaveButton  = document.getElementById("createMascotaSaveButton");
const createMascotaCancelButton = document.getElementById("createMascotaCancelButton");
const createMascotaCountBadge  = document.getElementById("createMascotaCountBadge");

const mascotaChipInput    = document.getElementById("mascotaChipInput");
const mascotaNombreInput  = document.getElementById("mascotaNombreInput");
const mascotaEspecieSelect = document.getElementById("mascotaEspecieSelect");
const mascotaRazaSelect   = document.getElementById("mascotaRazaSelect");
const mascotaFechaNacInput = document.getElementById("mascotaFechaNacInput");
const mascotaColorInput   = document.getElementById("mascotaColorInput");
const mascotaObsInput     = document.getElementById("mascotaObsInput");

const mascotaChipError    = document.getElementById("mascotaChipError");
const mascotaNombreError  = document.getElementById("mascotaNombreError");
const mascotaEspecieError = document.getElementById("mascotaEspecieError");
const mascotaRazaError    = document.getElementById("mascotaRazaError");
const mascotaFechaNacError = document.getElementById("mascotaFechaNacError");
const mascotaColorError   = document.getElementById("mascotaColorError");
const mascotaObsError     = document.getElementById("mascotaObsError");

initializeCreateMascotaFeature({
  menuButton:    createMascotaMenuButton,
  modal:         createMascotaModal,
  form:          createMascotaForm,
  saveButton:    createMascotaSaveButton,
  cancelButton:  createMascotaCancelButton,
  countBadge:    createMascotaCountBadge,
  chipInput:     mascotaChipInput,
  nombreInput:   mascotaNombreInput,
  especieSelect: mascotaEspecieSelect,
  razaSelect:    mascotaRazaSelect,
  fechaNacInput: mascotaFechaNacInput,
  colorInput:    mascotaColorInput,
  obsInput:      mascotaObsInput,
  chipError:     mascotaChipError,
  nombreError:   mascotaNombreError,
  especieError:  mascotaEspecieError,
  razaError:     mascotaRazaError,
  fechaNacError: mascotaFechaNacError,
  colorError:    mascotaColorError,
  obsError:      mascotaObsError,
});

/* ============================================================
   MÓDULO: LISTAR MASCOTAS (nuevo en AdoptaMascotasApp)
   ============================================================ */
const listMascotasMenuButton  = document.getElementById("listMascotasMenuButton");
const listMascotasModal       = document.getElementById("listMascotasModal");
const listMascotasForm        = document.getElementById("listMascotasForm");
const listMascotasSortSelect  = document.getElementById("listMascotasSortSelect");
const listMascotasEspecieFilter = document.getElementById("listMascotasEspecieFilter");
const listMascotasSearchInput = document.getElementById("listMascotasSearchInput");
const mascotasListContainer   = document.getElementById("mascotasListContainer");
const mascotasList            = document.getElementById("mascotasList");
const listMascotasCloseButton = document.getElementById("listMascotasCloseButton");
const listMascotasCountBadge  = document.getElementById("listMascotasCountBadge");

initializeListMascotasFeature({
  menuButton:    listMascotasMenuButton,
  modal:         listMascotasModal,
  form:          listMascotasForm,
  sortSelect:    listMascotasSortSelect,
  especieFilter: listMascotasEspecieFilter,
  searchInput:   listMascotasSearchInput,
  listContainer: mascotasListContainer,
  listNode:      mascotasList,
  closeButton:   listMascotasCloseButton,
  countBadge:    listMascotasCountBadge,
});

/* ============================================================
   MÓDULO: CREAR ADOPCIÓN (nuevo en AdoptaMascotasApp)
   ============================================================ */
const createAdopcionMenuButton   = document.getElementById("createAdopcionMenuButton");
const createAdopcionModal        = document.getElementById("createAdopcionModal");
const createAdopcionForm         = document.getElementById("createAdopcionForm");
const createAdopcionSaveButton   = document.getElementById("createAdopcionSaveButton");
const createAdopcionCancelButton = document.getElementById("createAdopcionCancelButton");
const createAdopcionCountBadge   = document.getElementById("createAdopcionCountBadge");

const adopcionIdentificacionInput = document.getElementById("adopcionIdentificacionInput");
const adopcionNombreInput         = document.getElementById("adopcionNombreInput");
const adopcionWhatsappInput       = document.getElementById("adopcionWhatsappInput");
const adopcionMascotaSelect       = document.getElementById("adopcionMascotaSelect");
const adopcionFechaInput          = document.getElementById("adopcionFechaInput");
const adopcionObsInput            = document.getElementById("adopcionObsInput");

const adopcionIdentificacionError = document.getElementById("adopcionIdentificacionError");
const adopcionNombreError         = document.getElementById("adopcionNombreError");
const adopcionWhatsappError       = document.getElementById("adopcionWhatsappError");
const adopcionMascotaError        = document.getElementById("adopcionMascotaError");
const adopcionFechaError          = document.getElementById("adopcionFechaError");
const adopcionObsError            = document.getElementById("adopcionObsError");

initializeCreateAdopcionFeature({
  menuButton:          createAdopcionMenuButton,
  modal:               createAdopcionModal,
  form:                createAdopcionForm,
  saveButton:          createAdopcionSaveButton,
  cancelButton:        createAdopcionCancelButton,
  countBadge:          createAdopcionCountBadge,
  identificacionInput: adopcionIdentificacionInput,
  nombreInput:         adopcionNombreInput,
  whatsappInput:       adopcionWhatsappInput,
  mascotaSelect:       adopcionMascotaSelect,
  fechaInput:          adopcionFechaInput,
  obsInput:            adopcionObsInput,
  identificacionError: adopcionIdentificacionError,
  nombreError:         adopcionNombreError,
  whatsappError:       adopcionWhatsappError,
  mascotaError:        adopcionMascotaError,
  fechaError:          adopcionFechaError,
  obsError:            adopcionObsError,
});

/* ============================================================
   MÓDULO: LISTAR ADOPCIONES (nuevo en AdoptaMascotasApp)
   ============================================================ */
const listAdopcionesMenuButton  = document.getElementById("listAdopcionesMenuButton");
const listAdopcionesModal       = document.getElementById("listAdopcionesModal");
const listAdopcionesForm        = document.getElementById("listAdopcionesForm");
const listAdopcionesSortSelect  = document.getElementById("listAdopcionesSortSelect");
const listAdopcionesSearchInput = document.getElementById("listAdopcionesSearchInput");
const adopcionesListContainer   = document.getElementById("adopcionesListContainer");
const adopcionesList            = document.getElementById("adopcionesList");
const listAdopcionesCloseButton = document.getElementById("listAdopcionesCloseButton");
const listAdopcionesCountBadge  = document.getElementById("listAdopcionesCountBadge");

initializeListAdopcionesFeature({
  menuButton:    listAdopcionesMenuButton,
  modal:         listAdopcionesModal,
  form:          listAdopcionesForm,
  sortSelect:    listAdopcionesSortSelect,
  searchInput:   listAdopcionesSearchInput,
  listContainer: adopcionesListContainer,
  listNode:      adopcionesList,
  closeButton:   listAdopcionesCloseButton,
  countBadge:    listAdopcionesCountBadge,
});

/* ============================================================
   INICIALIZAR PANEL DE BIENVENIDA
   ============================================================ */
updateWelcomeStats();

/* ============================================================
   PERSISTENCIA: cargar datos guardados y activar auto-guardado
   Debe ser la última llamada después de inicializar todos los módulos.
   ============================================================ */
inicializarPersistencia();
