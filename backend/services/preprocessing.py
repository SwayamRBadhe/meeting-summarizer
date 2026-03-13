import re
import nltk

# Download required nltk data
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)

from nltk.tokenize import sent_tokenize

# Common filler words to remove
FILLER_WORDS = [
    "um", "uh", "like", "you know", "basically",
    "literally", "actually", "i mean", "sort of",
    "kind of", "right", "okay so"
]

def clean_text(raw_text: str):
    """
    Clean raw transcript text and split into sentences
    """
    # Lowercase
    text = raw_text.lower()

    # Remove filler words
    for filler in FILLER_WORDS:
        text = re.sub(rf'\b{filler}\b', '', text)

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    # Split into sentences
    sentences = sent_tokenize(text)

    # Remove very short sentences (less than 5 words)
    sentences = [s.strip() for s in sentences if len(s.split()) >= 5]

    return sentences