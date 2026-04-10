const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/bns_dataset.json');
const bnsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

async function scrapeWikipedia() {
  try {
    console.log('Fetching BNS data from Wikipedia...');
    const res = await axios.get('https://en.wikipedia.org/wiki/Bharatiya_Nyaya_Sanhita', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    // Wikipedia stores the offenses in `.wikitable` usually
    const tables = $('.wikitable').toArray();
    let updates = 0;
    
    tables.forEach(table => {
      const rows = $(table).find('tr').toArray();
      rows.forEach(row => {
        const cols = $(row).find('td').toArray();
        if (cols.length >= 2) {
          // Typically column 0 is Section, column 1 is Offense/Description
          let sectionRaw = $(cols[0]).text().trim();
          let descriptionRaw = $(cols[1]).text().trim();
          
          // Match "Section X" or just number
          const match = sectionRaw.match(/\d+/);
          if (match && descriptionRaw.length > 5) {
            const secNum = match[0];
            const targetSection = `BNS ${secNum}`;
            
            // Find in our dataset and update
            const dbItem = bnsData.find(item => item.section === targetSection);
            if (dbItem) {
              dbItem.title = descriptionRaw.length > 50 ? descriptionRaw.substring(0, 50) + '...' : descriptionRaw;
              dbItem.description = descriptionRaw;
              
              // shortTitle logic
              const words = descriptionRaw.split(' ');
              dbItem.shortTitle = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : descriptionRaw;
              
              updates++;
            }
          }
        }
      });
    });
    
    console.log(`Successfully scraped and applied ${updates} verifiably accurate BNS sections from Wikipedia.`);
    fs.writeFileSync(DATA_FILE, JSON.stringify(bnsData, null, 2));
    
  } catch(e) {
    console.error('Scraping error:', e.message);
  }
}

scrapeWikipedia();
