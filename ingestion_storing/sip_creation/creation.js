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
  console.log('Processing:', itemPath);
  console.log('Prefix:', prefix);
  //console.log('Zip:', zip);
  console.log('Manifest:', manifest);
  
  for(let i = 0; i < itemPath.length; i++){
    const stat = fs.statSync(itemPath[i]);
    var prefix = path.dirname(itemPath[i])

    console.log('Processing:', itemPath[i]);
    console.log('Prefix:', prefix);
    //console.log('Zip:', zip);
    console.log('Manifest:', manifest);

    const relativePath = path.relative(prefix, itemPath[i]);
    zip.file(itemPath[i], { name: relativePath });
    const fileHash = await hashFile(itemPath[i]);
    manifest.push({ file: path.basename(itemPath[i]), hash: fileHash });

  }

}

// Main function to create the SIP
async function createSIP(inputPath) {
  // Create a write stream for the output zip file
  const output = fs.createWriteStream('output.zip');
  // Create a zip archiver instance with the specified compression level
  const zip = archiver('zip', { zlib: { level: 9 } });

  // Log the total size of the archive when it's closed
  output.on('close', () => console.log('Archive created:', zip.pointer() + ' total bytes'));
  // Pipe the archiver's output to the write stream
  zip.pipe(output);

  // Process the input path (file or directory) and generate the manifest
  const manifest = [];
  await processPath(inputPath, path.dirname(inputPath),zip, manifest);
  //await processPath2(inputPath, zip, manifest);

  // Append the manifest to the zip archive as 'manifest.json'
  const manifestFile = 'manifest.json';
  zip.append(JSON.stringify(manifest, null, 2), { name: manifestFile });

  // Finalize the archive, indicating that there are no more files to append
  zip.finalize();
}

// Example usage
const listPaths = ['./registos/0c6ae33fe5955aa6/257358dbf6b48b2e/unziped/jacasld.jpg', './registos/0c6ae33fe5955aa6/257358dbf6b48b2e/unziped/manifesto1.xml', './registos/0c6ae33fe5955aa6/257358dbf6b48b2e/template4.zip']
//createSIP(listPaths);

createSIP('./registos');

