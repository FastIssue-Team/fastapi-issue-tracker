# Easy Tracker

> A modern, open-source issue tracker with collaboration, due-date calendars, and multi-account switching, built with FastAPI and React.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Project Status](https://img.shields.io/badge/status-active%20development-brightgreen.svg)](#project-status)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Live Demo](https://img.shields.io/badge/demo-live-blueviolet?logo=railway&logoColor=white)](https://frontend-production-3125.up.railway.app)

Easy Tracker is an open-source issue-tracking application built with FastAPI, React, PostgreSQL, and Docker.

The project is a modernized version of an earlier Flask-based issue tracker. It provides authentication, issue management, assignment, sharing, comments, progress tracking, due-date calendar views, and fast multi-account switching in a typed full-stack architecture.

Repository: https://github.com/FastIssue-Team/fastapi-issue-tracker

## Project Status

The main full-stack foundation, core issue-tracking workflow, due-date calendar, and multi-account switching features have been completed.

Completed work includes:

- [x] FastAPI backend
- [x] React frontend
- [x] PostgreSQL database
- [x] SQLModel and Alembic migrations
- [x] Docker Compose development environment
- [x] User authentication and account management
- [x] Issue creation, viewing, editing, and deletion
- [x] Issue status, priority, and progress tracking
- [x] Issue assignment
- [x] Issue sharing and permissions
- [x] Issue comments
- [x] Optional issue due dates
- [x] Dashboard calendar
- [x] Display issues on their corresponding deadline dates
- [x] Save multiple Easy Tracker accounts
- [x] Fast switching between saved accounts
- [x] Predefined and custom account tags
- [x] Account color customization
- [x] Active-account identification
- [x] Backend automated tests
- [x] Playwright end-to-end tests
- [x] Pre-commit checks
- [x] GitHub Actions continuous integration
- [x] Production deployment on Railway

The repository is runnable from the `main` branch, and the main issue-management, calendar, and account-switching workflows function end to end.

## Why Easy Tracker?

Many issue trackers are either too limited for team collaboration or too complex for small projects. Easy Tracker aims for a practical middle ground:

- Simple enough to start using quickly
- Structured enough for real team workflows
- Secure by default
- Easy to run locally with Docker
- Fully typed from database models to frontend API calls
- Extensible for future integrations and automation

## Major Additions by the FastIssue Team

The FastIssue Team extended the migrated issue tracker with two major user-facing features:

### Due-date calendar

Issues can now include optional due dates and appear on a dashboard calendar on their corresponding deadline dates. The calendar reuses the existing issue visibility and permission model so users only see issues they are authorized to access.

### Multi-account switching

Users can save and quickly switch between multiple Easy Tracker accounts without repeatedly completing the full logout and login workflow. Saved accounts can be labeled with predefined or custom tags and assigned distinct colors for easier identification.

The team also improved the user interface, documentation, deployment workflow, automated testing, and open-source attribution.

## Features

### Authentication and users

- User registration
- User sign-in and sign-out
- Secure password hashing
- JWT-based authentication
- User profile management
- Administrator and regular-user roles

### Issue management

- Create, view, edit, and delete issues
- Set issue status
- Set issue priority
- Assign issues to users
- Track issue progress
- View issue creation and update information

### Calendar and due dates

- Add an optional due date to an issue
- Edit or clear an existing due date
- View issues with deadlines on the dashboard calendar
- Display each issue on its corresponding deadline date
- Navigate between calendar date ranges
- Apply existing issue visibility and permission rules to calendar results
- Refresh calendar data after issue updates

### Multi-account switching

- Save multiple Easy Tracker accounts
- Switch between saved accounts without repeating the full logout and login process
- Assign predefined tags such as `Work`, `Personal`, or `Company`
- Create custom account tags
- Assign a distinct color to each saved account
- Clearly indicate the currently active account
- Edit or remove saved account profiles
- Reload account-specific issue, calendar, permission, and profile data after switching

### Collaboration

- Share issues with other users
- Control issue access through backend permission rules
- Add comments to issues
- Assign responsibility for an issue
- Allow authorized users to update issue information

### Development and quality

- Docker-based local development
- PostgreSQL database persistence
- Alembic database migrations
- Backend automated tests
- Playwright end-to-end tests
- Pre-commit formatting and quality checks
- GitHub Actions continuous integration

### User experience

- Responsive web interface
- Issue list with filters and an issue detail view
- Dashboard calendar for deadline-based issues
- Fast multi-account switcher
- Account tags, colors, and active-account indicators
- Clear status, priority, progress, and due-date information
- Inline editing of status and assignee (permission-aware)
- Light and dark themes
- Accessible, reusable UI components (shadcn/ui)
- Loading, empty, validation, and error states

### Engineering and operations

- Automatically generated, fully typed frontend API client
- Interactive OpenAPI documentation (Swagger UI and ReDoc)
- Database migrations with Alembic
- Backend unit and integration tests (Pytest)
- End-to-end browser tests (Playwright)
- Docker Compose for development and deployment
- Continuous integration with GitHub Actions
- Production deployment on Railway, with Traefik/HTTPS support for self-hosting

## Technology Stack

### Backend

- FastAPI
- Python
- SQLModel
- PostgreSQL
- Alembic
- Pydantic
- JWT authentication

### Frontend

- React
- TypeScript
- Vite
- Generated API client

### Development and testing

- Docker
- Docker Compose
- Pytest
- Playwright
- Pre-commit
- GitHub Actions

## Architecture

Easy Tracker uses a separated full-stack architecture:

- The FastAPI backend provides authentication, issue-management APIs, authorization rules, and database access.
- The React frontend provides the user interface for authentication, issue management, collaboration, and progress tracking.
- PostgreSQL stores users, issues, comments, sharing relationships, and related application data.
- SQLModel defines typed database models and API schemas.
- Alembic manages database schema migrations.
- Docker Compose provides a consistent local development environment.
- GitHub Actions runs automated quality checks and tests.
- The calendar workflow uses issue due dates and existing permission rules to display only issues visible to the active user.
- The multi-account workflow stores account-specific session metadata and refreshes protected application data whenever the active account changes.
The backend exposes a versioned REST API and is responsible for authentication, authorization, validation, and business rules. The frontend consumes the generated OpenAPI client so request and response types stay synchronized with the API. Access control (owner vs. shared vs. superuser) is centralized in `backend/app/core/permissions.py` and enforced on every issue, comment, and share route.

## Core Domain Model

### User

| Field             | Description                               |
| ----------------- | ------------------------------------------ |
| `id`              | Unique user identifier                     |
| `email`           | Unique sign-in address                     |
| `full_name`       | Optional display name                      |
| `hashed_password` | Secure password hash                       |
| `is_active`       | Whether the account is active              |
| `is_superuser`    | Whether the user has administrator access  |

### Issue

| Field | Description |
| --- | --- |
| `id` | Unique issue identifier |
| `title` | Short issue title |
| `description` | Detailed issue description |
| `status` | Current issue workflow status |
| `priority` | Issue urgency or importance |
| `owner_id` | User who created or owns the issue |
| `assignee_id` | User assigned to the issue |
| `due_date` | Optional issue deadline used by the dashboard calendar |
| `created_at` | Issue creation timestamp |
| `updated_at` | Most recent update timestamp |


### Comment

| Field        | Description               |
| ------------ | -------------------------- |
| `id`         | Unique comment identifier |
| `issue_id`   | Related issue              |
| `author_id`  | Comment author             |
| `content`    | Comment body                |
| `created_at` | Creation timestamp          |

### IssueShare

| Field               | Description                        |
| ------------------- | ------------------------------------ |
| `id`                | Unique sharing record identifier    |
| `issue_id`          | Shared issue                        |
| `user_id`           | User receiving access               |
| `can_edit_status`   | Permission to change issue status   |
| `can_edit_assignee` | Permission to change the assignee   |

Deleting an issue cascades to its comments and shares; deleting a user cascades to issues they own and shares granted to them, while leaving issues they were merely assigned to intact (`assignee_id` is set to `NULL`). See the migrations in `backend/app/alembic/versions/` for the exact schema.

## API

The full API is documented automatically through OpenAPI at `/docs` (Swagger UI) and `/redoc` (ReDoc). Key resources:

| Method   | Path                                   | Purpose                                              |
| -------- | --------------------------------------- | --------------------------------------------------- |
| `POST`   | `/api/v1/login/access-token`           | Authenticate a user                                  |
| `POST`   | `/api/v1/users/signup`                 | Register a new account                               |
| `GET`    | `/api/v1/users/me`                     | Get the current user                                 |
| `GET`    | `/api/v1/users/lookup?email=`          | Look up a user by email (for assign/share)           |
| `GET`    | `/api/v1/issues`                       | List issues owned by or shared with the current user |
| `POST`   | `/api/v1/issues`                       | Create an issue                                      |
| `GET`    | `/api/v1/issues/{id}`                  | Get issue details plus the caller's permissions      |
| `PUT`    | `/api/v1/issues/{id}`                  | Update an issue (permission-aware field restrictions)|
| `DELETE` | `/api/v1/issues/{id}`                  | Delete an issue (owner or superuser only)            |
| `GET`    | `/api/v1/issues/{id}/comments`         | List issue comments                                  |
| `POST`   | `/api/v1/issues/{id}/comments`         | Add a comment                                        |
| `GET`    | `/api/v1/issues/{id}/shares`           | List who an issue is shared with (owner only)        |
| `POST`   | `/api/v1/issues/{id}/shares`           | Share an issue by email (owner only)                 |
| `DELETE` | `/api/v1/issues/{id}/shares/{user_id}` | Revoke shared access (owner only)                    |
| `GET`    | `/api/v1/issues/calendar`              | List visible issues within a requested date range    |
The dashboard calendar uses issue due-date data returned by the issue API and applies the same ownership, sharing, and permission rules as the issue list.

## Repository Layout

```text
fastapi-issue-tracker/
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/routes/     # login, users, issues route modules
│   │   ├── core/           # config, security, permissions
│   │   ├── alembic/        # database migrations
│   │   └── models.py       # SQLModel tables and API schemas
│   ├── tests/               # Pytest suite
│   └── scripts/             # prestart, lint, format, test helpers
├── frontend/                # React + TypeScript application
│   ├── src/
│   │   ├── client/          # generated OpenAPI client (types + SDK)
│   │   ├── components/      # Issues, calendar, account switcher, sidebar, and reusable UI
│   │   └── routes/          # TanStack Router file-based routes
│   └── tests/                # Playwright end-to-end tests
├── scripts/                  # Repo-wide dev/test/deploy helpers
├── docs/                      # Design notes and migration plan
├── .github/workflows/         # CI: backend tests, Playwright, pre-commit
├── compose.yml                 # Local/production service definitions
├── compose.override.yml        # Local development overrides (Traefik, hot reload)
├── deployment.md / development.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── .env.example                 # Documented environment variables
├── README.md
└── LICENSE
```

## Getting Started

### Prerequisites

- Git
- Docker and Docker Compose
- [uv](https://docs.astral.sh/uv/) for backend Python dependency management
- [bun](https://bun.sh/) for frontend dependency management (or Node.js 20+ with npm)

### Installation

```bash
git clone https://github.com/FastIssue-Team/fastapi-issue-tracker.git
cd fastapi-issue-tracker
cp .env.example .env
```

Edit `.env` and set at least `SECRET_KEY`, `FIRST_SUPERUSER`, and `FIRST_SUPERUSER_PASSWORD` (see [Configuration](#configuration)).

Start the full stack with Docker Compose:

```bash
docker compose watch
```

Development services:

| Service              | Address                          |
| -------------------- | ---------------------------------- |
| Frontend             | `http://localhost:5173`            |
| Backend API          | `http://localhost:8000`            |
| Swagger UI           | `http://localhost:8000/docs`       |
| ReDoc                | `http://localhost:8000/redoc`      |
| Adminer (DB admin)   | `http://localhost:8080`            |
| Traefik dashboard    | `http://localhost:8090`            |
| MailCatcher          | `http://localhost:1080`            |

See [development.md](development.md) for the full local development guide, including running the backend and frontend outside Docker.

### Contributor quick start

1. Clone the repo and copy `.env.example` to `.env`.
2. Start the stack with `docker compose watch`.
3. Run backend tests with `cd backend && uv run pytest`.
4. Run frontend end-to-end tests with `cd frontend && bun run test`.
5. Read [development.md](development.md) for day-to-day workflow details.
6. Follow [CONTRIBUTING.md](CONTRIBUTING.md) for issue → branch → PR expectations.
7. Review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

### Backend only (without Docker)

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run fastapi dev app/main.py
```

### Frontend only (without Docker)

```bash
cd frontend
bun install
bun run generate-client   # regenerate the API client after backend schema changes
bun run dev
```

## Configuration

Secrets must not be committed to Git; `.env` is git-ignored. `.env.example` documents every variable, including:

```dotenv
PROJECT_NAME="FastAPI Issue Tracker"
SECRET_KEY="replace-with-a-secure-random-value"
FIRST_SUPERUSER="admin@example.com"
FIRST_SUPERUSER_PASSWORD="replace-me"
POSTGRES_SERVER="localhost"
POSTGRES_DB="app"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="replace-me"
BACKEND_CORS_ORIGINS="http://localhost,http://localhost:5173"
FRONTEND_HOST="http://localhost:5173"
```

Generate a secure secret with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Development

The project follows these conventions:

- Keep API schemas and database models explicitly typed (SQLModel + Pydantic).
- Put authorization checks in backend services (`app/core/permissions.py`), never only in the UI.
- Regenerate the frontend client from the backend OpenAPI schema after any API change (`bash scripts/generate-client.sh`).
- Add an Alembic migration for every database schema change.
- Add or update tests with each behavior change.
- Keep pull requests focused and document user-visible changes.

Linting and formatting are handled by `prek` (backend: ruff; frontend: biome) and run automatically before each commit once installed — see [development.md](development.md#pre-commits-and-code-linting).

## Testing

```bash
# Backend tests
cd backend
uv run pytest

# Frontend end-to-end tests (spins up the app via Playwright config)
cd frontend
bun run test

# Full stack test run via Docker Compose (used in CI)
bash scripts/test.sh
```

CI runs the backend test suite, Playwright end-to-end tests, and pre-commit checks on every pull request (see `.github/workflows/`).

## Deployment

The application is deployed on [Railway](https://railway.com/), with the backend and frontend as separate services sharing a managed PostgreSQL database. See [deployment.md](deployment.md) for the general Docker/Traefik-based deployment guide this project builds on.

When deploying schema changes, make sure the backend service's start command runs migrations before serving traffic, e.g.:

```bash
bash scripts/prestart.sh && fastapi run --workers 4
```

## Roadmap

### Phase 1 — Foundation ✅

- Scaffold the application from the Full Stack FastAPI Template
- Configure PostgreSQL, SQLModel, Alembic, and Docker Compose
- Establish formatting, linting, testing, and CI

### Phase 2 — Core issue tracking ✅

- Implement authentication and user management
- Implement issue CRUD operations
- Add status, priority, progress, and assignee fields
- Build list, create, edit, and detail pages

### Phase 3 — Collaboration ✅

- Add comments
- Add issue sharing and fine-grained permissions
- Add filtering by status, priority, and assignee

### Phase 4 — Due dates and calendar ✅

- Add optional due dates to issues
- Add due-date controls to issue forms
- Display deadline-based issues on the dashboard calendar
- Show issues on their corresponding deadline dates
- Apply visibility and permission rules to calendar data

### Phase 5 — Multi-account switching ✅

- Save multiple Easy Tracker accounts
- Switch between saved accounts
- Add predefined and custom account tags
- Assign account colors
- Clearly indicate the active account
- Reload account-specific issue and calendar data after switching

### Phase 6 — Quality and future improvements

- Expand accessibility and responsive-behavior coverage
- Improve search and sorting for the issue list
- Add pagination controls to the UI
- Expand automated test coverage
- Improve documentation and demonstration materials

Possible future additions include labels, attachments, notifications, project boards, audit logs, and third-party integrations. They are not part of the current release unless added to the roadmap above.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a change.

Before opening a pull request:

1. Open or select an issue describing the work.
2. Create a focused feature branch.
3. Add tests for new or changed behavior.
4. Run the relevant checks locally (`uv run pytest`, `bun run test`, `uv run prek run --all-files`).
5. Submit a pull request with a clear description and screenshots for UI changes.
6. For account-switching changes, verify that data from the previous account is cleared before loading the newly active account.
7. Do not use color as the only way to identify an account or application state.

Please keep architectural proposals and large feature additions in an issue before implementation so the team can agree on scope and design.

## Inspiration and References

Easy Tracker draws inspiration from:

- [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) — application architecture, tooling, testing, and deployment conventions
- [OmarMashal0/issue-tracker](https://github.com/OmarMashal0/issue-tracker) — lightweight issue tracking, sharing, permissions, and comments

Easy Tracker builds on and adapts open-source project structures and ideas while adding substantial new implementation, features, and documentation. Referenced projects remain subject to their respective licenses.

## Attribution

Easy Tracker was migrated from an earlier Flask-based issue tracker and uses components adapted from the Full Stack FastAPI Template.

Relevant third-party license and attribution information is available in:

- `THIRD_PARTY_NOTICES.md`
- the `licenses/` directory
- the repository's main license file

All imported and adapted code must retain the applicable upstream license notices.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Thanks to the FastAPI community and the maintainers of the open-source projects that helped shape Easy Tracker's technical and product direction.
