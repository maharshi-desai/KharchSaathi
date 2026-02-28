# KharchSaathi
### Because every rupee deserves attention.

KharchSaathi is a lightweight, web-based Personal Finance Anomaly Detection tool built using *HTML, CSS, and JavaScript*.

It transforms raw bank transaction CSV files into:

Visual spending insights  
Intelligent anomaly alerts  
Simple, explainable risk scoring  

The goal is to help individuals detect unusual financial behavior such as high-value transactions, new merchants, and sudden spending spikes — before they turn into financial problems.

---

## Problem Statement

With the rapid growth of digital banking, UPI, and online payments, individuals generate large transaction histories. However:

•⁠  ⁠Users rarely receive proactive alerts about unusual spending  
•⁠  ⁠Fraudulent or high-value transactions often go unnoticed  
•⁠  ⁠Banks provide only basic summaries  
•⁠  ⁠Spending awareness remains reactive instead of proactive  

KharchSaathi bridges this gap by providing a simple, explainable anomaly detection system that works directly on bank CSV statements.

---

## Key Features

###  1. CSV Upload
Users can upload their bank transaction history in CSV format directly in the browser.

---

### 2. Automatic Transaction Parsing
Using *PapaParse*, the system extracts:

•⁠  ⁠Date  
•⁠  ⁠Description  
•⁠  ⁠Amount  

All processing happens on the client side — no backend required.

---

### 3. Smart Categorization
Transactions are automatically categorized using keyword-based matching:

•⁠  ⁠*Food* → Swiggy, Zomato  
•⁠  ⁠*Shopping* → Amazon, Flipkart  
•⁠  ⁠*Travel* → Uber, Ola  
•⁠  ⁠*Others* → Default category  

This allows better analysis of spending patterns.

---

### 4. Anomaly Detection Engine

KharchSaathi applies simple, explainable rules to detect unusual activity:

🔴 *High-Value Transactions*  
Flags transactions significantly higher than normal spending.

🟠 *New Merchant Alerts*  
Detects merchants appearing for the first time.

🟡 *Spending Trend Analysis*  
Tracks spending over time using visual line charts.

Each anomaly is clearly explained — no black-box alerts.

---

### 5. Risk Score System

Every flagged transaction contributes to a simple risk score to indicate financial irregularity.

The score helps users quickly understand whether their recent spending behavior is normal or unusual.

---

### 6. Visual Dashboard

The dashboard provides:

•⁠  ⁠Total spending summary  
•⁠  ⁠Spending trend line chart  
•⁠  ⁠Alert section highlighting anomalies  
•⁠  ⁠Clear explanation for each flagged transaction  

All displayed in a clean and user-friendly interface.

---

## Tech Stack

### Frontend
•⁠  ⁠HTML  
•⁠  ⁠CSS  
•⁠  ⁠JavaScript  

### Libraries (CDN-based)
•⁠  ⁠*Chart.js* – Data visualization  
•⁠  ⁠*PapaParse* – CSV parsing  

No backend required.  
Fully client-side implementation.

---

## 📁 Project Structure


kharchsaathi/
│
├── index.html
├── style.css
├── script.js
└── README.md


---

## How It Works

1.⁠ ⁠User uploads a CSV file  
2.⁠ ⁠PapaParse converts CSV into a JavaScript array  
3.⁠ ⁠Transactions are processed  
4.⁠ ⁠Spending totals and categories are calculated  
5.⁠ ⁠Anomaly detection rules are applied:
   - High transaction amount  
   - New merchant detection  
6.⁠ ⁠Results are displayed visually on the dashboard  

Everything runs locally in the browser.

---

## Example CSV Format


Date,Description,Amount
01-01-2026,Swiggy,-350
02-01-2026,Amazon,-6000
03-01-2026,Uber,-500
04-01-2026,Salary,30000


---

## Demo Flow

1.⁠ ⁠Upload CSV file  
2.⁠ ⁠View total spending summary  
3.⁠ ⁠See spending trend chart  
4.⁠ ⁠View flagged anomalies  
5.⁠ ⁠Understand risk score explanation  

---

## Why This Project Matters

•⁠  ⁠Encourages financial awareness  
•⁠  ⁠Helps detect suspicious or unusual transactions  
•⁠  ⁠Promotes proactive budgeting  
•⁠  ⁠Provides explainable anomaly alerts  
•⁠  ⁠Demonstrates practical data processing using JavaScript  

KharchSaathi proves that meaningful financial insights can be generated using simple, transparent logic — without complex systems.

---

## Future Improvements

•⁠  ⁠Support for PDF bank statements  
•⁠  ⁠Advanced statistical anomaly detection  
•⁠  ⁠Category-based budget recommendations  
•⁠  ⁠Improved merchant pattern recognition  
•⁠  ⁠Mobile-responsive design enhancements  

---

## Built With

Developed as a personal finance awareness tool focused on simplicity, clarity, and usability.

---