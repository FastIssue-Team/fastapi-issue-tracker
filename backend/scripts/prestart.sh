#! /usr/bin/env bash

set -e
set -x

# Let the DB start
python app/backend_pre_start.py

# #region agent log
python - <<'PY'
from app.core.debug_agent import agent_log, inspect_schema
try:
    schema = inspect_schema()
    agent_log("prestart.sh:before_migrate", "schema before alembic upgrade", schema, "A,B,C")
except Exception as e:
    agent_log("prestart.sh:before_migrate", "inspect failed", {"error": str(e)}, "E")
PY
# #endregion

# Run migrations
alembic upgrade head

# #region agent log
python - <<'PY'
from app.core.debug_agent import agent_log, inspect_schema
try:
    schema = inspect_schema()
    agent_log("prestart.sh:after_migrate", "schema after alembic upgrade", schema, "A,B,C")
except Exception as e:
    agent_log("prestart.sh:after_migrate", "inspect failed", {"error": str(e)}, "E")
PY
# #endregion

# Create initial data in DB
python app/initial_data.py
