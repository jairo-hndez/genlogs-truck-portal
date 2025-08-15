import React, { useEffect, useRef, useState } from "react";
import styles from "./CitySearchForm.module.css";

const AUTOCOMPLETE_OPTIONS = { types: ["(cities)"] };

function CitySearchForm({ onSearch, isLoading }) {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.google?.maps?.places) {
      console.warn("Google Places API is not available. Autocomplete will be disabled.");
      return;
    }

    const setupAutocomplete = (inputRef, setValue) => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, AUTOCOMPLETE_OPTIONS);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setValue(place.formatted_address || "");
      });
    };

    setupAutocomplete(fromInputRef, setFromCity);
    setupAutocomplete(toInputRef, setToCity);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!fromCity || !toCity) {
      setError('Please select both a "From" and "To" city.');
      return;
    }
    setError("");
    onSearch({ from: fromCity, to: toCity });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="fromCity">From:</label>
        <input
          id="fromCity"
          ref={fromInputRef}
          type="text"
          placeholder="Enter a city"
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="toCity">To:</label>
        <input
          id="toCity"
          ref={toInputRef}
          type="text"
          placeholder="Enter a city"
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default CitySearchForm;
