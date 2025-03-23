const express = require('express');
const fs = require('fs');
const mammoth = require('mammoth');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const archiver = require('archiver');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5784;
const ROOT_DIR = ["C:\\Publico\\facul", "C:\\Users\\tiago\\Dropbox\\facul", "C:\\Users\\tiago\\OneDrive\\facul", "C:\\Users\\tiago\\GoogleDrive\\facul",];
let numberRootDir = 0
const upload = multer({ dest: 'uploads/' });
const FILE_EXTENSION = ["txt", "bat", "js", "html", "css", "lnk", "docx"]
console.log(FILE_EXTENSION)

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(cookieParser()); // Middleware para manipular cookies

let lastPathUrl = []

// Middleware para extrair o caminho dinâmico
app.use((req, res, next) => {
    let requestedPath = decodeURIComponent(req.path).replace(/\//g, "\\"); // Converte "/" para "\"
    let absolutePath = path.join(ROOT_DIR[numberRootDir], requestedPath);

    if (!absolutePath.startsWith(ROOT_DIR[numberRootDir])) {
        return res.status(400).send('Acesso negado');
    }

    req.currentPath = absolutePath; // Guarda o caminho atual na requisição
    next();
});


app.get('/*', (req, res, next) => {

    
    //?---------------------------------------
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    //?---------------------------------------

    switch (req.path.startsWith) {
            case '/download':
                return next();
            break;
    
            case '/search':
                return next();
            break;
    
            case '/download':
            
            break;
    
        default:
            break;
    }
    let lastCookie = req.cookies.pathUrl
    if (req.path.startsWith('/download') || req.path.startsWith('/search')) {
        return next(); // Deixa o Express processar a rota normalmente
    }
    const currentPath = req.currentPath;
    let pathUrl = req.path
    const pathSegments = pathUrl.split("/");
    if (!(req.path).endsWith("/")){pathUrl = req.path+"/"}

    let accumulatedPath = "";
    
    const Pachfiles = pathSegments.map((file) => {
        accumulatedPath += file.replaceAll("/", "")+"/";
        return `<a href="${accumulatedPath}">/${file}</a>`;
    }).join('');

    if (!fs.existsSync(currentPath)) {
        return res.status(404).send('Pasta não encontrada');
    }

    console.log("Está na path: " + req.path);
    if (pathUrl != req.cookies.nowPathUrl){
        lastPathUrl[lastPathUrl.length] = req.path
        res.cookie('lastPathUrl', lastPathUrl, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
        console.log(lastPathUrl)
        console.log(lastPathUrl.length)

    }
    res.cookie('nowPathUrl', pathUrl, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    console.log("Now Cookie: "+ req.cookies.nowPathUrl)

    const fileExtension = path.extname(req.path).substring(1);

    const buttons = [
        { name: 'Local', id: 0 },
        { name: 'Dropbox', id: 1 },
        { name: 'OneDrive', id: 2 },
        { name: 'GoogleDrive', id: 3 }
    ];


    const half = Math.ceil(buttons.length / 2); // Define o ponto de corte

    const BTNROOTDIR1 = buttons.slice(0, half).map(btn => `
        <button style="width: auto;${/* css */ ''} ${numberRootDir !== btn.id ? `box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);` : ''}"
            ${/* js */ ''} ${numberRootDir !== btn.id ? `onclick="numberRootDir(${btn.id})" onmouseover="this.style.backgroundColor='#005bb5'" onmouseout="this.style.backgroundColor=''"` : ''}>
            ${/* name */ ''} ${btn.name}
        </button>
    `).join('');
    
    const BTNROOTDIR2 = buttons.slice(half).map(btn => `
        <button style="width: auto;${/* css */ ''} ${numberRootDir !== btn.id ? `box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);` : ''}"
            ${/* js */ ''} ${numberRootDir !== btn.id ? `onclick="numberRootDir(${btn.id})" onmouseover="this.style.backgroundColor='#005bb5'" onmouseout="this.style.backgroundColor=''"` : ''}>
            ${/* name */ ''} ${btn.name}
        </button>
    `).join('');
    

    function  readDocx(filePath) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo:', err);
                return;
            }
            mammoth.extractRawText({ buffer: data })
                .then(result => {
                    console.log("return: "+result.value)
                    return result.value;
                })
                .catch(error => console.error('Erro ao extrair texto:', error));
        });
    }




    if (FILE_EXTENSION.includes(fileExtension)) {

        if (fileExtension === 'docx') {
            async function fdataText() {
             return readDocx(currentPath)
            };     
            let dataText = fdataText();
            console.log("dataText: "+dataText)
            res.send(`
                <html>
<head>
    <style>

    ::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover{
    background-color: #ffffff1e;
}

::-webkit-scrollbar-track {
    background: transparent;

}

::-moz-scrollbar {
    width: 12px;
}
    
::-moz-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-moz-scrollbar-track {
    background-color: #0e0f12;
}

        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .header {
            background-color: #0073e6;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
        }

        h2,
        h3 {
            margin: 10px 0;
        }

        button {
            background-color: #0073e6;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
            width: calc(100% - 20px);
        }

        button:hover {
            background-color: #005bb5;
        }

        p {
            font-size: 16px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            border: 3px double black;
            border-radius: 10px;
        }

        #current-path {
            font-weight: bold;
            color: #0073e6;
            cursor: pointer;
            text-decoration: none;
        }

        li a {
            text-decoration: none;
            color: #0073e6;
        }

        li a:hover {
            text-decoration: underline;
        }

        li button,
        p button {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            width: auto;
        }

        p a {
            color: #000;
            text-decoration: none;
            font-weight: bold;
            Font-style: italic
        }

        .folder a, .file a {
            text-decoration: none;
            color: #000;
            font-weight: bold;
        }       

        .clickEditable {
            display: inline-flex;
            width: 75%;
            height: 17px;
        }

        textarea {
            width: 100%;
            height: 85vh;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;
            font-family: monospace;
            resize: none;
            border-color: #0073e6;
            background-color: #8080805c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Gerenciador de Arquivos #Editor de texto</h2>
    </div>
    <p>
        <button onclick="alert('Em Breve')" onclick="goBack('${lastPathUrl[lastPathUrl.length-2]}')">⬅️</button>
        <button onclick="alert('Em Breve')" ">➡️</button>
        <button onclick="goBack('${pathUrl}')">⬆️</button>
        <b>Caminho Atual:</b>
        <span id="current-path" ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')">
        <a href="/">C:</a>${Pachfiles}</span>
        <span class="clickEditable" onclick="editPath()"ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')"></span>
    </p>
    <div style="
    display: flex;
    align-items: center;
    justify-content: space-between;">
        <h3>Editando: ${req.path}</h3>
        <button onclick="saveFile()" style="width: 100px;">Salvar</button>
    </div>
    <textarea id="editor">${dataText}</textarea>
    
    <script>
        function saveFile() {
            const content = document.getElementById('editor').value;
            fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: '${req.path}', content })
            })
            .then(response => response.text())
            .then(console.log)
            .catch(error => console.log("Erro ao salvar: " + error));
        }

function goBack(goTo) {
    var url = "";
    if (goTo.endsWith("/")){
        const pathSegments = goTo.split("/");
        for (let i = 1; i < (pathSegments.length) - 2; i++) {
            if ((pathSegments[i] == "") && (!(url).endsWith("/"))) {
                url = "/";
            } else {
                url += "/" + pathSegments[i];
            }
        }
    } else {url = goTo}
        if (!url) { url = "/"; }
        console.log(url)
        window.location.href = url;
}
    </script>
</body>
</html>

            `);
        } else {

        fs.readFile(currentPath, 'utf8', (error, dataText) => {
            if (error) {
                return res.status(500).send("Erro ao abrir o arquivo: " + error);
            }
            res.send(`
                <html>
<head>
    <style>

    ::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover{
    background-color: #ffffff1e;
}

::-webkit-scrollbar-track {
    background: transparent;

}

::-moz-scrollbar {
    width: 12px;
}
    
::-moz-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-moz-scrollbar-track {
    background-color: #0e0f12;
}

        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .header {
            background-color: #0073e6;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
        }

        h2,
        h3 {
            margin: 10px 0;
        }

        button {
            background-color: #0073e6;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
            width: calc(100% - 20px);
        }

        button:hover {
            background-color: #005bb5;
        }

        p {
            font-size: 16px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            border: 3px double black;
            border-radius: 10px;
        }

        #current-path {
            font-weight: bold;
            color: #0073e6;
            cursor: pointer;
            text-decoration: none;
        }

        li a {
            text-decoration: none;
            color: #0073e6;
        }

        li a:hover {
            text-decoration: underline;
        }

        li button,
        p button {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            width: auto;
        }

        p a {
            color: #000;
            text-decoration: none;
            font-weight: bold;
            Font-style: italic
        }

        .folder a, .file a {
            text-decoration: none;
            color: #000;
            font-weight: bold;
        }       

        .clickEditable {
            display: inline-flex;
            width: 75%;
            height: 17px;
        }

        textarea {
            width: 100%;
            height: 85vh;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;
            font-family: monospace;
            resize: none;
            border-color: #0073e6;
            background-color: #8080805c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Gerenciador de Arquivos #Editor de texto</h2>
    </div>
    <p>
        <button onclick="alert('Em Breve')" onclick="goBack('${lastPathUrl[lastPathUrl.length-2]}')">⬅️</button>
        <button onclick="alert('Em Breve')" ">➡️</button>
        <button onclick="goBack('${pathUrl}')">⬆️</button>
        <b>Caminho Atual:</b>
        <span id="current-path" ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')">
        <a href="/">C:</a>${Pachfiles}</span>
        <span class="clickEditable" onclick="editPath()"ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')"></span>
    </p>
    <div style="
    display: flex;
    align-items: center;
    justify-content: space-between;">
        <h3>Editando: ${req.path}</h3>
        <button onclick="saveFile()" style="width: 100px;">Salvar</button>
    </div>
    <textarea id="editor">${dataText}</textarea>
    
    <script>
        function saveFile() {
            const content = document.getElementById('editor').value;
            fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: '${req.path}', content })
            })
            .then(response => response.text())
            .then(console.log)
            .catch(error => console.log("Erro ao salvar: " + error));
        }

function goBack(goTo) {
    var url = "";
    if (goTo.endsWith("/")){
        const pathSegments = goTo.split("/");
        for (let i = 1; i < (pathSegments.length) - 2; i++) {
            if ((pathSegments[i] == "") && (!(url).endsWith("/"))) {
                url = "/";
            } else {
                url += "/" + pathSegments[i];
            }
        }
    } else {url = goTo}
        if (!url) { url = "/"; }
        console.log(url)
        window.location.href = url;
}
    </script>
</body>
</html>

            `);
        });
    }
    }else{

    const files = fs.readdirSync(currentPath).map(file => {
        const filePath = path.join(currentPath, file);
    
        return fs.statSync(filePath).isDirectory() ?
            `<li class="folder" draggable="true" ondragstart="dragStart(event, '${file}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl}${file}')" style="background-color: #8080805c">
                <a href="${pathUrl}${file}">📁 ${file}</a>
                <div class="options_ar">
                    <button onclick="renameItem('${file}')">✏️</button>
                    <button onclick="downloadFile('${file}')">⏏️</button>
                    <button onclick="deleteItem('${file}')">❎</button>
                </div>
            </li>` :
            `<li class="file" draggable="true" ondragstart="dragStart(event, '${file}')" style="background-color: #8080805c">
                ${FILE_EXTENSION.includes(file.split('.').pop()) 
                    ? `<a href="${pathUrl}${file}">📄 ${file}</a>` 
                    : `📄 ${file}`
                }
                <div class="options_ar">
                    <button onclick="renameItem('${file}')">✏️</button>
                    <button onclick="downloadFile('${file}')">⏏️</button>
                    <button onclick="deleteItem('${file}')">❎</button>
                </div>
            </li>`;
    }).join('');
    

    res.send(`<html>

<head>
    <style>
        ::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover{
    background-color: #ffffff1e;
}

::-webkit-scrollbar-track {
    background: transparent;

}

::-moz-scrollbar {
    width: 12px;
}
    
::-moz-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-moz-scrollbar-track {
    background-color: #0e0f12;
}


        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .header {
            background-color: #0073e6;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
        }

        h2,
        h3 {
            margin: 10px 0;
        }

        input[type="text"],
        input[type="file"] {
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: calc(100% - 20px);
            height: 39px;
        }

        button {
            background-color: #0073e6;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
            width: calc(100% - 20px);
        }

        button:hover:not(.menu button) {
            background-color: #005bb5;
        }

        p {
            font-size: 16px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            border: 3px double black;
            border-radius: 10px;
        }

        p a {
            color: #000;
            text-decoration: none;
            font-weight: bold;
            Font-style: italic
        }

        #current-path {
            font-weight: bold;
            color: #0073e6;
            cursor: pointer;
            text-decoration: none;
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        li.folder {
            font-weight: bold;
        }

        li.file {
            color: #333;
        }

        li a {
            text-decoration: none;
            color: #0073e6;
        }

        li a:hover {
            text-decoration: underline;
        }

        li button,
        p button {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            width: auto
        }

        .folder a, .file a {
            text-decoration: none;
            color: #000;
            font-weight: bold;
        }

        .options_ar {
            display: flex;
            align-items: center;
        }

        .clickEditable {
            display: inline-flex;
            width: 75%;
            height: 17px
        }
    </style>
</head>

<body>
    <div class="header"style="
        display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    ">
    <div class="menu">
        ${BTNROOTDIR1}
    </div>
        <h2 style="
            flex-grow: 1;
        ">Gerenciador de Arquivos</h2>
        <div class="menu">
        ${BTNROOTDIR2}
    </div>
    </div>
    <div style="
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
    ">
        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;">
                <h3>Criação de Arquivo:</h3>
                <input type="text" id="file-folder-name" placeholder="Nome do Arquivo/Pasta"><button
                onclick="createItem()">Criar Arquivo/Pasta</button>
        </div>

        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;;">

                <h3>Upload de Arquivo:</h3>
                <input type="file" id="file-upload">
                <button onclick="uploadFile()">Enviar</button>
        </div>

        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;">
                <h3>Pesquisar Arquivos no Sistema:</h3>
                <input type="text" id="file-folder-research" placeholder="Pesquisar"><button onclick="locate()">Localizar</button>
        </div>
    </div>

    <p>
        <button onclick="alert('Em Breve')" onclick="goBack('${lastPathUrl[lastPathUrl.length-2]}')">⬅️</button>
        <button onclick="alert('Em Breve')" ">➡️</button>
        <button onclick="goBack('${pathUrl}')">⬆️</button>
        <b>Caminho Atual:</b>
        <span id="current-path" ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')">
        <a href="/">C:</a>${Pachfiles}</span>
        <span class="clickEditable" onclick="editPath()"ondragstart="dragStart(event, '${(pathUrl.slice(0, -1)).split('/').at(-1)}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl.slice(0, -2)}')"></span>
    </p>

    <h3>Arquivos na Pasta Atual:</h3>
    <ul>${files}</ul>

    
<div id="drop-zone" style="border: 2px dashed #0073e6; padding: 20px; text-align: center; margin-top: 10px;">
    Arraste e solte os arquivos aqui para enviar.
</div>



    <script>
        const currentPathElement = document.getElementById("current-path");
        let originalPath = currentPathElement.innerText;

        function editPath() {

            const clickEditable = document.getElementsByClassName("clickEditable")[0];
            clickEditable.style.display = 'none';

            const input = document.createElement("input");
            input.type = "text";
            input.value = currentPathElement.innerText.slice(0, -1);
            input.id = "editable-path";

            input.addEventListener("blur", function () {
                changePathOnEdit((input.value).split("C:/")[1]);
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    changePathOnEdit((input.value).split("C:/")[1]);
                } else if (event.key === "Escape") {
                    cancelEditPath();
                }
            });

            currentPathElement.replaceWith(input);
            input.focus();
        }

        function changePathOnEdit(newPath) {
            window.location.href = newPath;
        }

        function cancelEditPath() {
            const input = document.getElementById("editable-path");
            const span = document.createElement("span");
            span.id = "current-path";
            span.innerText = originalPath;
            span.onclick = editPath();
            input.replaceWith(span);
        }

        function changePathInput() {
            const newPath = document.getElementById("path-input").value;
            fetch("/change-path", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: newPath })
            }).then(() => location.reload());
        }

        function changePath(folder) {
            fetch("/change-path", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: folder })
            }).then(() => location.reload());
        }

function goBack(goTo) {
    var url = "";
    if (goTo.endsWith("/")){
        const pathSegments = goTo.split("/");
        for (let i = 1; i < (pathSegments.length) - 2; i++) {
            if ((pathSegments[i] == "") && (!(url).endsWith("/"))) {
                url = "/";
            } else {
                url += "/" + pathSegments[i];
            }
        }
    } else {url = goTo}
        if (!url) { url = "/"; }
        console.log(url)
        window.location.href = url;
}

        function createItem() {
            const name = document.getElementById("file-folder-name").value;
            let pathUrl = '${pathUrl}'
            fetch("/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, pathUrl })
            }).then(() => console.log("Criado com sucesso!"));
            refreshFileList()
        }

        function renameItem(oldName) {
                const newName = prompt("Novo nome para " + oldName + ":");
            let pathUrl = '${pathUrl}'
                if (newName) {
                    fetch("/rename", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pathUrl, oldName, newName })
                    }).then(() => console.log("Renomeado com sucesso!"));
            refreshFileList()
                }
            }

        function deleteItem(name) {
        let pathUrl = '${pathUrl}'
            fetch("/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pathUrl, name })
            }).then(() => console.log("Excluido com sucesso!"));
            refreshFileList()
        }

        function uploadFile() {
    const fileInput = document.getElementById("file-upload");
    if (!fileInput.files.length) {
        console.log("Selecione um arquivo para enviar");
        return;
    }
    
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("pathUrl", window.location.pathname);
    
    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(console.log)
    .catch(error => console.log("Erro ao enviar arquivo: " + error));
}

function downloadFile(fileName) {
    const filePath = window.location.pathname + '/' + fileName;
    window.location.href = '/download?path='+encodeURIComponent(filePath);
}
    


        function refreshFileList() {
            window.location.href = '${pathUrl}';
        }


        const dropZone = document.getElementById("drop-zone");

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "#e6f7ff"; // Mudar cor ao arrastar
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "transparent"; // Voltar ao normal ao sair
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "transparent";

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        uploadDroppedFiles(files);
    }
});

function uploadDroppedFiles(files) {
    const formData = new FormData();
    formData.append("pathUrl", window.location.pathname);

    for (let file of files) {
        formData.append("file", file);
    }

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(console.log)
    .catch(error => console.log("Erro ao enviar arquivo: " + error));
}

let draggedItem = null; // Guarda o item que está sendo arrastado

function dragStart(event, fileName) {
    draggedItem = fileName; // Salva o nome do arquivo/pasta arrastado
    event.dataTransfer.setData("text", fileName); // Passa o nome via drag and drop
}

function allowDrop(event) {
    event.preventDefault(); // Permite soltar
}

function drop(event, destinationFolder) {
    event.preventDefault();
    
    if (!draggedItem) {
        return;
    }

    let sourcePath = window.location.pathname + '/' + draggedItem; // Caminho atual do item
    let destPath = destinationFolder; // Caminho de destino

    // Enviar solicitação para mover o arquivo/pasta
    fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: sourcePath, destination: destPath })
    })
    .then(response => response.text())
    .then(console.log)
    .catch(error => console.log("Erro ao mover arquivo: " + error));

    draggedItem = null;

    goBack(destPath+"/");
}

function searchFiles(directory, query, results = []) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (item.toLowerCase().includes(query.toLowerCase())) {
            results.push(itemPath); // Adiciona o caminho do item encontrado
        }

        if (stats.isDirectory()) {
            searchFiles(itemPath, query, results); // Busca dentro de subpastas
        }
    }

    return results;
}

    function locate(){
    const research = document.getElementById("file-folder-research").value;
    window.location.href = '/search?query='+research;
    }

    function numberRootDir(numberRootDir){

    fetch("/changeDir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numberRootDir })
    })
    .then(response => response.text())
    .then(console.log)
    .catch(error => console.log("Erro ao mudar de diretorio: " + error));

    goBack("//");
    }
    </script>
</body>

</html>
`);
}
});

