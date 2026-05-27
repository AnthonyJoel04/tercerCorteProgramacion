/*
  INTEGRACION.JS — PataHogar (completo)
  Maneja: modales, CRUD mascotas/clientes/adopciones/visitas,
  render de tablas, dashboard, estadísticas, documentos, persistencia.
*/

/* ============================================================
   ARRAYS LOCALES (PataHogar UI — independientes del repo)
============================================================ */
var petasLocal      = [];
var clientesLocal   = [];
var adopcionesLocal = [];
var visitasLocal    = [];
var documentosGuardados = [];

/* ============================================================
   PERSISTENCIA localStorage
============================================================ */
function guardarTodo() {
  try {
    localStorage.setItem("ph_mascotas",   JSON.stringify(petasLocal));
    localStorage.setItem("ph_clientes",   JSON.stringify(clientesLocal));
    localStorage.setItem("ph_adopciones", JSON.stringify(adopcionesLocal));
    localStorage.setItem("ph_visitas",    JSON.stringify(visitasLocal));
    localStorage.setItem("ph_docs",       JSON.stringify(documentosGuardados));
  } catch(e) {}
}

function cargarTodo() {
  try {
    const pm = localStorage.getItem("ph_mascotas");
    const pc = localStorage.getItem("ph_clientes");
    const pa = localStorage.getItem("ph_adopciones");
    const pv = localStorage.getItem("ph_visitas");
    const pd = localStorage.getItem("ph_docs");
    if (pm) petasLocal      = JSON.parse(pm);
    if (pc) clientesLocal   = JSON.parse(pc);
    if (pa) adopcionesLocal = JSON.parse(pa);
    if (pv) visitasLocal    = JSON.parse(pv);
    if (pd) documentosGuardados = JSON.parse(pd);
  } catch(e) {}

  /* Si no hay datos locales, migrar desde arrays del repo */
  if (!petasLocal.length && typeof mascotas !== "undefined" && mascotas.length) {
    petasLocal = mascotas.map(repoMascotaToPata);
  }
  if (!clientesLocal.length && typeof clientes !== "undefined" && clientes.length) {
    clientesLocal = clientes.map(repoClienteToPata);
  }
  if (!adopcionesLocal.length && typeof adopciones !== "undefined" && adopciones.length) {
    adopcionesLocal = adopciones.map(repoAdopcionToPata);
  }
}

/* ============================================================
   CONVERSORES repo → PataHogar
============================================================ */
function repoMascotaToPata(m) {
  try {
    const idEsp  = getEspecieIdByRazaId(m.idRaza);
    const espNom = getEspecieNombreById(idEsp);
    const razaNom= getRazaNombreById(m.idRaza);
    const adopt  = isMascotaAdoptada(m.idMascota);
    const emoji  = ({Canino:"🐶",Felino:"🐱",Ave:"🐦",Roedor:"🐹"})[espNom] || "🐾";
    return {
      id: m.idMascota, nombre: m.nombre,
      especie: espNom || "Otro", raza: razaNom || "",
      edad: calcEdad(m.fechaNacimiento),
      estado: adopt ? "Adoptado" : "Disponible",
      emoji, desc: m.observaciones || "",
      sexo: "", vivienda: ""
    };
  } catch(e) {
    return { id: m.idMascota, nombre: m.nombre||"?", especie:"Otro", raza:"", edad:"—", estado:"Disponible", emoji:"🐾", desc:"" };
  }
}

function repoClienteToPata(c) {
  return {
    id: c.idCliente,
    nombre: c.nombres || c.nombre || "—",
    doc: c.identificacion || "",
    email: c.email || "—",
    tel: c.whatsapp || c.telefono || "—",
    ciudad: (typeof getMunicipioNombreById==="function" ? getMunicipioNombreById(c.idMunicipio) : "") || "Pereira",
    vivienda: "", notas: ""
  };
}

function repoAdopcionToPata(a) {
  const ma = (typeof mascotasAdoptadas!=="undefined") ? mascotasAdoptadas.find(x=>x.idAdopcion===a.idAdopcion) : null;
  return {
    id: a.idAdopcion,
    mascotaId: ma ? ma.idMascota : null,
    clienteId: a.idCliente,
    fecha: a.fechaAdopcion || a.fechaRegistro || "",
    estado: "Aprobada",
    notas: a.observaciones || ""
  };
}

