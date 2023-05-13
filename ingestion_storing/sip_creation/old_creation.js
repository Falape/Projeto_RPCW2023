const fs = require('fs-extra');
const crypto = require('crypto-js');
const archiver = require('archiver');
const path = require('path');

async function calculateHash(file) {
  const data = await fs.readFile(file);
  const hash = crypto.SHA256(data).toString();
  return hash;
}

async function createManifest(folder, items) {
  const manifest = {};

  for (const item of items) {
    const itemPath = path.join(folder, item);
    const hash = await calculateHash(itemPath);
    manifest.push({
      file: item,
      hash: hash
    });
  }

  await fs.writeJson(path.join(folder, 'manifest.json'), manifest);
}

async function createZipArchive(folder, outputPath, items) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip');

  output.on('close', () => {
    console.log('ZIP archive created successfully');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  items.forEach(item => {
    const itemPath = path.join(folder, item);
    archive.file(itemPath, { name: item });
  });

  archive.finalize();
}

async function createSip(input, outputPath) {
  let items;
  let folder;

  const stats = await fs.stat(input);
  if (stats.isDirectory()) {
    folder = input;
    items = await fs.readdir(input);
  } else {
    folder = path.dirname(input);
    items = [path.basename(input)];
  }

  await createManifest(folder, items);
  await createZipArchive(folder, outputPath, items.concat('manifest.json'));
}

// Example usage:
const inputPath = 'README.md';
const outputPath = 'sip_archive.zip';
createSip(inputPath, outputPath).catch((err) => console.error(err));
