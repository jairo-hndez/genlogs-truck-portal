# Genlogs Platform Database Schema Design

The Genlogs database serves as the **single source of truth** for all processed information. 
It is designed for **data integrity, high query performance, and traceability** to support both **real-time applications** and **long-term analytics**.

The schema follows a **normalized relational model** (PostgreSQL) to:
- Prevent redundancy.
- Maintain strict referential integrity.
- Support complex analytical queries.
- Seamlessly ingest validated AI pipeline results.

---

## **Core Tables**

### 1. `carriers`
Master record of all trucking companies.

**Purpose:** Store official carrier information for identity resolution and business context.

**Key Columns:**
- `carrier_id` (`UUID`, PK)
- `usdot_number` (`VARCHAR`, Unique) – primary external lookup key
- `name` (`VARCHAR`)
- `created_at` (`TIMESTAMPTZ`)

**Relationships:**
- One-to-many with `vehicle_profiles`
- One-to-many with `carrier_routes`

---

### 2. `vehicle_profiles`
Represents a **unique, persistent physical truck**.

**Purpose:** Track a vehicle's history over time.

**Key Columns:**
- `vehicle_profile_id` (`UUID`, PK)
- `carrier_id` (`UUID`, FK → carriers)
- `vehicle_type` (`VARCHAR`)
- `first_sighting_at` (`TIMESTAMPTZ`)

**Relationships:**
- One-to-many with `sighting_events`

---

### 3. `sighting_events`
Logs every verified sighting. 
This is the **core transactional table** for analytics.

**Purpose:** Provide a permanent, traceable record of each sighting.

**Key Columns:**
- `sighting_event_id` (`UUID`, PK)
- `vehicle_profile_id` (`UUID`, FK → vehicle_profiles)
- `timestamp` (`TIMESTAMPTZ`)
- `latitude` (`NUMERIC`)
- `longitude` (`NUMERIC`)
- `confidence_score` (`FLOAT`)
- `correlated_with` (`UUID`, Nullable, FK → sighting_events)

**Relationships:**
- One-to-one with `images`
- One-to-many with `plates`
- One-to-many with `logos`

---

### 4. `images`
Stores **metadata** about images, not binary data.

**Purpose:** Maintain a link to visual evidence for auditing and ML retraining.

**Key Columns:**
- `image_id` (`UUID`, PK)
- `sighting_event_id` (`UUID`, FK → sighting_events)
- `s3_key` (`VARCHAR`)

---

### 5. `plates`
OCR & NER processed text results.

**Purpose:** Store normalized text data from images (plates, USDOT numbers).

**Key Columns:**
- `plate_id` (`UUID`, PK)
- `sighting_event_id` (`UUID`, FK → sighting_events)
- `plate_text` (`VARCHAR`)
- `is_usdot` (`BOOLEAN`)

---

### 6. `logos`
Stores logo detection results.

**Purpose:** Link detected logos to carriers.

**Key Columns:**
- `logo_id` (`UUID`, PK)
- `sighting_event_id` (`UUID`, FK → sighting_events)
- `carrier_id` (`UUID`, FK → carriers)

---

### 7. `routes`
Conceptual routes for portal queries.

**Purpose:** Simplify querying and aggregation for common paths.

**Key Columns:**
- `route_id` (`UUID`, PK)
- `source_city` (`VARCHAR`)
- `destination_city` (`VARCHAR`)

---

### 8. `carrier_routes`
Join table for aggregated carrier activity per route.

**Purpose:** Store **pre-aggregated counts** for fast portal responses.

**Key Columns:**
- `carrier_id` (`UUID`, FK, PK part)
- `route_id` (`UUID`, FK, PK part)
- `truck_count` (`INT`)
- `last_seen_timestamp` (`TIMESTAMPTZ`)

---

## **Indexes**
- `sighting_events.vehicle_profile_id` – fast vehicle history lookups
- `sighting_events.timestamp` – optimize time-series queries
- `carriers.usdot_number` – unique identity resolution
- Composite PK `(carrier_id, route_id)` in `carrier_routes` – fast portal lookups

---

## **Population Flow**
1. **AI Pipeline Produces Data** – Results passed between services via queues (no direct DB writes).
2. **Identity Resolution** – Aggregates AI outputs into a complete record.
3. **Final Write** – Insert into `sighting_events` and linked tables (`plates`, `logos`, etc.).

This approach avoids real-time I/O bottlenecks by writing **only validated final records** to the DB.

---


## **Example Workflow**

Scenario: A red J.B. Hunt semi-truck is seen twice within 30 seconds.

1. **Carrier Exists** → carriers

2. **Vehicle Profile Created** → vehicle_profiles

3. **Sighting Events Logged** → sighting_events

4. **Image Metadata Stored** → images

5. **AI Outputs Saved** → plates, logos

6. **Route Aggregated** → carrier_routes updated in real-time



## **Real-Time Aggregation (Revised Approach)**

Instead of nightly batch jobs:

- A **listener** updates carrier_routes instantly via UPSERT.

- Supports **broker pricing tools** and **missing truck detection** with **fresh data**.

- Implements **event-driven triggers** (e.g., Apache Flink, Kafka Streams).

---

## **Business Benefits**

- **Fresh, accurate data** for pricing and logistics decisions.

- **Auditable history** for compliance and investigations.

- **Scalable schema** supporting both transactional and analytical workloads.

---

## **ER Diagram**
```mermaid
erDiagram
    carriers {
        UUID carrier_id PK
        VARCHAR name
        VARCHAR usdot_number UK
        TIMESTAMPTZ created_at
    }

    vehicle_profiles {
        UUID vehicle_profile_id PK
        UUID carrier_id FK
        VARCHAR vehicle_type
        TIMESTAMPTZ first_sighting_at
    }

    sighting_events {
        UUID sighting_event_id PK
        UUID vehicle_profile_id FK
        TIMESTAMPTZ timestamp
        NUMERIC latitude
        NUMERIC longitude
        FLOAT confidence_score
        UUID correlated_with FK
    }

    images {
        UUID image_id PK
        UUID sighting_event_id FK
        VARCHAR s3_key
    }

    plates {
        UUID plate_id PK
        UUID sighting_event_id FK
        VARCHAR plate_text
        BOOLEAN is_usdot
    }

    logos {
        UUID logo_id PK
        UUID sighting_event_id FK
        UUID carrier_id FK
    }

    routes {
        UUID route_id PK
        VARCHAR source_city
        VARCHAR destination_city
    }

    carrier_routes {
        UUID carrier_id PK,FK
        UUID route_id PK,FK
        TIMESTAMPTZ last_seen_timestamp
        INT truck_count
    }

    carriers ||--o{ vehicle_profiles : has
    vehicle_profiles ||--o{ sighting_events : logs
    sighting_events ||--|| images : has
    sighting_events ||--o{ plates : contains
    sighting_events ||--o{ logos : contains
    carriers ||--o{ carrier_routes : maps
    routes ||--o{ carrier_routes : maps

