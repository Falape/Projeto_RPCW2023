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
  const stat = fs.statSync(itemPath);

  if (stat.isFile()) {
    const relativePath = path.relative(prefix, itemPath);
    zip.file(itemPath, { name: relativePath });
    const fileHash = await hashFile(itemPath);
    manifest.push({ file: path.basename(itemPath), hash: fileHash });
  } else if (stat.isDirectory()) {
    const items = fs.readdirSync(itemPath);
    for (const item of items) {
      await processPath(path.join(itemPath, item), prefix, zip, manifest);
    }
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
    await processPath(inputPath, path.dirname(inputPath), zip, manifest);
  
    // Append the manifest to the zip archive as 'manifest.json'
    const manifestFile = 'manifest.json';
    zip.append(JSON.stringify(manifest, null, 2), { name: manifestFile });
  
    // Finalize the archive, indicating that there are no more files to append
    zip.finalize();
  }
  
  // Example usage
  createSIP('./registos');
  
