# ShearStream API Documentation

## Base URL
```
https://production.api.shearstreaming.com
```

## Authentication
- **Type:** OAuth 2.0 / Keycloak
- **Provider:** https://shield.shearfrac.com/realms/sfg/protocol/openid-connect/token
- **Method:** Bearer token in Authorization header

---

## 📊 Phase 1: Core Data Endpoints (GET Only - SAFE)

### Companies

#### GET `/api/v1/company`
**Description:** List all companies
**Auth Required:** Yes
**Parameters:** None
**Response:** Array of company objects
**Use Case:** Dashboard homepage, company selection

**Sample Response Structure:**
```json
[
  {
    "id": 225,
    "name": "Ballard Petroleum",
    "updatedAt": "2024-XX-XX",
    "activeProjects": 5,
    "pads": 2,
    "administrator": "Simrat Toor"
  }
]
```

---

#### GET `/api/v1/company/{id}`
**Description:** Get specific company details
**Auth Required:** Yes
**Parameters:**
- `id` (path) - Company ID (e.g., 225)

**Response:** Single company object with full details
**Use Case:** Company dashboard page

**Example:**
```
GET /api/v1/company/225
```

---

### Projects

#### GET `/api/v1/project/active`
**Description:** List all active projects across all companies
**Auth Required:** Yes
**Response:** Array of active project objects
**Use Case:** Dashboard "Active Projects" table

---

#### GET `/api/v1/project/activething`
**Description:** Get active projects with associated things/devices
**Auth Required:** Yes
**Response:** Projects with device associations
**Use Case:** Fieldbox Projects table

---

#### GET `/api/v1/project/active/{companyId}`
**Description:** Get active projects for a specific company
**Auth Required:** Yes
**Parameters:**
- `companyId` (path) - Company ID

**Example:**
```
GET /api/v1/project/active/225
```

**Use Case:** Company dashboard - Active Projects section

---

#### GET `/api/v1/project/{id}`
**Description:** Get specific project details
**Auth Required:** Yes
**Parameters:**
- `id` (path) - Project ID (e.g., 413)

**Example:**
```
GET /api/v1/project/413
```

---

### Pads

#### GET `/api/v1/pad/{companyId}/company`
**Description:** Get all pads for a specific company
**Auth Required:** Yes
**Parameters:**
- `companyId` (path) - Company ID

**Example:**
```
GET /api/v1/pad/225/company
```

**Sample Response:**
```json
[
  {
    "id": 123,
    "name": "Joanne Fed",
    "surfaceLocation": "44.095701 -105.620525",
    "spatialReferenceSystem": 4267,
    "projects": [...]
  },
  {
    "id": 124,
    "name": "LJ Fed",
    "surfaceLocation": null,
    "projects": [...]
  }
]
```

**Use Case:** Company dashboard - Pads section

---

### Hierarchy & Navigation

#### GET `/api/v1/hierarchy/{assetId}/{assetType}`
**Description:** Get hierarchical breadcrumb data
**Auth Required:** Yes
**Parameters:**
- `assetId` (path) - Asset ID
- `assetType` (path) - Type: COMPANY, PROJECT, CHART, etc.

**Examples:**
```
GET /api/v1/hierarchy/225/COMPANY
GET /api/v1/hierarchy/358/CHART
```

**Sample Response:**
```json
{
  "breadcrumbs": [
    {
      "type": "COMPANY",
      "id": 225,
      "name": "Ballard Petroleum"
    },
    {
      "type": "PAD",
      "id": 123,
      "name": "Joanne Fed"
    },
    {
      "type": "PROJECT",
      "id": 413,
      "name": "PPS-004"
    }
  ]
}
```

**Use Case:** Breadcrumb navigation

---

### Charts

#### GET `/api/v1/chart/{id}`
**Description:** Get chart configuration and metadata
**Auth Required:** Yes
**Parameters:**
- `id` (path) - Chart ID (e.g., 358)

