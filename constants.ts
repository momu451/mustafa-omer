import { ExperienceItem, EducationItem, Certification, SkillMetric, ProjectItem, OutcomeItem, ServiceArea } from './types';

export const PROFILE_SUMMARY = `Third-party and supplier risk specialist with 20+ years’ experience across financial services, banking, regulated technology and retail. Career characterised by consistent responsibility for managing supplier risk end to end, including intake, due diligence, onboarding, contractual controls, ongoing monitoring, escalation and exit.`;

export const PROFILE_SUBTEXT = `Strong track record improving control environments, reducing cost, stabilising operations and increasing transparency across complex vendor landscapes. Experienced working with procurement, legal, risk, compliance, technology and operations to operate practical, proportionate third-party risk processes and produce decision-grade management information in FCA and PRA regulated contexts, including GDPR, DPA and PECR.`;

export const COMMERCIAL_OUTCOMES: OutcomeItem[] = [
  { value: "~40%", label: "MarTech and CRM cost reduction" },
  { value: "~£1.3m", label: "Verified savings" },
  { value: "3m+", label: "Automated messages per year" },
  { value: "4.5x", label: "ROI modelled for platform migration" },
  { value: "~£1.6m", label: "Annual spend controlled" }
];

export const SERVICE_AREAS: ServiceArea[] = [
  {
    title: "Risk and Control",
    items: [
      "Third-party risk management and supplier assurance",
      "Supplier lifecycle management from intake to exit",
      "Due diligence, risk assessments and ongoing monitoring",
      "Contractual controls including MSA, SOW, SLA, service credits and exit rights"
    ]
  },
  {
    title: "Operations and Resilience",
    items: [
      "Outsourcing risk and operational resilience",
      "Business continuity and disaster recovery expectations",
      "Operational, data, cyber and integration risk",
      "Risk and workflow tooling: Archer, SAP Ariba, ServiceNow, JIRA"
    ]
  },
  {
    title: "Strategy and Governance",
    items: [
      "Regulatory awareness: FCA, PRA, GDPR, DPA, PECR, DORA",
      "Risk MI, dashboards and senior management reporting",
      "Stakeholder management across procurement, legal, risk, IT and operations",
      "Cost reduction and vendor landscape rationalisation"
    ]
  }
];

export const CORE_CAPABILITIES = [
  "Third-party risk management and supplier assurance",
  "Supplier lifecycle management from intake to exit",
  "Due diligence, risk assessments and ongoing monitoring",
  "Outsourcing risk and operational resilience",
  "Contractual controls including MSA, SOW, SLA, service credits and exit rights",
  "Business continuity and disaster recovery expectations",
  "Regulatory awareness: FCA, PRA, GDPR, DPA, PECR, DORA",
  "Operational, data, cyber and integration risk",
  "Risk MI, dashboards and senior management reporting",
  "Stakeholder management across procurement, legal, risk, IT and operations",
  "Risk and workflow tooling: Archer, SAP Ariba, SAP Concur, ServiceNow, JIRA"
];

