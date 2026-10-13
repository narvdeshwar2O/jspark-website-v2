export const detailedCaseStudies = [
  {
    id: "up-112",
    num: "01",
    client: "Uttar Pradesh 112 (UP Police)",
    domain: "Emergency Response System",
    headline: "Reducing Emergency Response from ~13 Min to 7:55 Min Across 75 Districts",
    product: "OpsUnity + OpsVision",
    modules: "Vision Dashboard, Low-Code Workflow Engine, PRV Telemetry",
    summary: "OpsUnity + Vision was deployed at UP 112 (UP Police) to unify data intelligence, AI-based advisories, command, monitor district performance, and optimize response operations with low-code workflows and decision intelligence.",
    problems: [
      "Average PRV response time was ~13 minutes, varying significantly across districts.",
      "No unified visibility to compare performance of districts, operators, or PRVs.",
      "Operators followed manual decision workflows, leading to inconsistent dispatch actions.",
      "Fragmented systems (Dial 112, CAD, GIS, Radio) resulted in high operational overhead.",
      "Increased repeat calls and citizen complaints due to lack of SOP standardization."
    ],
    deployedLayers: [
      {
        layer: "Vision Dashboard",
        function: "Performance & Command Visualization",
        description: "District benchmarking, PRV live tracking, shift intelligence, and escalation routing."
      },
      {
        layer: "Low-Code Workflow Engine",
        function: "Policy Enforcement",
        description: "Dynamic workflows customized by crime type, severity, and jurisdiction."
      }
    ],
    kpis: [
      { kpi: "PRV Response Time", before: "~13:00 min", after: "7:55 min", improvement: "38% faster" },
      { kpi: "Repeat Incidents", before: "High across districts", after: "Reduced", improvement: "83% reduction" },
      { kpi: "ROIP Communication Load", before: "High (manual back-and-forth)", after: "Streamlined", improvement: "75% reduction" },
      { kpi: "Citizen Grievances", before: "Frequent escalations", after: "Controlled", improvement: "71% reduction" }
    ],
    highlightMetric: "7:55 MIN AVG RESPONSE",
    keyTakeaway: "We reduced UP112's emergency response time from 13 minutes to 7:55 across the state, improved coordination efficiency, and standardized SOP execution using our AI-powered Command Operating System."
  },
  {
    id: "ncrb-nafis",
    num: "02",
    client: "National Crime Records Bureau (NCRB)",
    domain: "Homeland Security & Crime Intelligence",
    headline: "Unifying 10M+ Fingerprint Profiles & Accelerating Cross-State Offender Trace",
    product: "OpsMind + OpsVision",
    modules: "Ten-Print, Chance-Print, MESA Correlator, Crime Graph",
    summary: "OpsMind + Vision Crime Intelligence Layer was deployed at NCRB to unify state-wise crime data at national scale as well as sensitive fingerprint datasets (Ten-Print, Chance-Print, and MESA) with real-time match efficiency scoring and cross-state linkage detection.",
    problems: [
      "Crime data across states, departments, and agencies existed in separate silos.",
      "Fingerprint systems (Ten-Print, Chance-Print, MESA) had no unified correlation layer.",
      "Analysts manually compared profiles, slowing down identification and delaying case progress.",
      "Cross-state repeat offender tracing relied heavily on investigator intuition rather than data-driven linkage.",
      "Intelligence generation was reactive, often happening after crime escalation."
    ],
    deployedLayers: [
      {
        layer: "OpsMind Document & Pattern Intelligence",
        function: "Automated Data Correlation",
        description: "Unified Ten-Print, Chance-Print, and MESA datasets with real-time similarity scoring."
      },
      {
        layer: "OpsVision Crime Analytics Dashboard",
        function: "Cross-State Crime Graph Linking",
        description: "Surfaced repeat offenders, behavioral patterns, and district-to-district criminal movements."
      },
      {
        layer: "Sovereign AI Reasoning Stack",
        function: "Secure Air-Gapped Intelligence Engine",
        description: "Built to run entirely inside NCRB infrastructure without external cloud exposure."
      }
    ],
    kpis: [
      { kpi: "Crime Data Processing Time", before: "Manual, slow", after: "Automated", improvement: "90% faster" },
      { kpi: "Hit / No-Hit Identification Accuracy", before: "Limited scoring", after: "Confidence-Based Matching", improvement: "67% improvement" },
      { kpi: "Analyst Productivity", before: "Time spent on manual search", after: "AI-assisted triage", improvement: "60% higher capacity" },
      { kpi: "Cross-State Crime Trace Recognition", before: "Rare, investigator-driven", after: "System-generated linkages", improvement: "45% better trace detection" }
    ],
    highlightMetric: "90% FASTER INTELLIGENCE",
    keyTakeaway: "We enabled NCRB to unify fingerprint and crime datasets nationwide, automate offender identification, and accelerate intelligence generation by over 90% using a sovereign AI intelligence platform."
  },
  {
    id: "kmds-smart-cities",
    num: "03",
    client: "Karnataka Municipal Data Society (KMDS)",
    domain: "Smart City & Critical Infrastructure",
    headline: "Unified Inter-Department Command Across Environmental, Traffic & Utility Grids",
    product: "OpsSharthi ICCC Layer",
    modules: "ICCC Command Stack, Shared Data Lake, Incident Workflow Engine",
    summary: "OpsSharthi ICCC layer was deployed across KMDS Smart Cities to unify environmental sensor data, traffic streams, utilities, surveillance, and citizen grievance systems into a single real-time operational view.",
    problems: [
      "City systems for traffic, environment, utilities, surveillance, and grievances operated independently with no shared command layer.",
      "Incident handling was reactive—action was only taken after public complaints or escalation.",
      "Inter-department coordination required manual calls, written noting, and multi-step follow-ups.",
      "No real-time situational awareness existed for city administrators or emergency leadership.",
      "SLAs were frequently breached because the live operational state was not visible in real time."
    ],
    deployedLayers: [
      {
        layer: "OpsSharthi ICCC Command Layer",
        function: "Unified Inter-Department Control",
        description: "Integrated traffic, waste, utilities, surveillance, grievance, and emergency inputs into one command stack."
      },
      {
        layer: "City Ops Data Lake + Real-Time Streams",
        function: "Event Correlation & Risk Alerts",
        description: "Created shared operational intelligence for proactive multi-agency decision making."
      },
      {
        layer: "Incident Workflow & Escalation Engine",
        function: "SLA & SOP Enforcement",
        description: "Automated escalation triggers and accountability workflows across municipal departments."
      }
    ],
    kpis: [
      { kpi: "Incident Response Style", before: "Reactive", after: "Predictive + Coordinated", improvement: "Shift to proactive governance" },
      { kpi: "Grievance Closure Efficiency", before: "Manual cross-department follow-ups", after: "Centralized routing + auto escalation", improvement: "Faster resolution & lower backlog" },
      { kpi: "Cross-Department Coordination Time", before: "High (manual intercom/phone)", after: "Real-time joint dashboards", improvement: "Significant overhead reduction" },
      { kpi: "SLA Compliance", before: "Frequently breached", after: "Improved consistency", improvement: "Stronger municipal accountability" }
    ],
    highlightMetric: "100% INTER-AGENCY SYNC",
    keyTakeaway: "We unified city operations across KMDS Smart Cities, shifting governance from reactive complaints to proactive, data-driven urban command and coordination."
  },
  {
    id: "namchi-smart-city",
    num: "04",
    client: "Namchi Smart City",
    domain: "Smart Waste Management Platform",
    headline: "IoT-Driven Dynamic Routing & Real-Time Bin Telemetry",
    product: "OpsSharthi IoT Command Platform",
    modules: "Smart Bin Telemetry, GPS Fleet Routing, Illegal Dumping Detection",
    summary: "OpsSharthi IoT-based command and control system was deployed in Namchi Smart City with bin fullness telemetry, GPS vehicle routing, illegal dumping detection, and a unified control dashboard.",
    problems: [
      "Municipal waste collection followed fixed routes regardless of actual bin fill levels, causing fuel wastage and inefficient manpower usage.",
      "No real-time visibility of bin status (overflow, uncollected waste, location mismatches).",
      "Illegal dumping was only detected after public complaints or occasional ground inspections.",
      "City administration lacked a centralized view of waste operations, driver routes, and asset health."
    ],
    deployedLayers: [
      {
        layer: "Smart Bin Telemetry Integration",
        function: "Fill-Level & Health Monitoring",
        description: "Real-time IoT sensors for bin fullness detection, temperature anomalies, and tamper alerts."
      },
      {
        layer: "GPS Routing & Fleet Tracking",
        function: "Dynamic Route Optimization",
        description: "Live vehicle routing based on bin priority, geofencing, and automated collection cycles."
      },
      {
        layer: "OpsSharthi Unified Control Dashboard",
        function: "Real-Time Command View",
        description: "Bin status maps, route progress, fleet condition, operator logs, and incident reporting."
      }
    ],
    kpis: [
      { kpi: "Route Efficiency", before: "Fixed collection routes", after: "Dynamic routing", improvement: "Reduced fuel & time cost" },
      { kpi: "Bin Overflow & Complaints", before: "Frequent", after: "Reduced significantly", improvement: "Cleaner public spaces" },
      { kpi: "Illegal Dumping Detection", before: "Reactive (post-complaint)", after: "Real-time alerts via camera + telemetry", improvement: "Faster enforcement" },
      { kpi: "Administrative Visibility", before: "Fragmented, manual logs", after: "Unified command dashboard", improvement: "High operational transparency" }
    ],
    highlightMetric: "DYNAMIC FLEET ROUTING",
    keyTakeaway: "We enabled Namchi Smart City to shift from fixed waste collection routes to IoT-driven dynamic routing, improving cleanliness, reducing fuel costs, and delivering unified operational command visibility."
  },
  {
    id: "barcelona-schneider",
    num: "05",
    client: "Barcelona Smart City – Schneider Electric",
    domain: "Urban Infrastructure & Cross-System SCADA",
    headline: "Unified City Command Integrating SCADA, Traffic & Citizen Modules",
    product: "OpsSharthi ICCC Layer",
    modules: "ICCC Command Layer, Data & Event Integration Bus, Multi-Agency Console",
    summary: "OpsSharthi ICCC layer was deployed in collaboration with Schneider Electric to provide a unified city command platform integrating traffic systems, surveillance inputs, utility SCADA streams, and citizen service modules.",
    problems: [
      "City systems were running in departmental silos with no unified real-time command view.",
      "Incident coordination across Police, Traffic, Utilities, and Civic Agencies required manual communication.",
      "Service request resolution often crossed departments, causing slow closures and SLA delays."
    ],
    deployedLayers: [
      {
        layer: "OpsSharthi ICCC Command Layer",
        function: "Unified City Operations",
        description: "Single operational dashboard across traffic, utilities, surveillance, and service systems."
      },
      {
        layer: "Data & Event Integration Bus",
        function: "Cross-System Interoperability",
        description: "Standardized integration bus to break vendor and legacy system silos."
      },
      {
        layer: "Multi-Agency Command Console",
        function: "Joint Action & Response",
        description: "Enables coordinated joint action across civic, utility, and emergency safety teams."
      }
    ],
    kpis: [
      { kpi: "Incident Coordination Time", before: "14–22 min", after: "6–11 min", improvement: "35–55% faster" },
      { kpi: "Cross-Department Case Resolution", before: "48–96 hours", after: "18–40 hours", improvement: "40–60% faster" },
      { kpi: "Citizen Service SLA Compliance", before: "55–68%", after: "78–89%", improvement: "+20% to +28%" },
      { kpi: "Operational Visibility", before: "Fragmented", after: "Unified Command Layer (80–100%)", improvement: "Real-time situational awareness" },
      { kpi: "Manual Communication Overhead", before: "High", after: "Workflow-driven automated routing", improvement: "35–50% reduction" }
    ],
    highlightMetric: "55% FASTER INTER-AGENCY DISPATCH",
    keyTakeaway: "We reduced inter-agency incident coordination time by up to 55% and improved SLA compliance by ~25% by unifying Barcelona's traffic, utility, surveillance, and citizen service systems under a single ICCC command layer."
  },
  {
    id: "munich-electrification",
    num: "06",
    client: "Munich Electrification Germany",
    domain: "IoT & EV Fleet Infrastructure",
    headline: "Cell-Level Battery Telemetry & Remote OTA Firmware Control",
    product: "JSPARK Prime IoT & OTA Control Platform",
    modules: "Cell-Level Telemetry Layer, OTA Distribution Engine, Fleet Health Dashboard",
    summary: "JSPARK Prime IoT Telemetry and OTA Control Platform was deployed for Munich Electrification Germany to monitor EV batteries at cell level and manage firmware/software remotely across fleets.",
    problems: [
      "No real-time visibility at cell level; diagnostics were available only at pack or module layer.",
      "Firmware updates required physical intervention, causing technician travel costs and downtime.",
      "Faults were often identified only after performance drop or breakdown, leading to premature replacement cycles.",
      "Fleet reliability data was scattered across systems with no unified fleet health dashboard."
    ],
    deployedLayers: [
      {
        layer: "Prime IoT Telemetry Layer",
        function: "Cell-Level Health Monitoring",
        description: "Voltage, temperature, and degradation trend modeling per individual battery cell."
      },
      {
        layer: "OTA Firmware Distribution Engine",
        function: "Remote Software Updates",
        description: "Controlled, staged, rollback-capable OTA deployments without physical field visits."
      },
      {
        layer: "Unified Fleet Health Dashboard",
        function: "Predictive Maintenance Intelligence",
        description: "Pack deviation scoring, early fault flagging, and remaining useful life prediction."
      }
    ],
    kpis: [
      { kpi: "Battery Fault Detection Lead Time", before: "Detected post-symptom", after: "Predicted 7–21 days earlier", improvement: "Proactive maintenance enabled" },
      { kpi: "Pack Downtime / Off-Road Time", before: "6–14 hours avg/incident", after: "2–6 hours", improvement: "45–65% reduction" },
      { kpi: "Firmware Update Deployment Effort", before: "Physical technician required", after: "100% remote OTA rollout", improvement: "Eliminated field servicing" },
      { kpi: "Fleet Reliability (MTBF)", before: "Baseline fleet averages", after: "+18% to +32% improvement", improvement: "Higher operational uptime" },
      { kpi: "Premature Battery Replacement", before: "Occasional avoidable replacements", after: "Reduced by 25–40%", improvement: "Substantial cost & lifecycle savings" }
    ],
    highlightMetric: "7-21 DAYS FAULT PREDICTION",
    keyTakeaway: "We enabled Munich Electrification to transition from reactive battery maintenance to predictive fleet intelligence, improving reliability by up to 32% and eliminating physical firmware update overhead through OTA control."
  },
];