function calcEdad(f) {
  try {
    const t = (new Date().getFullYear()-new Date(f).getFullYear())*12
            + (new Date().getMonth()-new Date(f).getMonth());
    return t<12 ? t+" mes"+(t!==1?"es":"") : Math.floor(t/12)+" año"+(Math.floor(t/12)!==1?"s":"");
  } catch(e) { return "—"; }
}

/* ============================================================
   ESTADO UI
============================================================ */
var currentSection = "dashboard";
var editingId      = null;
var pendingFiles   = [];

/* ============================================================
   HELPERS
============================================================ */
function getPeta(id)    { return petasLocal.find(x=>x.id==id)||{}; }
function getCliente(id) { return clientesLocal.find(x=>x.id==id)||{}; }
function nextId(arr)    { return arr.length ? Math.max(...arr.map(x=>x.id||0))+1 : 1; }

function fmtDate(d) {
  if (!d) return "—";
  const p = d.split("-");
  return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : d;
}
function initials(n) { return (n||"?").split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase(); }
function avatarColor(i){ return ["avatar-green","avatar-blue","avatar-amber","avatar-red"][i%4]; }
function pillState(st) {
  return ({Disponible:"pill-green",Adoptado:"pill-gray","En proceso":"pill-amber",
    Aprobada:"pill-green",Pendiente:"pill-amber",Rechazada:"pill-red",
    Confirmada:"pill-blue",Realizada:"pill-green",Cancelada:"pill-red"})[st]||"pill-gray";
}

/* ============================================================
   TOAST
============================================================ */
var _tt;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(()=>el.classList.remove("show"), 2800);
}

/* ============================================================
   MODALES
============================================================ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add("open"); el.style.display="flex"; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove("open"); el.style.display="none"; }
}

/* ============================================================
   NAVEGACIÓN
============================================================ */
function navigate(sec, btn) {
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  const s = document.getElementById("sec-"+sec);
  if (s) s.classList.add("active");
  if (btn) btn.classList.add("active");
  currentSection = sec;
  const titles = {dashboard:"Resumen",mascotas:"Librería de mascotas",
    clientes:"Lista de clientes",adopciones:"Lista de adopciones",
    visitas:"Visitas agendadas",documentos:"Documentos",estadisticas:"Estadísticas"};
  const pt = document.getElementById("page-title");
  if (pt) pt.textContent = titles[sec]||sec;
  const labels = {mascotas:"Nueva mascota",clientes:"Nuevo cliente",
    adopciones:"Nueva adopción",visitas:"Agendar visita"};
  const b2 = document.getElementById("main-add-btn");
  if (b2) {
    if (labels[sec]) { b2.style.display=""; b2.lastChild.textContent=" "+labels[sec]; }
    else b2.style.display="none";
  }
  renderAll();
}

function openAddModal() {
  editingId = null;
  if      (currentSection==="mascotas")   openMascotaModal();
  else if (currentSection==="clientes")   openClienteModal();
  else if (currentSection==="adopciones") openAdopcionModal();
  else if (currentSection==="visitas")    openVisitaModal();
}

/* ============================================================
   RENDER ALL
============================================================ */
function renderAll() {
  updateBadges();
  const fn = {dashboard:renderDashboard, mascotas:renderMascotas,
    clientes:renderClientes, adopciones:renderAdopciones,
    visitas:renderVisitas, documentos:renderDocumentos,
    estadisticas:renderEstadisticas}[currentSection];
  if (fn) fn();
}

function updateBadges() {
  const bm = document.getElementById("badge-mascotas");
  const bc = document.getElementById("badge-clientes");
  const ba = document.getElementById("badge-adopciones");
  const bv = document.getElementById("badge-visitas");
  if (bm) bm.textContent = petasLocal.filter(m=>m.estado!=="Adoptado").length;
  if (bc) bc.textContent = clientesLocal.length;
  if (ba) ba.textContent = adopcionesLocal.length;
  if (bv) bv.textContent = visitasLocal.filter(v=>v.estado==="Pendiente"||v.estado==="Confirmada").length;
}

