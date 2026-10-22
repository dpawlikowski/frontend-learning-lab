const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const os = require('os');

const files = [
  'index.html',
  'Senior_Frontend_Fullstack_2026_OFFICIAL_V14_STANDALONE.html'
];

function extract(html) {
  const scripts = [];
  const ids = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    const attrs = match[1] || '';
    if (/\ssrc\s*=/.test(attrs)) continue;
    scripts.push(match[2]);
  }
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const idRe = /\sid="([^"]+)"/g;
  while ((match = idRe.exec(withoutScripts))) ids.push(match[1]);
  return {scripts, ids};
}

let failed = false;
for (const file of files) {
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const {scripts, ids} = extract(html);
  if (!scripts.length) {
    console.error(file, 'no inline scripts found');
    failed = true;
  }
  const seen = new Map();
  ids.forEach((id, index) => {
    if (seen.has(id)) {
      console.error(file, 'duplicate id', id);
      failed = true;
    } else seen.set(id, index);
  });
  scripts.forEach((code, index) => {
    const tmp = path.join(os.tmpdir(), `check-${path.basename(file)}-${index}.js`);
    fs.writeFileSync(tmp, code);
    try {
      execFileSync(process.execPath, ['--check', tmp], {stdio: 'pipe'});
    } catch (error) {
      console.error(file, 'script', index, 'failed syntax check');
      console.error(String(error.stderr || error.message));
      failed = true;
    }
  });
  console.log(file, 'scripts', scripts.length, 'ids', ids.length);
}

if (failed) process.exit(1);
console.log('html checks passed');
