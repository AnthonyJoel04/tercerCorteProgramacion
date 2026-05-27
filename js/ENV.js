"use strict";

/*
  ARCHIVO TIPO .ENV (ENTORNO DE LA APLICACIÓN)
  Proyecto: Adopción de Mascotas
  Versión: 1.1

  Propósito:
  - Centralizar la declaración e inicialización de variables, constantes y arrays globales del proyecto.
  - Mantener el proyecto simple, legible y mantenible.

  Reglas de este archivo:
  - NO contiene funciones (estricto).
  - Define únicamente datos globales (arrays/variables/constantes).
*/

/* Versión de la aplicación */
const appVersion = "1.1";

/* =========================================================
   CATÁLOGOS GEOGRÁFICOS (igual que proyecto base ClientesApp)
   ========================================================= */

const departamentos = [{ idDepartamento: 66, nombre: "Risaralda" }];

const municipios = [
  { idMunicipio: 66001, nombre: "Pereira",             idDepartamento: 66 },
  { idMunicipio: 66045, nombre: "Apía",                idDepartamento: 66 },
  { idMunicipio: 66075, nombre: "Balboa",              idDepartamento: 66 },
  { idMunicipio: 66088, nombre: "Belén de Umbría",     idDepartamento: 66 },
  { idMunicipio: 66170, nombre: "Dosquebradas",        idDepartamento: 66 },
  { idMunicipio: 66318, nombre: "Guática",             idDepartamento: 66 },
  { idMunicipio: 66383, nombre: "La Celia",            idDepartamento: 66 },
  { idMunicipio: 66400, nombre: "La Virginia",         idDepartamento: 66 },
  { idMunicipio: 66440, nombre: "Marsella",            idDepartamento: 66 },
  { idMunicipio: 66456, nombre: "Mistrató",            idDepartamento: 66 },
  { idMunicipio: 66572, nombre: "Pueblo Rico",         idDepartamento: 66 },
  { idMunicipio: 66594, nombre: "Quinchía",            idDepartamento: 66 },
  { idMunicipio: 66682, nombre: "Santa Rosa de Cabal", idDepartamento: 66 },
  { idMunicipio: 66687, nombre: "Santuario",           idDepartamento: 66 },
];

const barrios = [
  { idBarrio: 1,  nombre: "Belalcázar",         idMunicipio: 66001 },
  { idBarrio: 2,  nombre: "Bosques de la Salle", idMunicipio: 66001 },
  { idBarrio: 3,  nombre: "Boston",              idMunicipio: 66001 },
  { idBarrio: 4,  nombre: "Caminos de Canaán",  idMunicipio: 66001 },
  { idBarrio: 5,  nombre: "Centenario",          idMunicipio: 66001 },
  { idBarrio: 6,  nombre: "Central",             idMunicipio: 66001 },
  { idBarrio: 7,  nombre: "Ciudad Palermo",      idMunicipio: 66001 },
  { idBarrio: 8,  nombre: "Ciudad Pereira",      idMunicipio: 66001 },
  { idBarrio: 9,  nombre: "El Vergel",           idMunicipio: 66001 },
  { idBarrio: 10, nombre: "Gaviotas",            idMunicipio: 66001 },
  { idBarrio: 11, nombre: "Guaduales de Canaán", idMunicipio: 66001 },
  { idBarrio: 12, nombre: "La Arboleda",         idMunicipio: 66001 },
  { idBarrio: 13, nombre: "La Florida",          idMunicipio: 66001 },
  { idBarrio: 14, nombre: "La Laguna",           idMunicipio: 66001 },
  { idBarrio: 15, nombre: "La Lorena I",         idMunicipio: 66001 },
  { idBarrio: 16, nombre: "La Lorena II",        idMunicipio: 66001 },
  { idBarrio: 17, nombre: "La Lorena III",       idMunicipio: 66001 },
  { idBarrio: 18, nombre: "La Lorena IV",        idMunicipio: 66001 },
  { idBarrio: 19, nombre: "La Platanera",        idMunicipio: 66001 },
  { idBarrio: 20, nombre: "La Unidad",           idMunicipio: 66001 },
  { idBarrio: 21, nombre: "Los Almendros",       idMunicipio: 66001 },
  { idBarrio: 22, nombre: "Los Profesionales",   idMunicipio: 66001 },
  { idBarrio: 23, nombre: "Mejía Robledo",       idMunicipio: 66001 },
  { idBarrio: 24, nombre: "Olaya Herrera",       idMunicipio: 66001 },
  { idBarrio: 25, nombre: "Providencia",         idMunicipio: 66001 },
  { idBarrio: 26, nombre: "San Luis Gonzaga",    idMunicipio: 66001 },
  { idBarrio: 27, nombre: "San Remo",            idMunicipio: 66001 },
  { idBarrio: 28, nombre: "Terminal",            idMunicipio: 66001 },
  { idBarrio: 29, nombre: "Tulcán I",            idMunicipio: 66001 },
  { idBarrio: 30, nombre: "Tulcán II",           idMunicipio: 66001 },
];

