const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, '..', 'src', 'data', 'bns_dataset.json');
const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log(`Processing ${data.length} legal sections...`);

data.forEach(item => {
    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    const loopholes = [];

    // CATEGORY: MURDER / SERIOUS VIOLENCE
    if (title.includes('murder') || desc.includes('death') || title.includes('culpable homicide')) {
        loopholes.push("Ground for Bail: Parity. Check if co-accused with similar roles have been granted bail.");
        loopholes.push("Search for 'Lack of Motive' and 'Circumstantial Evidence' weaknesses.");
        loopholes.push("Anticipatory Bail: File under Section 482 BNSS if no overt act is assigned in FIR.");
        loopholes.push("Default Bail: If chargesheet not filed within 90 days (Section 187 BNSS).");
    }
    // CATEGORY: THEFT / ROBBERY / BURGLARY
    else if (title.includes('theft') || title.includes('robbery') || title.includes('burglary') || title.includes('extortion')) {
        loopholes.push("Strategy: Challenge recovery. If no stolen property found on person, argue for bail.");
        loopholes.push("Tip: If the accused was not caught on spot, argue for lack of TI Parade (Identification).");
        loopholes.push("Procedural: Argue that custodial interrogation is no longer required once recovery is done.");
    }
    // CATEGORY: FRAUD / CHEATING / FORGERY
    else if (title.includes('cheat') || title.includes('fraud') || title.includes('forge') || title.includes('document')) {
        loopholes.push("Strategy: Present the case as a 'Civil Dispute' arising from a contract breach.");
        loopholes.push("Ground for Bail: Documentary evidence is already with the police; no need for custody.");
        loopholes.push("Statutory: Section 480 BNSS - Argue that no physical violence is involved.");
    }
    // CATEGORY: MARITAL / WOMEN / SEXUAL
    else if (title.includes('wife') || title.includes('dowry') || desc.includes('modesty') || title.includes('rape') || title.includes('sexual')) {
        loopholes.push("Defense: Challenge delay in filing FIR (common in marital disputes).");
        loopholes.push("Special Provision: Section 480 BNSS allows special consideration for women.");
        loopholes.push("Anticipatory Bail: Highly recommended under Section 482 BNSS for family members.");
    }
    // CATEGORY: HURT / ASSAULT
    else if (title.includes('hurt') || title.includes('assault') || title.includes('force')) {
        loopholes.push("Medical: Cross-examine medical reports; if injuries are simple, bail is a matter of right.");
        loopholes.push("Bailable: Most simple hurt sections are bailable (Sec 478 BNSS).");
        loopholes.push("Defense: Argue 'Sudden Provocation' or 'Self Defense'.");
    }
    // CATEGORY: GENERAL / OTHER
    else {
        loopholes.push("Procedural loophole: Check for compliance with Section 35 BNSS (Arrest Memo/Notice).");
        loopholes.push("Ground for Bail: No prior criminal record (clean antecedents).");
        loopholes.push("Default Bail: Check if the 60/90 day period for chargesheet has expired (Sec 187 BNSS).");
    }

    item.loopholes = loopholes;
    
    // Also improve keywords while we're here
    item.keywords = [
        ...new Set([
            ...title.split(/\s+/).filter(w => w.length > 3),
            ...(item.type ? [item.type.toLowerCase()] : []),
            'legal', 'defense'
        ])
    ].slice(0, 10);
});

fs.writeFileSync(datasetPath, JSON.stringify(data, null, 2));
console.log('Bail strategies and loopholes updated successfully across the entire dataset!');
