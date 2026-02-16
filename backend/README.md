# Nafath Mock API

A Spring Boot mock integration for the Nafath authentication service (Saudi Arabia's national digital identity platform).

## Prerequisites

- Java 21+
- Maven 3.6+

## Quick Start

```bash
mvn clean package spring-boot:repackage -U -X
mvn spring-boot:run
```

API runs on `http://localhost:8080/nafath/api/v1`

## API Endpoints

### 1. Initiate Request
**POST** `/initiate`
```json
{
  "nationalId": "1234567890"
}
```

### 2. Check Status
**GET** `/status/{id}`

Returns `PENDING`, `APPROVED`, `REJECTED`, or `NOT_FOUND`

### 3. Simulate Approval
**PATCH** `/simulate-approval/{id}`
```json
{
  "status": "APPROVED"
}
```

## Example Usage

```bash
# Initiate
curl -X POST http://localhost:8080/nafath/api/v1/initiate \
  -H "Content-Type: application/json" \
  -d '{"nationalId": "1234567890"}'

# Check status
curl http://localhost:8080/nafath/api/v1/status/{id}

# Simulate approval
curl -X PATCH http://localhost:8080/nafath/api/v1/simulate-approval/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'
```

     ## Configuration

Update `src/main/resources/application.properties` with your database settings (SQL Server or H2).

## Technologies

Spring Boot 4.0.2, Spring Data JPA, H2 Database, Java 21