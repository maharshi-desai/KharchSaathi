# KharchSaathi  
### Because every rupee deserves attention.

---

## Project Title  
KharchSaathi – Personal Finance Anomaly Detector

## One-line Project Description  
A lightweight, client-side web application that detects unusual financial behavior from bank transaction CSV files using explainable rule-based anomaly detection.

---

# 1. Problem Statement

## Problem Title  
Lack of Proactive Financial Anomaly Detection for Individuals

## Problem Description  
With the rise of digital banking, UPI, and online transactions, individuals generate large volumes of financial data. However:

- Users rarely receive alerts for unusual spending.
- Fraudulent or abnormal transactions often go unnoticed.
- Banks provide only basic summaries.
- Financial awareness remains reactive instead of proactive.

There is a need for a simple, user-centric system that analyzes transaction history and highlights unusual financial behavior.

## Target Users  
- Students managing monthly expenses  
- Working professionals tracking spending  
- Individuals using digital payments frequently  
- Anyone seeking better financial awareness  

## Existing Gaps  
- No lightweight personal anomaly detection tools  
- Limited explainable alerts  
- No behavior-based spending analysis in basic banking apps  

---

# 2. Problem Understanding & Approach

## Root Cause Analysis  
- Users do not manually analyze transaction history.
- No baseline comparison is performed on spending behavior.
- Alerts are not personalized.
- Lack of accessible financial analysis tools.

## Solution Strategy  
- Parse transaction CSV files directly in browser.
- Normalize transaction data.
- Categorize spending automatically.
- Build spending baseline (average behavior).
- Apply rule-based anomaly detection.
- Provide explainable risk scoring.
- Visualize results for better understanding.

---

# 3. Proposed Solution

## Solution Overview  
KharchSaathi is a browser-based financial anomaly detection tool that processes CSV transaction data and highlights unusual financial patterns.

## Core Idea  
Transform raw transaction data into actionable financial insights using simple, explainable rules and visual dashboards.

## Key Features  

 CSV Upload (Client-side)  
 Automatic Transaction Parsing  
 Smart Categorization (Food, Travel, Shopping, etc.)  
 High-Value Transaction Detection  
 New Merchant Detection  
 Category Spending Spike Detection  
 Risk Score Calculation  
 Visual Spending Dashboard  

---

# 4. System Architecture

## High-Level Flow  

User → Frontend (Browser) → CSV Parser → Data Processing Engine → Anomaly Detection Logic → Visualization Dashboard

Since KharchSaathi is fully client-side:

User → Frontend → Processing Logic → Output

## Architecture Description  

- User uploads CSV file.
- PapaParse converts CSV into JavaScript objects.
- Transactions are normalized.
- Categorization logic assigns categories.
- Spending baseline is calculated.
- Anomaly rules are applied.
- Risk score is computed.
- Results are displayed using Chart.js.

## Architecture Diagram  

(Add system architecture diagram image here)

---

# 5. Database Design

KharchSaathi currently operates fully client-side and does not require a database.

Transactions are stored in memory during runtime.

## ER Diagram  

(Add ER diagram image here)

### ER Diagram Description  

If extended with backend storage:

Entities:
- User
- Transaction
- Category
- Anomaly

Relationships:
- User has many Transactions
- Transaction belongs to one Category
- Transaction may generate one or more Anomalies

---

# 6. Dataset Selected

## Dataset Name  
User-uploaded Bank Transaction CSV

## Source  
User-provided CSV file

## Data Type  
Structured tabular data

Columns:
- Date
- Description
- Amount

## Selection Reason  
- Real-world financial data
- Structured and easy to parse
- Relevant for anomaly detection

## Preprocessing Steps  
- CSV parsing using PapaParse
- Data normalization
- Conversion of amount to numeric type
- Lowercasing descriptions
- Removing invalid rows

---

# 7. Model Selected

## Model Name  
Rule-Based Anomaly Detection

## Selection Reasoning  
- Lightweight and interpretable
- No backend required
- Easily explainable to users
- Suitable for hackathon timeline

## Alternatives Considered  
- Z-score statistical detection
- Isolation Forest
- Supervised classification models

## Evaluation Metrics  
- Correct identification of abnormal transactions
- False positive reduction
- User interpretability

---

# 8. Technology Stack

## Frontend  
- HTML  
- CSS  
- JavaScript  

## Backend  
Not required (Fully client-side implementation)

## ML/AI  
Rule-based anomaly detection logic

## Database  
None (In-memory processing)

## Deployment  
Can be hosted using:
- Netlify
- Vercel

---

# 9. API Documentation & Testing

KharchSaathi does not use external APIs.

All processing happens within the browser.

## API Endpoints List  
Not applicable.

## API Testing Screenshots  
(Add screenshots if backend version is implemented)

---

# 10. Module-wise Development & Deliverables

## Checkpoint 1: Research & Planning  
Deliverables:
- Problem understanding
- Feature planning
- System design outline

## Checkpoint 2: Backend Development  
Deliverables:
- Not applicable (client-side implementation)

## Checkpoint 3: Frontend Development  
Deliverables:
- CSV upload interface
- Dashboard UI
- Chart integration

## Checkpoint 4: Model Development  
Deliverables:
- Spending baseline logic
- Anomaly detection rules
- Risk scoring function

## Checkpoint 5: Model Integration  
Deliverables:
- Linking parsing, detection, and UI
- Displaying anomaly alerts

## Checkpoint 6: Deployment  
Deliverables:
- Live hosting setup
- Demo-ready version

---

# 11. End-to-End Workflow

1. User uploads CSV file.
2. CSV parsed using PapaParse.
3. Transactions converted into JavaScript objects.
4. Categorization applied.
5. Spending baseline calculated.
6. Anomaly detection rules executed.
7. Risk score generated.
8. Visual dashboard updated.

---

# 12. Demo & Video

Live Demo Link: (Add link here)  
Demo Video Link: (Add link here)  
GitHub Repository: (Add link here)

---

# 13. Hackathon Deliverables Summary

- Fully working client-side anomaly detection system
- Visual spending dashboard
- Risk scoring mechanism
- Explainable alerts
- Real-time CSV analysis

---

# 14. Future Scope & Scalability

## Short-Term  
- PDF statement support  
- Advanced statistical detection (z-score)  
- Improved categorization  

## Long-Term  
- Backend storage  
- User authentication  
- ML-based anomaly detection  
- Real-time bank API integration  
- Mobile application version  

---

# 15. Known Limitations

- Only supports CSV format currently  
- Rule-based detection may produce false positives  
- No persistent storage  
- No real-time bank integration  

---

# 16. Impact

KharchSaathi promotes financial awareness by:

- Encouraging proactive spending monitoring  
- Detecting unusual transactions early  
- Providing explainable financial insights  
- Making personal finance analysis accessible to everyone  

---
