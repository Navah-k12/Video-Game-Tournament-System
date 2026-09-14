/* =========================================================
   ArenaScore — script.js
   Frontend puro (HTML/CSS/JS). Todo el acceso a datos pasa
   por fetch() a una API REST que el Backend deberá exponer
   sobre MySQL. Ningún dato se guarda localmente: si la API
   no responde, las tablas quedarán vacías y se mostrará el
   error correspondiente.

   CONTRATO DE API ESPERADO POR ESTE FRONTEND
   -------------------------------------------------
   GET    /api/jugadores                 -> [{id, nombre, gamertag, correo, fechaRegistro}]
   POST   /api/jugadores                 <- {nombre, gamertag, correo}
   GET    /api/jugadores/buscar?q=texto  -> [{id, nombre, gamertag, correo}]

   GET    /api/videojuegos               -> [{id, nombre, genero}]
   POST   /api/videojuegos               <- {nombre, genero}

   GET    /api/puntuaciones              -> [{id, jugador, videojuego, puntuacion, fecha}]
   POST   /api/puntuaciones              <- {jugadorId, videojuegoId, puntuacion, fecha}

   GET    /api/ranking                   -> [{jugador, videojuego, puntuacion}] (ya ordenado)

   GET    /api/estadisticas              -> {totalJugadores, totalVideojuegos,
                                              totalPuntuaciones, promedio}

   Todas las respuestas de error deben regresar un JSON:
   { "error": "mensaje legible para mostrar al usuario" }
   ========================================================= */

const API_BASE = "http://localhost:3000/api";

/* ---------------- utilidades ---------------- */

async function apiGet(path){
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  if(!res.ok) throw new Error(data.error || `Error al consultar ${path}`);
  return data;
}

async function apiPost(path, body){
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if(!res.ok) throw new Error(data.error || `Error al enviar datos a ${path}`);
  return data;
}

function setMsg(el, text, kind){
  el.textContent = text;
  el.className = "form-msg" + (kind ? " " + kind : "");
}

function escapeHtml(str){
  return String(str ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function formatFecha(value){
  if(!value) return "—";
  const d = new Date(value);
  if(Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
}

function setConnStatus(state, text){
  const el = document.getElementById("conn-status");
  el.classList.remove("ok", "error");
  if(state) el.classList.add(state);
  el.querySelector(".conn-text").textContent = text;
}

/* ---------------- navegación entre vistas ---------------- */

function initNav(){
  const buttons = document.querySelectorAll(".rail-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      document.querySelectorAll(".view").forEach(v => v.classList.remove("is-active"));
      document.getElementById(`view-${btn.dataset.view}`).classList.add("is-active");

      // Refresca datos relevantes al entrar a cada vista
      if(btn.dataset.view === "jugadores") cargarJugadores();
      if(btn.dataset.view === "videojuegos") cargarVideojuegos();
      if(btn.dataset.view === "puntuaciones") { cargarPuntuaciones(); cargarSelectores(); }
      if(btn.dataset.view === "ranking") cargarRanking();
      if(btn.dataset.view === "estadisticas") cargarEstadisticas();
    });
  });
}

/* ---------------- RF01: jugadores ---------------- */

async function cargarJugadores(){
  const tbody = document.getElementById("tabla-jugadores");
  try{
    const jugadores = await apiGet("/jugadores");
    setConnStatus("ok", "Conectado a la API");
    if(!jugadores.length){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Aún no hay jugadores registrados.</td></tr>`;
      return;
    }
    tbody.innerHTML = jugadores.map(j => `
      <tr>
        <td>${escapeHtml(j.gamertag)}</td>
        <td>${escapeHtml(j.correo)}</td>
        <td>${formatFecha(j.fechaRegistro)}</td>
      </tr>
    `).join("");
  }catch(err){
    setConnStatus("error", "Sin conexión con la API");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">${escapeHtml(err.message)}</td></tr>`;
  }
}

function initFormJugador(){
  const form = document.getElementById("form-jugador");
  const msg = document.getElementById("jugador-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("jugador-nombre").value.trim();
    const gamertag = document.getElementById("jugador-gamertag").value.trim();
    const correo = document.getElementById("jugador-correo").value.trim();

    if(!nombre || !gamertag || !correo){
      setMsg(msg, "Nombre, gamertag y correo son obligatorios.", "error");
      return;
    }

    try{
      await apiPost("/jugadores", { nombre, gamertag, correo });
      setMsg(msg, `Jugador "${gamertag}" registrado correctamente.`, "success");
      form.reset();
      cargarJugadores();
      cargarSelectores();
    }catch(err){
      setMsg(msg, err.message || "No se pudo registrar el jugador.", "error");
    }
  });
}

