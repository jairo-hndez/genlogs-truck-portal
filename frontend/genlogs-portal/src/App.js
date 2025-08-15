import React, { useState } from "react";
import "./App.css";
import CitySearchForm from "./CitySearchForm";
import MapView from "./MapView";
import CarrierList from "./CarrierList";

function App() {
  const [route, setRoute] = useState({ from: null, to: null });
  const [carriers, setCarriers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ from, to }) => {
    setIsLoading(true);
    setError(null);
    setCarriers([]);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const formatCity = (city) => {
        const base = city.split(",")[0].trim();
        if (/dc/i.test(city) || /dc/i.test(city)) {
          return `${base} DC`;
        }
        return base;
      };

      console.log(formatCity(from));
      console.log(formatCity(to));

      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_city: formatCity(from),
          to_city: formatCity(to),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setCarriers(data);
      setRoute({ from, to });
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch carriers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Genlogs Carrier Portal</h1>
        <img
          src="https://images.squarespace-cdn.com/content/v1/5fe3faeb5af68c2f903b28ba/23bcda92-50ee-4a4c-9a61-704f763ff5ec/genlogs.png"
          alt="Genlogs Logo"
          className="genlogs-logo"
        />
      </header>
      <main>
        <CitySearchForm onSearch={handleSearch} isLoading={isLoading} />
        {error && <p className="errorText">Error: {error}</p>}
        <MapView from={route.from} to={route.to} />
        <CarrierList carriers={carriers} />
      </main>
    </div>
  );
}

export default App;
