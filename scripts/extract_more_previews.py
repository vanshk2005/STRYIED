import PyPDF2

def extract_preview(pdf_path, text_path, max_pages=15):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            print(f"File: {pdf_path} | Total Pages: {num_pages}")
            
            with open(text_path, 'w', encoding='utf-8') as out:
                pages_to_read = min(num_pages, max_pages)
                for i in range(pages_to_read):
                    page = reader.pages[i]
                    out.write(f"--- PAGE {i+1} ---\n")
                    out.write(page.extract_text())
                    out.write("\n\n")
        print(f"Extracted preview to {text_path}")
    except Exception as e:
        print(f"Error {pdf_path}: {e}")

if __name__ == "__main__":
    extract_preview('BNSS.pdf', 'bnss_preview.txt')
    extract_preview('BSA.pdf', 'bsa_preview.txt')
