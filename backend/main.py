from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="Genlogs Carrier Search API",
    description="API to find truck carriers between two cities.",
    version="1.0.0"
)

# CORS configuration (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    from_city: str
    to_city: str


class Carrier(BaseModel):
    name: str
    trucks_per_day: int


@app.post("/search", response_model=List[Carrier])
async def search_carriers(request: SearchRequest) -> List[Carrier]:
    """
    Search carriers between two cities.

    Args:
        request: Source and destination cities.

    Returns:
        List of carriers operating on the route.
    """

    # Map all variations of city names to a single canonical name
    city_aliases = {
        "new york": "new york",
        "nueva york": "new york",
        "ny": "new york",
        "washington dc": "washington dc",
        "san francisco": "san francisco",
        "sf": "san francisco",
        "los angeles": "los angeles",
        "la": "los angeles",
    }

    # Canonicalize input cities
    print(request.from_city.strip().lower())
    from_city = city_aliases.get(' '.join(request.from_city.strip().lower().split()))
    to_city = city_aliases.get(' '.join(request.to_city.strip().lower().split()))
    print(from_city, to_city)

    # Define carriers for known routes
    routes = {
        ("new york", "washington dc"): [
            Carrier(name="Knight-Swift Transport Services", trucks_per_day=10),
            Carrier(name="J.B. Hunt Transport Services Inc", trucks_per_day=7),
            Carrier(name="YRC Worldwide", trucks_per_day=5),
        ],
        ("san francisco", "los angeles"): [
            Carrier(name="XPO Logistics", trucks_per_day=9),
            Carrier(name="Schneider", trucks_per_day=6),
            Carrier(name="Landstar Systems", trucks_per_day=2),
        ],
    }

    # Return carriers for matching route, or default carriers
    return routes.get(
        (from_city, to_city),
        [
            Carrier(name="UPS Inc.", trucks_per_day=11),
            Carrier(name="FedEx Corp", trucks_per_day=9),
        ]
    )



@app.get("/")
def health_check():
    """Health check endpoint."""
    return {"status": "Genlogs API is running"}