**Example:**
```
GET /api/v1/chart/358
```

**Sample Response:**
```json
{
  "id": 358,
  "name": "Ballard-Joanne-Fed-SFG-Frac",
  "projectId": 413,
  "jobs": [746, 741, 742],
  "configuration": {...}
}
```

**Use Case:** Chart graph page initialization

---

### GIS / Mapping

#### GET `/api/v1/gis/spatialReferenceSystems`
**Description:** Get list of all spatial reference systems (coordinate systems)
**Auth Required:** Yes
**Response:** Array of SRS definitions
**Use Case:** Map coordinate system dropdown

---

#### GET `/api/v1/gis/spatialReferenceSystem/{id}`
**Description:** Get specific spatial reference system details
**Auth Required:** Yes
**Parameters:**
- `id` (path) - SRS ID (e.g., 4267, 32055)

**Examples:**
```
GET /api/v1/gis/spatialReferenceSystem/4267  (NAD27 Geographic)
GET /api/v1/gis/spatialReferenceSystem/32055 (WGS 84 / UPS North)
```

**Use Case:** Converting pad coordinates

---

## 📈 Phase 2: Time Series Data Endpoints (GET Only - SAFE)

### Metadata

#### GET `/api/v1/timeseries/{jobId}/metadata`
**Description:** Get available channels and metadata for a job
**Auth Required:** Yes
**Parameters:**
- `jobId` (path) - Job ID (e.g., 746, 741, 742)

**Examples:**
```
GET /api/v1/timeseries/746/metadata  (Main frac job)
GET /api/v1/timeseries/741/metadata  (Offset wells)
GET /api/v1/timeseries/742/metadata  (GDU monitoring)
```

**Sample Response:**
```json
{
  "jobId": 746,
  "channels": [
    {
      "name": "23-34-10 SH",
      "unit": "psi",
      "type": "pressure",
      "yAxis": "Pressure (psi)"
    },
    {
      "name": "Slurry Rate",
      "unit": "bpm",
      "type": "rate",
      "yAxis": "Rate (bpm)"
    }
  ]
}
```

**Use Case:** Determining available channels for charting

---

### Live Data

#### GET `/api/v1/timeseries/{jobId}/data`
**Description:** Get timeseries data for specified channels
**Auth Required:** Yes
**Parameters:**
- `jobId` (path) - Job ID
- `c[]` (query, multiple) - Channel names (URL encoded)
- `startTimestamp` (query) - Unix timestamp in milliseconds
- `endTimestamp` (query) - Unix timestamp in milliseconds
- `disableAggregation` (query) - Boolean flag

**Examples:**

**1. Main Frac Job (746) - Pressure & Rate:**
```
GET /api/v1/timeseries/746/data?
  c[]=23-34-10+SH&
  c[]=33-34-15+SH&
  c[]=p3&
  c[]=A.01+Treating+Pressure&
  c[]=Slurry+Rate&
  c[]=Belt.+Conc.&
  startTimestamp=1759420198999&
  endTimestamp=1759420200000&
  disableAggregation=false
```

**2. Main Frac Job (746) - Full History:**
```
GET /api/v1/timeseries/746/data?
  c[]=23-34-10+SH&
  c[]=timestamp&
  c[]=33-34-15+SH&
  c[]=p3&
  c[]=A.01+Treating+Pressure&
  c[]=Slurry+Rate&
  c[]=Calc+Clean+Rate&
  c[]=Belt.+Conc.&
  c[]=BLA4:+Conc.&
  c[]=QC+Visc&
  c[]=p4&
  startTimestamp=1759321800000&
  endTimestamp=1759420200000&
  disableAggregation=false
```