/* =========================================================
   CATÁLOGOS DEL CENTRO DE ADOPCIÓN
   ========================================================= */

/* Entidad: Especies */
const especies = [
  { idEspecie: 1, codigo: "CAN", nombre: "Canino" },
  { idEspecie: 2, codigo: "FEL", nombre: "Felino" },
  { idEspecie: 3, codigo: "AVE", nombre: "Ave" },
  { idEspecie: 4, codigo: "ROE", nombre: "Roedor" },
];

/* Entidad: Razas */
const razas = [
  { idRaza: 1,  codigo: "LAB",  nombre: "Labrador Retriever",    idEspecie: 1 },
  { idRaza: 2,  codigo: "PAT",  nombre: "Pastor Alemán",         idEspecie: 1 },
  { idRaza: 3,  codigo: "POM",  nombre: "Pomerania",             idEspecie: 1 },
  { idRaza: 4,  codigo: "BEA",  nombre: "Beagle",                idEspecie: 1 },
  { idRaza: 5,  codigo: "CRI",  nombre: "Criolla / Mestiza",     idEspecie: 1 },
  { idRaza: 6,  codigo: "PEP",  nombre: "Persa",                 idEspecie: 2 },
  { idRaza: 7,  codigo: "SIA",  nombre: "Siamés",                idEspecie: 2 },
  { idRaza: 8,  codigo: "MCO",  nombre: "Maine Coon",            idEspecie: 2 },
  { idRaza: 9,  codigo: "CRG",  nombre: "Criolla / Mestiza",     idEspecie: 2 },
  { idRaza: 10, codigo: "CAT",  nombre: "Canario",               idEspecie: 3 },
  { idRaza: 11, codigo: "PER",  nombre: "Periquito",             idEspecie: 3 },
  { idRaza: 12, codigo: "COB",  nombre: "Cobaya / Cuy",          idEspecie: 4 },
  { idRaza: 13, codigo: "HAM",  nombre: "Hámster",               idEspecie: 4 },
];

