# Lostifyy

Lostifyy is a full-stack web application designed to help users report, search, and manage lost and found items. The platform provides a seamless experience for both those who have lost items and those who have found them, facilitating easy communication and item recovery.

---

## Features
- User registration and authentication (JWT-based)
- Submit lost or found items
- Browse and search items by category and status
- View item details
- Responsive frontend UI

---

## Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security (JWT Authentication)
- Maven

### Frontend
- React.js (Create React App)
- Context API for state management
- CSS Modules

---

## Project Structure

```
Lostifyy/
  ├── Lostify/                  # Backend (Spring Boot)
  │   ├── src/main/java/com/Lostify/Lostify/...
  │   └── src/main/resources/...
  └── lostifyy-frontend/        # Frontend (React)
      └── src/...
```

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven
- Node.js & npm

### Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd Lostify/Lostify
   ```
2. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080` by default.

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd lostifyy-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000` by default.

---

## Usage
- Register or log in to your account.
- Submit a lost or found item with details and category.
- Browse the list of items or search by keywords.
- View item details and contact the reporter if needed.

---

## API Endpoints (Backend)

- **Auth**
  - `POST /api/auth/register` — Register a new user
  - `POST /api/auth/login` — Authenticate and receive JWT
- **Items**
  - `GET /api/items` — List all items
  - `GET /api/items/{id}` — Get item details
  - `POST /api/items/lost` — Submit a lost item
  - `POST /api/items/found` — Submit a found item

> For more details, see the controller classes in `Lostify/src/main/java/com/Lostify/Lostify/controller/`.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---



## Contact

For questions or support, please contact the maintainer at jashchauhan015@gmail.com. 