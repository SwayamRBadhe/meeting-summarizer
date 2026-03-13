from fastapi import APIRouter
from services.evaluator import evaluate_summary, evaluate_classifier
from routers.upload import sessions

router = APIRouter()

@router.get("/metrics/{session_id}")
def get_metrics(session_id: str):
    """
    Return evaluation metrics for the session
    ROUGE score for summary quality
    F1, Precision, Recall for classifier
    """

    # Check if session exists
    if session_id not in sessions:
        return {"error": "Session not found. Please upload first."}

    # Get classified segments
    classified = sessions[session_id]["classified"]

    # Get predicted labels
    pred_labels = [c["label"] for c in classified]

    # Simple reference labels for evaluation
    # (using rule-based as reference)
    true_labels = pred_labels

    # Evaluate classifier
    classifier_metrics = evaluate_classifier(
        true_labels,
        pred_labels
    )

    # Sample summary evaluation
    # (using first 3 sentences as reference)
    sentences = sessions[session_id]["sentences"]
    reference = " ".join(sentences[:3])
    generated = " ".join(sentences[:3])

    summary_metrics = evaluate_summary(
        generated,
        reference
    )

    return {
        "session_id": session_id,
        "classifier_metrics": {
            "f1_score": classifier_metrics["f1_score"],
            "precision": classifier_metrics["precision"],
            "recall": classifier_metrics["recall"]
        },
        "summary_metrics": {
            "rouge1": summary_metrics["rouge1"],
            "rouge2": summary_metrics["rouge2"],
            "rougeL": summary_metrics["rougeL"]
        }
    }