**3. Chemical Additives (746):**
```
GET /api/v1/timeseries/746/data?
  c[]=HLA1:+Low+Buffer+Conc.&
  c[]=timestamp&
  c[]=BLA3:+High+Buffer+Conc.&
  c[]=BLA1:+Surfactant+Conc.&
  c[]=A.10+DRY+Gel+Flowmeter&
  c[]=BLA2:+Biocide+Conc.&
  c[]=HLA3:+Clay+Conc.&
  c[]=BLA4:+Conc.&
  c[]=BDA1:+Conc.&
  c[]=Battery&
  startTimestamp=1759321800000&
  endTimestamp=1759420200000&
  disableAggregation=false
```

**4. Offset Wells (741) - Geis Fed:**
```
GET /api/v1/timeseries/741/data?
  c[]=pressure3-Geis+Fed+22-9-4-33+SH&
  c[]=timestamp&
  c[]=pressure1-Geis+Fed+32-9-4-33+SH+Casing&
  startTimestamp=1759176600000&
  endTimestamp=1759420200000&
  disableAggregation=false
```

**5. GDU Monitoring (742):**
```
GET /api/v1/timeseries/742/data?
  c[]=pressure1-GDU+23-10+Tubing&
  c[]=timestamp&
  c[]=pressure1-GDU+23-10+Casing&
  c[]=batt5&
  startTimestamp=1759176600000&
  endTimestamp=1759420200000&
  disableAggregation=false
```

**Sample Response:**
```json
{
  "jobId": 746,
  "data": [
    {
      "timestamp": 1759420198999,
      "23-34-10 SH": 1803.07,
      "33-34-15 SH": 1805.52,
      "p3": 9.94,
      "A.01 Treating Pressure": 24.01,
      "Slurry Rate": 0.00,
      "Belt. Conc.": 0.00
    },
    {
      "timestamp": 1759420200000,
      "23-34-10 SH": 1803.12,
      ...
    }
  ]
}
```

---

## 🔄 Real-Time Polling Pattern

The application polls timeseries data every **~2 seconds** with this pattern:

1. **Initial Load:** Fetch full history (e.g., last 1 hour, 3 hours, or All)
2. **Live Updates:** Poll with 2-second window
   ```
   startTimestamp = currentTime - 2000
   endTimestamp = currentTime
   ```
3. **Periodic Full Refresh:** Every ~30 seconds, fetch full time range to handle missed data

**Example Polling Sequence:**
```
T+0s:  GET ...?startTimestamp=1759321800000&endTimestamp=1759420200000  (1 hour history)
T+2s:  GET ...?startTimestamp=1759420198999&endTimestamp=1759420200000  (2s delta)
T+4s:  GET ...?startTimestamp=1759420217740&endTimestamp=1759420219741  (2s delta)
T+6s:  GET ...?startTimestamp=1759420217818&endTimestamp=1759420219819  (2s delta)
...
T+30s: GET ...?startTimestamp=1759321800000&endTimestamp=1759420230000  (full refresh)
```

---

## 📋 Channel Reference

### Job 746 (Main Frac) - Pressure Channels:
- `23-34-10 SH` - Well pressure (psi)
- `33-34-15 SH` - Well pressure (psi)
- `p3` / `SFG-WellSide` - Wellside pressure (psi)
- `A.01 Treating Pressure` / `LOS Treating Pressure` - Treatment pressure (psi)

### Job 746 - Rate Channels:
- `Slurry Rate` - Slurry injection rate (bpm)
- `Calc Clean Rate` - Calculated clean rate (bpm)

### Job 746 - Concentration Channels:
- `Belt. Conc.` / `Prop Conc.` - Proppant concentration (lb/gal)
- `BLA4: Conc.` / `FR Conc.` - Friction reducer concentration (lb/gal)
- `QC Visc` - Viscosity (lb/gal)

### Job 746 - Chemical Additives:
- `HLA1: Low Buffer Conc.` - Low buffer concentration
- `BLA3: High Buffer Conc.` - High buffer concentration
- `BLA1: Surfactant Conc.` - Surfactant concentration
- `A.10 DRY Gel Flowmeter` - Gel flowmeter reading
- `BLA2: Biocide Conc.` - Biocide concentration
- `HLA3: Clay Conc.` - Clay concentration
- `BLA4: Conc.` - FR concentration
- `BDA1: Conc.` - Diverter concentration
- `Battery` - Battery level

