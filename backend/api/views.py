from django.http import JsonResponse

def get_incidents(request):
    INCIDENTS = [
    {
        "id": "INC-001", "title": "Warehouse Fire — Kodambakkam",
        "type": "fire", "status": "critical", "severity": 9, "priorityScore": 94,
        "lat": 13.0530, "lng": 80.2209,
        "description": "Large industrial warehouse fire spreading to adjacent buildings. Thick black smoke visible. Possible chemical storage on-site.",
        "location": "14, Industrial Ave, Kodambakkam, Chennai",
        "reportedBy": "Citizen + IoT Sensor", "timeAgo": 3,
        "requiredResources": [{ "type": "fire", "count": 3 }, { "type": "medical", "count": 2 }, { "type": "police", "count": 1 }],
        "aiReasoning": [{ "factor": "Severity", "value": "9/10", "weight": 0.9 },
        { "factor": "Proximity to Hospital", "value": "High Risk", "weight": 0.8 },
        { "factor": "Pattern Match", "value": "87%", "weight": 0.7 }],
        "riskIfDelayed": "Spread to 3 adjacent buildings in 12 min"
    },
    {
        "id": "INC-002", "title": "Flash Flood — Adyar River Bank",
        "type": "flood", "status": "critical", "severity": 8, "priorityScore": 89,
        "lat": 13.0012, "lng": 80.2565,
        "description": "Adyar river overflowing. Residential area flooded 2ft. Elderly residents stranded on second floors.",
        "location": "Adyar Riverside Colony, Chennai",
        "reportedBy": "Police Patrol", "timeAgo": 7,
        "requiredResources": [{ "type": "rescue", "count": 2 }, { "type": "medical", "count": 1 }, { "type": "police", "count": 2 }],
        "aiReasoning": [{ "factor": "Severity", "value": "8/10", "weight": 0.85 },
        { "factor": "Vulnerable Population", "value": "High", "weight": 0.9 },
        { "factor": "Weather Forecast", "value": "Rain +2hr", "weight": 0.75 }],
        "riskIfDelayed": "Water level rising 6cm/hr — ground floor submerged in 20 min"
    },
    {
        "id": "INC-003", "title": "Multi-Vehicle Accident — OMR Highway",
        "type": "medical", "status": "high", "severity": 7, "priorityScore": 78,
        "lat": 12.9716, "lng": 80.2444,
        "description": "5-vehicle pileup on Old Mahabalipuram Road. Multiple casualties reported. Road completely blocked.",
        "location": "OMR, Near Perungudi Toll, Chennai",
        "reportedBy": "Traffic Camera AI", "timeAgo": 11,
        "requiredResources": [{ "type": "medical", "count": 3 }, { "type": "police", "count": 2 }],
        "aiReasoning": [{ "factor": "Casualties", "value": "Est. 6–8", "weight": 0.85 },
        { "factor": "Traffic Impact", "value": "Critical Artery", "weight": 0.6 },
        { "factor": "Golden Hour", "value": "32 min left", "weight": 0.95 }],
        "riskIfDelayed": "Golden hour breach for 2 critical patients in 32 min"
    },
    {
        "id": "INC-004", "title": "Gas Leak — Anna Nagar Apartment",
        "type": "hazmat", "status": "high", "severity": 7, "priorityScore": 74,
        "lat": 13.0850, "lng": 80.2101,
        "description": "Strong gas smell reported from 8th floor. Building partially evacuated. Source unidentified.",
        "location": "Block C, Anna Nagar West, Chennai",
        "reportedBy": "Resident Call", "timeAgo": 15,
        "requiredResources": [{ "type": "hazmat", "count": 1 }, { "type": "fire", "count": 1 }, { "type": "medical", "count": 1 }],
        "aiReasoning": [{ "factor": "Explosion Risk", "value": "Medium", "weight": 0.7 },
        { "factor": "Population Density", "value": "High", "weight": 0.8 },
        { "factor": "Wind Direction", "value": "Unfavorable", "weight": 0.65 }],
        "riskIfDelayed": "Ignition risk increases significantly after 20 min"
    },
    {
        "id": "INC-005", "title": "Armed Robbery — T Nagar Jewellery Store",
        "type": "crime", "status": "high", "severity": 6, "priorityScore": 71,
        "lat": 13.0418, "lng": 80.2341,
        "description": "3 armed suspects holding 12 hostages inside jewellery shop. Suspects reportedly armed with knives.",
        "location": "Usman Road, T Nagar, Chennai",
        "reportedBy": "Silent Alarm + Witness", "timeAgo": 8,
        "requiredResources": [{ "type": "police", "count": 4 }, { "type": "medical", "count": 1 }],
        "aiReasoning": [{ "factor": "Hostage Count", "value": "12", "weight": 0.9 },
        { "factor": "Armed Threat", "value": "Confirmed", "weight": 0.85 },
        { "factor": "Crowd Density", "value": "High (market area)", "weight": 0.6 }],
        "riskIfDelayed": "Crowd gathering outside — risk of escalation"
    },
    {
        "id": "INC-006", "title": "Building Collapse — Royapuram",
        "type": "infrastructure", "status": "critical", "severity": 9, "priorityScore": 91,
        "lat": 13.1130, "lng": 80.2990,
        "description": "Partial collapse of 4-story residential building. Estimated 15–20 residents trapped under debris.",
        "location": "Royapuram Harbour Area, Chennai",
        "reportedBy": "Seismic Sensor + Citizen", "timeAgo": 5,
        "requiredResources": [{ "type": "rescue", "count": 3 }, { "type": "medical", "count": 3 }, { "type": "fire", "count": 1 }],
        "aiReasoning": [{ "factor": "Trapped Persons", "value": "Est. 15–20", "weight": 0.95 },
        { "factor": "Structural Stability", "value": "Low", "weight": 0.9 },
        { "factor": "Survival Window", "value": "6 hr", "weight": 0.85 }],
        "riskIfDelayed": "Secondary collapse risk in 45 min"
    },
    {
        "id": "INC-007", "title": "Chemical Spill — Manali Industrial",
        "type": "hazmat", "status": "high", "severity": 7, "priorityScore": 69,
        "lat": 13.1674, "lng": 80.2590,
        "description": "Unidentified chemical spill from overturned tanker. Fumes causing respiratory issues in nearby residents.",
        "location": "Manali Industrial Corridor, Chennai",
        "reportedBy": "IoT Air Quality Sensor", "timeAgo": 22,
        "requiredResources": [{ "type": "hazmat", "count": 2 }, { "type": "medical", "count": 2 }, { "type": "police", "count": 1 }],
        "aiReasoning": [{ "factor": "Air Quality Index", "value": "Hazardous", "weight": 0.85 },
        { "factor": "Wind Speed", "value": "12 km/h NE", "weight": 0.7 },
        { "factor": "Residential Proximity", "value": "400m", "weight": 0.8 }],
        "riskIfDelayed": "Plume reaches school zone in 18 min"
    },
    {
        "id": "INC-008", "title": "Cardiac Emergency — Velachery",
        "type": "medical", "status": "medium", "severity": 5, "priorityScore": 58,
        "lat": 12.9815, "lng": 80.2180,
        "description": "67-year-old male, unresponsive. CPR being performed by bystander. Nearest hospital 4.2km.",
        "location": "Velachery Main Road, Chennai",
        "reportedBy": "Emergency Hotline", "timeAgo": 2,
        "requiredResources": [{ "type": "medical", "count": 1 }],
        "aiReasoning": [{ "factor": "Age Risk", "value": "High", "weight": 0.8 },
        { "factor": "Response Time", "value": "Borderline", "weight": 0.75 },
        { "factor": "CPR Active", "value": "Yes", "weight": 0.6 }],
        "riskIfDelayed": "Survival rate drops 10% per minute without defibrillation"
    },
    {
        "id": "INC-009", "title": "Power Grid Failure — Mylapore",
        "type": "infrastructure", "status": "medium", "severity": 5, "priorityScore": 54,
        "lat": 13.0368, "lng": 80.2676,
        "description": "Transformer explosion causing blackout across 3 wards. Hospital on backup power. Traffic signals down.",
        "location": "Mylapore, Chennai",
        "reportedBy": "TNEB Monitoring System", "timeAgo": 18,
        "requiredResources": [{ "type": "police", "count": 2 }],
        "aiReasoning": [{ "factor": "Hospital Impact", "value": "On Backup", "weight": 0.85 },
        { "factor": "Area Size", "value": "3 Wards", "weight": 0.6 },
        { "factor": "Backup Duration", "value": "Est. 4 hrs", "weight": 0.7 }],
        "riskIfDelayed": "Hospital backup generator fuel low in 3.5 hrs"
    },
    {
        "id": "INC-010", "title": "Protest Escalation — Marina Beach",
        "type": "crime", "status": "medium", "severity": 4, "priorityScore": 48,
        "lat": 13.0500, "lng": 80.2824,
        "description": "Peaceful protest becoming agitated. Crowd estimate 2,000. Minor clashes at north entrance.",
        "location": "Marina Beach North Gate, Chennai",
        "reportedBy": "Police Patrol + CCTV AI", "timeAgo": 35,
        "requiredResources": [{ "type": "police", "count": 5 }],
        "aiReasoning": [{ "factor": "Crowd Size", "value": "2,000+", "weight": 0.7 },
        { "factor": "Escalation Pattern", "value": "Rising", "weight": 0.75 },
        { "factor": "Media Presence", "value": "High", "weight": 0.4 }],
        "riskIfDelayed": "Historical pattern: escalates to violence within 1 hr"
    },
    {
        "id": "INC-011", "title": "Water Main Burst — Tambaram",
        "type": "infrastructure", "status": "low", "severity": 3, "priorityScore": 32,
        "lat": 12.9249, "lng": 80.1000,
        "description": "Major water main burst flooding residential street. Water supply disrupted in 2 sectors.",
        "location": "Tambaram West, Chennai",
        "reportedBy": "CMWSSB Sensor", "timeAgo": 45,
        "requiredResources": [{ "type": "police", "count": 1 }],
        "aiReasoning": [{ "factor": "Service Disruption", "value": "2 Sectors", "weight": 0.5 },
        { "factor": "Road Damage", "value": "Minor", "weight": 0.3 },
        { "factor": "Repair ETA", "value": "3 hrs", "weight": 0.4 }],
        "riskIfDelayed": "Road may become impassable for emergency vehicles"
    },
    {
        "id": "INC-012", "title": "School Bus Breakdown — Porur",
        "type": "medical", "status": "low", "severity": 2, "priorityScore": 24,
        "lat": 13.0368, "lng": 80.1572,
        "description": "School bus with 32 children broken down on highway. No injuries. Children need safe relocation.",
        "location": "Porur Junction, Chennai",
        "reportedBy": "Bus Driver — Emergency Line", "timeAgo": 12,
        "requiredResources": [{ "type": "police", "count": 1 }, { "type": "medical", "count": 1 }],
        "aiReasoning": [{ "factor": "Children Count", "value": "32", "weight": 0.6 },
        { "factor": "Traffic Hazard", "value": "Medium", "weight": 0.5 },
        { "factor": "Weather", "value": "Clear", "weight": 0.2 }],
        "riskIfDelayed": "Low immediate risk — monitor"
    }
    ]
    return JsonResponse(INCIDENTS, safe=False)

