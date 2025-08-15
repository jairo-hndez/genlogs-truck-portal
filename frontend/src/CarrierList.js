import React from "react";
import styles from "./CarrierList.module.css";

function CarrierList({ carriers }) {
  if (!Array.isArray(carriers) || carriers.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2>Top Carriers</h2>
      <ul className={styles.list}>
        {carriers.map((carrier) => (
          <li key={carrier.id || carrier.name} className={styles.item}>
            <strong>{carrier.name}</strong> ({carrier.trucks_per_day} Trucks/Day)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarrierList;
