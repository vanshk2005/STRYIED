const fs = require('fs');

const data = [];
const existing = JSON.parse(fs.readFileSync('src/data/bns_dataset.json', 'utf8'));
const existingSections = new Set(existing.map(e => e.section));
data.push(...existing);

const loops = [
  { prefix: 'BNS', count: 358 },
  { prefix: 'BNSS', count: 531 },
  { prefix: 'BSA', count: 170 }
];

loops.forEach(l => {
  for (let i = 1; i <= l.count; i++) {
    const secName = `${l.prefix} ${i}`;
    if (!existingSections.has(secName)) {
      data.push({
        section: secName,
        title: `Section ${i} of the ${l.prefix}`,
        description: `This represents Section ${i} of the newly enacted ${l.prefix}. Full legal text will be populated from the official gazette.`,
        type: l.prefix,
        keywords: [l.prefix.toLowerCase(), 'law', `section ${i}`, 'legal clause'],
        loopholes: ['Standard procedural rules apply based on the schedule classification of this offense. Ensure proper legal counsel is consulted.']
      });
    }
  }
});

// Sort them numerically within types
const order = { 'BNS': 1, 'BNSS': 2, 'BSA': 3 };
data.sort((a, b) => {
  if (order[a.type] !== order[b.type]) return order[a.type] - order[b.type];
  const numA = parseInt(a.section.split(' ')[1]);
  const numB = parseInt(b.section.split(' ')[1]);
  return numA - numB;
});

fs.writeFileSync('src/data/bns_dataset.json', JSON.stringify(data, null, 2));
console.log('Successfully generated ' + data.length + ' sections for BNS, BNSS, BSA.');
