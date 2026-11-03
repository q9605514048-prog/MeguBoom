const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const port=Number(process.env.PORT||4173);
const files=new Set(['/index.html','/personal-app.js','/personal.css','/personal-model.js','/category-icons.js','/design-system.css','/ui-icons.js','/desktop-ui.js','/player-utils.js','/queue-utils.js','/local-library.js','/manifest.webmanifest','/personal/book-placeholder.svg','/assets/app-icon.png']);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
 if(url.pathname==='/api/health'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({app:'MeguBoom',version:require('./package.json').version,startupId:process.env.MEGUBOOM_STARTUP_ID||''}));return}
 const requested=url.pathname==='/'?'/index.html':url.pathname;if(!files.has(requested)){res.writeHead(404).end('Not found');return}
 res.setHeader('Content-Type',mime[path.extname(requested)]||'application/octet-stream');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob: https:; media-src 'self' blob: http://127.0.0.1:*; connect-src 'self'; frame-src 'none'; object-src 'none'");fs.createReadStream(path.join(__dirname,requested)).on('error',()=>res.destroy()).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('MeguBoom local service ready'));
