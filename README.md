# 🤖 Internshala Automation | Node.js + Puppeteer

This project automates key user workflows on the [Internshala](https://internshala.com/) platform — including **login**, **internship filtering**, **auto-apply**, and **logout** — using **Node.js**, **JavaScript**, and **Puppeteer** on the **Chrome browser**.

It is built as an automation solution to eliminate repetitive manual job search tasks, with a modular script-based backend and TestNG-style control logic in JavaScript.

---

## 📌 Project Overview

🔹 **Goal:** Automate routine interactions with Internshala  
🔹 **Automation Scope:** Login → Filter → Apply to Internship → Logout  
🔹 **Frameworks Used:** Puppeteer (Chrome headless automation), Node.js  
🔹 **Outcome:** 100% automation of internship application flow  
🔹 **Runtime:** Headless or Visible browser execution (Chromium)

---

## ⚙️ Tech Stack

| Tool/Language | Purpose                       |
|---------------|-------------------------------|
| JavaScript    | Scripting logic               |
| Node.js       | Backend runtime environment   |
| Puppeteer     | Chrome automation (headless/GUI) |
| Chromium      | Browser for execution         |

---

## 🚀 Key Features

- 🔐 **Automated Login:** Simulates secure login with credentials
- 🎯 **Internship Filtering:** Filters internships using tags, location, work-from-home, etc.
- 📄 **Internship Application:** Automatically clicks apply buttons and submits interest
- 📤 **Logout:** Logs out the user after completing all actions
- 📂 **Modular Scripts:** Each function (login, filter, apply, logout) is a separate file
- 🧪 **TestNG-style Flow:** Main controller (`main.js`) runs the full test pipeline

---

## 🧩 Project Structure

Internshala-Automation/
├── login.js # Automates user login
├── filter.js # Applies search filters
├── apply.js # Iterates and applies to internships
├── logout.js # Logs out the user
├── main.js # Orchestrates the automation sequence
├── credentials.json # Securely stores user credentials
├── package.json # Node.js config and scripts
└── README.md # Project documentation


## 🛠 Setup Instructions
```
1. Clone the repository

git clone https://github.com/your-username/Internshala-Automation.git
cd internshala-automation

2. Install dependencies

npm install

3. Configure credentials
Create a file named credentials.json in the root folder with your login details:

{
  "email": "your_email@example.com",
  "password": "your_password"
}

4.How to Run
Run the main automation sequence:

node main.js

```
---

## 🧪 TestNG-style Execution
Although written in JavaScript, the execution flow mimics the modular TestNG test suite pattern:

| Phase      | File                     |
| ---------- | ------------------------ |
| BeforeTest | `login.js`               |
| Test       | `filter.js` → `apply.js` |
| AfterTest  | `logout.js`              |


---

## 💡 Use Cases
- Automating Internshala for daily job/internship hunts

- Task scheduling via Node.js for nightly automation

- Extendable to other job portals using Puppeteer

- Can integrate with Slack/email alerts for new matches


