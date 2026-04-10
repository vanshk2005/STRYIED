import re
import json
import os

RAW_FILE = 'bns_raw.txt'
DATA_FILE = 'src/data/bns_dataset.json'

print("⚖️ STRYIED Official Data Extractor")

if not os.path.exists(RAW_FILE):
    print(f"[ERROR] Could not find {RAW_FILE}. Please create this file and paste the official document text inside.")
    exit(1)

with open(RAW_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

# We look for patterns like: "Section 3. Definitions" OR "3. Punishment for..."
# Since legal text formats wildly, a general regex is built assuming:
# Number + Dot/Space + Title -> Description until next Number + Dot/Space
pattern = re.compile(r'\n(\d+)\.\s*(.*?)\n(.*?)(?=\n\d+\.\s*|\Z)', re.DOTALL)
matches = pattern.findall(text)

if not matches:
    print("[ERROR] Could not extract any sections using the generic heuristic. Ensure your text has formatting like '1. Title\\n Description...'.")
    exit(1)

data = []
for idx, match in enumerate(matches):
    sec_num = match[0].strip()
    title = match[1].strip()
    description = match[2].strip().replace('\n', ' ')

    # Dynamic BNS looping structure assignment
    prefix = "BNS"
    # Basic logic to split types based on massive section numbers (if combined txt)
    if int(sec_num) > 358:
        prefix = "BNSS"
    if int(sec_num) > (358 + 531):
        prefix = "BSA"

    # Specific Loophole Generation based on keyword heuristics
    loopholes = []
    desc_lower = description.lower()
    if 'bailable' in desc_lower:
        loopholes.append("Explicitly states it is a bailable offense. You have a statutory right to bail upon arrest.")
    if 'cognizable' in desc_lower:
        loopholes.append("Cognizable offense: Police can arrest without a warrant. Anticipatory bail prep is critical.")
    if 'death' in desc_lower or 'life imprisonment' in desc_lower:
        loopholes.append("Extremely severe punishment threshold. Standard bail will likely be rejected initially.")
    
    if not loopholes:
        loopholes.append("Procedural legal defenses depend strictly on evidence and schedule class.")

    data.append({
        "section": f"{prefix} {sec_num}",
        "title": title,
        "description": description,
        "type": prefix,
        "keywords": [prefix.lower(), "law", "official", title.lower()[:15]],
        "loopholes": list(set(loopholes))
    })

# Write safely
with open(DATA_FILE, 'w', encoding='utf-8') as df:
    json.dump(data, df, indent=2)

print(f"✅ Extracted {len(data)} Official Sections from the raw file! Update complete.")
