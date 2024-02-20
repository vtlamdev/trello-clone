from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE
global_mode: GlobalMode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE
from main import app

def test_index():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "place"}