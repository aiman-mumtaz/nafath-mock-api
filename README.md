<h1 align="center">🛡️ Nafath-Mock: AI-Enhanced SSO Middleware</h1>

<p align="center">
  <b>A high-fidelity simulation of the Saudi National Single Sign-On (Nafath) ecosystem.</b><br>
  <i>Integrating real-time AI behavioral risk assessment with Spring Boot & Next.js.</i>
</p>

---

## 🏗️ System Architecture

The repository is structured as a **Monorepo** to maintain tight coupling between the security contract and implementation layers.

### 💻 Tech Stack
* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS.
* **Backend:** Spring Boot 3.4 (Java 21), Spring Data JPA, Hibernate.
* **Database:** Microsoft SQL Server 2022.
* **Intelligence:** Simulated LLM Middleware for Behavioral Risk Assessment.

---

## 🛠️ Installation & Setup

### 1. Database Configuration
The application expects a Microsoft SQL Server instance with a database named `nafath_db`.

```Bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password123" \
       -p 1433:1433 --name nafath-sql -d \
       [mcr.microsoft.com/mssql/server:2022-latest](https://mcr.microsoft.com/mssql/server:2022-latest)
```
### 2. Backend Initialization
```Bash
cd backend
mvn clean package:spring-boot:repackage -U -X
mvn spring-boot:run
```

### 3. Frontend Initialization
```Bash
cd frontend
npm install
npm run dev
```
## 🧠 Technical Highlights

### 🚀 AI Risk Assessment Middleware
Unlike standard auth flows, this system intercepts the /initiate request to perform:

  - Contextual Analysis: Evaluates National ID patterns and metadata.
  - Risk Scoring: Assigns a value (0.0 to 1.0). Scores > 0.8 trigger an immediate REJECTED_BY_AI state, bypassing the Nafath challenge entirely to prevent credential stuffing.

### 🔄 Asynchronous State Machine
The system utilizes a decoupled state machine to ensure data integrity:

  - Backend: Manages persistent state in SQL Server via JPA.
  - Frontend: Implemented with a resilient polling hook.
  - Simulator: External trigger for PATCH state transitions, mimicking mobile app interaction.

## 🧪 Simulation Flow
1. Initiate: Enter a valid dummy ID: 1010101010 (Citizen) or 2020202020 (Resident).
2. Challenge: The system generates a Random Code (Handshake).
3. Approve: Use the Simulator Panel to trigger a biometric success simulation.
4. Verify: The Next.js frontend detects the COMPLETED state and grants access.

## 📂 Project Structure
```Bash
nafath-project/
├── backend/                # Spring Boot Service (Java 21)
│   ├── src/main/java/      # Domain Logic & AI Middleware
│   └── src/main/resources/ # application.properties & SQL scripts
├── frontend/               # Next.js 15 Application
│   ├── app/                # App Router & UI Components
│   └── public/             # Static Branding Assets
└── README.md               # System Documentation
```
<p align="center">
Developed for secure, scalable authentication demonstrations.
</p>
