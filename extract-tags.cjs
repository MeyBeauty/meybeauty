const fs = require('fs');
const text = fs.readFileSync('src/data/products.js', 'utf8');
const matches = [...text.matchAll(/tags:\s*\[([^\]]*)\]/g)];
const all = [];
matches.forEach((m) => {
  const arr = m[1].match(/"[^"]+"/g) || [];
  arr.forEach((s) => all.push(s.replace(/"/g, '')));
});
const counts = {};
all.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const output = sorted.map(([t, c]) => `${t} (${c})`).join('\n') + '\nTOTAL: ' + sorted.length + '\n';
fs.writeFileSync('tags.txt', output);
console.log(output);
