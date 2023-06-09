// npm install --save md5-file
// npm install node-stream-zip
const md5File = require('md5-file');
const StreamZip = require('node-stream-zip');
const fs = require("fs");
const { stdin } = require('process');
//const { response } = require('express');
//const { replaceOne } = require('../../data_api/models/resource');
//const fs = require('fs/promises');



function changePath(new_path){
    mypath = new_path
    console.log("mypath --------------------> ", mypath)
}


function StoreSIP(zip_name){
    // if given a path, get the name of the file
    zip_path = ""
    if (zip_name.includes('/')){
        zip_path = zip_name
        zip_name = zip_name.split('/').pop()
    }

    console.log("ZIP NAME:", zip_name)
    console.log("ZIP path:", zip_path)
    const base = "./public/storage"; //MUDAR PATH PARA FICAR NA PASTA PUBLIC
    //var mypath = ""
    var final_info = []

    /* versão com promessa (asincrino) */
    return md5File(zip_path).then((hash) => {
        approvedExtensions = ['JPEG', 'JPG', 'PNG', 'GIF', 'SVG', 'MP4', 'WEBM', 'MP3', 'WAV', 'OGG', 'HTML', 'HTM','XML', 'CSS', 'JS', 'JSON', 'TXT', 'PDF']
        console.log(`The MD5 sum is: ${hash}`)
    
        // A hash tem o tamanho de 32 chars, mas vamos usar apenas 16 para cada pasta
        // só assim já deve evitar um grande numero de colisões
        let dir1 = hash.substring(0,16)
        let dir2 = hash.substring(16, 32)
    
        console.log(dir1, dir2)
        
        /// CRIAR DIRECTORIAS 
        final_dir = base + '/' + dir1 + '/' + dir2
        fs.mkdirSync(final_dir, { recursive: true })
        changePath(final_dir)

        /// VERIFICO QUAIS OS FICHEIROS QUE SÂO PDF/XML/PNG/JGP/ ... 
        unzipedFiles = []
        const zip = new StreamZip({
            file: zip_path,
            storeEntries: true
        });
        console.log("zip_path abaixo: ", zip_path)
        console.log("Criei o stream com sucesso!")
        return new Promise((resolve, reject) => {
        // Esta função procura no zip, sem fazer unzip, isto para o caso de não haver nenhum, poupa tempo
            console.log("Vou ler o zip")
            zip.on('ready', () => {
                // Take a look at the files
                console.log('Entries read: ' + zip.entriesCount);
                for (const entry of Object.values(zip.entries())) {
                    if (!entry.isDirectory){ // se não for uma pasta então verifico a extensão do ficheiro 
                        //console.log(`Entry ${entry.name}`);
                        //console.log(`Entry ${entry.name.split('/').pop()}`);
                        filename = entry.name.split('/').pop()
                        extension = entry.name.split('.').pop().toUpperCase()
                        console.log("Extensão: ", '['+extension+']')
                        if(filename != 'manifest.json'){
                            var file_info = {
                                "fileName" : filename,
                                "type" : extension,
                            }
                            if(approvedExtensions.includes(extension)){
                                unzipedFiles.push(entry.name)
                                file_info["browserSupported"] = true
                                file_info["path"] = final_dir + '/' + 'unziped' + '/' + filename
                            }
                            else{
                                unzipedFiles.push(entry.name)
                                file_info["browserSupported"] = false
                                file_info["path"] = final_dir + '/' + 'unziped' + '/' + filename
                            }
                            final_info.push(file_info)
                        }
                    }
                }
                //console.log("Ficheiros: ", final_info)

            
                /// Depois de verificar quais os ficheiros que podem ficar fora, então é feito o unzip desses
                /// para o directorio criado enteriormente... (storage/hash/hash/..)
                unziped_path = final_dir + '/' + 'unziped'
                fs.mkdirSync(unziped_path, { recursive: true })

                for (var i = 0; i < unzipedFiles.length; i++){
                    //console.log("elem === ", unzipedFiles[i])
                    filename = unzipedFiles[i].split('/').pop()
                    console.log("FILENAME == ", filename)
                    console.log("PATH == ", unziped_path + '/' + filename)
                    zip.extract(unzipedFiles[i], unziped_path + '/' + filename, err => {
                        console.log(err ? 'Extract error: '+ err : 'Extracted');
                        //zip.close();
                    });
                }
                console.log("Ficheiros mostraveis: ", unzipedFiles)
                //zip.close()
                resolve(final_info);
            })
            zip.on('error', (err) => {
                console.log("ERRO: ", err)
                reject(err)
            })
        })
    })
    .then((final_info) => {
        console.log("FINAL INFO: ", final_info)
        // Move the zip file to the final directory
        return fs.promises.rename(zip_path, final_dir + '/' + zip_name)
            .then(() => {
                console.log("FINAL DIR: ", final_dir + '/' + zip_name)
                console.log('Successfully renamed - AKA moved!');
                qq = { 
                    "zip_path" : final_dir + '/' + zip_name,
                    "list_files" : final_info
                }
                return qq;
            })
            .catch((err) => {
                throw err;
            });
    });
}

// Executar desta forma:
//receive from stdin
module.exports = {
    StoreSIP : StoreSIP
}


//var args = process.argv.slice(2);
// StoreSIP('../sip_creation/output.zip').then(x=>{
//     console.log("FINAL DIR =======================================> ", x)
//      // este valor ainda não está a dar correcto.
// })


// Desta forma a promessa fica pendente, desta maneira a variavel não tem o resultado:
// x = StoreSIP('template4.zip')
// console.log("FINAL DIR =======================================> ", x)


