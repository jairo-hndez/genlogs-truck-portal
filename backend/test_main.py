from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def assert_carriers_match(payload, expected):
    response = client.post("/search", json=payload)
    assert response.status_code == 200
    assert response.json() == expected


def test_search_nyc_to_dc_variations():
    expected = [
        {"name": "Knight-Swift Transport Services", "trucks_per_day": 10},
        {"name": "J.B. Hunt Transport Services Inc", "trucks_per_day": 7},
        {"name": "YRC Worldwide", "trucks_per_day": 5},
    ]

    # Different valid inputs for NYC → DC
    cases = [
        {"from_city": "New York", "to_city": "Washington DC"},
        {"from_city": "nueva york", "to_city": "washington dc"},
        {"from_city": "ny", "to_city": "washington dc"},
        {"from_city": "   NY   ", "to_city": "Washington DC"},  # extra spaces
        {"from_city": "NEW YORK", "to_city": "WASHINGTON dc"},  # upper case
    ]
    for payload in cases:
        assert_carriers_match(payload, expected)


def test_search_sf_to_la_variations():
    expected = [
        {"name": "XPO Logistics", "trucks_per_day": 9},
        {"name": "Schneider", "trucks_per_day": 6},
        {"name": "Landstar Systems", "trucks_per_day": 2},
    ]

    # Different valid inputs for SF → LA
    cases = [
        {"from_city": "San Francisco", "to_city": "Los Angeles"},
        {"from_city": "san francisco", "to_city": "la"},
        {"from_city": "SF", "to_city": "Los Angeles"},
        {"from_city": "sf", "to_city": "LA"},
        {"from_city": "  SF  ", "to_city": " los angeles "},  # spaces
    ]
    for payload in cases:
        assert_carriers_match(payload, expected)


def test_search_other_routes():
    expected = [
        {"name": "UPS Inc.", "trucks_per_day": 11},
        {"name": "FedEx Corp", "trucks_per_day": 9},
    ]

    cases = [
        {"from_city": "Chicago", "to_city": "Miami"},
        {"from_city": "Bogotá", "to_city": "Medellín"},  # Unicode chars
        {"from_city": "Paris", "to_city": "London"},
    ]
    for payload in cases:
        assert_carriers_match(payload, expected)


def test_search_reverse_order_not_matched():
    """NYC→DC works, but DC→NY should return default carriers."""
    expected_default = [
        {"name": "UPS Inc.", "trucks_per_day": 11},
        {"name": "FedEx Corp", "trucks_per_day": 9},
    ]
    payload = {"from_city": "Washington DC", "to_city": "New York"}
    assert_carriers_match(payload, expected_default)


def test_case_insensitivity_and_spaces():
    """Ensures mixed casing and extra spaces don't affect results."""
    payload = {"from_city": "   nEw   YoRk ", "to_city": "  WASHINGTON dc   "}
    response = client.post("/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["name"] == "Knight-Swift Transport Services"