/* ============================================================
   DASHBOARD
============================================================ */
function renderDashboard() {
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set("s-disponibles", petasLocal.filter(m=>m.estado!=="Adoptado").length);
  set("s-clientes",    clientesLocal.length);
  set("s-adopciones",  adopcionesLocal.length);
  set("s-visitas",     visitasLocal.filter(v=>v.estado==="Pendiente"||v.estado==="Confirmada").length);

  const tb = document.getElementById("dash-adopciones-tbody");
  if (tb) {
    const rows = adopcionesLocal.slice(-5).reverse();
    tb.innerHTML = rows.length
      ? rows.map(a=>`<tr>
          <td>${getPeta(a.mascotaId).emoji||"🐾"} ${getPeta(a.mascotaId).nombre||"—"}</td>
          <td>${getCliente(a.clienteId).nombre||"—"}</td>
          <td>${fmtDate(a.fecha)}</td>
          <td><span class="pill ${pillState(a.estado)}">${a.estado}</span></td>
        </tr>`).join("")
      : `<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:20px">Sin adopciones</td></tr>`;
  }

  const vl = document.getElementById("dash-visitas-list");
  if (vl) {
    const proximas = visitasLocal
      .filter(v=>v.estado==="Pendiente"||v.estado==="Confirmada")
      .sort((a,b)=>(a.fecha+a.hora).localeCompare(b.fecha+b.hora))
      .slice(0,4);
    const meses=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    vl.innerHTML = proximas.length
      ? proximas.map(v=>{
          const c=getCliente(v.clienteId);
          const m=v.mascotaId?getPeta(v.mascotaId):null;
          const parts=(v.fecha||"").split("-");
          return `<div class="visit-item">
            <div class="visit-date-box">
              <div class="visit-day">${parts[2]||"—"}</div>
              <div class="visit-month">${meses[parseInt(parts[1])]||""}</div>
            </div>
            <div>
              <div style="font-weight:500;font-size:14px">${c.nombre||"—"}</div>
              <div style="font-size:12px;color:var(--text3)">${m?(m.emoji||"🐾")+" "+m.nombre:"Sin mascota"} · ${v.hora||""}</div>
              <span class="pill ${pillState(v.estado)}" style="margin-top:4px;display:inline-flex">${v.estado}</span>
            </div>
          </div>`;
        }).join("")
      : `<div class="empty-state"><div class="empty-icon">📅</div><div>Sin visitas próximas</div></div>`;
  }
}

/* ============================================================
   MASCOTAS
============================================================ */
function openMascotaModal(id) {
  editingId = id || null;
  const set=(sid,v)=>{const e=document.getElementById(sid);if(e)e.value=v||"";};
  if (id) {
    const m = petasLocal.find(x=>x.id==id)||{};
    set("m-id",     m.id);
    set("m-nombre", m.nombre);
    set("m-especie",m.especie);
    set("m-raza",   m.raza);
    set("m-edad",   m.edad);
    set("m-sexo",   m.sexo||"");
    set("m-estado", m.estado);
    set("m-emoji",  m.emoji);
    set("m-desc",   m.desc);
    document.getElementById("modal-mascota-title").textContent = "Editar mascota";
  } else {
    ["m-id","m-nombre","m-raza","m-edad","m-emoji","m-desc"].forEach(s=>set(s,""));
    set("m-especie",""); set("m-sexo",""); set("m-estado","Disponible");
    document.getElementById("modal-mascota-title").textContent = "Nueva mascota";
  }
  openModal("modal-mascota");
}

function saveMascota() {
  const get=id=>(document.getElementById(id)?.value||"").trim();
  const nombre  = get("m-nombre");
  const especie = get("m-especie");
  if (!nombre)  { toast("El nombre es obligatorio");  return; }
  if (!especie) { toast("Selecciona una especie");     return; }

  const id = get("m-id") ? parseInt(get("m-id")) : nextId(petasLocal);
  const emoji = get("m-emoji") || ({Perro:"🐶",Gato:"🐱",Conejo:"🐰",Ave:"🐦"})[especie] || "🐾";
  const peta = { id, nombre, especie,
    raza:   get("m-raza"),
    edad:   get("m-edad"),
    sexo:   get("m-sexo"),
    estado: get("m-estado")||"Disponible",
    emoji, desc: get("m-desc") };

  const idx = petasLocal.findIndex(x=>x.id==id);
  if (idx>=0) petasLocal[idx]=peta; else petasLocal.push(peta);
  guardarTodo();
  closeModal("modal-mascota");
  renderAll();
  toast(idx>=0 ? "Mascota actualizada ✓" : "Mascota guardada ✓");
}

function editMascota(id)   { openMascotaModal(id); }
function deleteMascota(id) {
  if (!confirm("¿Eliminar esta mascota?")) return;
  petasLocal = petasLocal.filter(x=>x.id!=id);
  guardarTodo(); renderAll(); toast("Mascota eliminada");
}

