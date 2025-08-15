import React, { useEffect, useRef } from "react";
import styles from "./MapView.module.css";

const MapView = ({ from, to }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) {
      console.warn("Google Maps is not loaded or map container is missing.");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 7,
      center: { lat: 40.7128, lng: -74.0060 },
      mapTypeControl: false,
    });

    if (!from || !to) return;

    const directionsService = new window.google.maps.DirectionsService();
    const routeColors = ["#1976D2", "#388E3C", "#F57C00"];

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status !== "OK" || !response?.routes?.length) {
          console.error("Directions request failed:", status);
          return;
        }

        response.routes.slice(0, 3).forEach((route, index) => {
          const renderer = new window.google.maps.DirectionsRenderer({
            map,
            directions: response,
            routeIndex: index,
            polylineOptions: {
              strokeColor: routeColors[index],
              strokeOpacity: 0.8,
              strokeWeight: 6,
            },
            suppressMarkers: false,
          });
        });
      }
    );
  }, [from, to]);

  return <div ref={mapRef} className={styles.mapContainer} />;
};

export default MapView;