app.post('/change-path', (req, res) => {
    let newPath = req.body.path === ".." ? path.dirname(currentPath) : path.join(currentPath, req.body.path);
    newPath = path.resolve(newPath);
    
    if (!newPath.startsWith(ROOT_DIR[numberRootDir])) {
        return res.status(400).send('Acesso negado');
    }
    
    if (fs.existsSync(newPath)) {
        currentPath = path.resolve(newPath);
        res.sendStatus(200);
    } if (fs.existsSync(req.body.path)) {
        currentPath = path.resolve(req.body.path);
        res.sendStatus(200);
    } else {
        res.status(400).send('Caminho inválido');
    }
});

app.post('/create', (req, res) => {
    const pathUrl =  req.body.pathUrl
    const itemPath = path.join(ROOT_DIR[numberRootDir],(pathUrl.replaceAll("/","\\")), req.body.name);

    if (req.body.name.includes('.')) {
        fs.writeFileSync(itemPath, '');
    } else {
        fs.mkdirSync(itemPath, { recursive: true });
    }
    res.status(200);
});

app.post('/delete', (req, res) => {
    const pathUrl =  req.body.pathUrl
    const itemPath = path.join(ROOT_DIR[numberRootDir],(pathUrl.replaceAll("/","\\")), req.body.name);
    if (fs.existsSync(itemPath)) {
    console.log("itemPath: "+itemPath)

        fs.statSync(itemPath).isDirectory() ? fs.rmdirSync(itemPath) : fs.unlinkSync(itemPath);
        res.sendStatus(200);
    } else {
        res.status(400).send('Arquivo/Pasta não encontrado');
    }
});