/* ---------------- RF02: videojuegos ---------------- */

async function cargarVideojuegos(){
  const tbody = document.getElementById("tabla-videojuegos");
  try{
    const juegos = await apiGet("/videojuegos");
    setConnStatus("ok", "Conectado a la API");
    if(!juegos.length){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="2">Aún no hay videojuegos registrados.</td></tr>`;
      return;
    }
    tbody.innerHTML = juegos.map(v => `
      <tr>
        <td>${escapeHtml(v.nombre)}</td>
        <td>${escapeHtml(v.genero)}</td>
      </tr>
    `).join("");
  }catch(err){
    setConnStatus("error", "Sin conexión con la API");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="2">${escapeHtml(err.message)}</td></tr>`;
  }
}

function initFormVideojuego(){
  const form = document.getElementById("form-videojuego");
  const msg = document.getElementById("juego-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("juego-nombre").value.trim();
    const genero = document.getElementById("juego-genero").value.trim();

    if(!nombre || !genero){
      setMsg(msg, "Nombre y género son obligatorios.", "error");
      return;
    }

    try{
      await apiPost("/videojuegos", { nombre, genero });
      setMsg(msg, `Videojuego "${nombre}" registrado correctamente.`, "success");
      form.reset();
      cargarVideojuegos();
      cargarSelectores();
    }catch(err){
      setMsg(msg, err.message || "No se pudo registrar el videojuego.", "error");
    }
  });
}

/* ---------------- selects compartidos (jugador / videojuego) ---------------- */

async function cargarSelectores(){
  const selJugador = document.getElementById("puntuacion-jugador");
  const selVideojuego = document.getElementById("puntuacion-videojuego");

  try{
    const [jugadores, juegos] = await Promise.all([
      apiGet("/jugadores"),
      apiGet("/videojuegos")
    ]);

    selJugador.innerHTML = `<option value="" disabled selected>Selecciona un jugador</option>` +
      jugadores.map(j => `<option value="${j.id}">${escapeHtml(j.gamertag)} — ${escapeHtml(j.nombre)}</option>`).join("");

    selVideojuego.innerHTML = `<option value="" disabled selected>Selecciona un videojuego</option>` +
      juegos.map(v => `<option value="${v.id}">${escapeHtml(v.nombre)}</option>`).join("");
  }catch(err){
    selJugador.innerHTML = `<option value="" disabled selected>No se pudieron cargar jugadores</option>`;
    selVideojuego.innerHTML = `<option value="" disabled selected>No se pudieron cargar videojuegos</option>`;
  }
}

/* ---------------- RF03 / RF05: puntuaciones ---------------- */

async function cargarPuntuaciones(){
  const tbody = document.getElementById("tabla-puntuaciones");
  try{
    const puntuaciones = await apiGet("/puntuaciones");
    setConnStatus("ok", "Conectado a la API");
    if(!puntuaciones.length){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Aún no hay puntuaciones registradas.</td></tr>`;
      return;
    }
    tbody.innerHTML = puntuaciones.map(p => `
      <tr>
        <td>${escapeHtml(p.jugador)}</td>
        <td>${escapeHtml(p.videojuego)}</td>
        <td class="score-cell">${escapeHtml(p.puntuacion)}</td>
        <td>${formatFecha(p.fecha)}</td>
      </tr>
    `).join("");
  }catch(err){
    setConnStatus("error", "Sin conexión con la API");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${escapeHtml(err.message)}</td></tr>`;
  }
}

function initFormPuntuacion(){
  const form = document.getElementById("form-puntuacion");
  const msg = document.getElementById("puntuacion-msg");

  // Fecha de hoy como valor por defecto
  document.getElementById("puntuacion-fecha").valueAsDate = new Date();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const jugadorId = document.getElementById("puntuacion-jugador").value;
    const videojuegoId = document.getElementById("puntuacion-videojuego").value;
    const puntuacion = Number(document.getElementById("puntuacion-valor").value);
    const fecha = document.getElementById("puntuacion-fecha").value;

    if(!jugadorId || !videojuegoId){
      setMsg(msg, "Selecciona un jugador y un videojuego existentes.", "error");
      return;
    }
    if(Number.isNaN(puntuacion) || puntuacion < 0){
      setMsg(msg, "La puntuación no puede ser negativa.", "error");
      return;
    }

    try{
      await apiPost("/puntuaciones", { jugadorId, videojuegoId, puntuacion, fecha });
      setMsg(msg, "Puntuación guardada correctamente.", "success");
      form.reset();
      document.getElementById("puntuacion-fecha").valueAsDate = new Date();
      cargarPuntuaciones();
      cargarRanking();
      cargarEstadisticas();
    }catch(err){
      setMsg(msg, err.message || "No se pudo guardar la puntuación.", "error");
    }
  });
}