// Data for Recharts Radar Chart
export const SKILL_DATA: SkillMetric[] = [
  { subject: 'Risk Mgmt', A: 100, fullMark: 100 },
  { subject: 'Regulatory', A: 90, fullMark: 100 },
  { subject: 'Operations', A: 95, fullMark: 100 },
  { subject: 'Data/Cyber', A: 85, fullMark: 100 },
  { subject: 'Strategy', A: 90, fullMark: 100 },
  { subject: 'Negotiation', A: 90, fullMark: 100 },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "lantern-2024",
    role: "Digital Transformation Lead",
    company: "Lantern Debt Services",
    period: "2024",
    summary: "Third-party risk responsibility for a critical outsourced collections platform.",
    achievements: [
      "Developed and secured board approval for an outsourced platform migration, framed around risk reduction, operational resilience and control improvement. Modelled c. 4.5x ROI, multi-year profit uplift and c. 3 FTE efficiency gains.",
      "Led supplier selection and onboarding including RFP design, due diligence, technical and operational risk assessment, information security review and commercial negotiation with enforceable SLAs and exit provisions.",
      "Identified operational and revenue risks using GA4, GTM and SQL, and designed a phased migration to limit customer impact, revenue risk and operational disruption."
    ]
  },
  {
    id: "plusx-2023",
    role: "CRM and Digital Marketing Manager",
    company: "Plus X Holdings",
    period: "2023 - 2024",
    summary: "Supplier performance, SLA and data risk oversight.",
    achievements: [
      "Conducted a detailed performance and SLA review of a core technology supplier, analysing API logs and error responses to identify integration failures, service gaps and data quality risks.",
      "Quantified approximately £44k of misaligned supplier spend across retainers, integrations and migrations. Reset commercials, SLAs and escalation paths, reducing financial leakage and operational exposure.",
      "Mapped supplier data flows to evidence data handling and consent risks, informing access control, error handling and remediation actions.",
      "Delivered a 30-day remediation plan covering data governance, consent management and audit trails.",
      "Tracked incidents and remediation through JIRA and ServiceNow."
    ]
  },
  {
    id: "cirium-2022",
    role: "Marketing Operations and Analytics Director",
    company: "Cirium",
    period: "2022 - 2023",
    summary: "Supplier consolidation and oversight role.",
    achievements: [
      "Rationalised the supplier and platform landscape, consolidating vendors and renegotiating contracts to deliver approximately £125k annual run-rate savings while improving control and auditability.",
      "Built supplier and platform performance MI using SQL, PySpark and Power BI on Azure, providing visibility of incidents, data quality risks and third-party dependencies.",
      "Worked with procurement, legal and information security to review vendor contracts, data processing arrangements and integration risk.",
      "Used ServiceNow to manage supplier incidents and issues."
    ]
  },
  {
    id: "oneclick-2022",
    role: "Product Manager",
    company: "One Click Group (Sky Betting and Gaming)",
    period: "2022",
    summary: "Regulated supplier change oversight.",
    achievements: [
      "Assessed supplier and control impacts of CRM and marketing tooling changes, ensuring alignment with regulatory and safer gambling obligations.",
      "Prioritised supplier-related work based on operational risk, incident history and revenue impact using JIRA."
    ]
  },
  {
    id: "morrisons-2021",
    role: "Senior Digital Product Manager",
    company: "WM Morrison Supermarkets",
    period: "2021 - 2022",
    summary: "Multi-supplier operational stability role.",
    achievements: [
      "Led app relaunch and platform changes with focus on supplier performance, SLAs, incident response and customer impact across multiple third-party providers.",
      "Clarified supplier ownership, escalation paths and support models, reducing recovery time for vendor-related incidents.",
      "Ensured third-party integrations were covered by appropriate controls, resilience considerations and KPIs."
    ]
  },
  {
    id: "informa-2021",
    role: "Product Owner, Marketing Platforms",
    company: "Informa",
    period: "2021",
    summary: "Enterprise supplier oversight.",
    achievements: [
      "Owned delivery and operation of enterprise platforms with significant third-party involvement.",
      "Assessed supplier and integration risk for new change including data flows, downtime exposure and external dependencies.",
      "Produced regular MI on supplier performance, incidents and remediation progress."
    ]
  },
  {
    id: "hsbc-2008",
    role: "Manager, Digital Third-Party Risk and Marketing",
    company: "HSBC",
    period: "2008 - 2021",
    summary: "Financial services anchor role with embedded third-party risk responsibility.",
    achievements: [
      "Managed approx £2m annual supplier spend across CRM, messaging and marketing technology vendors. Delivered verified savings through vendor consolidation, competitive RFPs and commercial renegotiation without weakening controls.",
      "Reduced MarTech and CRM run-rate costs by approx 40 percent, lowering operational complexity and supplier concentration risk.",
      "Led end-to-end RFP, due diligence and onboarding of a new Email/SMS supplier for MENA region, coordinating with Risk, Procurement, Legal, Compliance, Cybersecurity and IT.",
      "Embedded supplier risk controls into MSAs, SOWs and SLAs, including business continuity, disaster recovery expectations and structured exit planning.",
      "Produced supplier risk and performance MI and supported internal audit and external reviews with evidence and remediation tracking.",
      "Operated supplier risk reporting through Archer, SAP Ariba and SAP Concur."
    ]
  },
  {
    id: "barclays-2007",
    role: "Credit Risk Analyst",
    company: "Barclays",
    period: "2007 - 2008",
    summary: "",
    achievements: [
      "Built and maintained retail credit risk MI covering PD, LGD, EAD and portfolio performance.",
      "Delivered an estimated £150k annual benefit through improved provisioning accuracy and control-driven analysis.",
      "Designed reporting frameworks using Excel, SQL and SAS."
    ]
  },
  {
    id: "earlier-roles",
    role: "Web Developer and Data Lead",
    company: "Yellow Pages, Verbanet",
    period: "Earlier Roles",
    summary: "",
    achievements: [
      "Built and maintained web and data systems, forming a foundation in integration, data quality and operational resilience."
    ]
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    title: "Outsourced Platform Migration",
    context: "Strategic Transformation (Lantern)",
    description: "Developed and secured board approval for migration framed around risk reduction. Modelled c. 4.5x ROI, multi-year profit uplift and c. 3 FTE efficiency gains.",
    technologies: ["ROI Modelling", "RFP Design", "Risk Assessment"],
    link: "assets/platform-migration-case-study.pdf",
    linkText: "PDF"
  },
  {
    title: "Supplier Spend & SLA Remediation",
    context: "Commercial Optimization (Plus X)",
    description: "Quantified £44k of misaligned supplier spend. Reset commercials, SLAs and escalation paths, reducing financial leakage and operational exposure.",
    technologies: ["SLA Review", "Cost Control", "Data Remediation"],
    link: "assets/supplier-spend-remediation.pdf",
    linkText: "PDF"
  },
  {
    title: "Supplier Landscape Rationalisation",
    context: "Cost Reduction (Cirium)",
    description: "Rationalised supplier landscape, consolidating vendors to deliver approx £125k annual run-rate savings while improving control and auditability.",
    technologies: ["Vendor Consolidation", "Contract Negotiation", "Auditability"],
    link: "assets/supplier-rationalisation.pdf",
    linkText: "PDF"
  },
  {
    title: "Regulated Supplier Change Oversight",
    context: "Regulatory Compliance (Sky Betting)",
    description: "Assessed supplier and control impacts of CRM tooling changes, ensuring alignment with regulatory and safer gambling obligations.",
    technologies: ["Regulatory Compliance", "Operational Risk", "JIRA"],
    link: "assets/regulated-change-oversight.pdf",
    linkText: "PDF"
  },
  {
    title: "MarTech & CRM Cost Reduction",
    context: "Operational Efficiency (HSBC)",
    description: "Reduced run-rate costs by approx 40% and managed £2m annual spend. Delivered verified savings through competitive RFPs and renegotiation.",
    technologies: ["RFP Management", "Cost Reduction", "MarTech"],
    link: "assets/martech-cost-reduction.pdf",
    linkText: "PDF"
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    institution: "University of New South Wales",
    degree: "BSc Computer Science"
  },
  {
    institution: "Wharton, Columbia, MIT Sloan, IMD, INSEAD and Darden",
    degree: "Executive and professional programmes"
  }
];

export const CERTIFICATIONS: Certification[] = [
  { name: "ISC2 Certified in Cybersecurity", validity: "Valid to 2028" },
  { name: "Fortinet Certified Associate Cybersecurity", validity: "Valid to 2026" },
  { name: "Cyber & Third-Party Risk Governance (Self-directed)", validity: "Aligned to ISACA CISM domains" }
];

export const CONTACT_INFO = {
  email: "mail.omermustafa@gmail.com",
  phone: "+44 7462 479714",
  location: "Leeds, UK"
};