### Job 741 (Offset Wells - Geis Fed):
- `pressure3-Geis Fed 22-9-4-33 SH` - Offset well pressure (psi)
- `pressure1-Geis Fed 32-9-4-33 SH Casing` - Offset well casing pressure (psi)

### Job 742 (GDU Monitoring):
- `pressure1-GDU 23-10 Tubing` - GDU tubing pressure (psi)
- `pressure1-GDU 23-10 Casing` - GDU casing pressure (psi)
- `batt5` - Battery level

---

## 🎯 Key Implementation Insights

### Time Ranges
The application supports these predefined time ranges:
- `5m` - Last 5 minutes
- `15m` - Last 15 minutes
- `30m` - Last 30 minutes
- `1h` - Last 1 hour
- `2h` - Last 2 hours
- `3h` - Last 3 hours
- `12h` - Last 12 hours
- `1 day` - Last 24 hours
- `All` - Complete job history

### Chart Types
Three separate charts display:
1. **Pressure/Rate Chart:** Pressure channels + Slurry Rate
2. **Concentration Chart:** Chemical additives and concentrations
3. **Offset Pressure Chart:** Offset well pressures

### Current Values Display
Large colored boxes below charts show real-time values:
- **Format:** `Channel Name: Value`
- **Example:** `Joanne Fed 23-34-10 SH: 1803.07`
- **Update Frequency:** Every 2 seconds

---

## 🔒 Safety Notes

**✅ SAFE TO USE (GET-only, Read-only):**
- All endpoints documented above are GET requests
- No data modification
- No job control/manipulation
- Safe for production testing

**❌ DO NOT USE:**
- POST, PUT, PATCH, DELETE endpoints
- Job control endpoints (start, stop, pause)
- Configuration modification endpoints
- Delete operations

---

## 🚀 Next Steps for Implementation

### Priority 1: Core Dashboard
1. Implement `/api/v1/company` - Companies list
2. Implement `/api/v1/project/active` - Active projects
3. Implement `/api/v1/company/{id}` - Company details

### Priority 2: Time Series Visualization
1. Implement `/api/v1/timeseries/{jobId}/metadata` - Get available channels
2. Implement `/api/v1/timeseries/{jobId}/data` - Real-time data
3. Set up 2-second polling

### Priority 3: Real-Time Value Displays
1. Create ValueDisplay component
2. Extract current values from timeseries data
3. Color-match to chart lines
4. Update every 2 seconds

### Priority 4: Enhanced Features
1. Implement time range selector
2. Add channel visibility toggles
3. Create breadcrumb navigation
4. Add hierarchy support

---

## 📊 API Call Summary

### Captured During Testing:
- **Total Unique GET Endpoints:** 15+
- **Timeseries Data Requests:** 100+ (polling)
- **Response Times:** Fast (<200ms for most)
- **Data Refresh:** Every ~2 seconds
- **Authentication:** OAuth 2.0 with automatic renewal

### Endpoint Categories:
1. **Companies** - 2 endpoints
2. **Projects** - 4 endpoints
3. **Pads** - 1 endpoint
4. **Charts** - 1 endpoint
5. **Hierarchy** - 1 endpoint (multiple types)
6. **GIS** - 2 endpoints
7. **Timeseries** - 2 endpoints (metadata + data)

---

## 📝 Notes

- All timestamps are Unix time in milliseconds
- Channel names are URL-encoded in query parameters
- The `timestamp` channel provides explicit timestamps in responses
- `disableAggregation=false` allows server-side data aggregation for performance
- Responses use HTTP 304 (Not Modified) for unchanged data
- Authentication tokens are managed by the framework automatically

---

**Generated:** October 2, 2025
**Version:** 1.0
**Status:** Tested & Verified on Production System