def get_resources(request):
    RESOURCES = [
    { "id": "R-01", "name": "FIRE-Unit-1", "type": "fire", "status": "available", "zone": "Zone A" },
    { "id": "R-02", "name": "FIRE-Unit-2", "type": "fire", "status": "deployed", "zone": "Zone B" },
    { "id": "R-03", "name": "FIRE-Unit-3", "type": "fire", "status": "available", "zone": "Zone C" },
    { "id": "R-04", "name": "FIRE-Unit-4", "type": "fire", "status": "offline", "zone": "Zone A" },
    { "id": "R-05", "name": "MEDIC-1", "type": "medical", "status": "available", "zone": "Zone A" },
    { "id": "R-06", "name": "MEDIC-2", "type": "medical", "status": "deployed", "zone": "Zone D" },
    { "id": "R-07", "name": "MEDIC-3", "type": "medical", "status": "available", "zone": "Zone B" },
    { "id": "R-08", "name": "MEDIC-4", "type": "medical", "status": "available", "zone": "Zone C" },
    { "id": "R-09", "name": "POLICE-Alpha", "type": "police", "status": "available", "zone": "Zone A" },
    { "id": "R-10", "name": "POLICE-Bravo", "type": "police", "status": "deployed", "zone": "Zone B" },
    { "id": "R-11", "name": "POLICE-Charlie", "type": "police", "status": "available", "zone": "Zone C" },
    { "id": "R-12", "name": "POLICE-Delta", "type": "police", "status": "available", "zone": "Zone D" },
    { "id": "R-13", "name": "HAZMAT-1", "type": "hazmat", "status": "available", "zone": "Zone B" },
    { "id": "R-14", "name": "HAZMAT-2", "type": "hazmat", "status": "deployed", "zone": "Zone A" },
    { "id": "R-15", "name": "RESCUE-1", "type": "rescue", "status": "available", "zone": "Zone C" },
    { "id": "R-16", "name": "RESCUE-2", "type": "rescue", "status": "available", "zone": "Zone D" }
    ]
    return JsonResponse(RESOURCES, safe=False)
