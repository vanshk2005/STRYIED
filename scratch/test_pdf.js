const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('BNS.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("Text length:", data.text.length);
    console.log("Info:", data.info);
    console.log("Metadata:", data.metadata);
    console.log("Pages:", data.numpages);
    // Let's see if there's any image info
    // console.log("Data keys:", Object.keys(data));
}).catch(err => {
    console.error(err);
});