app.post('/rename', (req, res) => {
    const { pathUrl, oldName, newName } = req.body;
    const oldPath = path.join(ROOT_DIR[numberRootDir],(pathUrl.replaceAll("/","\\")), oldName);
    const newPath = path.join(ROOT_DIR[numberRootDir],(pathUrl.replaceAll("/","\\")), newName);

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        res.sendStatus(200);
    } else {
        res.status(400).send('Arquivo/Pasta não encontrado');
    }
});

app.post('/upload', upload.array('file'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('Nenhum arquivo enviado');
    }

    const pathUrl = req.body.pathUrl || "";
    
    req.files.forEach(file => {
        const destPath = path.join(ROOT_DIR[numberRootDir], pathUrl.replaceAll("/", "\\"), file.originalname);
        fs.renameSync(file.path, destPath);
    });

    res.send('Upload concluído com sucesso');
});

app.get('/download', (req, res) => {
    const filePath = path.join(ROOT_DIR[numberRootDir], req.query.path);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Arquivo/Pasta não encontrado');
    }
    
    if (fs.statSync(filePath).isDirectory()) {
        const zipPath = filePath + '.zip';
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(filePath, false);
        archive.finalize();

        output.on('close', () => {
            res.download(zipPath, path.basename(zipPath), (err) => {
                if (err) {
                    console.error("Erro ao enviar o ZIP:", err);
                }
                fs.unlinkSync(zipPath); // Remove o ZIP após o download
            });
        });
    } else {
        res.download(filePath);
    }
});

