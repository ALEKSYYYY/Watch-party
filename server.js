// Movie Night server. No packages needed: run with `node server.js`.
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png'
};
const rooms = new Map(); // room code -> Set of {id, res}
const ok = s => /^[a-z0-9]{1,12}$/.test(s || '');

function broadcast(room, msg) {
  const set = rooms.get(room);
  if (!set) return;
  const data = 'data: ' + JSON.stringify(msg) + '\n\n';
  for (const c of set) c.res.write(data);
}

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const room = u.searchParams.get('room'), id = u.searchParams.get('id');

  // Live stream of everything said in a room
  if (u.pathname === '/events' && ok(room) && ok(id)) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache',
      'Connection': 'keep-alive', 'X-Accel-Buffering': 'no'
    });
    res.write('retry: 2000\n\n');
    if (!rooms.has(room)) rooms.set(room, new Set());
    const set = rooms.get(room), client = { id, res };
    set.add(client);
    const keepAlive = setInterval(() => res.write(':\n\n'), 25000);
    req.on('close', () => {
      clearInterval(keepAlive);
      set.delete(client);
      if (!set.size) rooms.delete(room);
      broadcast(room, { t: 'leave', from: id });
    });
    return;
  }

  // Send a message to everyone in a room
  if (u.pathname === '/send' && req.method === 'POST' && ok(room) && ok(id)) {
    let body = '';
    req.on('data', d => { body += d; if (body.length > 4096) req.destroy(); });
    req.on('end', () => {
      try {
        const m = JSON.parse(body);
        broadcast(room, { ...m, from: id });
        res.writeHead(204).end();
      } catch (e) { res.writeHead(400).end(); }
    });
    return;
  }

  // The app files
  const file = path.join(PUB, path.normalize(u.pathname === '/' ? '/index.html' : u.pathname));
  if (!file.startsWith(PUB)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Movie Night running on port ' + PORT));
