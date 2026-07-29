"""Temporary debug helpers for session 7f7cc1. Remove after verified fix."""
from __future__ import annotations

import json
import logging
import time
import urllib.request
from typing import Any

from sqlalchemy import text
from sqlmodel import Session

from app.core.db import engine

_LOG_PATHS = (
    "/home/lyz/COMS4995/project/.cursor/debug-7f7cc1.log",
    "/tmp/debug-7f7cc1.log",
)
_INGEST = "http://127.0.0.1:7296/ingest/0ac29c1d-75b8-4e75-b8d0-77262822d720"
_logger = logging.getLogger("agent_dbg")


def agent_log(
    location: str,
    message: str,
    data: dict[str, Any],
    hypothesis_id: str,
    run_id: str = "pre-fix",
) -> None:
    # #region agent log
    payload = {
        "sessionId": "7f7cc1",
        "runId": run_id,
        "hypothesisId": hypothesis_id,
        "location": location,
        "message": message,
        "data": data,
        "timestamp": int(time.time() * 1000),
    }
    line = json.dumps(payload, default=str)
    for path in _LOG_PATHS:
        try:
            with open(path, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        except Exception:
            pass
    try:
        req = urllib.request.Request(
            _INGEST,
            data=line.encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "7f7cc1",
            },
            method="POST",
        )
        urllib.request.urlopen(req, timeout=1)
    except Exception:
        pass
    _logger.warning("AGENT_DBG %s", line)
    # #endregion


def inspect_schema() -> dict[str, Any]:
    # #region agent log
    with Session(engine) as session:
        rows = session.execute(
            text(
                "SELECT tablename FROM pg_tables "
                "WHERE schemaname = 'public' ORDER BY tablename"
            )
        ).all()
        table_names = [r[0] for r in rows]
        alembic_version = None
        alembic_error = None
        if "alembic_version" in table_names:
            try:
                row = session.execute(
                    text("SELECT version_num FROM alembic_version")
                ).first()
                alembic_version = row[0] if row else None
            except Exception as e:
                alembic_error = str(e)
        else:
            alembic_error = "alembic_version table missing"
        return {
            "tables": table_names,
            "has_issue": "issue" in table_names,
            "has_item": "item" in table_names,
            "has_comment": "comment" in table_names,
            "has_issueshare": "issueshare" in table_names,
            "alembic_version": alembic_version,
            "alembic_error": alembic_error,
            "expected_head": "7d3f9a1c5e2b",
        }
    # #endregion
