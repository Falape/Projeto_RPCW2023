// Lê e lista todos os ficheiros num arquivo ZIP usando adm-zip
const path = require("path");
const AdmZip = require("adm-zip");
const crypto = require("crypto");

async function readZipArchive(filepath) {
    try {
        const zip = new AdmZip(filepath);
        let files_in_zip = new Map();
        let files_in_manifest = new Array();

        const zipEntries = zip.getEntries();

        if (!zipEntries.some(elem => elem.name == 'manifest.json')) {
            //throw " O ficheiro manifest.json não existe existe"
            console.log("[INVALID] O ficheiro manifest.json não existe...")
            return false
        }

        for (const zipEntry of zipEntries) {

            if (zipEntry.name == 'manifest.json') {
                files_in_manifest = JSON.parse(zipEntry.getData().toString('utf8'))
            }
            else {
                if (!zipEntry.name.startsWith(".") && zipEntry.name != "") {
                    const fileName = path.basename(zipEntry.name);
                    //console.log(fileName)
                    const md5Hash = crypto.createHash('md5').update(zipEntry.getData()).digest('hex');
                    //console.log('['+fileName+']'+ md5Hash)
                    files_in_zip.set(fileName, md5Hash)

                }
            }
        }
        for (const elem of files_in_manifest) {
            if (!files_in_zip.has(elem.file)) {
                //throw "Ficheiro " + elem.file + " referenciado no manifest.json, mas não existe no pacote enviado."
                console.log("[INVALID] Ficheiro " + elem.file + " referenciado no manifest.json, mas não existe no pacote enviado...")
                return false
            }
            else {
                const originalMd5Hash = elem.hash
                //console.log('['+elem.file+']'+ originalMd5Hash)
                //console.log('['+elem.file+']'+ files_in_zip.get(elem.file))
                if (originalMd5Hash == files_in_zip.get(elem.file)) {
                    files_in_zip.delete(elem.file)
                }
                else {
                    //throw "Ficheiro " + elem.file + " com hash não correspondente."
                    console.log("[INVALID] Ficheiro " + elem.file + " com hash não correspondente...")
                    return false
                }
            }
        }
        if (files_in_zip.size > 0){
            
            //throw "[INVALID] Ficheiros não referenciados no manifest.json, mas existem no pacote enviado."
            console.log("[INVALID] Ficheiros não referenciados no manifest.json, mas existem no pacote enviado...")
            return false
        }
        console.log("[VALID] Todos os ficheiros referenciados no manifest.json existem no pacote enviado...")
        return true
    }
    catch (e) {
        console.log(`Erro: ${e}`);
    }
}

x = readZipArchive("./output.zip");
//console.log(x)

