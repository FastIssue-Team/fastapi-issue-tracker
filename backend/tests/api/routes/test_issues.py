import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.issue import create_random_issue
from tests.utils.user import create_random_user


def test_create_issue(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/issues/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["status"] == "Open"
    assert content["priority"] == 3
    assert "id" in content
    assert "owner_id" in content


def test_create_issue_with_status_priority_assignee(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    assignee = create_random_user(db)
    data = {
        "title": "Foo",
        "status": "In Progress",
        "priority": 1,
        "assignee_id": str(assignee.id),
    }
    response = client.post(
        f"{settings.API_V1_STR}/issues/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["status"] == "In Progress"
    assert content["priority"] == 1
    assert content["assignee_id"] == str(assignee.id)


def test_read_issue(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    response = client.get(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == issue.title
    assert content["description"] == issue.description
    assert content["id"] == str(issue.id)
    assert content["owner_id"] == str(issue.owner_id)
    assert content["is_owner"] is True
    assert content["can_edit_status"] is True
    assert content["can_edit_assignee"] is True


def test_read_issue_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/issues/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Issue not found"


def test_read_issue_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    response = client.get(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_read_issues(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_issue(db)
    create_random_issue(db)
    response = client.get(
        f"{settings.API_V1_STR}/issues/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_read_issues_filters_by_status_and_priority(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    client.put(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=superuser_token_headers,
        json={"status": "Done", "priority": 5},
    )

    response = client.get(
        f"{settings.API_V1_STR}/issues/",
        headers=superuser_token_headers,
        params={"status": "Done", "priority": 5},
    )
    assert response.status_code == 200
    content = response.json()
    assert any(item["id"] == str(issue.id) for item in content["data"])
    assert all(item["status"] == "Done" for item in content["data"])
    assert all(item["priority"] == 5 for item in content["data"])


def test_read_issues_only_shows_owned_and_shared_for_normal_user(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    other_users_issue = create_random_issue(db)
    response = client.get(
        f"{settings.API_V1_STR}/issues/",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    returned_ids = {item["id"] for item in content["data"]}
    assert str(other_users_issue.id) not in returned_ids


def test_update_issue(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["id"] == str(issue.id)
    assert content["owner_id"] == str(issue.owner_id)


def test_update_issue_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/issues/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Issue not found"


def test_update_issue_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403


def test_delete_issue(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    response = client.delete(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Issue deleted successfully"


def test_delete_issue_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/issues/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Issue not found"


def test_delete_issue_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    issue = create_random_issue(db)
    response = client.delete(
        f"{settings.API_V1_STR}/issues/{issue.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
