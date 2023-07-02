const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');

// Function to create the hash for a file using the MD5 algorithm
async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

// Recursive function to process each file and folder
async function processPath(itemPath, prefix, zip, manifest) {
  console.log('Processing:', itemPath);
  console.log('Prefix:', prefix);
  //console.log('Zip:', zip);
  console.log('Manifest:', manifest);
  const stat = fs.statSync(itemPath);

  if (stat.isFile()) {
    const relativePath = path.relative(prefix, itemPath);
    zip.file(itemPath, { name: relativePath });
    const fileHash = await hashFile(itemPath);
    manifest.push({ file: path.basename(itemPath), hash: fileHash });

    console.log('Processing:', itemPath);
    console.log('Prefix:', prefix);
    //console.log('Zip:', zip);
    console.log('Manifest:', manifest);

  } else
    if (stat.isDirectory()) {

      const items = fs.readdirSync(itemPath);

      for (const item of items) {
        await processPath(path.join(itemPath, item), prefix, zip, manifest);
      }
    }
}

async function processPath2(itemPath, zip, manifest) {
  
  for(let i = 0; i < itemPath.length; i++){
    const stat = fs.statSync(itemPath[i]);
    var prefix = path.dirname(itemPath[i]);

    const relativePath = path.relative(prefix, itemPath[i]);
    zip.file(itemPath[i], { name: relativePath });
    const fileHash = await hashFile(itemPath[i]);
    manifest.push({ file: path.basename(itemPath[i]), hash: fileHash });

  }

}

function sanitizeFilename(fileName) {
  // Remove accentuation
  let sanitized = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remove special characters
  sanitized = sanitized.replace(/[^\w\s]|_/g, "");

  // Replace spaces with underscore
  sanitized = sanitized.replace(/\s+/g, '_');

  return sanitized;
}

// Main function to create the SIP
async function createSIP(inputPath, fileName=null) {
  // Create a write stream for the output zip file
  console.log('Filename:', fileName)
  if (fileName != null) {
    console.log('Filename is not null')
    fileName = sanitizeFilename(fileName)
    fileName = fileName + '.zip'
  } else {
    fileName = 'output.zip'
  }
  
  var filePath = './uploads/' + fileName
  const output = fs.createWriteStream(filePath);
  // Create a zip archiver instance with the specified compression level
  const zip = archiver('zip', { zlib: { level: 9 } });

  // Pipe the archiver's output to the write stream
  zip.pipe(output);

  // Process the input path (file or directory) and generate the manifest
  const manifest = [];
  await processPath2(inputPath, zip, manifest);

  console.log('Manifest:', manifest);

  // Append the manifest to the zip archive as 'manifest.json'
  const manifestFile = 'manifest.json';
  zip.append(JSON.stringify(manifest, null, 2), { name: manifestFile });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log('Archive created:', zip.pointer() + ' total bytes');
      resolve(fileName);
    });

    output.on('error', (err) => {
      console.log('Error in creating archive:', err);
      reject(err);
    });

    // Finalize the archive, indicating that there are no more files to append
    zip.finalize();
  });
}



// Example usage
//const listPaths = ['./registos/0c6ae33fe5955aa6/257358dbf6b48b2e/unziped/jacasld.jpg', './registos/0c6ae33fe5955aa6/257358dbf6b48b2e/unziped/manifesto1.xml', './registos/0c6ae33fe5955aa6/257358dbf6b48b2e/template4.zip']
//createSIP(listPaths);


module.exports = {
  createSIP: createSIP
}

  