function renderMascotas() {
  const espFil = document.getElementById("filter-especie")?.value||"";
  const estFil = document.getElementById("filter-estado")?.value||"";
  const q      = (document.getElementById("global-search")?.value||"").toLowerCase();
  const list   = petasLocal.filter(m=>
    (!espFil||m.especie===espFil)&&(!estFil||m.estado===estFil)&&
    (!q||m.nombre.toLowerCase().includes(q)||(m.raza||"").toLowerCase().includes(q)));
  const grid = document.getElementById("pets-grid");
  if (!grid) return;
  grid.innerHTML = list.length
    ? list.map(m=>`<div class="pet-card">
        <div class="pet-card-img">${m.emoji||"🐾"}</div>
        <div class="pet-card-body">
          <div class="pet-name">${m.nombre}</div>
          <div class="pet-meta">${m.especie}${m.raza?" · "+m.raza:""} ${m.edad?" · "+m.edad:""}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:8px">
            <span class="pill ${pillState(m.estado)}">${m.estado}</span>
            <div style="display:flex;gap:4px">
              <button class="btn" style="padding:4px 10px;font-size:12px" onclick="editMascota(${m.id})">Editar</button>
              <button class="btn btn-danger" style="padding:4px 10px;font-size:12px" onclick="deleteMascota(${m.id})">✕</button>
            </div>
          </div>
        </div>
      </div>`).join("")
    : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🐾</div><div>Sin mascotas registradas</div></div>`;
}

/* ============================================================
   CLIENTES
============================================================ */
function openClienteModal(id) {
  editingId = id || null;
  const set=(sid,v)=>{const e=document.getElementById(sid);if(e)e.value=v||"";};
  if (id) {
    const c = clientesLocal.find(x=>x.id==id)||{};
    set("c-id",      c.id);
    set("c-nombre",  c.nombre);
    set("c-doc",     c.doc);
    set("c-email",   c.email);
    set("c-tel",     c.tel);
    set("c-ciudad",  c.ciudad);
    set("c-vivienda",c.vivienda||"");
    set("c-notas",   c.notas||"");
    document.getElementById("modal-cliente-title").textContent = "Editar cliente";
  } else {
    ["c-id","c-nombre","c-doc","c-email","c-tel","c-ciudad","c-notas"].forEach(s=>set(s,""));
    set("c-vivienda","");
    document.getElementById("modal-cliente-title").textContent = "Nuevo cliente";
  }
  openModal("modal-cliente");
}

function saveCliente() {
  const get=id=>(document.getElementById(id)?.value||"").trim();
  const nombre = get("c-nombre");
  const email  = get("c-email");
  if (!nombre) { toast("El nombre es obligatorio"); return; }
  if (!email)  { toast("El email es obligatorio");  return; }

  const id = get("c-id") ? parseInt(get("c-id")) : nextId(clientesLocal);
  const cliente = { id, nombre,
    doc:      get("c-doc"),
    email,
    tel:      get("c-tel"),
    ciudad:   get("c-ciudad")||"—",
    vivienda: get("c-vivienda"),
    notas:    get("c-notas") };

  const idx = clientesLocal.findIndex(x=>x.id==id);
  if (idx>=0) clientesLocal[idx]=cliente; else clientesLocal.push(cliente);
  guardarTodo();
  closeModal("modal-cliente");
  renderAll();
  toast(idx>=0 ? "Cliente actualizado ✓" : "Cliente guardado ✓");
}

function editCliente(id)   { openClienteModal(id); }
function deleteCliente(id) {
  if (!confirm("¿Eliminar este cliente?")) return;
  clientesLocal = clientesLocal.filter(x=>x.id!=id);
  guardarTodo(); renderAll(); toast("Cliente eliminado");
}

function renderClientes() {
  const q    = (document.getElementById("global-search")?.value||"").toLowerCase();
  const list = clientesLocal.filter(c=>!q||
    c.nombre.toLowerCase().includes(q)||(c.email||"").toLowerCase().includes(q)||
    (c.ciudad||"").toLowerCase().includes(q));
  const tb = document.getElementById("clientes-tbody");
  if (!tb) return;
  tb.innerHTML = list.length
    ? list.map((c,i)=>{
        const n = adopcionesLocal.filter(a=>a.clienteId==c.id).length;
        return `<tr>
          <td><div style="display:flex;align-items:center;gap:10px">
            <div class="avatar ${avatarColor(i)}">${initials(c.nombre)}</div>
            <div><div style="font-weight:500">${c.nombre}</div>
              <div style="font-size:12px;color:var(--text3)">${c.doc}</div></div>
          </div></td>
          <td style="color:var(--text2)">${c.email}</td>
          <td>${c.tel}</td><td>${c.ciudad}</td><td>${n}</td>
          <td><div style="display:flex;gap:4px">
            <button class="btn" style="padding:4px 10px;font-size:12px" onclick="editCliente(${c.id})">Editar</button>
            <button class="btn btn-danger" style="padding:4px 10px;font-size:12px" onclick="deleteCliente(${c.id})">✕</button>
          </div></td></tr>`;
      }).join("")
    : `<tr><td colspan="6" class="empty-state">Sin clientes registrados</td></tr>`;
}

/* ============================================================
   ADOPCIONES
============================================================ */
function openAdopcionModal(id) {
  editingId = id || null;
  /* Poblar selects */
  const am = document.getElementById("a-mascota");
  const ac = document.getElementById("a-cliente");
  if (am) am.innerHTML = `<option value="">Seleccionar mascota...</option>` +
    petasLocal.map(m=>`<option value="${m.id}">${m.emoji||"🐾"} ${m.nombre} (${m.estado})</option>`).join("");
  if (ac) ac.innerHTML = `<option value="">Seleccionar cliente...</option>` +
    clientesLocal.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("");

  const set=(sid,v)=>{const e=document.getElementById(sid);if(e)e.value=v||"";};
  if (id) {
    const a = adopcionesLocal.find(x=>x.id==id)||{};
    set("a-id",      a.id);
    set("a-mascota", a.mascotaId);
    set("a-cliente", a.clienteId);
    set("a-fecha",   a.fecha);
    set("a-estado",  a.estado||"Pendiente");
    set("a-notas",   a.notas||"");
    document.getElementById("modal-adopcion-title").textContent = "Editar adopción";
  } else {
    ["a-id","a-fecha","a-notas"].forEach(s=>set(s,""));
    set("a-mascota",""); set("a-cliente",""); set("a-estado","Pendiente");
    document.getElementById("modal-adopcion-title").textContent = "Nueva adopción";
  }
  openModal("modal-adopcion");
}

function saveAdopcion() {
  const get=id=>(document.getElementById(id)?.value||"").trim();
  const mascotaId = get("a-mascota");
  const clienteId = get("a-cliente");
  const fecha     = get("a-fecha");
  if (!mascotaId) { toast("Selecciona una mascota"); return; }
  if (!clienteId) { toast("Selecciona un cliente");  return; }
  if (!fecha)     { toast("Ingresa la fecha");        return; }

  const id = get("a-id") ? parseInt(get("a-id")) : nextId(adopcionesLocal);
  const adopcion = { id,
    mascotaId: parseInt(mascotaId),
    clienteId: parseInt(clienteId),
    fecha,
    estado: get("a-estado")||"Pendiente",
    notas:  get("a-notas") };

  const idx = adopcionesLocal.findIndex(x=>x.id==id);
  if (idx>=0) adopcionesLocal[idx]=adopcion; else adopcionesLocal.push(adopcion);

  /* Marcar mascota como adoptada si estado es Aprobada */
  if (adopcion.estado==="Aprobada") {
    const mi = petasLocal.findIndex(x=>x.id==adopcion.mascotaId);
    if (mi>=0) petasLocal[mi].estado = "Adoptado";
  }
  guardarTodo();
  closeModal("modal-adopcion");
  renderAll();
  toast(idx>=0 ? "Adopción actualizada ✓" : "Adopción registrada ✓");
}

function editAdopcion(id)   { openAdopcionModal(id); }
function deleteAdopcion(id) {
  if (!confirm("¿Eliminar esta adopción?")) return;
  adopcionesLocal = adopcionesLocal.filter(x=>x.id!=id);
  guardarTodo(); renderAll(); toast("Adopción eliminada");
}

function renderAdopciones() {
  const est  = document.getElementById("filter-estado-adop")?.value||"";
  const list = adopcionesLocal.filter(a=>!est||a.estado===est);
  const tb   = document.getElementById("adopciones-tbody");
  if (!tb) return;
  tb.innerHTML = list.length
    ? list.map(a=>{
        const m=getPeta(a.mascotaId), c=getCliente(a.clienteId);
        return `<tr>
          <td>${a.id}</td>
          <td><div style="display:flex;align-items:center;gap:8px">
            <span>${m.emoji||"🐾"}</span><span>${m.nombre||"—"}</span></div></td>
          <td>${c.nombre||"—"}</td>
          <td>${fmtDate(a.fecha)}</td>
          <td><span class="pill ${pillState(a.estado)}">${a.estado}</span></td>
          <td style="color:var(--text3);font-size:13px;max-width:160px;overflow:hidden;text-overflow:ellipsis">${a.notas||"—"}</td>
          <td><div style="display:flex;gap:4px">
            <button class="btn" style="padding:4px 10px;font-size:12px" onclick="editAdopcion(${a.id})">Editar</button>
            <button class="btn btn-danger" style="padding:4px 10px;font-size:12px" onclick="deleteAdopcion(${a.id})">✕</button>
          </div></td></tr>`;
      }).join("")
    : `<tr><td colspan="7" class="empty-state">Sin adopciones registradas</td></tr>`;
}

/* ============================================================
   VISITAS
============================================================ */
function openVisitaModal(id) {
  editingId = id || null;
  const vc = document.getElementById("v-cliente");
  const vm = document.getElementById("v-mascota");
  if (vc) vc.innerHTML = `<option value="">Seleccionar cliente...</option>` +
    clientesLocal.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("");
  if (vm) vm.innerHTML = `<option value="">— Sin mascota —</option>` +
    petasLocal.map(m=>`<option value="${m.id}">${m.emoji||"🐾"} ${m.nombre}</option>`).join("");

  const set=(sid,v)=>{const e=document.getElementById(sid);if(e)e.value=v||"";};
  if (id) {
    const v = visitasLocal.find(x=>x.id==id)||{};
    set("v-id",      v.id);
    set("v-cliente", v.clienteId);
    set("v-mascota", v.mascotaId||"");
    set("v-fecha",   v.fecha);
    set("v-hora",    v.hora);
    set("v-motivo",  v.motivo||"Conocer mascota");
    set("v-estado",  v.estado||"Pendiente");
    set("v-notas",   v.notas||"");
    document.getElementById("modal-visita-title").textContent = "Editar visita";
  } else {
    ["v-id","v-fecha","v-hora","v-notas"].forEach(s=>set(s,""));
    set("v-cliente",""); set("v-mascota","");
    set("v-motivo","Conocer mascota"); set("v-estado","Pendiente");
    document.getElementById("modal-visita-title").textContent = "Agendar visita";
  }
  openModal("modal-visita");
}

function saveVisita() {
  const get=id=>(document.getElementById(id)?.value||"").trim();
  const clienteId = get("v-cliente");
  const fecha     = get("v-fecha");
  const hora      = get("v-hora");
  if (!clienteId) { toast("Selecciona un cliente"); return; }
  if (!fecha)     { toast("Ingresa la fecha");      return; }
  if (!hora)      { toast("Ingresa la hora");       return; }

  const id = get("v-id") ? parseInt(get("v-id")) : nextId(visitasLocal);
  const visita = { id,
    clienteId: parseInt(clienteId),
    mascotaId: get("v-mascota") ? parseInt(get("v-mascota")) : null,
    fecha, hora,
    motivo: get("v-motivo")||"Conocer mascota",
    estado: get("v-estado")||"Pendiente",
    notas:  get("v-notas") };

  const idx = visitasLocal.findIndex(x=>x.id==id);
  if (idx>=0) visitasLocal[idx]=visita; else visitasLocal.push(visita);
  guardarTodo();
  closeModal("modal-visita");
  renderAll();
  toast(idx>=0 ? "Visita actualizada ✓" : "Visita agendada ✓");
}

function editVisita(id)   { openVisitaModal(id); }
function deleteVisita(id) {
  if (!confirm("¿Eliminar esta visita?")) return;
  visitasLocal = visitasLocal.filter(x=>x.id!=id);
  guardarTodo(); renderAll(); toast("Visita eliminada");
}

function renderVisitas() {
  const tb = document.getElementById("visitas-tbody");
  if (!tb) return;
  if (!visitasLocal.length) {
    tb.innerHTML = `<tr><td colspan="7" class="empty-state">Sin visitas agendadas</td></tr>`;
    return;
  }
  tb.innerHTML = visitasLocal
    .slice().sort((a,b)=>(a.fecha+a.hora).localeCompare(b.fecha+b.hora))
    .map(v=>{
      const c=getCliente(v.clienteId);
      const m=v.mascotaId?getPeta(v.mascotaId):null;
      return `<tr>
        <td>${fmtDate(v.fecha)}</td>
        <td>${v.hora||"—"}</td>
        <td>${c.nombre||"—"}</td>
        <td>${m?(m.emoji||"🐾")+" "+m.nombre:"—"}</td>
        <td>${v.motivo||"—"}</td>
        <td><span class="pill ${pillState(v.estado)}">${v.estado}</span></td>
        <td><div style="display:flex;gap:4px">
          <button class="btn" style="padding:4px 10px;font-size:12px" onclick="editVisita(${v.id})">Editar</button>
          <button class="btn btn-danger" style="padding:4px 10px;font-size:12px" onclick="deleteVisita(${v.id})">✕</button>
        </div></td>
      </tr>`;
    }).join("");
}

/* ============================================================
   DOCUMENTOS
============================================================ */
function handleFileSelect(files) { addFiles(Array.from(files)); }
function handleFileDrop(ev) {
  ev.preventDefault();
  document.getElementById("file-drop")?.classList.remove("dragover");
  addFiles(Array.from(ev.dataTransfer.files));
}
function addFiles(files) {
  const icons={pdf:"📄",jpg:"🖼",jpeg:"🖼",png:"🖼",doc:"📝",docx:"📝"};
  files.forEach(f=>{
    const ext=f.name.split(".").pop().toLowerCase();
    pendingFiles.push({name:f.name,size:f.size,icon:icons[ext]||"📎",tipo:document.getElementById("doc-tipo")?.value||""});
  });
  renderFilePreviews();
}
function renderFilePreviews() {
  const fp=document.getElementById("file-preview");
  if (!fp) return;
  fp.innerHTML=pendingFiles.map((f,i)=>`<div class="file-item">
    <div class="file-item-icon">${f.icon}</div>
    <div class="file-item-info">
      <div class="file-item-name">${f.name}</div>
      <div class="file-item-size">${(f.size/1024).toFixed(1)} KB</div>
    </div>
    <button class="btn btn-danger" style="padding:4px 8px;font-size:12px" onclick="removeFile(${i})">✕</button>
  </div>`).join("");
}
function removeFile(i) { pendingFiles.splice(i,1); renderFilePreviews(); }
function saveDocuments() {
  const clienteId = document.getElementById("doc-cliente")?.value;
  const tipo      = document.getElementById("doc-tipo")?.value||"Otro";
  if (!clienteId) { toast("Selecciona un cliente primero"); return; }
  if (!pendingFiles.length) { toast("No hay archivos para guardar"); return; }
  pendingFiles.forEach(f=>{
    documentosGuardados.push({
      id: nextId(documentosGuardados),
      clienteId, nombre:f.name, size:f.size, tipo,
      fecha:new Date().toISOString().slice(0,10)
    });
  });
  pendingFiles=[];
  renderFilePreviews();
  guardarTodo();
  renderDocumentos();
  toast("Documentos guardados ✓");
}
function deleteDoc(id) {
  documentosGuardados = documentosGuardados.filter(x=>x.id!=id);
  guardarTodo(); renderDocumentos();
}

function renderDocumentos() {
  const sel = document.getElementById("doc-cliente");
  if (sel) sel.innerHTML = `<option value="">Seleccionar cliente...</option>` +
    clientesLocal.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("");

  const tb = document.getElementById("docs-tbody");
  if (!tb) return;
  tb.innerHTML = documentosGuardados.length
    ? documentosGuardados.map(d=>`<tr>
        <td>${d.nombre}</td>
        <td>${d.tipo||"—"}</td>
        <td>${getCliente(d.clienteId).nombre||"—"}</td>
        <td>${fmtDate(d.fecha)}</td>
        <td><button class="btn btn-danger" style="padding:4px 8px;font-size:12px" onclick="deleteDoc(${d.id})">✕</button></td>
      </tr>`).join("")
    : `<tr><td colspan="5" class="empty-state">Sin documentos guardados</td></tr>`;
}

/* ============================================================
   ESTADÍSTICAS
============================================================ */
function renderEstadisticas() {
  const total  = petasLocal.length || 1;
  const adopt  = petasLocal.filter(x=>x.estado==="Adoptado").length;
  const disp   = petasLocal.filter(x=>x.estado!=="Adoptado").length;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set("est-tasa",        Math.round(adopt/total*100)+"%");
  set("est-disponibles", disp);
  set("est-tiempo",      "—");
  set("est-docs",        documentosGuardados.length);

  /* Adopciones por mes */
  const cm = document.getElementById("chart-meses");
  if (cm) {
    const bM={};
    adopcionesLocal.forEach(a=>{const k=(a.fecha||"").slice(0,7);if(k)bM[k]=(bM[k]||0)+1;});
    const ent=Object.entries(bM).sort(), mx=Math.max(1,...Object.values(bM));
    cm.innerHTML = ent.length
      ? ent.map(([mes,c])=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="width:70px;font-size:12px;color:var(--text2)">${mes}</span>
          <div style="height:10px;width:${Math.round(c/mx*180)}px;background:var(--accent);border-radius:4px;min-width:4px"></div>
          <span style="font-weight:500;font-size:13px">${c}</span></div>`).join("")
      : `<div class="empty-state">Sin datos</div>`;
  }

  /* Mascotas por especie */
  const ce = document.getElementById("chart-especies");
  if (ce) {
    const bE={};
    petasLocal.forEach(m=>{const e=m.especie||"Otro";bE[e]=(bE[e]||0)+1;});
    ce.innerHTML = Object.entries(bE).length
      ? `<table style="width:100%;font-size:14px">`+
          Object.entries(bE).map(([e,c])=>`<tr>
            <td style="padding:7px 0;color:var(--text2)">${e}</td>
            <td><div style="display:flex;align-items:center;gap:8px">
              <div style="height:10px;width:${Math.round(c/total*100)*2}px;background:var(--accent);border-radius:4px;min-width:4px"></div>
              <span style="font-weight:500">${c}</span>
              <span style="color:var(--text3);font-size:12px">${Math.round(c/total*100)}%</span>
            </div></td></tr>`).join("")+`</table>`
      : `<div class="empty-state">Sin datos</div>`;
  }

  /* Distribución por estado */
  const cs = document.getElementById("chart-estados");
  if (cs) {
    const est={Disponible:disp,Adoptado:adopt};
    cs.innerHTML = `<table style="width:100%;font-size:14px">`+
      Object.entries(est).map(([st,c])=>`<tr>
        <td style="padding:7px 0"><span class="pill ${pillState(st)}">${st}</span></td>
        <td><div style="display:flex;align-items:center;gap:8px">
          <div style="height:10px;width:${Math.round(c/total*100)*2}px;background:var(--accent2);border-radius:4px;min-width:4px"></div>
          <span style="font-weight:500">${c}</span></div></td></tr>`).join("")+`</table>`;
  }

  /* Visitas por mes */
  const cv = document.getElementById("chart-visitas-mes");
  if (cv) {
    const bV={};
    visitasLocal.forEach(v=>{const k=(v.fecha||"").slice(0,7);if(k)bV[k]=(bV[k]||0)+1;});
    const entV=Object.entries(bV).sort(), mxV=Math.max(1,...Object.values(bV));
    cv.innerHTML = entV.length
      ? entV.map(([mes,c])=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="width:70px;font-size:12px;color:var(--text2)">${mes}</span>
          <div style="height:10px;width:${Math.round(c/mxV*180)}px;background:var(--accent2);border-radius:4px;min-width:4px"></div>
          <span style="font-weight:500;font-size:13px">${c}</span></div>`).join("")
      : `<div class="empty-state">Sin datos de visitas</div>`;
  }
}

/* ============================================================
   SEARCH
============================================================ */
function globalSearch() { renderAll(); }

/* ============================================================
   ARRANQUE
============================================================ */
document.addEventListener("DOMContentLoaded", function() {
  /* Ocultar elementos del repo que no usa PataHogar */
  ["sidebar","welcomePanel","overlay"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display="none";
  });
  const th=document.querySelector("header.topbar");
  if(th) th.style.display="none";

  /* Asegurar modales ocultos al inicio */
  ["modal-mascota","modal-cliente","modal-adopcion","modal-visita"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) { el.style.display="none"; el.classList.remove("open"); }
  });

  /* Cerrar modal al hacer clic en el overlay */
  document.querySelectorAll(".modal-overlay").forEach(overlay=>{
    overlay.addEventListener("click", function(e){
      if (e.target===this) closeModal(this.id);
    });
  });

  /* Cargar datos */
  cargarTodo();

  /* Primer render */
  renderAll();
});
