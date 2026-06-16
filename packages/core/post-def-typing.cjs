const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

const files = fs.readdirSync(distDir).filter(
  (file) =>
    /^LoginIDService-.*\.d\.(ts|cts)$/.test(file)
);

for (const file of files) {
  const filePath = path.join(distDir, file);

  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /^\s*#private;\s*$/gm,
    '    private __private;'
  );

  fs.writeFileSync(filePath, content, 'utf8');

  console.log('Post-processed:', file);
}
