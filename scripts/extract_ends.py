import PyPDF2

def extract_end(pdf_path, text_path, last_n=10):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            start_page = max(0, num_pages - last_n)
            
            with open(text_path, 'w', encoding='utf-8') as out:
                for i in range(start_page, num_pages):
                    page = reader.pages[i]
                    out.write(f"--- PAGE {i+1} ---\n")
                    out.write(page.extract_text())
                    out.write("\n\n")
        print(f"Extracted end to {text_path}")
    except Exception as e:
        print(f"Error {pdf_path}: {e}")

if __name__ == "__main__":
    extract_end('BNSS.pdf', 'bnss_end.txt')
    extract_end('BSA.pdf', 'bsa_end.txt')
    extract_end('BNS.pdf', 'bns_end.txt')