/* ---------------- RF06: clasificación ---------------- */

function medalClass(posicion){
  if(posicion === 1) return "gold";
  if(posicion === 2) return "silver";
  if(posicion === 3) return "bronze";
  return "";
}

async function cargarRanking(){
  const tbody = document.getElementById("tabla-ranking");
  try{
    const ranking = await apiGet("/ranking");
    setConnStatus("ok", "Conectado a la API");
    if(!ranking.length){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Todavía no hay resultados para clasificar.</td></tr>`;
      return;
    }
    tbody.innerHTML = ranking.map((r, i) => {
      const pos = i + 1;
      return `
        <tr>
          <td><span class="rank-badge ${medalClass(pos)}">${pos}</span></td>
          <td>${escapeHtml(r.jugador)}</td>
          <td>${escapeHtml(r.videojuego)}</td>
          <td class="score-cell">${escapeHtml(r.puntuacion)}</td>
        </tr>
      `;
    }).join("");
  }catch(err){
    setConnStatus("error", "Sin conexión con la API");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------------- RF07: búsqueda ---------------- */

function initBusqueda(){
  const form = document.getElementById("form-buscar");
  const tbody = document.getElementById("tabla-buscar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = document.getElementById("buscar-input").value.trim();

    if(!q){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Escribe un nombre o gamertag para buscar.</td></tr>`;
      return;
    }

    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Buscando…</td></tr>`;

    try{
      const resultados = await apiGet(`/jugadores/buscar?q=${encodeURIComponent(q)}`);
      if(!resultados.length){
        tbody.innerHTML = `<tr class="empty-row"><td colspan="3">Sin coincidencias para "${escapeHtml(q)}".</td></tr>`;
        return;
      }
      tbody.innerHTML = resultados.map(j => `
        <tr>
          <td>${escapeHtml(j.nombre)}</td>
          <td>${escapeHtml(j.gamertag)}</td>
          <td>${escapeHtml(j.correo)}</td>
        </tr>
      `).join("");
    }catch(err){
      tbody.innerHTML = `<tr class="empty-row"><td colspan="3">${escapeHtml(err.message)}</td></tr>`;
    }
  });
}

/* ---------------- RF08: estadísticas ---------------- */

async function cargarEstadisticas(){
  try{
    const stats = await apiGet("/estadisticas");
    setConnStatus("ok", "Conectado a la API");

    document.getElementById("stat-jugadores").textContent = stats.totalJugadores ?? "0";
    document.getElementById("stat-videojuegos").textContent = stats.totalVideojuegos ?? "0";
    document.getElementById("stat-puntuaciones").textContent = stats.totalPuntuaciones ?? "0";
    document.getElementById("stat-promedio").textContent =
      stats.promedio !== undefined ? Number(stats.promedio).toFixed(1) : "0.0";

    document.getElementById("ticker-jugadores").textContent = stats.totalJugadores ?? "–";
    document.getElementById("ticker-juegos").textContent = stats.totalVideojuegos ?? "–";
    document.getElementById("ticker-puntuaciones").textContent = stats.totalPuntuaciones ?? "–";
    document.getElementById("ticker-promedio").textContent =
      stats.promedio !== undefined ? Number(stats.promedio).toFixed(1) : "–";
  }catch(err){
    setConnStatus("error", "Sin conexión con la API");
    ["stat-jugadores","stat-videojuegos","stat-puntuaciones","stat-promedio"].forEach(id => {
      document.getElementById(id).textContent = "—";
    });
  }
}

/* ---------------- arranque ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFormJugador();
  initFormVideojuego();
  initFormPuntuacion();
  initBusqueda();
  document.getElementById("btn-refresh-jugadores").addEventListener("click", cargarJugadores);
  document.getElementById("btn-refresh-videojuegos").addEventListener("click", cargarVideojuegos);
  document.getElementById("btn-refresh-puntuaciones").addEventListener("click", cargarPuntuaciones);
  document.getElementById("btn-refresh-ranking").addEventListener("click", cargarRanking);
  document.getElementById("btn-refresh-stats").addEventListener("click", cargarEstadisticas);

  // Carga inicial (vista activa por defecto: jugadores)
  cargarJugadores();
  cargarSelectores();
  cargarEstadisticas();
});
