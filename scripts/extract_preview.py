import PyPDF2
import json

def extract_text(pdf_path, text_path, max_pages=None):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            print(f"Total Pages: {num_pages}")
            
            with open(text_path, 'w', encoding='utf-8') as out:
                pages_to_read = min(num_pages, max_pages) if max_pages else num_pages
                for i in range(pages_to_read):
                    page = reader.pages[i]
                    out.write(f"--- PAGE {i+1} ---\n")
                    out.write(page.extract_text())
                    out.write("\n\n")
        print(f"Extracted text to {text_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Extract first 30 pages to find index and early sections
    extract_text('BNS.pdf', 'bns_preview.txt', max_pages=30)
