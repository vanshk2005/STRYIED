const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DATA_FILE = path.join(__dirname, '../src/data/bns_dataset.json');

console.log('⚖️ STRYIED: BNS Database Importer');
console.log('Use this script to rapidly add the remaining 1059 BNS/BNSS/BSA sections.');

const promptLaw = () => {
  rl.question('\nEnter Section (e.g. BNS 105): ', (section) => {
    if (!section.trim()) {
      console.log('Exiting...');
      process.exit(0);
    }
    
    rl.question('Enter Title: ', (title) => {
      rl.question('Enter Description: ', (desc) => {
        rl.question('Enter Keywords (comma separated): ', (kwString) => {
          rl.question('Enter Loopholes (comma separated): ', (lhString) => {
            
            // Format data
            let type = section.split(" ")[0] || "BNS";
            if (!["BNS", "BNSS", "BSA"].includes(type)) type = "BNS";

            const keywords = kwString.split(',').map(s => s.trim()).filter(s => s);
            const loopholes = lhString.split(',').map(s => s.trim()).filter(s => s);

            const newEntry = {
              section,
              title,
              description: desc,
              type,
              keywords,
              loopholes
            };

            // Read existing, append, write
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            
            // Check if exists and update or create
            const existingIdx = data.findIndex(d => d.section.toUpperCase() === section.toUpperCase());
            if (existingIdx >= 0) {
              data[existingIdx] = newEntry;
              console.log(`Updated existing section: ${section}`);
            } else {
              data.push(newEntry);
              console.log(`Added new section: ${section}`);
            }

            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            console.log('✅ Database saved successfully!');
            promptLaw(); // loop
          });
        });
      });
    });
  });
};

promptLaw();
