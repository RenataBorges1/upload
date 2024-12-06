const http = require('http')
const porta = 3000
const formidavel = require('formidable')
const fs = require('fs')
const path = require('path')

const servidor = http.createServer((req, res) => {

    console.log(`Requisição recebida: ${req.url}`);
    
        if (req.url == '/'){
          res.writeHead(200, {'Content-Type': 'text/html' })
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Restrito</title>
                    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body {
                            background-color: black;
                            color: white;
                            font-family: "Nunito";
                            text-align: center;
                        }
                        h1{
                        margin-top: 100px;
                        text-align: center;
                        color: gold;
                        font-family: "Bangers";
                        Letter-spacing: 3px;
                          font-size: 50px;
                        }
                        .btn-custom {
                            background-color: gold;
                            color: black;
                            border: none;
                        }
                        .btn-custom:hover {
                            background-color: yellow;
                        }
                        img{
                          display: block;
                          margin-left: auto;
                          margin-right: auto;
                        width: 30%;

                        }
                        a{ 
                        color: black;
                        }
                    </style>
                </head>
                <body>
      <h1>Restrito!</h1>
      <p>Acesso apenas para a mestra!</p>
      <img src="https://game-icons.net/icons/ffffff/000000/1x1/lorc/wooden-door.svg" alt="Desenho de uma porta trancada." />
      
    <br>
    <a href="/upgames">  ________  </a>
                </body>
                </html>
            `);
          return res.end()
        }



    if (req.url == '/upgames'){
      res.writeHead(200, {'Content-Type': 'text/html' })
        res.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Envio de Arquivo</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: black;
                        color: white;
                        font-family: "Nunito";
                    }
                    h1{
                    margin-top: 100px;
                    text-align: center;
                    color: gold;
                    font-family: "Bangers";
                    Letter-spacing: 3px;
                      font-size: 50px;
                    }
                    .btn-custom {
                        background-color: gold;
                        color: black;
                        border: none;
                    }
                    .btn-custom:hover {
                        background-color: yellow;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6">
                            <h1 class="text-center">Envio de Arquivo</h1>
                            <form action="games" method="post" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="filetoupload">Selecione o arquivo</label>
                                    <input type="file" class="form-control-file" id="filetoupload" name="filetoupload" required>
                                </div>
                                <button type="submit" class="btn btn-custom btn-block">UPLOAD</button>
                            </form>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
      return res.end()
    }
    if (req.url == '/games') {
    const form = new formidavel.IncomingForm()
    form.parse(req, (erro, campos, arquivos) => {
      const urlAntiga = arquivos.filetoupload[0].filepath
      const urlNova = './games/' + arquivos.filetoupload[0].originalFilename
    var rawData = fs.readFileSync(urlAntiga)
    fs.writeFile(urlNova, rawData, function(err) {
    if (err) console.log(err)
      res.write("Arquivo enviado com sucesso!")
      res.end()
      })
    })
    }


    if (req.url == '/games' && req.method === 'GET') {
        const dirPath = './games';
        fs.readdir(dirPath, (err, files) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.write('<h1>Erro ao listar os arquivos</h1>');
            return res.end();
          }
    
          const fileLinks = files
            .map(file => `<li><a href="/games/${file}" target="_blank">${file}</a></li>`)
            .join('');
    
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Lista de Jogos</title>
                  <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Envio de Arquivo</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: black;
                        color: white;
                        font-family: "Nunito";
                        text-align: center;
                    }
                    h1{
                    margin-top: 100px;
                    text-align: center;
                    color: gold;
                    font-family: "Bangers";
                    Letter-spacing: 3px;
                      font-size: 50px;
                    }
                    .btn-custom {
                        background-color: gold;
                        color: black;
                        border: none;
                    }
                    .btn-custom:hover {
                        background-color: yellow;
                    }
                </style>
              </head>
              <body>
                  <h1>Arquivos na pasta Games</h1>
                  ${fileLinks}
              </body>
              </html>
          `);
          res.end();
        });

        return; // Evita que outra lógica interfira nessa resposta.

      }



      if (req.url.startsWith('/games/') && req.method === 'GET') {
        const filePath = `.${req.url}`; // Converte a URL em caminho no sistema de arquivos
        fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('<h1>Arquivo não encontrado</h1>');
            return res.end();
          }
    
          const ext = path.extname(filePath).toLowerCase();
          const contentType = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
          }[ext] || 'application/octet-stream';
    
          res.writeHead(200, { 'Content-Type': contentType });
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
        });
        return;
      }



      

    })

servidor.listen(porta, () => console.log('Servidor ok'))
