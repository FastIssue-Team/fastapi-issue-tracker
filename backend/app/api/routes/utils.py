from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser
from app.core.debug_agent import agent_log, inspect_schema
from app.models import Message
from app.utils import generate_test_email, send_email

router = APIRouter(prefix="/utils", tags=["utils"])


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")


@router.get("/health-check/")
async def health_check() -> bool:
    return True


@router.get("/debug-schema/")
def debug_schema() -> dict[str, Any]:
    """Temporary debug endpoint for session 7f7cc1 — remove after fix verified."""
    # #region agent log
    try:
        schema = inspect_schema()
        agent_log(
            "utils.py:debug_schema",
            "debug-schema endpoint hit",
            schema,
            hypothesis_id="A,B,C,D,E",
        )
        return schema
    except Exception as e:
        data = {"error": str(e), "error_type": type(e).__name__}
        agent_log(
            "utils.py:debug_schema",
            "debug-schema failed",
            data,
            hypothesis_id="E",
        )
        return data
    # #endregion
