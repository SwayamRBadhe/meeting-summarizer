from rouge_score import rouge_scorer
from sklearn.metrics import (
    f1_score,
    precision_score,
    recall_score,
    classification_report
)

def evaluate_summary(generated: str, reference: str):
    """
    Evaluate summary quality using ROUGE score
    generated  = summary Gemini produced
    reference  = expected/reference summary
    """
    scorer = rouge_scorer.RougeScorer(
        ['rouge1', 'rouge2', 'rougeL'],
        use_stemmer=True
    )

    scores = scorer.score(reference, generated)

    return {
        "rouge1": round(scores['rouge1'].fmeasure, 4),
        "rouge2": round(scores['rouge2'].fmeasure, 4),
        "rougeL": round(scores['rougeL'].fmeasure, 4)
    }


def evaluate_classifier(true_labels: list, pred_labels: list):
    """
    Evaluate ML classifier using F1, Precision, Recall
    true_labels = actual correct labels
    pred_labels = labels our classifier predicted
    """
    return {
        "f1_score": round(
            f1_score(true_labels, pred_labels,
                     average='weighted'), 4),
        "precision": round(
            precision_score(true_labels, pred_labels,
                            average='weighted'), 4),
        "recall": round(
            recall_score(true_labels, pred_labels,
                         average='weighted'), 4),
        "report": classification_report(
            true_labels, pred_labels)
    }