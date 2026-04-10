import json
from transformers import pipeline


with open('ipc_crpc_sections.json', 'r') as f:
    sections_data = json.load(f)


legal_strategies = [
    "seek plea bargain",
    "prove self-defense",
    "claim mental instability",
    "show lack of intent",
    "return stolen items",
    "cooperate with authorities",
    "challenge evidence",
    "prove false accusation",
    "negotiate settlement",
    "first-time offense",
    "argue for reduced sentencing based on remorse",
    "highlight rehabilitation efforts",
    "prove provocation",
    "show lack of premeditation",
    "request reduced charges based on the circumstances",
    "demonstrate clean record",
    "showing evidence of duress",
    "request for lesser punishment due to age or health condition",
    "assert that the offense was a result of societal pressure",
    "appeal for leniency based on personal hardship",
    "argue that the offense was a mistake or misjudgment",
    "request community service instead of incarceration",
    "demonstrate the absence of prior criminal intent",
    "offer restitution or compensation to the victim",
    "request a probationary sentence instead of jail time"
]


classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")


def find_ipc_crpc_sections(text):
    found_sections = []
    for entry in sections_data:
        
        if 'keywords' in entry and isinstance(entry['keywords'], list):
            for keyword in entry['keywords']:
                if keyword.lower() in text.lower():
                    found_sections.append((entry['section'], entry['title'], entry['description']))
                    break  
        else:
            print(f"Warning: 'keywords' key missing or incorrectly formatted in section {entry.get('section', 'Unknown')}")
    
    return found_sections


def get_legal_suggestions(text):
    result = classifier(text, legal_strategies)
    top_suggestions = result["labels"][:3]
    top_scores = result["scores"][:3]
    return list(zip(top_suggestions, top_scores))


def main():
    print(" Legal Case NLP Assistant")
    case_text = input(" Enter a short case summary or keyword describing the crime:\n> ")

    print("\n Matching IPC/CrPC Sections:")
    ipc_crpc_sections = find_ipc_crpc_sections(case_text)
    if ipc_crpc_sections:
        for section, title, description in ipc_crpc_sections:
            print(f" {section} - {title}: {description}")
    else:
        print(" No IPC/CrPC section matched. Try being more descriptive.")

    print("\n Suggested Legal Strategies to Reduce Sentence:")
    suggestions = get_legal_suggestions(case_text)
    for label, score in suggestions:
        print(f" {label} (confidence: {score:.2f})")

if __name__ == "__main__":
    main()
