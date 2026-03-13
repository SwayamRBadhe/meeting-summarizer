import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Labels for classification
LABELS = ["ACTION_ITEM", "DECISION", "DISCUSSION", "FOLLOW_UP"]

# Simple rule-based classifier
# (We use rules instead of training a model
#  so it works immediately without any dataset)
def classify_segments(sentences: list):
    """
    Classify each sentence into a category
    Returns: list of dicts with text and label
    """
    results = []

    for sentence in sentences:
        label = get_label(sentence)
        results.append({
            "text": sentence,
            "label": label
        })

    return results


def get_label(sentence: str) -> str:
    """
    Assign label based on keywords in sentence
    """
    s = sentence.lower()

    # Action item keywords
    action_words = [
        "will", "need to", "should",
        "must", "action", "assign",
        "todo", "going to", "responsible"
    ]

    # Decision keywords
    decision_words = [
        "decided", "agreed", "confirmed",
        "approved", "rejected", "finalized",
        "selected", "chose"
    ]

    # Follow up keywords
    followup_words = [
        "follow up", "next meeting", "pending",
        "waiting", "unclear", "tbc", "tbd",
        "next week", "later"
    ]

    if any(w in s for w in action_words):
        return "ACTION_ITEM"
    elif any(w in s for w in decision_words):
        return "DECISION"
    elif any(w in s for w in followup_words):
        return "FOLLOW_UP"
    else:
        return "DISCUSSION"