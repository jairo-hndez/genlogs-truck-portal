# Genlogs Truck Portal

A full-stack application that enables users to search for trucking carriers operating between two cities, visualize possible driving routes on a map, and display top carriers per route.  

This project is designed as a **React frontend** consuming a **FastAPI backend** API, with Google Maps integration for location search and route visualization.

---

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Backend Design](#backend-design)
- [Frontend Design](#frontend-design)
- [Database & Data Model](#database--data-model)
- [Implementation Choices](#implementation-choices)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## Architecture Overview

This application follows a **client–server architecture** with a clean separation between frontend and backend layers:

- **Frontend (React)**:  
  - Provides an interface for selecting source and destination cities (Google Places Autocomplete).
  - Displays a map of possible driving routes between the cities.
  - Shows a list of carriers operating the given route.

- **Backend (FastAPI)**:  
  - Receives city search requests.
  - Normalizes city names using a canonicalization mapping (handles aliases, casing, and spacing).
  - Returns carriers for known routes, or default carriers otherwise.
  - Designed to be stateless and easily deployable (Railway-compatible).

- **External APIs**:  
  - Google Maps JavaScript API (`places` and `directions` libraries) is used for autocomplete and route drawing.

```

\[ React Client ]  ⇄  \[ FastAPI API ]  ⇄  \[ In-Memory Carrier Data ]
↑                   ↓
Google Maps API (Autocomplete & Directions)

````

---

## Backend Design

**Framework:** [FastAPI](https://fastapi.tiangolo.com/) — chosen for its speed, modern syntax, and built-in validation.

### Endpoints
| Method | Path       | Description |
|--------|-----------|-------------|
| GET    | `/`        | Health check |
| POST   | `/search`  | Returns list of carriers for the given route |

### Request Model
```json
{
  "from_city": "New York",
  "to_city": "Washington DC"
}
````

### Response Model

```json
[
  {
    "name": "Knight-Swift Transport Services",
    "trucks_per_day": 10
  }
]
```

### City Normalization

To handle variations in user input (e.g., `"ny"`, `"Nueva York"`, `" NEW YORK "`), all cities are:

1. Trimmed of whitespace.
2. Converted to lowercase.
3. Mapped to a **canonical city name** via an alias dictionary.

### Route Matching Logic

* If `(from_city, to_city)` exists in predefined `routes` dictionary → return specific carriers.
* Otherwise → return default carriers (`UPS`, `FedEx`).

---

## Frontend Design

**Framework:** [React](https://reactjs.org/) — chosen for modularity and interactive UI needs.

### Main Components

1. **`CitySearchForm`**

   * Uses Google Places Autocomplete to suggest cities.
   * Validates that both origin and destination are selected.
   * Calls backend `/search` on submit.

2. **`MapView`**

   * Displays Google Maps.
   * Draws up to **3 alternative driving routes** between origin and destination.
   * Uses distinct colors for each route.

3. **`CarrierList`**

   * Displays carriers returned by the backend in a clean list format.

4. **`App`**

   * Manages global state for selected route and carriers.
   * Handles API communication and error management.

---

## Database & Data Model

**Note:** This project currently uses **in-memory data** instead of a persistent database.

### Data Model

```python
class Carrier(BaseModel):
    name: str
    trucks_per_day: int
```

### Current Data Storage

* Stored in a Python dictionary (`routes`) keyed by `(from_city, to_city)` tuples.
* Easily replaceable with a real database (PostgreSQL, MySQL) in future.

Example:

```python
routes = {
    ("new york", "washington dc"): [
        Carrier(name="Knight-Swift Transport Services", trucks_per_day=10),
        Carrier(name="J.B. Hunt Transport Services Inc", trucks_per_day=7),
        Carrier(name="YRC Worldwide", trucks_per_day=5),
    ],
    ...
}
```

---

## Implementation Choices

1. **FastAPI over Flask**

   * Faster, async-first, built-in data validation with Pydantic.

2. **City Aliasing**

   * Reduces user error by allowing multiple input variations for the same city.

3. **In-Memory Carrier Data**

   * Speeds up prototype development; keeps API stateless.
   * Can later connect to a relational database.

4. **Google Maps Integration**

   * Provides rich UI for selecting cities and viewing possible routes.

5. **CORS Middleware**

   * Allows frontend to communicate with backend from different origins during development.

6. **Railway Deployment**

   * `railway.json` defines how to start the backend with `uvicorn`.

---

## Running the Project

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

**Frontend**

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_API_URL=http://localhost:8000
```

---

## Testing

Backend tests are written with **pytest** and **FastAPI TestClient**.

Run tests:

```bash
cd backend
pytest
```

Tests cover:

* City alias handling.
* Known route matches.
* Default carrier fallback.
* Case insensitivity.
* Reverse route not matching.
