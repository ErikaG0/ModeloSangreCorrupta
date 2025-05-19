const http = require('http');
const fs = require('fs'); 
const path = require('path');
const { exec } = require('child_process');  // Para ejecutar el script Python

const server = http.createServer(function(req, res) {
    // Ruta para procesar los datos del formulario (POST)
    if (req.method === 'POST' && req.url === '/procesar-datos') {
        let body = '';
        
        // Recibir los datos del formulario
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Parsear el JSON recibido
            const formData = JSON.parse(body);
            console.log("Datos recibidos:", formData);

            const { t, r, p, a } = formData;

            // Aquí podrías procesar los datos o llamar a un script Python
            exec(`python3 procesar.py ${t} ${r} ${p} ${a}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error ejecutando el script Python: ${stderr}`);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al procesar los datos');
                    return;
                }
                
                // Retornar los resultados al cliente
                console.log(stdout);
                const result = JSON.parse(stdout);  // Asegúrate de que el script Python devuelva un JSON
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            });
        });
    } 
    else if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer el archivo HTML');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else if (req.url === '/mis.css') {
        fs.readFile(path.join(__dirname, 'mis.css'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer el archivo CSS');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página no encontrada');
    }
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
