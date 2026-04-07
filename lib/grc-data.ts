export interface GRCLesson {
  id: string;
  title: string;
  duration: string; // e.g. "8 min read"
  content: string; // markdown-like plain text
  keyTakeaways: string[];
}

export interface GRCTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: GRCLesson[];
}

export interface GRCModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string; // tailwind gradient classes
  badge: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  topics: GRCTopic[];
}

export const grcModules: GRCModule[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1: GRC FUNDAMENTALS
  // ─────────────────────────────────────────────────────────────
  {
    id: "grc-fundamentals",
    slug: "grc-fundamentals",
    title: "GRC Fundamentals",
    description:
      "Understand what Governance, Risk, and Compliance means, why it matters, and how the three pillars work together to protect organisations.",
    icon: "landmark",
    color: "from-red-600 to-rose-700",
    badge: "Start Here",
    difficulty: "Beginner",
    estimatedTime: "45 min",
    topics: [
      {
        id: "what-is-grc",
        title: "What Is GRC?",
        description: "A plain-English introduction to Governance, Risk, and Compliance.",
        icon: "book-open",
        lessons: [
          {
            id: "grc-overview",
            title: "GRC at a Glance",
            duration: "7 min read",
            content: `GRC stands for Governance, Risk, and Compliance — three disciplines that together help an organisation achieve its objectives reliably while managing uncertainty and acting with integrity.

**Governance** defines the rules of the road: who makes decisions, how policies are created, and how accountability is enforced at every level of the organisation.

**Risk** is about identifying and managing the things that could go wrong — before they do. Good risk management turns uncertainty into advantage by helping leaders make informed decisions.

**Compliance** ensures the organisation meets its legal, regulatory, and contractual obligations. Failing to comply can result in fines, sanctions, reputational damage, and — in serious cases — criminal liability.

The three pillars are intertwined. Governance sets the policy; Risk tells you what to protect and why; Compliance verifies you are doing it correctly.`,
            keyTakeaways: [
              "GRC = Governance + Risk + Compliance — three complementary disciplines.",
              "Governance defines authority and accountability structures.",
              "Risk management reduces uncertainty and informs decisions.",
              "Compliance ensures legal and regulatory obligations are met.",
            ],
          },
          {
            id: "why-grc-matters",
            title: "Why GRC Matters for Security",
            duration: "6 min read",
            content: `Without a GRC programme, security teams operate reactively — patching vulnerabilities after attacks happen, scrambling to meet audit deadlines, and struggling to communicate risk in business terms.

A mature GRC programme shifts your security posture from reactive to proactive. Here is why that matters:

**Business alignment** — GRC links security controls directly to business objectives, making it easier to justify budget and resources to executive leadership.

**Regulatory pressure** — Organisations in healthcare, finance, government contracting, and many other sectors face strict data protection laws. GRC frameworks provide a structured way to demonstrate compliance.

**Incident resilience** — Organisations with mature GRC programmes recover faster from incidents because responsibility chains, communication protocols, and escalation paths are defined in advance.

**Third-party trust** — Customers and partners increasingly require proof of compliance (SOC 2 reports, ISO certificates) before doing business. GRC documentation makes obtaining that proof systematic.`,
            keyTakeaways: [
              "GRC moves security from reactive to proactive.",
              "Strong GRC links technical controls to business objectives.",
              "Regulatory compliance is a legal necessity, not optional.",
              "Mature GRC programmes accelerate post-incident recovery.",
            ],
          },
        ],
      },
      {
        id: "governance-pillar",
        title: "The Governance Pillar",
        description: "Policies, procedures, roles, accountability, and ethical culture.",
        icon: "scale",
        lessons: [
          {
            id: "policies-and-procedures",
            title: "Policies, Standards, and Procedures",
            duration: "9 min read",
            content: `The governance hierarchy runs from broad to specific:

**Policies** are high-level statements of intent signed by senior leadership. Example: "All sensitive data must be encrypted at rest and in transit." Policies rarely change; they reflect organisational values.

**Standards** translate policies into measurable requirements. Example: "Sensitive data at rest must use AES-256 encryption." Standards change when technology or the threat landscape evolves.

**Procedures** are step-by-step instructions telling staff exactly how to implement standards. Example: A documented process for enabling disk encryption on new laptops during provisioning.

**Guidelines** are optional best-practice recommendations that supplement procedures without being mandatory.

When writing policies:
- Use clear, plain language that non-technical staff can understand.
- Assign clear ownership (the policy owner is accountable for its accuracy).
- Include review dates — stale policies are as dangerous as no policies.
- Obtain formal sign-off from executive leadership.`,
            keyTakeaways: [
              "Policy → Standard → Procedure → Guideline: each layer adds specificity.",
              "Policies express intent; procedures specify action.",
              "Assign explicit ownership and review cadences to every document.",
              "All governance documents need executive sign-off to carry authority.",
            ],
          },
          {
            id: "roles-and-responsibilities",
            title: "Roles, Responsibilities & the Three Lines of Defence",
            duration: "8 min read",
            content: `The **Three Lines of Defence** model is the most widely used framework for distributing GRC responsibility across an organisation:

**First Line — Operational Ownership**
Business units and IT teams own day-to-day controls. They implement policies, operate systems securely, and are the first to notice when something is wrong. Security is "everyone's job" at this line.

**Second Line — Risk and Compliance Functions**
The CISO, Risk team, and Compliance team set standards, monitor controls, and provide oversight without being responsible for operational decisions. They act as advisers and challengers to the first line.

**Third Line — Internal Audit**
Independent assurance. Internal auditors examine whether controls designed by the second line are actually operating as the first line claims. Their findings go directly to the board / audit committee, not to management.

**External Audit and Regulators** sit outside all three lines; they provide independent validation to stakeholders beyond the organisation.

Key roles to know:
- **CISO** — Chief Information Security Officer; owns the information security programme.
- **CRO** — Chief Risk Officer; owns enterprise risk management.
- **DPO** — Data Protection Officer (required under GDPR); ensures data privacy compliance.
- **GRC Analyst** — Day-to-day management of risk registers, policy libraries, and audit evidence.`,
            keyTakeaways: [
              "Three Lines of Defence: Operations → Risk/Compliance → Internal Audit.",
              "Each line provides independent assurance, preventing conflicts of interest.",
              "CISO, CRO, and DPO are key GRC leadership roles.",
              "External auditors and regulators sit outside all three lines.",
            ],
          },
        ],
      },
      {
        id: "risk-pillar",
        title: "The Risk Pillar",
        description: "Risk identification, assessment, appetite, and treatment.",
        icon: "alert-triangle",
        lessons: [
          {
            id: "risk-basics",
            title: "Risk Fundamentals: Threat, Vulnerability, Impact",
            duration: "8 min read",
            content: `Risk in cybersecurity is typically expressed as:

**Risk = Likelihood × Impact**

Understanding the components:

**Threat** — An agent or event that could exploit a vulnerability. Examples: ransomware gangs, insider threats, natural disasters, software bugs.

**Vulnerability** — A weakness that a threat can exploit. Examples: unpatched software, misconfigured S3 buckets, lack of MFA.

**Impact** — The consequences if the threat successfully exploits the vulnerability. Examples: data breach, operational downtime, regulatory fines.

**Risk** — The product of likelihood (how probable is exploitation?) and impact (how bad would it be?).

Qualitative vs Quantitative Risk Assessment:
- **Qualitative** — Uses descriptive scales (Low / Medium / High / Critical). Fast and easy but subjective.
- **Quantitative** — Uses monetary values (Annual Loss Expectancy = Single Loss Expectancy × Annual Rate of Occurrence). More precise but harder to implement consistently.

Most organisations combine both: qualitative for initial triage, quantitative for high-priority risks that need budget justification.`,
            keyTakeaways: [
              "Risk = Likelihood × Impact — always consider both dimensions.",
              "Threats exploit vulnerabilities to cause impact.",
              "Qualitative scales are fast; quantitative models justify spend.",
              "ALE = SLE × ARO is the core quantitative risk formula.",
            ],
          },
          {
            id: "risk-register",
            title: "Building and Maintaining a Risk Register",
            duration: "10 min read",
            content: `A **Risk Register** is the central GRC artefact — a living document that records every identified risk, its assessment, and the organisation's response.

**Typical columns in a risk register:**
1. **Risk ID** — A unique identifier (e.g. RISK-0042).
2. **Risk Description** — A clear statement of the risk in plain language.
3. **Asset / Process Affected** — What is at stake.
4. **Threat Source** — The agent that could cause the risk.
5. **Inherent Likelihood** (1–5 scale).
6. **Inherent Impact** (1–5 scale).
7. **Inherent Risk Score** — Likelihood × Impact.
8. **Current Controls** — What is already in place to reduce the risk.
9. **Residual Likelihood / Impact / Score** — After controls are applied.
10. **Risk Treatment** — Avoid, Accept, Transfer, or Mitigate (see below).
11. **Risk Owner** — The person accountable for managing this risk.
12. **Review Date** — Risks must be reviewed regularly, especially after significant changes.

**Risk Treatment Options (the four T's):**
- **Tolerate (Accept)** — Residual risk is within appetite; no further action is taken.
- **Treat (Mitigate)** — Implement controls to reduce likelihood or impact.
- **Transfer** — Shift the financial impact to a third party (e.g. cyber insurance, contractual indemnity).
- **Terminate (Avoid)** — Discontinue the activity that creates the risk entirely.

**Risk Appetite vs Risk Tolerance:**
- **Appetite** — The broad-level risk an organisation is willing to pursue to achieve objectives.
- **Tolerance** — The acceptable deviation around the appetite threshold before escalation is required.`,
            keyTakeaways: [
              "Risk registers are living documents — review them regularly.",
              "Every risk needs an owner, a score, and a treatment decision.",
              "Four treatment options: Tolerate, Treat, Transfer, Terminate.",
              "Risk Appetite is strategic; Risk Tolerance is operational.",
            ],
          },
        ],
      },
      {
        id: "compliance-pillar",
        title: "The Compliance Pillar",
        description: "Regulatory landscape, audit evidence, and compliance mapping.",
        icon: "check-circle",
        lessons: [
          {
            id: "compliance-overview",
            title: "The Compliance Landscape",
            duration: "9 min read",
            content: `Compliance is not a single destination — it is a continuous journey through a landscape of overlapping regulations, standards, and contractual obligations.

**Types of compliance obligations:**

1. **Legal / Regulatory** — Imposed by government bodies with legal force. Non-compliance can result in fines, sanctions, or criminal liability.
   - Examples: GDPR (EU data protection), HIPAA (US healthcare), PCI DSS (payment cards), SOX (US public companies).

2. **Contractual** — Requirements imposed by customers or partners as a condition of doing business.
   - Examples: A cloud vendor requiring SOC 2 Type II, a government contractor requiring CMMC.

3. **Industry Standards** — Voluntary frameworks that become de-facto requirements in certain sectors.
   - Examples: ISO/IEC 27001, NIST Cybersecurity Framework, CIS Controls.

4. **Internal Policy Compliance** — Ensuring staff follow the organisation's own policies and procedures.

**The Compliance Process:**
1. **Scoping** — Identify which obligations apply to your organisation.
2. **Gap Assessment** — Compare current state against each requirement.
3. **Remediation** — Implement controls to close gaps.
4. **Evidence Collection** — Document that controls are operating effectively.
5. **Audit / Assessment** — Internal or external verification.
6. **Continuous Monitoring** — Ongoing assurance that controls remain effective.`,
            keyTakeaways: [
              "Compliance spans legal, contractual, voluntary, and internal obligations.",
              "GDPR, HIPAA, SOX, and PCI DSS are major regulatory frameworks.",
              "ISO 27001 and NIST CSF are widely adopted voluntary standards.",
              "Compliance is a cycle: scope → assess → remediate → evidence → audit → monitor.",
            ],
          },
          {
            id: "evidence-and-audits",
            title: "Evidence Collection and Audit Readiness",
            duration: "10 min read",
            content: `Auditors do not take your word for it — they require **evidence** that controls exist and are operating effectively.

**Types of Evidence:**
- **Screenshots** — Timestamped captures of system configurations, dashboards, or settings.
- **System-generated reports** — Export logs from SIEM, vulnerability scanners, or access management tools.
- **Signed documents** — Policy acknowledgement forms, change management records.
- **Interview notes** — Documented evidence that staff understand their responsibilities.
- **Configuration exports** — Infrastructure-as-code files, system configuration backups.

**Evidence Quality Principles (the "CAVE" model):**
- **Complete** — Does the evidence cover the full period under review?
- **Accurate** — Is it free from errors or manipulation?
- **Valid** — Does it directly demonstrate the control's operation?
- **Evidential** — Could a reasonable person accept it as proof?

**Audit Readiness Tips:**
1. **Maintain a continuous evidence library** — Do not scramble at audit time. Collect evidence as controls operate.
2. **Map evidence to controls** — A control matrix (spreadsheet mapping each requirement to evidence) is indispensable.
3. **Assign evidence owners** — Someone must be responsible for each piece of evidence.
4. **Conduct pre-audit walkthroughs** — Simulate the auditor's process before they arrive.
5. **Automate where possible** — GRC tools can collect and timestamp evidence automatically.`,
            keyTakeaways: [
              "Auditors require documented evidence, not verbal assurances.",
              "Good evidence is Complete, Accurate, Valid, and Evidential (CAVE).",
              "Maintain a continuous evidence library — don't wait for audit season.",
              "Map every piece of evidence to the control it supports.",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2: RISK MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  {
    id: "risk-management",
    slug: "risk-management",
    title: "Risk Management Deep Dive",
    description:
      "Master the end-to-end risk management lifecycle — from identification and quantification through to treatment plans, metrics, and board reporting.",
    icon: "alert-triangle",
    color: "from-orange-600 to-amber-600",
    badge: "Core Skill",
    difficulty: "Intermediate",
    estimatedTime: "60 min",
    topics: [
      {
        id: "risk-identification",
        title: "Risk Identification Techniques",
        description: "How to surface risks systematically before they become incidents.",
        icon: "search",
        lessons: [
          {
            id: "threat-modelling",
            title: "Threat Modelling for GRC Professionals",
            duration: "11 min read",
            content: `Threat modelling is the process of systematically identifying threats to a system so that controls can be prioritised appropriately. While it originated in software development, GRC professionals apply it at the enterprise level.

**STRIDE — The Classic Threat Model:**
Developed by Microsoft, STRIDE categorises threats into six types:
- **S**poofing — Impersonating another entity.
- **T**ampering — Modifying data without authorisation.
- **R**epudiation — Denying having performed an action.
- **I**nformation Disclosure — Exposing data to unauthorised parties.
- **D**enial of Service — Making a system unavailable.
- **E**levation of Privilege — Gaining capabilities beyond what is authorised.

**PASTA (Process for Attack Simulation and Threat Analysis):**
A seven-stage risk-centric threat modelling methodology that aligns business objectives with technical threats. Preferred when a more formal, documented threat modelling output is required.

**Practical Threat Identification Techniques:**
1. **Asset inventory** — You cannot protect what you do not know exists.
2. **Data flow diagrams (DFDs)** — Map how data moves across systems and trust boundaries.
3. **Attack trees** — Visualise how an attacker could achieve their goal through a tree of sub-goals.
4. **Workshops and red-teaming** — Structured brainstorming with cross-functional teams.
5. **Threat intelligence feeds** — MITRE ATT&CK, sector-specific ISACs keep your model current.`,
            keyTakeaways: [
              "STRIDE provides a structured vocabulary for threat categories.",
              "Threat modelling requires a complete asset inventory as a starting point.",
              "Data flow diagrams reveal where trust boundaries exist.",
              "MITRE ATT&CK maps real attacker techniques to defensive gaps.",
            ],
          },
          {
            id: "bia",
            title: "Business Impact Analysis (BIA)",
            duration: "10 min read",
            content: `A **Business Impact Analysis** quantifies the consequences of disruption to critical business functions. It is the foundation of both risk management and business continuity planning.

**Key BIA Metrics:**

**RTO — Recovery Time Objective**
The maximum acceptable time for a process or system to be offline after a disruption. Example: "Our payment processing system must be restored within 4 hours."

**RPO — Recovery Point Objective**
The maximum acceptable amount of data loss, measured in time. Example: "We can tolerate losing up to 1 hour of transaction data."

**MTTR — Mean Time to Recover**
The average time it actually takes to restore a system (a historical metric used to validate whether RTO targets are achievable).

**MTBF — Mean Time Between Failures**
The average time between system failures — used to understand reliability and predict risk likelihood.

**BIA Process:**
1. Identify critical business processes.
2. For each process, document dependencies (systems, staff, third parties, physical infrastructure).
3. Estimate financial and operational impact at different downtime thresholds (1 hour, 4 hours, 24 hours, 1 week).
4. Determine RTO and RPO for each process (set by the business, not IT).
5. Validate that current recovery capabilities can meet stated RTO/RPO.
6. Identify gaps and feed them into the risk register and BCP.`,
            keyTakeaways: [
              "BIA quantifies the cost of disruption to inform risk priorities.",
              "RTO = maximum downtime; RPO = maximum data loss.",
              "MTTR and MTBF validate whether recovery targets are achievable.",
              "BIA outputs feed directly into risk registers and continuity plans.",
            ],
          },
        ],
      },
      {
        id: "risk-frameworks",
        title: "Risk Frameworks and Standards",
        description: "NIST RMF, ISO 31000, FAIR — choosing and implementing the right approach.",
        icon: "layers",
        lessons: [
          {
            id: "nist-rmf",
            title: "NIST Risk Management Framework (RMF)",
            duration: "12 min read",
            content: `The **NIST Risk Management Framework** provides a disciplined, structured, and flexible process for managing security and privacy risk. Originally developed for US government agencies, it is now widely used in commercial organisations.

**The Seven Steps of NIST RMF:**

1. **Prepare** — Establish context: identify key stakeholders, define risk tolerance, and set up the organisational infrastructure for RMF.

2. **Categorise** — Classify information systems based on the potential impact of a security breach (Low, Moderate, High) using FIPS 199 criteria: Confidentiality, Integrity, Availability.

3. **Select** — Choose an appropriate set of security controls from NIST SP 800-53 based on the system categorisation.

4. **Implement** — Put the selected controls into operation, documenting how they are deployed.

5. **Assess** — Determine whether controls are implemented correctly, operating as intended, and producing the desired outcome.

6. **Authorise** — A senior official (Authorising Official) formally accepts the risk of operating the system based on the assessment results.

7. **Monitor** — Continuously track control effectiveness, document changes, and reassess risk on an ongoing basis.

**Key NIST Publications for GRC:**
- **NIST SP 800-53** — Security and Privacy Controls for Federal Information Systems.
- **NIST SP 800-37** — Guide for Applying the RMF.
- **NIST SP 800-30** — Guide for Conducting Risk Assessments.
- **NIST Cybersecurity Framework (CSF)** — Identify, Protect, Detect, Respond, Recover.`,
            keyTakeaways: [
              "NIST RMF has seven steps: Prepare → Categorise → Select → Implement → Assess → Authorise → Monitor.",
              "System categorisation (Low/Moderate/High) drives control selection.",
              "SP 800-53 is the master catalogue of security controls.",
              "Authorisation is a formal risk acceptance decision by a senior official.",
            ],
          },
          {
            id: "fair-model",
            title: "FAIR: Quantitative Risk Analysis",
            duration: "10 min read",
            content: `**FAIR (Factor Analysis of Information Risk)** is the leading quantitative risk model. It translates qualitative risk descriptions into financial impact estimates, making risk conversations accessible to the board.

**The FAIR Ontology:**
Risk is decomposed into two primary factors:

**Loss Event Frequency (LEF)** — How often can we expect to experience a loss?
- Threat Event Frequency × Vulnerability Probability = LEF

**Probable Loss Magnitude (PLM)** — How much would we lose per event?
- Primary Loss + Secondary Loss = PLM

**Loss Forms in FAIR:**
1. Productivity — Lost revenue from operational disruption.
2. Response — Incident response costs (forensics, legal, PR).
3. Replacement — Cost to restore or replace assets.
4. Competitive Advantage — Revenue lost to competitors during downtime.
5. Fines and Judgments — Regulatory penalties and legal settlements.
6. Reputation — Long-term revenue impact from brand damage.

**FAIR in Practice:**
FAIR analysis outputs a probability distribution (e.g. "there is a 90% chance the annual loss from this risk is between $200K and $2M, with a most-likely estimate of $650K"). This range communicates uncertainty honestly, rather than false precision.

**Monte Carlo Simulation** is commonly used with FAIR to generate these distributions by running thousands of risk scenarios.`,
            keyTakeaways: [
              "FAIR produces financial risk estimates, not just colour-coded heat maps.",
              "Risk = Loss Event Frequency × Probable Loss Magnitude.",
              "FAIR recognises six types of loss: productivity, response, replacement, competitive, fines, reputation.",
              "Monte Carlo simulation generates probability distributions from FAIR models.",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 3: KEY FRAMEWORKS
  // ─────────────────────────────────────────────────────────────
  {
    id: "key-frameworks",
    slug: "key-frameworks",
    title: "Key GRC Frameworks",
    description:
      "ISO 27001, NIST CSF, SOC 2, PCI DSS, GDPR, and HIPAA — understand what each requires and how they fit together.",
    icon: "layout-grid",
    color: "from-blue-600 to-indigo-700",
    badge: "Essential",
    difficulty: "Intermediate",
    estimatedTime: "75 min",
    topics: [
      {
        id: "iso-27001",
        title: "ISO/IEC 27001",
        description: "The international standard for information security management systems.",
        icon: "globe",
        lessons: [
          {
            id: "iso-overview",
            title: "ISO 27001 Overview and Structure",
            duration: "12 min read",
            content: `**ISO/IEC 27001** is the global standard for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).

**The Plan-Do-Check-Act (PDCA) Cycle:**
ISO 27001 is built on PDCA:
- **Plan** — Establish the ISMS: define scope, conduct risk assessment, select controls.
- **Do** — Implement the ISMS: put controls into operation, run security awareness training.
- **Check** — Monitor and review: conduct internal audits, management reviews, and measure performance.
- **Act** — Improve continuously: correct nonconformities, implement improvements.

**The Standard's Structure:**
- **Clauses 4–10** — The mandatory requirements (what you must do).
- **Annex A** — 93 controls across 4 themes (not all need to be implemented; selection is risk-based).

**Annex A Themes (ISO 27001:2022):**
- **Organisational Controls (clause 5)** — 37 controls: policies, roles, threat intelligence, information security in projects.
- **People Controls (clause 6)** — 8 controls: screening, training, disciplinary process, remote working.
- **Physical Controls (clause 7)** — 14 controls: perimeter security, clean desk, equipment maintenance.
- **Technological Controls (clause 8)** — 34 controls: access control, malware protection, cryptography, vulnerability management.

**Certification Process:**
1. **Gap Assessment** — Compare current state to standard requirements.
2. **ISMS Implementation** — Build policies, procedures, risk register, and Statement of Applicability (SoA).
3. **Internal Audit** — Verify readiness.
4. **Stage 1 Audit** — Certification body reviews documentation.
5. **Stage 2 Audit** — On-site verification that the ISMS is operating.
6. **Certification** — Certificate issued (valid 3 years, with annual surveillance audits).`,
            keyTakeaways: [
              "ISO 27001 is a risk-based ISMS standard, not a prescriptive checklist.",
              "Clauses 4–10 are mandatory; Annex A controls are selected based on risk.",
              "PDCA drives continuous improvement of the ISMS.",
              "Certification requires two-stage external audit by an accredited body.",
            ],
          },
          {
            id: "soa",
            title: "Statement of Applicability (SoA)",
            duration: "8 min read",
            content: `The **Statement of Applicability (SoA)** is one of the most important documents in an ISO 27001 ISMS. It is a living spreadsheet or database that records:

1. **Every Annex A control** — All 93 controls must be listed.
2. **Applicability** — Is this control applicable to your organisation? (Yes/No)
3. **Justification for Exclusion** — If a control is excluded, you must document a clear business or risk-based reason. Unjustified exclusions are a finding in the audit.
4. **Implementation Status** — Not started / In progress / Implemented.
5. **Evidence Reference** — Link to the policy, procedure, or system that demonstrates the control is in place.

**Why the SoA matters:**
The SoA is the bridge between your risk assessment and your control set. Your auditor will trace a sample of risks from your risk register through to the corresponding controls in the SoA and then to the evidence that those controls are operating. If any link in this chain is broken, it is a nonconformity.

**Common SoA Mistakes:**
- Copying a generic SoA from the internet without tailoring it to your risk assessment.
- Marking controls as "implemented" when only a policy document exists (policies alone are not implementation evidence).
- Failing to update the SoA after significant changes to systems or the business.`,
            keyTakeaways: [
              "SoA lists all 93 Annex A controls with applicability and justification.",
              "Exclusions require documented, risk-based justification.",
              "Auditors trace risks → SoA → evidence: every link must hold.",
              "The SoA is a living document — update it when the business changes.",
            ],
          },
        ],
      },
      {
        id: "nist-csf",
        title: "NIST Cybersecurity Framework",
        description: "The flexible, outcome-based framework for managing cyber risk.",
        icon: "shield-check",
        lessons: [
          {
            id: "csf-overview",
            title: "NIST CSF 2.0: Core, Tiers, and Profiles",
            duration: "11 min read",
            content: `The **NIST Cybersecurity Framework (CSF)** is a voluntary framework developed in 2014 (updated to version 2.0 in 2024) to help organisations manage cybersecurity risk. It is widely used by US organisations but has become globally influential.

**The CSF Core — Six Functions (CSF 2.0):**
1. **Govern (GV)** — NEW in 2.0. Establish and monitor the organisation's cybersecurity risk management strategy, expectations, and policy.
2. **Identify (ID)** — Understand your assets, risks, and vulnerabilities.
3. **Protect (PR)** — Implement safeguards to ensure delivery of critical services.
4. **Detect (DE)** — Identify cybersecurity events as quickly as possible.
5. **Respond (RS)** — Take action when a cybersecurity incident is detected.
6. **Recover (RC)** — Restore capabilities and services impaired by a cybersecurity incident.

Each function contains **Categories** (outcomes) and **Subcategories** (specific activities). In CSF 2.0, there are 6 functions, 22 categories, and ~106 subcategories.

**CSF Implementation Tiers:**
- **Tier 1 — Partial** — Ad hoc, reactive. Limited awareness of cybersecurity risk.
- **Tier 2 — Risk-Informed** — Practices exist but are not consistently applied organisation-wide.
- **Tier 3 — Repeatable** — Formally approved processes consistently applied across the organisation.
- **Tier 4 — Adaptive** — Organisation actively adapts practices based on lessons learned and predictive analytics.

**CSF Profiles:**
A profile describes the current or desired state of cybersecurity outcomes. A **Current Profile** maps your existing controls to CSF subcategories; a **Target Profile** maps where you want to be. The gap between them is your improvement roadmap.`,
            keyTakeaways: [
              "CSF 2.0 added a Govern function, recognising GRC as the foundation.",
              "Six functions: Govern → Identify → Protect → Detect → Respond → Recover.",
              "Tiers describe process maturity, not compliance level.",
              "Current Profile vs Target Profile drives the improvement roadmap.",
            ],
          },
        ],
      },
      {
        id: "pci-gdpr",
        title: "PCI DSS & GDPR Essentials",
        description: "Payment card data security and personal data protection requirements.",
        icon: "lock",
        lessons: [
          {
            id: "pci-dss",
            title: "PCI DSS: Protecting Cardholder Data",
            duration: "10 min read",
            content: `**PCI DSS (Payment Card Industry Data Security Standard)** is a set of requirements designed to ensure that all companies that process, store, or transmit credit card information maintain a secure environment.

**The 12 PCI DSS Requirements (v4.0):**
1. Install and maintain network security controls.
2. Apply secure configurations to all system components.
3. Protect stored account data.
4. Protect cardholder data with strong cryptography during transmission over open, public networks.
5. Protect all systems and networks from malicious software.
6. Develop and maintain secure systems and software.
7. Restrict access to system components and cardholder data by business need to know.
8. Identify users and authenticate access to system components.
9. Restrict physical access to cardholder data.
10. Log and monitor all access to system components and cardholder data.
11. Test security of systems and networks regularly.
12. Support information security with organisational policies and programmes.

**Merchant Levels:**
- **Level 1** — >6 million transactions/year: annual on-site QSA audit + quarterly network vulnerability scans.
- **Level 2** — 1–6 million: annual SAQ + quarterly scans.
- **Level 3 & 4** — Smaller volumes: SAQ (Self-Assessment Questionnaire).

**Scope Reduction:**
Reducing the number of systems that touch cardholder data reduces compliance scope. Tokenisation and Point-to-Point Encryption (P2PE) are the most effective scope-reduction techniques.`,
            keyTakeaways: [
              "PCI DSS has 12 requirements covering network, data, access, monitoring, and policy.",
              "Assessment method depends on merchant level (transaction volume).",
              "Tokenisation and P2PE are the best tools for scope reduction.",
              "Version 4.0 emphasises customised implementation and continuous security.",
            ],
          },
          {
            id: "gdpr",
            title: "GDPR: Principles, Rights, and Obligations",
            duration: "12 min read",
            content: `**GDPR (General Data Protection Regulation)** came into force on 25 May 2018 and applies to any organisation that processes personal data of EU/EEA residents, regardless of where the organisation is located.

**Seven GDPR Principles (Article 5):**
1. **Lawfulness, Fairness, and Transparency** — Processing must have a legal basis and be transparent to data subjects.
2. **Purpose Limitation** — Data may only be used for the specific purpose it was collected.
3. **Data Minimisation** — Collect only data that is adequate, relevant, and necessary.
4. **Accuracy** — Keep personal data accurate and up to date.
5. **Storage Limitation** — Do not retain data longer than necessary.
6. **Integrity and Confidentiality** — Protect data with appropriate security measures.
7. **Accountability** — Be able to demonstrate compliance with all principles.

**Six Lawful Bases for Processing:**
1. Consent
2. Contractual necessity
3. Legal obligation
4. Vital interests
5. Public task
6. Legitimate interests

**Key Data Subject Rights:**
- Right of access (Subject Access Request / SAR)
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object

**Breach Notification:**
Personal data breaches must be reported to the relevant supervisory authority within **72 hours** of becoming aware of the breach (if it poses a risk to individuals). High-risk breaches must also be notified to the affected individuals without undue delay.

**Penalties:**
- Up to €10M or 2% of global annual turnover (lower-tier violations).
- Up to €20M or 4% of global annual turnover (higher-tier violations, including breaches of core principles).`,
            keyTakeaways: [
              "GDPR applies globally if you process EU/EEA resident data.",
              "Seven principles: Lawful → Transparent → Minimal → Accurate → Limited → Secure → Accountable.",
              "Breach notification to supervisory authority: 72-hour deadline.",
              "Maximum fines: €20M or 4% of global annual turnover.",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 4: GRC IN PRACTICE
  // ─────────────────────────────────────────────────────────────
  {
    id: "grc-in-practice",
    slug: "grc-in-practice",
    title: "GRC in Practice",
    description:
      "Vendor risk management, supply chain security, GRC tooling, metrics and KPIs, and building a GRC programme from scratch.",
    icon: "wrench",
    color: "from-emerald-600 to-teal-700",
    badge: "Applied",
    difficulty: "Intermediate",
    estimatedTime: "55 min",
    topics: [
      {
        id: "vendor-risk",
        title: "Third-Party & Vendor Risk Management",
        description: "Managing risk that originates outside your boundaries.",
        icon: "users",
        lessons: [
          {
            id: "vrm-overview",
            title: "Vendor Risk Management (VRM) Essentials",
            duration: "11 min read",
            content: `Most modern organisations rely heavily on third parties — cloud providers, SaaS vendors, outsourced IT, legal firms, and logistics partners. Each of these relationships introduces risk into your environment that you cannot control directly.

**Why Third-Party Risk Matters:**
High-profile supply chain attacks (e.g. SolarWinds, Kaseya, 3CX) demonstrated that a trusted vendor can become your biggest threat vector. Regulators have responded: DORA (EU financial sector), NIS2, and HIPAA all impose third-party risk requirements.

**The Third-Party Risk Lifecycle:**
1. **Identification** — Maintain a inventory of all third parties and the data/systems they access.
2. **Classification (Tiering)** — Rank vendors by risk level based on data sensitivity + access level + criticality to business operations:
   - Tier 1: Critical vendors with access to sensitive data or systems (deep due diligence required).
   - Tier 2: Moderate risk vendors (standard due diligence).
   - Tier 3: Low-risk vendors (lightweight due diligence or self-assessment questionnaire).
3. **Due Diligence** — Before onboarding: security questionnaires (CAIQ, SIG), review of certifications (ISO 27001, SOC 2), contractual security requirements.
4. **Ongoing Monitoring** — Post-onboarding: periodic re-assessment, continuous monitoring tools, tracking of newsworthy events (breaches, financial instability).
5. **Offboarding** — Ensure data is returned or destroyed, access is revoked, and obligations are documented.

**Key Contractual Clauses to Include:**
- Data Processing Agreement (DPA) if the vendor processes personal data under GDPR.
- Right-to-audit clause giving you the right to assess vendor security posture.
- Breach notification requirements (faster than regulatory minimums recommended).
- Security incident notification timelines.
- Sub-contractor approval requirements.`,
            keyTakeaways: [
              "Third-party risk extends your attack surface beyond your direct control.",
              "Tier vendors by risk level: critical, moderate, low.",
              "Due diligence uses questionnaires (CAIQ, SIG) and certifications (SOC 2, ISO 27001).",
              "Contracts must include DPA, right-to-audit, and breach notification clauses.",
            ],
          },
        ],
      },
      {
        id: "grc-metrics",
        title: "GRC Metrics & Board Reporting",
        description: "KPIs, KRIs, and communicating risk to non-technical stakeholders.",
        icon: "bar-chart",
        lessons: [
          {
            id: "kpi-kri",
            title: "KPIs, KRIs, and Effective Board Reporting",
            duration: "10 min read",
            content: `A common failure in GRC programmes is collecting vast amounts of data but failing to communicate actionable insights to leadership. The solution is disciplined use of metrics.

**Key Performance Indicators (KPIs):**
KPIs measure how well your security controls are performing. They answer: "Are we doing the things we said we would do?"

Examples:
- % of systems with current vulnerability scans (target: 100%)
- % of critical patches applied within SLA (target: >95%)
- % of staff who have completed annual security training (target: 100%)
- Mean time to detect (MTTD) and mean time to respond (MTTR) to security events.

**Key Risk Indicators (KRIs):**
KRIs are early warning signals. They answer: "Are risk levels moving in the wrong direction?"

Examples:
- Number of critical vulnerabilities open >30 days (upward trend = risk increasing).
- Number of failed login attempts per week (spike = possible brute-force campaign).
- Number of third-party assessments overdue (indicates increasing supply chain risk).
- Employee satisfaction scores in security awareness surveys (declining = culture risk).

**Building an Effective Board Dashboard:**
The board is not interested in technical details — they want to understand:
1. **What is our current risk posture?** (Is our overall risk level acceptable?)
2. **Are things improving or deteriorating?** (Trend over time.)
3. **What are the top risks?** (The three risks most likely to cause material harm.)
4. **Are we compliant?** (Status of key regulatory requirements.)
5. **What are we doing about it?** (Remediation progress.)

Present risk in financial terms where possible. "We have 47 critical vulnerabilities" is less useful to the board than "Unpatched systems expose us to an estimated $2.4M annualised risk of ransomware disruption."`,
            keyTakeaways: [
              "KPIs measure control performance; KRIs signal rising risk.",
              "Track MTTD and MTTR as operational resilience KPIs.",
              "Board wants risk posture, trends, top risks, compliance status, and remediation.",
              "Translate technical metrics into financial impact for executive audiences.",
            ],
          },
        ],
      },
      {
        id: "grc-tools",
        title: "GRC Tooling Overview",
        description: "Platforms, automation, and building a lean GRC tech stack.",
        icon: "settings",
        lessons: [
          {
            id: "grc-platforms",
            title: "GRC Platforms and Automation",
            duration: "9 min read",
            content: `As GRC programmes mature, manual spreadsheets become unmanageable. GRC platforms provide centralised management of risks, controls, evidences, audits, and compliance mappings.

**Categories of GRC Tooling:**

**Integrated GRC (IGRM) Platforms:**
Full-suite platforms that manage the entire GRC lifecycle. Examples:
- ServiceNow GRC
- RSA Archer
- MetricStream
- OneTrust

**Compliance Automation Platforms:**
Focus on automating evidence collection for specific frameworks (SOC 2, ISO 27001, PCI DSS). Examples:
- Vanta
- Drata
- Tugboat Logic (OneTrust)
- Secureframe

**Risk Management Tools:**
Specialised tools for quantitative risk analysis. Examples:
- RiskLens (FAIR-based)
- LogicGate

**Vendor Risk Management Platforms:**
- SecurityScorecard
- CyberGRX (now CyberVadis)
- BitSight
- UpGuard

**Choosing a GRC Tool:**
Key selection criteria:
1. Framework coverage (which regulatory frameworks does it support out of the box?)
2. Integration capabilities (can it connect to your existing tech stack via API?)
3. Evidence collection automation (does it auto-collect vs. require manual uploads?)
4. Workflow and notification support.
5. Reporting quality (can you generate board-ready dashboards?)
6. Total cost of ownership (licences + implementation + ongoing administration).

**Small Organisations:**
Many effective GRC programmes start with a well-structured spreadsheet. A risk register in Google Sheets or Excel, combined with a document library and a clear review calendar, is entirely sufficient for organisations with fewer than 50 employees.`,
            keyTakeaways: [
              "GRC platforms centralise risk, controls, evidence, and compliance tracking.",
              "Compliance automation tools (Vanta, Drata) focus on evidence collection for specific frameworks.",
              "Vendor risk platforms (SecurityScorecard, BitSight) provide continuous third-party monitoring.",
              "Small organisations can start with well-structured spreadsheets and scale later.",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 5: CYBERSECURITY COMPLIANCE CAREERS
  // ─────────────────────────────────────────────────────────────
  {
    id: "grc-careers",
    slug: "grc-careers",
    title: "GRC Career Pathways",
    description:
      "Explore roles, certifications, salary benchmarks, and how to break into GRC from a technical or non-technical background.",
    icon: "target",
    color: "from-purple-600 to-violet-700",
    badge: "Career",
    difficulty: "Beginner",
    estimatedTime: "40 min",
    topics: [
      {
        id: "grc-roles",
        title: "GRC Roles and Career Paths",
        description: "Junior analyst to CISO — understand the career landscape.",
        icon: "briefcase",
        lessons: [
          {
            id: "roles-overview",
            title: "GRC Roles: From Analyst to CISO",
            duration: "10 min read",
            content: `GRC is one of the fastest-growing areas of cybersecurity. Unlike technical roles that require deep coding or hacking skills, GRC roles require analytical thinking, communication, and structured problem-solving — making them accessible to people from a variety of backgrounds.

**Entry-Level Roles (0–3 years):**
- **GRC Analyst** — Maintains risk registers, collects audit evidence, tracks remediation tasks. Starting salary: £35K–£50K / $55K–$80K.
- **Compliance Analyst** — Monitors regulatory requirements, tracks controls, prepares audit reports.
- **Security Awareness Coordinator** — Designs and delivers security training programmes.

**Mid-Level Roles (3–7 years):**
- **GRC Manager / Information Security Manager** — Owns specific compliance programmes (ISO 27001, SOC 2). Manages small teams. Salary: £55K–£80K / $90K–$130K.
- **Risk Manager** — Owns the enterprise risk register, runs risk workshops, reports to CRO / CISO.
- **Data Protection Officer (DPO)** — Required by GDPR for many organisations; advises on data privacy and manages compliance.

**Senior / Leadership Roles (7+ years):**
- **Head of GRC / VP of Compliance** — Leads the GRC function, manages the team, owns the GRC programme strategy.
- **Chief Risk Officer (CRO)** — C-suite role owning enterprise risk management.
- **Chief Information Security Officer (CISO)** — Owns the entire information security programme, including GRC. Salary: £120K–£250K+ / $180K–$400K+.

**Breaking In from a Technical Background:**
Technical professionals (sysadmins, developers, security engineers) bring huge value to GRC because they understand how controls actually work. Focus on developing communication, documentation, and business-risk communication skills.

**Breaking In from a Non-Technical Background:**
Law, audit, finance, and business administration backgrounds are highly valued. Focus on developing enough technical literacy to understand cyber threats and controls at a conceptual level.`,
            keyTakeaways: [
              "GRC roles range from Analyst (£35K) to CISO (£250K+).",
              "Both technical and non-technical backgrounds can transition into GRC.",
              "Key skills: analytical thinking, documentation, risk communication, stakeholder management.",
              "DPO is a legally required role under GDPR for many organisations.",
            ],
          },
          {
            id: "certifications",
            title: "GRC Certifications Worth Pursuing",
            duration: "9 min read",
            content: `Certifications validate your knowledge to employers and clients. Here is a practical guide to the most recognised GRC certifications.

**Foundation Level:**
- **CompTIA Security+** — Entry-level vendor-neutral security certification covering risk, compliance, and technical controls. Excellent first certification.
- **ISACA CISM foundations / IT Risk Fundamentals** — ISACA offers free online foundations courses as entry points.
- **ISO 27001 Foundation** — Available from multiple providers; demonstrates conceptual knowledge of the standard.

**Intermediate Level:**
- **CISA (Certified Information Systems Auditor)** — ISACA. The gold standard for IT audit, risk, and compliance. Requires 5 years of experience.
- **CRISC (Certified in Risk and Information Systems Control)** — ISACA. Focused on enterprise risk and control. Highly valued by employers.
- **ISO 27001 Lead Implementer** — Demonstrates ability to implement and manage an ISMS.
- **ISO 27001 Lead Auditor** — Demonstrates ability to audit an ISMS. Valuable for GRC assurance roles.

**Advanced / Leadership Level:**
- **CISSP (Certified Information Systems Security Professional)** — (ISC)². The most recognised senior security certification. Covers all domains including GRC. Requires 5 years of experience.
- **CISM (Certified Information Security Manager)** — ISACA. Management-focused ISMS certification. Highly valued for CISO track roles.
- **CGEIT (Certified in the Governance of Enterprise IT)** — ISACA. Senior IT governance certification.
- **CIPM (Certified Information Privacy Manager)** — IAPP. Specialised in privacy programme management; ideal if focused on GDPR/DPO track.

**Study Strategy:**
Start with Security+ to build a baseline, then pursue CISA or CRISC based on whether you lean toward audit or risk management. CISSP or CISM are long-term targets for leadership roles.`,
            keyTakeaways: [
              "Start with Security+ as an accessible baseline certification.",
              "CISA is the audit gold standard; CRISC leads the risk track.",
              "CISSP and CISM are the premier senior GRC certifications.",
              "ISO 27001 Lead Implementer/Auditor certifications are highly practical.",
            ],
          },
        ],
      },
    ],
  },
];

// Helper to get a module by slug
export function getModuleBySlug(slug: string): GRCModule | undefined {
  return grcModules.find((m) => m.slug === slug);
}

// Helper to get a topic by moduleSlug and topicId
export function getTopicById(moduleSlug: string, topicId: string): GRCTopic | undefined {
  const mod = getModuleBySlug(moduleSlug);
  return mod?.topics.find((t) => t.id === topicId);
}

// Helper to get a lesson
export function getLessonById(
  moduleSlug: string,
  topicId: string,
  lessonId: string
): GRCLesson | undefined {
  const topic = getTopicById(moduleSlug, topicId);
  return topic?.lessons.find((l) => l.id === lessonId);
}

// Count total lessons across all modules
export function countTotalLessons(): number {
  return grcModules.reduce(
    (total, mod) =>
      total + mod.topics.reduce((t2, topic) => t2 + topic.lessons.length, 0),
    0
  );
}