/* Entidad: Mascotas */
const mascotas = [
  { idMascota: 1,  chipIdentificacion: "COL0010001", nombre: "Toby",    idRaza: 1,  fechaNacimiento: "2021-03-15", color: "Dorado",      observaciones: "Muy amigable y juguetón",        fechaCreacion: "2023-01-10" },
  { idMascota: 2,  chipIdentificacion: "COL0010002", nombre: "Luna",    idRaza: 6,  fechaNacimiento: "2020-07-22", color: "Blanco",      observaciones: "Tranquila, ideal para apartamento", fechaCreacion: "2023-02-05" },
  { idMascota: 3,  chipIdentificacion: "COL0010003", nombre: "Max",     idRaza: 2,  fechaNacimiento: "2019-11-01", color: "Negro/Marrón",observaciones: "Entrenado en obediencia básica",  fechaCreacion: "2023-03-18" },
  { idMascota: 4,  chipIdentificacion: "COL0010004", nombre: "Mia",     idRaza: 9,  fechaNacimiento: "2022-01-30", color: "Naranja",     observaciones: "Cariñosa con niños",             fechaCreacion: "2023-04-02" },
  { idMascota: 5,  chipIdentificacion: "COL0010005", nombre: "Rocky",   idRaza: 4,  fechaNacimiento: "2021-09-12", color: "Tricolor",    observaciones: "Le encanta correr al aire libre", fechaCreacion: "2023-04-25" },
  { idMascota: 6,  chipIdentificacion: "COL0010006", nombre: "Nala",    idRaza: 7,  fechaNacimiento: "2020-05-18", color: "Crema/Café",  observaciones: "Muy vocal y curiosa",            fechaCreacion: "2023-05-10" },
  { idMascota: 7,  chipIdentificacion: "COL0010007", nombre: "Pelusa",  idRaza: 3,  fechaNacimiento: "2022-08-05", color: "Blanco",      observaciones: "Mini, ideal para espacios pequeños", fechaCreacion: "2023-06-01" },
  { idMascota: 8,  chipIdentificacion: "COL0010008", nombre: "Simba",   idRaza: 5,  fechaNacimiento: "2018-12-20", color: "Café",        observaciones: "Adulto mayor, muy tranquilo",    fechaCreacion: "2023-07-15" },
  { idMascota: 9,  chipIdentificacion: "COL0010009", nombre: "Coco",    idRaza: 10, fechaNacimiento: "2021-04-10", color: "Amarillo",    observaciones: "Canta por las mañanas",          fechaCreacion: "2023-08-03" },
  { idMascota: 10, chipIdentificacion: "COL0010010", nombre: "Thor",    idRaza: 2,  fechaNacimiento: "2022-02-14", color: "Negro",       observaciones: "Energético, necesita espacio",   fechaCreacion: "2023-09-20" },
];

/* Entidad: Vacunas por Mascota */
const vacunasMascota = [
  { idVacunaMascota: 1, idMascota: 1, vacuna: "Rabia",         fechaAplicacion: "2024-01-10", fechaVencimiento: "2025-01-10", nombreVeterinario: "Dr. Peña",   fechaRegistro: "2024-01-10" },
  { idVacunaMascota: 2, idMascota: 1, vacuna: "Parvovirus",    fechaAplicacion: "2024-01-10", fechaVencimiento: "2025-01-10", nombreVeterinario: "Dr. Peña",   fechaRegistro: "2024-01-10" },
  { idVacunaMascota: 3, idMascota: 2, vacuna: "Triple Felina", fechaAplicacion: "2024-02-15", fechaVencimiento: "2025-02-15", nombreVeterinario: "Dra. Torres",fechaRegistro: "2024-02-15" },
  { idVacunaMascota: 4, idMascota: 3, vacuna: "Rabia",         fechaAplicacion: "2024-03-20", fechaVencimiento: "2025-03-20", nombreVeterinario: "Dr. Mora",   fechaRegistro: "2024-03-20" },
  { idVacunaMascota: 5, idMascota: 5, vacuna: "Rabia",         fechaAplicacion: "2024-04-05", fechaVencimiento: "2025-04-05", nombreVeterinario: "Dr. Peña",   fechaRegistro: "2024-04-05" },
];

/* Entidad: Clientes */
const clientes = [
  { idCliente: 1,  identificacion: "1000000001", nombres: "Ana María Pérez",        direccion: "Calle 10 # 12-34 Apto 202", idDepartamento: 66, idMunicipio: 66001, idBarrio: 1,  whatsapp: "3001234567", telefono: "6041234", email: "ana.perez@correo.com",      fechaCreacion: "2024-01-15" },
  { idCliente: 2,  identificacion: "1000000002", nombres: "Juan David Gómez",        direccion: "Carrera 7 # 20-15",         idDepartamento: 66, idMunicipio: 66001, idBarrio: 2,  whatsapp: "3012345678", telefono: null,       email: "juan.gomez@correo.com",      fechaCreacion: "2024-02-10" },
  { idCliente: 3,  identificacion: "1000000003", nombres: "Luisa Fernanda Rodríguez",direccion: "Avenida 30 # 5-10",         idDepartamento: 66, idMunicipio: 66001, idBarrio: 3,  whatsapp: "3023456789", telefono: "6078901", email: "luisa.rodriguez@correo.com", fechaCreacion: "2024-03-08" },
  { idCliente: 4,  identificacion: "1000000004", nombres: "Carlos Andrés Martínez",  direccion: "Calle 22 # 8-45",           idDepartamento: 66, idMunicipio: 66001, idBarrio: 4,  whatsapp: "3034567890", telefono: null,       email: "carlos.martinez@correo.com", fechaCreacion: "2024-04-12" },
  { idCliente: 5,  identificacion: "1000000005", nombres: "Sofía Alejandra López",   direccion: "Diagonal 15 # 9-30",        idDepartamento: 66, idMunicipio: 66001, idBarrio: 5,  whatsapp: "3045678901", telefono: "6034567", email: "sofia.lopez@correo.com",     fechaCreacion: "2024-05-20" },
];

