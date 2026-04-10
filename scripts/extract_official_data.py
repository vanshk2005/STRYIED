import PyPDF2
import json
import re
import os

def clean_text(text):
    # Remove obvious noise
    text = re.sub(r'--- PAGE \d+ ---', '', text)
    text = re.sub(r'xxxGID[HE]xxx', '', text)
    text = re.sub(r'सी.जी.-डी.एल.-अ.-[\d-]+', '', text)
    text = re.sub(r'CG-DL-E-[\d-]+', '', text)
    return text.strip()

def extract_bns(pdf_path):
    print("Parsing BNS Index and Body...")
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        index_text = ""
        for i in range(2, 15): # Pages 3-15
            index_text += reader.pages[i].extract_text() + "\n"
        
        body_text = ""
        for i in range(15, len(reader.pages)): # Pages 16+
            body_text += reader.pages[i].extract_text() + "\n"
            
    # Extract Titles from Index
    index_map = {}
    index_matches = re.finditer(r'^(\d+)\.\s*(.*?)\.\s*$', index_text, re.MULTILINE)
    for m in index_matches:
        index_map[m.group(1)] = m.group(2).strip()
    
    # Extract Body Content
    sections = []
    # Pattern: Digit + dot + whitespace + everything until next digit + dot
    body_matches = re.finditer(r'\n(\d+)\.\s*(.*?)(?=\n\d+\.\s*|\Z)', body_text, re.DOTALL)
    for m in body_matches:
        sec_num = m.group(1)
        content = m.group(2).strip().replace('\n', ' ')
        title = index_map.get(sec_num, "Title not found in index")
        
        # Strip title from content if it's there
        # Sometimes sections starts with Title + emdash + content
        content = re.sub(r'^[^\.\d]+––', '', content).strip()
        
        sections.append({
            "section": f"BNS {sec_num}",
            "title": title,
            "description": content,
            "type": "BNS",
            "keywords": ["bns", "law", "punishment"],
            "loopholes": generate_loopholes(content)
        })
    return sections

def extract_body_marginalia(pdf_path, act_type, start_page=0):
    print(f"Parsing {act_type} Body via Marginalia logic...")
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        full_text = ""
        for i in range(start_page, len(reader.pages)):
            full_text += reader.pages[i].extract_text() + "\n"
            
    full_text = clean_text(full_text)
    
    # Gazette sections look like: "2.(1) ..." or "2. Title. ..."
    # The marginal note often ends up at the end of the line.
    sections = []
    # Find all pattern SectionNum + dot + optional (1)
    # We split the text by section markers
    matches = re.split(r'\n(\d+)\.\s*(?=\(1\)|[A-Z])', full_text)
    # Result of split is [noise, num, content, num, content...]
    
    for i in range(1, len(matches), 2):
        sec_num = matches[i]
        content = matches[i+1].strip() if i+1 < len(matches) else ""
        content = content.replace('\n', ' ')
        
        # Marginal title extraction heuristic:
        # It's often at the end of the first paragraph, followed by a dot or capital letter.
        # Or it might be right at the start before (1)
        title = "Official Title"
        # Search for titles like "Short title." or "Definitions."
        title_search = re.search(r'([A-Z][a-z\s,]+)\.', content)
        if title_search:
            title = title_search.group(1).strip()
        
        sections.append({
            "section": f"{act_type} {sec_num}",
            "title": title,
            "description": content,
            "type": act_type,
            "keywords": [act_type.lower(), "official"],
            "loopholes": generate_loopholes(content)
        })
    return sections

def generate_loopholes(desc):
    desc_l = desc.lower()
    loopholes = []
    if 'bailable' in desc_l: loopholes.append("Bailable offense: Right to bail is statutory.")
    if 'non-bailable' in desc_l: loopholes.append("Non-bailable offense: Court discretion required for bail.")
    if 'cognizable' in desc_l: loopholes.append("Cognizable: Police can arrest without warrant. Pre-arrest strategies needed.")
    if 'summons' in desc_l: loopholes.append("Usually a less severe case; focus on procedural errors in summons service.")
    if 'summary' in desc_l: loopholes.append("Summary trial eligible: Faster resolution possible.")
    if not loopholes: loopholes.append("Procedural defenses apply; verify evidence chain of custody.")
    return list(set(loopholes))

if __name__ == "__main__":
    bns_sections = extract_bns('BNS.pdf')
    bnss_sections = extract_body_marginalia('BNSS.pdf', 'BNSS')
    bsa_sections = extract_body_marginalia('BSA.pdf', 'BSA')
    
    all_sections = bns_sections + bnss_sections + bsa_sections
    
    output_path = 'src/data/bns_dataset.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_sections, f, indent=2)
    
    print(f"Extraction Complete! Total Sections: {len(all_sections)}")
