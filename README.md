# Easy Tracker

> A modern, open-source issue tracker for individuals and small teams, built with FastAPI and React.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Project Status](https://img.shields.io/badge/status-in%20development-orange.svg)](#project-status)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)

Easy Tracker is a full-stack issue and task management application designed to make team collaboration simple, transparent, and efficient. It combines the practical workflow of a lightweight issue tracker with the architecture and developer experience of the official Full Stack FastAPI Template.

The project is being developed as a modern successor to a Flask-based issue tracker, with a FastAPI backend, a React frontend, typed APIs, role-aware collaboration, automated testing, and containerized deployment.

## Project Status

> [!IMPORTANT]
> Easy Tracker is currently in the planning and initial development stage. The architecture, features, API paths, and setup commands below describe the intended direction and may change while the first usable release is being built.

Current repository status:

- [x] Project scope and technical direction defined
- [x] Reference applications selected
- [ ] Full-stack project scaffold
- [ ] Authentication and user management
- [ ] Issue management API
- [ ] React user interface
- [ ] Sharing, permissions, and comments
- [ ] Automated tests and CI
- [ ] First development release

## Why Easy Tracker?

Many issue trackers are either too limited for team collaboration or too complex for small projects. Easy Tracker aims for a practical middle ground:

- Simple enough to start using quickly
- Structured enough for real team workflows
- Secure by default
- Easy to run locally with Docker
- Fully typed from database models to frontend API calls
- Extensible for future integrations and automation

## Planned Features

### Authentication and users

- User registration, sign-in, and sign-out
- Secure password hashing
- JWT-based authentication
- Profile and password management
- Password recovery by email
- Administrator and regular-user roles

### Issue management

- Create, view, edit, and delete issues
- Rich issue descriptions
- Configurable status and priority
- Assign issues to team members
- Track issue owners and collaborators
- Creation and update timestamps
- Issue progress tracking
- Search, filter, and sort issue lists

### Collaboration and permissions

- Share issues with other users
- Fine-grained permissions for shared issues
- Control who may update status or assignee
- Revoke shared access
- Add comments to issue discussions
- Record comment authors and timestamps

### User experience

- Responsive web interface
- Dashboard and issue list views
- Clear status and priority indicators
- Issue detail and activity views
- Light and dark themes
- Accessible reusable UI components
- Useful loading, empty, validation, and error states

### Engineering and operations

- Automatically generated frontend API client
- Interactive OpenAPI documentation
- Database migrations
- Backend unit and integration tests
- End-to-end browser tests
- Docker Compose for development and deployment
- Continuous integration with GitHub Actions
- Production-ready reverse proxy and HTTPS support

## Technology Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Backend API      | FastAPI, Python                 |
| Validation       | Pydantic                        |
| ORM              | SQLModel                        |
| Database         | PostgreSQL                      |
| Migrations       | Alembic                         |
| Authentication   | JWT and secure password hashing |
| Frontend         | React, TypeScript, Vite         |
| UI               | Tailwind CSS, shadcn/ui         |
| API client       | Generated from OpenAPI          |
| Backend tests    | Pytest                          |
| End-to-end tests | Playwright                      |
| Containers       | Docker, Docker Compose          |
| CI/CD            | GitHub Actions                  |
| Reverse proxy    | Traefik                         |

## Intended Architecture

```text
Browser
   |
   v
React + TypeScript frontend
   |
   | Generated typed API client
   v
FastAPI REST API
   |
   +-- Authentication and authorization
   +-- Issue and comment services
   +-- Sharing and permission rules
   |
   v
SQLModel / Alembic
   |
   v
PostgreSQL
```

The backend will expose a versioned REST API and remain responsible for authentication, authorization, validation, and business rules. The frontend will consume the generated OpenAPI client so request and response types stay synchronized with the API.

## Core Domain Model

### User

| Field             | Description                               |
| ----------------- | ----------------------------------------- |
| `id`              | Unique user identifier                    |
| `email`           | Unique sign-in address                    |
| `username`        | Public user name                          |
| `hashed_password` | Secure password hash                      |
| `is_active`       | Whether the account is active             |
| `is_superuser`    | Whether the user has administrator access |

### Issue

| Field         | Description                             |
| ------------- | --------------------------------------- |
| `id`          | Unique issue identifier                 |
| `title`       | Short issue summary                     |
| `description` | Detailed issue content                  |
| `status`      | Current workflow state                  |
| `priority`    | Relative urgency                        |
| `progress`    | Completion percentage or progress state |
| `owner_id`    | User who owns the issue                 |
| `assignee_id` | User responsible for the issue          |
| `created_at`  | Creation timestamp                      |
| `updated_at`  | Last update timestamp                   |

### Comment

| Field        | Description               |
| ------------ | ------------------------- |
| `id`         | Unique comment identifier |
| `issue_id`   | Related issue             |
| `author_id`  | Comment author            |
| `content`    | Comment body              |
| `created_at` | Creation timestamp        |

### IssueShare

| Field               | Description                       |
| ------------------- | --------------------------------- |
| `id`                | Unique sharing record identifier  |
| `issue_id`          | Shared issue                      |
| `user_id`           | User receiving access             |
| `can_edit_status`   | Permission to change issue status |
| `can_edit_assignee` | Permission to change the assignee |

The exact schema will be finalized during implementation and represented by database migrations.

## Planned API

The final API will be documented automatically through OpenAPI. The initial resource design is expected to include:

| Method   | Path                                   | Purpose              |
| -------- | -------------------------------------- | -------------------- |
| `POST`   | `/api/v1/login/access-token`           | Authenticate a user  |
| `GET`    | `/api/v1/users/me`                     | Get the current user |
| `GET`    | `/api/v1/issues`                       | List visible issues  |
| `POST`   | `/api/v1/issues`                       | Create an issue      |
| `GET`    | `/api/v1/issues/{id}`                  | Get issue details    |
| `PATCH`  | `/api/v1/issues/{id}`                  | Update an issue      |
| `DELETE` | `/api/v1/issues/{id}`                  | Delete an issue      |
| `GET`    | `/api/v1/issues/{id}/comments`         | List issue comments  |
| `POST`   | `/api/v1/issues/{id}/comments`         | Add a comment        |
| `POST`   | `/api/v1/issues/{id}/shares`           | Share an issue       |
| `DELETE` | `/api/v1/issues/{id}/shares/{user_id}` | Revoke shared access |

## Repository Layout

The planned layout follows the official Full Stack FastAPI Template:

```text
fastapi-issue-tracker/
├── backend/              # FastAPI application, models, services, and tests
├── frontend/             # React and TypeScript application
├── scripts/              # Development and deployment helpers
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Local and production services
├── .env.example          # Documented environment variables
├── README.md
└── LICENSE
```

## Getting Started

The runnable application scaffold has not yet been committed. Once the initial implementation lands, the intended local workflow will be:

### Prerequisites

- Git
- Docker and Docker Compose
- Python 3.10 or newer for backend development
- Node.js 20 or newer for frontend development

### Installation

```bash
git clone https://github.com/FastIssue-Team/fastapi-issue-tracker.git
cd fastapi-issue-tracker
```

After the application scaffold is added:

```bash
cp .env.example .env
docker compose up --build
```

Expected development services:

| Service         | Address                   |
| --------------- | ------------------------- |
| Web application | `http://localhost`        |
| Backend API     | `http://localhost/api/v1` |
| Swagger UI      | `http://localhost/docs`   |
| ReDoc           | `http://localhost/redoc`  |

The final ports and commands will be updated when Docker Compose configuration is available.

## Configuration

Secrets must not be committed to Git. The project is expected to provide an `.env.example` containing safe placeholders for settings such as:

```dotenv
PROJECT_NAME="Easy Tracker"
SECRET_KEY="replace-with-a-secure-random-value"
FIRST_SUPERUSER="admin@example.com"
FIRST_SUPERUSER_PASSWORD="replace-me"
POSTGRES_SERVER="db"
POSTGRES_DB="easy_tracker"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="replace-me"
```

Generate a secure secret with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Development

Development instructions will be expanded as the backend and frontend are introduced. The project intends to follow these conventions:

- Keep API schemas and database models explicitly typed.
- Put authorization checks in backend services, never only in the UI.
- Generate the frontend client from the backend OpenAPI schema.
- Add migrations for every database schema change.
- Add or update tests with each behavior change.
- Keep pull requests focused and document user-visible changes.

## Testing

The planned test suite includes:

```bash
# Backend tests
docker compose exec backend pytest

# Frontend checks
cd frontend
npm test

# End-to-end tests
npx playwright test
```

These commands will become active after the corresponding project components are committed.

## Roadmap

### Phase 1 — Foundation

- Scaffold the application from the Full Stack FastAPI Template
- Configure PostgreSQL, SQLModel, Alembic, and Docker Compose
- Establish formatting, linting, testing, and CI

### Phase 2 — Core issue tracking

- Implement authentication and user management
- Implement issue CRUD operations
- Add status, priority, assignee, and progress fields
- Build dashboard, list, create, edit, and detail pages

### Phase 3 — Collaboration

- Add comments and activity history
- Add issue sharing and fine-grained permissions
- Add search, filtering, sorting, and pagination

### Phase 4 — Quality and release

- Complete backend and end-to-end test coverage
- Improve accessibility and responsive behavior
- Document deployment and operational configuration
- Publish the first development release

Possible future additions include labels, attachments, notifications, project boards, audit logs, and third-party integrations. They are not part of the initial release unless added to the roadmap.

## Contributing

Contributions are welcome. Before submitting a change:

1. Open or select an issue describing the work.
2. Create a focused feature branch.
3. Add tests for new or changed behavior.
4. Run the relevant checks locally.
5. Submit a pull request with a clear description and screenshots for UI changes.

Please keep architectural proposals and large feature additions in a discussion or issue before implementation so the team can agree on scope and design.

## Inspiration and References

Easy Tracker draws inspiration from:

- [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) — application architecture, tooling, testing, and deployment conventions
- [OmarMashal0/issue-tracker](https://github.com/OmarMashal0/issue-tracker) — lightweight issue tracking, sharing, permissions, and comments

Easy Tracker is an independent implementation. Referenced projects remain subject to their respective licenses.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Thanks to the FastAPI community and the maintainers of the open-source projects that helped shape Easy Tracker's technical and product direction.