/* Entidad: Usuarios del sistema */
const usuarios = [
  { idUsuario: 1, identificacion: "98765001", nombre: "Ing. Diego Fernando Londoño", whatsapp: "3043942508", telefono: null,       idMunicipio: 66001, email: "diego.londono@ciaf.edu.co", fechaCreacion: "2023-01-01" },
  { idUsuario: 2, identificacion: "10050002", nombre: "Administradora Centro",        whatsapp: "3001111222", telefono: "6041000", idMunicipio: 66001, email: "admin@centropets.com",       fechaCreacion: "2023-01-02" },
];

/* Entidad: Adopciones */
const adopciones = [
  { idAdopcion: 1, idUsuario: 1, fechaAdopcion: "2024-02-20", idCliente: 1, observaciones: "Proceso completado sin inconvenientes", fechaRegistro: "2024-02-20" },
  { idAdopcion: 2, idUsuario: 1, fechaAdopcion: "2024-03-15", idCliente: 3, observaciones: "Cliente con experiencia previa en mascotas", fechaRegistro: "2024-03-15" },
  { idAdopcion: 3, idUsuario: 2, fechaAdopcion: "2024-04-10", idCliente: 2, observaciones: "Primer mascota del cliente", fechaRegistro: "2024-04-10" },
];

/* Entidad: Mascotas Adoptadas */
const mascotasAdoptadas = [
  { idMascotaAdoptada: 1, idAdopcion: 1, idMascota: 2, observaciones: "Luna adoptada por familia Pérez",          fechaRegistro: "2024-02-20" },
  { idMascotaAdoptada: 2, idAdopcion: 2, idMascota: 6, observaciones: "Nala va a un hogar con mucho amor",        fechaRegistro: "2024-03-15" },
  { idMascotaAdoptada: 3, idAdopcion: 3, idMascota: 9, observaciones: "Coco adoptado, tiene buena adaptación",   fechaRegistro: "2024-04-10" },
];

/* =========================================================
   VARIABLES GLOBALES DE ESTADO
   ========================================================= */

let selectedDepartamentoId = null;
let selectedMunicipioId    = null;
let selectedBarrioId       = null;
let selectedEspecieId      = null;
let selectedRazaId         = null;

const uiToastDurationMs = 5000;
let toastTimeoutId = null;

let appUiContext          = null;
let createClientUiContext = null;
let listClientsUiContext  = null;
let createMascotaUiContext = null;
let listMascotasUiContext  = null;
let createAdopcionUiContext = null;
let listAdopcionesUiContext = null;

let corporateLogoObjectUrl = null;
let userAvatarObjectUrl    = null;

let createClientHasAttemptedSubmit     = false;
let createClientIdentificacionDuplicated = false;
let createMascotaHasAttemptedSubmit    = false;
let createAdopcionHasAttemptedSubmit   = false;

/* Expresiones regulares globales */
const regexIdentificacion    = /^[0-9]{5,15}$/;
const regexNombres           = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,80}$/;
const regexDireccion         = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 #\-.,]{5,120}$/;
const regexTelefono          = /^[0-9]{7}$/;
const regexWhatsapp          = /^[0-9]{10}$/;
const regexEmail             = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const regexChip              = /^[A-Za-z0-9]{5,20}$/;
const regexNombreMascota     = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,60}$/;
const regexColor             = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\/\-,. ]{2,40}$/;