app.post('/move', (req, res) => {
    const { source, destination } = req.body;
    
    let srcPath = path.join(ROOT_DIR[numberRootDir], source.replaceAll("/", "\\"));
    let destPath = path.join(ROOT_DIR[numberRootDir], destination.replaceAll("/", "\\"), path.basename(srcPath));

    if (!fs.existsSync(srcPath)) {
        return res.status(400).send("Arquivo/Pasta não encontrado");
    }

    fs.rename(srcPath, destPath, (err) => {
        if (err) {
            return res.status(500).send("Erro ao mover o arquivo/pasta");
        }
        res.send("Movido com sucesso!");
    });
});

app.post('/save', (req, res) => {
    const filePath = path.join(ROOT_DIR[numberRootDir], req.body.path);
    
    if (!filePath.startsWith(ROOT_DIR[numberRootDir])) {
        return res.status(400).send('Acesso negado');
    }

    fs.writeFile(filePath, req.body.content, 'utf8', (error) => {
        if (error) {
            return res.status(500).send('Erro ao salvar o arquivo: ' + error);
        }
        res.send('Arquivo salvo com sucesso!');
    });
});

app.post('/changeDir', (req, res) => {
    numberRootDir = req.body.numberRootDir
});


app.get('/search', (req, res) => {

    let pathUrl
    const query = req.query.query; // Nome do arquivo/pasta a buscar

    if (!query) {
        return res.status(400).send('Especifique um termo de busca.');
    }

    // console.log(searchFiles(ROOT_DIR[numberRootDir], query).replace("\\\\", "/"));
    const results = searchFiles(ROOT_DIR[numberRootDir], query);

    if (results.length === 0) {
        return res.status(404).send('Nenhum arquivo ou pasta encontrado.');
    }

    const FILE_EXTENSION = ["txt", "bat", "js", "html", "css"];

    const files = results.map(file => {
        pathUrl = (file.split(ROOT_DIR[numberRootDir])[1].replace("\\\\", "/"));
        const fileName = path.basename(file); // Pega apenas o nome do arquivo/pasta

        return fs.statSync(file).isDirectory() ?
            `<li class="folder" draggable="true" ondragstart="dragStart(event, '${fileName}')" ondragover="allowDrop(event)" ondrop="drop(event, '${pathUrl}${fileName}')" style="background-color: #8080805c">
                <a href="${pathUrl}">📁 ${fileName}</a>
                <div class="options_ar">
                    <button onclick="renameItem('${fileName}')">✏️</button>
                    <button onclick="downloadFile('${fileName}')">⏏️</button>
                    <button onclick="deleteItem('${fileName}')">❎</button>
                </div>
            </li>` :
            `<li class="file" draggable="true" ondragstart="dragStart(event, '${fileName}')" style="background-color: #8080805c">
                ${FILE_EXTENSION.includes(fileName.split('.').pop()) 
                    ? `<a href="${pathUrl}">📄 ${fileName}</a>` 
                    : `📄 ${fileName}`
                }
                <div class="options_ar">
                    <button onclick="renameItem('${fileName}')">✏️</button>
                    <button onclick="downloadFile('${fileName}')">⏏️</button>
                    <button onclick="deleteItem('${fileName}')">❎</button>
                </div>
            </li>`;
    }).join(''); // Junta todos os resultados em uma string

    res.send(`
        <html>
        <style>

            ::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover{
    background-color: #ffffff1e;
}

::-webkit-scrollbar-track {
    background: transparent;

}

::-moz-scrollbar {
    width: 12px;
}
    
::-moz-scrollbar-thumb {
    background-color: #0073e6;
    border-radius: 6px;
}

::-moz-scrollbar-track {
    background-color: #0e0f12;
}


        body {
    font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }

.header {
        background-color: #0073e6;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
}

button {
    background-color: #0073e6;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
            width: calc(100% - 20px);
}

button:hover {
    background-color: #005bb5;
}

ul {
    list-style: none;
            padding: 0;
}

li {
    background: white;
    padding: 10px;
    margin: 5px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

li.folder {
    font-weight: bold;
}

li.file {
    color: #333;
}

li a {
    text-decoration: none;
    color: #0073e6;
}

li a:hover {
            text-decoration: underline;
}

p {
    font-size: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border: 3px double black;
    border-radius: 10px;
}

li button,
p button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
    width: auto
}

p a {
    color: #000;
    text-decoration: none;
    font-weight: bold;
    Font-style: italic
}

.folder a, .file a {
    text-decoration: none;
    color: #000;
    font-weight: bold;
}

.options_ar {
    display: flex;
    align-items: center;
}

h2, h3 {
    margin: 10px 0;
    }

    input[type="text"] {
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: calc(100% - 20px);
    height: 39px;
}

        </style>
        <head>
        </head>
        <body>
                <div class="header">
        <h2>Gerenciador de Arquivos</h2>
    </div>
    <div style="
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
    ">
        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;">
        </div>

        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;;">
        </div>

        <div style="
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;">
                <h3>Pesquisar Arquivos no Sistema:</h3>
                <input type="text" id="file-folder-research" placeholder="Pesquisar"><button onclick="locate()">Localizar</button>
        </div>
    </div>
            <p>
                <button onclick="alert('Em Breve')" onclick="goBack('${lastPathUrl[lastPathUrl.length-2]}')">⬅️</button>
                <button onclick="alert('Em Breve')" ">➡️</button>
                <button onclick="goBack('${pathUrl}')">⬆️</button>
                <b>Pesquisa:</b>
                <span id="current-path">
                    <a href="/search?query=${query}">${query}</a>
                </span>
            </p>

            <h3>Arquivos e Pastas encontrados:</h3>
            <ul>${files}</ul>

        </body>
        </html>
    `);
});

function searchFiles(directory, query, results = []) {
    const items = fs.readdirSync(directory); // Lê os arquivos e pastas

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (item.toLowerCase().includes(query.toLowerCase())) {
            results.push(itemPath); // Adiciona o caminho do item encontrado
        }

        if (stats.isDirectory()) {
            searchFiles(itemPath, query, results); // Busca dentro de subpastas
        }
    }
    return results;
}


app.listen(PORT, () => console.log('Servidor rodando em http://localhost:' + PORT));