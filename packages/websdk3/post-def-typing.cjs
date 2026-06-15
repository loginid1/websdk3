const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'dist/index.d.ts');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }

  let cleaned = data;

  cleaned = cleaned.replace(/(\w+)\$1\b/g, '$1');

  cleaned = cleaned.replace(/^\s*#private;\s*$/gm, '    private __private;');

  fs.writeFile(filePath, cleaned, 'utf8', (err) => {
    if (err) {
      throw new Error(`Error writing file: ${err.message}`);
    }

    console.log('Post-processed:', filePath);
  });
});
