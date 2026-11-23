/* Reservas de artículos para la evaluación interna (IA) de Economía IB.
   Se pega en una hoja de cálculo de Google: Extensiones → Apps Script.
   Cada reserva es una fila de la pestaña «Reservas». Para liberar un artículo,
   borra su fila. Instrucciones completas en RESERVAS.md. */

const HOJA = 'Reservas';
const COLS = ['Fecha', 'Alumno', 'Unidad', 'Artículo', 'Medio', 'Id', 'Clave'];
// Columnas (desde 0): 0 Fecha, 1 Alumno, 2 Unidad, 3 Artículo, 4 Medio, 5 Id, 6 Clave

function doGet() {
  return salida_(lista_());
}

function doPost(e) {
  let q;
  try { q = JSON.parse(e.postData.contents); } catch (err) { return salida_({ ok: false, e: 'datos' }); }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return salida_({ ok: false, e: 'ocupado' });
  try {
    if (q.a === 'res') return salida_(reservar_(q));
    if (q.a === 'lib') return salida_(liberar_(q));
    return salida_({ ok: false, e: 'accion' });
  } finally {
    lock.releaseLock();
  }
}

/* Para probar desde el editor: crea la pestaña «Reservas» si no existe. */
function preparar() {
  hoja_();
}

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(HOJA);
  if (!h) {
    h = ss.insertSheet(HOJA);
    h.appendRow(COLS);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
    h.setColumnWidth(2, 180);
    h.setColumnWidth(4, 360);
  }
  return h;
}

function filas_() {
  const h = hoja_(), n = h.getLastRow();
  return n < 2 ? [] : h.getRange(2, 1, n - 1, COLS.length).getValues();
}

function lista_(f) {
  return { ok: true, r: (f || filas_()).filter(x => x[5]).map(x => ({ id: String(x[5]), u: Number(x[2]) })) };
}

function norm_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/* Evita que un texto que empieza con = + - @ se tome como fórmula. */
function texto_(s, max) {
  const t = String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function reservar_(q) {
  const id = String(q.id || ''), u = Number(q.u), k = String(q.k || ''), nombre = texto_(q.n, 60);
  if (!/^[\w-]{1,80}$/.test(id) || [2, 3, 4].indexOf(u) < 0 || !/^[\w-]{8,64}$/.test(k) || norm_(nombre).length < 3) {
    return Object.assign(lista_(), { ok: false, e: 'datos' });
  }
  const h = hoja_(), f = filas_();
  const tomado = f.find(x => String(x[5]) === id);
  if (tomado) {
    return Object.assign(lista_(f), String(tomado[6]) === k ? {} : { ok: false, e: 'tomado' });
  }
  const otro = f.find(x => Number(x[2]) === u && norm_(x[1]) === norm_(nombre) && String(x[6]) !== k);
  if (otro) return Object.assign(lista_(f), { ok: false, e: 'unidad' });
  // Si este mismo navegador ya tenía un artículo en esta unidad, se cambia por el nuevo.
  for (let i = f.length - 1; i >= 0; i--) {
    if (String(f[i][6]) === k && Number(f[i][2]) === u) h.deleteRow(i + 2);
  }
  h.appendRow([new Date(), nombre, u, texto_(q.t, 200), texto_(q.m, 60), id, k]);
  return lista_();
}

function liberar_(q) {
  const id = String(q.id || ''), k = String(q.k || '');
  const h = hoja_(), f = filas_();
  for (let i = f.length - 1; i >= 0; i--) {
    if (String(f[i][5]) === id) {
      if (String(f[i][6]) !== k) return Object.assign(lista_(f), { ok: false, e: 'ajeno' });
      h.deleteRow(i + 2);
    }
  }
  return lista_();
}

function salida_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
