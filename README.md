# Library Book Management System

A small library catalogue where a librarian can manage books and see at a glance which ones are available.

> Stack: **React 18 (Vite) + Axios** · **Java 17 + Spring Boot 3.3.5 (Spring Web, Spring Data JPA/Hibernate, Bean Validation)** · **MySQL 8.x** · Maven

## 1. Problem statement (summary)

Add books (unique book ID, title, author, category), list them, search by title or author, edit/remove them and switch availability between Available and Issued.

## 2. Features implemented

- Add / edit / remove books
- Unique book ID (case-insensitive, stored upper-case)
- Search by title **or** author
- Availability badge beside every book (Available / Issued)
- Issue / Return button using PATCH
- Summary: total, available, issued
- Business rules: cannot issue an already-issued book; cannot delete an issued book

## 3. Technologies and versions

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5.4, Axios 1.7, plain CSS (responsive) |
| Backend | Java 17, Spring Boot 3.3.5, Spring Web, Spring Data JPA (Hibernate 6), Jakarta Bean Validation, Maven |
| Database | MySQL 8.x with MySQL Connector/J (managed by Spring Boot) |

## 4. Prerequisites

- JDK 17 or newer (`java -version`) and Maven 3.8+ (`mvn -version`) - or use IntelliJ IDEA's bundled Maven
- Node.js 18+ and npm (`node -v`, `npm -v`)
- MySQL Server 8.x **installed and running** on `localhost:3306`
- A MySQL user (for example `root`) that has privileges on database `library_book_management`
- VS Code or IntelliJ IDEA

## 5. Folder structure

```
04-Library-Book-Management/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── tt/
│   │       │           └── librarymanagement/
│   │       │               ├── config/
│   │       │               │   └── CorsConfig.java
│   │       │               ├── controller/
│   │       │               │   └── BookController.java
│   │       │               ├── dto/
│   │       │               │   ├── BookRequest.java
│   │       │               │   ├── BookStatusRequest.java
│   │       │               │   └── LibrarySummary.java
│   │       │               ├── entity/
│   │       │               │   ├── Book.java
│   │       │               │   └── BookStatus.java
│   │       │               ├── exception/
│   │       │               │   ├── BadRequestException.java
│   │       │               │   ├── ConflictException.java
│   │       │               │   ├── GlobalExceptionHandler.java
│   │       │               │   └── NotFoundException.java
│   │       │               ├── repository/
│   │       │               │   └── BookRepository.java
│   │       │               ├── service/
│   │       │               │   └── BookService.java
│   │       │               └── LibraryManagementApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── .gitignore
│   └── pom.xml
├── database/
│   ├── sample-data.sql
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── bookApi.js
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── BookForm.jsx
│   │   │   └── Notice.jsx
│   │   ├── pages/
│   │   │   └── BooksPage.jsx
│   │   ├── styles/
│   │   │   └── app.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 6. MySQL setup

1. Make sure MySQL Server is running (Windows: *Services → MySQL80 → Start*; Linux: `sudo systemctl start mysql`; macOS: `brew services start mysql`).
2. This project uses its **own database**: `library_book_management`.
3. Create it **before starting the backend** (Hibernate creates tables, but not the database):

```sql
CREATE DATABASE IF NOT EXISTS library_book_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the ready-made script: `mysql -u root -p < database/schema.sql` (or open `database/schema.sql` in MySQL Workbench and execute it).

4. Tables are then created/updated automatically on the first backend start because `spring.jpa.hibernate.ddl-auto=update`. No SQL table scripts are executed by Spring (there is no `schema.sql` inside the backend), so the two strategies never conflict.

## 7. Configure `application.properties`

Open `backend/src/main/resources/application.properties` and change only these lines:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_book_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

- **Database name** → the word after `3306/` (keep `library_book_management` unless you created a different name).
- **Host / port** → `localhost:3306` (change if MySQL runs elsewhere or on another port).
- **Username / password** → your own MySQL credentials. Replace `YOUR_MYSQL_PASSWORD` with your real password (leave it empty if your root user has no password).
- No credentials are stored in Java code, and no environment variables are needed.

## 8. Run the backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

(or run `LibraryManagementApplication` from IntelliJ IDEA / VS Code). When you see `Started LibraryManagementApplication`, the API is live at **http://localhost:8080**.

## 9. Run the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Production build check: `npm run build`.

The API base URL is set in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Change it only if the backend uses another host/port. Restart `npm run dev` after editing `.env`. CORS for `http://localhost:5173` is configured in `config/CorsConfig.java`.

## 10. REST API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | List books; optional search by title or author: ?search=java |
| GET | `/api/books/summary` | Counts of total, available and issued books |
| POST | `/api/books` | Add a book (book ID must be unique; new books are AVAILABLE) |
| PUT | `/api/books/{id}` | Edit book details |
| PATCH | `/api/books/{id}/status` | Change availability: body {"status":"AVAILABLE"} or {"status":"ISSUED"} |
| DELETE | `/api/books/{id}` | Remove a book record (not allowed while the book is issued) |

Errors are returned as JSON: `{ "timestamp", "status", "message", "errors": { "field": "message" } }` with HTTP 400 (validation), 404 (not found) or 409 (conflict/duplicate).

## 11. How to test the main features manually

1. Add book `B101`, `Core Java`, `Cay Horstmann`, `Programming` → shown as *Available*.
2. Add another book with ID `b101` → error: Book ID already exists.
3. Search `java` and then `horstmann` → results by title and by author; search `xyz` → *No books match*.
4. Click **Issue** → badge turns red *Issued*; summary updates. Click **Mark returned** → green again.
5. Try **Delete** on an issued book → error message; return it first, then delete.
6. Edit a book's category → saved after refresh.

## 12. Validation rules and business logic

- Book ID, title, author, category: required, not blank
- Book ID unique (DB unique constraint + service check, HTTP 409)
- New books start as AVAILABLE
- Issuing an issued book / returning an available book → HTTP 409 with a message
- An issued book cannot be deleted (HTTP 409)

## 13. Sample data

Optional sample rows are provided in `database/sample-data.sql`. Start the backend once first (so Hibernate creates the tables), then run: `mysql -u root -p < database/sample-data.sql`.

## 14. Common errors and solutions

| Problem | Solution |
|---|---|
| `Access denied for user 'root'@'localhost'` | Wrong username/password in `application.properties`. Test with `mysql -u root -p`. |
| `Unknown database 'library_book_management'` | Create it first: `CREATE DATABASE library_book_management;` (see section 6). |
| `Communications link failure` / `Connection refused` | MySQL is not running or uses a different port. Start MySQL and check the port in the JDBC URL. |
| `Port 8080 was already in use` | Stop the other program or set `server.port=8081` in `application.properties` **and** `VITE_API_BASE_URL=http://localhost:8081/api` in `frontend/.env`. |
| Port 5173 busy | Vite automatically picks 5174; then add that origin to `CorsConfig.java`, or free port 5173. |
| `Public Key Retrieval is not allowed` | Keep `allowPublicKeyRetrieval=true` in the JDBC URL (already included). |
| Browser shows "Cannot reach the backend" | Backend is not running, or `VITE_API_BASE_URL` is wrong. Open `http://localhost:8080/api/...` in the browser to check. |
| CORS error in browser console | Frontend is running on an origin other than 5173/4173; add it in `CorsConfig.java`. |
| `npm install` fails | Check the Node version (18+) and your internet connection. |


## 15. MySQL connection troubleshooting checklist

1. `mysql -u root -p` works from a terminal? If not, fix the password/service first.
2. `SHOW DATABASES;` lists `library_book_management`? If not, create it.
3. `SHOW GRANTS FOR 'root'@'localhost';` shows privileges on `library_book_management`? If you use another user, `GRANT ALL PRIVILEGES ON library_book_management.* TO 'user'@'localhost';`.
4. `SHOW VARIABLES LIKE 'port';` equals the port in the JDBC URL?
5. Special characters in the password are fine in `.properties`; do not wrap the password in quotes.
6. Read the **first** "Caused by:" line of the Spring Boot stack trace - it names the real MySQL problem.

## 16. How React, Spring Boot, REST, JPA and MySQL work together

1. The **React** component calls an **Axios** function (`src/api/client.js`) such as `api.get("/...")`.
2. Axios sends an HTTP request (JSON) to the **Spring Boot** REST controller in `controller/`.
3. The controller validates input (`@Valid`) and delegates to a **service** that holds the business rules.
4. The service uses a **Spring Data JPA repository**; **Hibernate** converts entity objects to SQL.
5. **MySQL** stores the rows permanently; the result travels back as JSON and React re-renders the screen.

## 17. Viva preparation

**Q1. How is search implemented?**  
A JPQL query with `lower(...) like lower(concat('%', :q, '%'))` on title and author.

**Q2. How do you keep the book ID unique?**  
`unique = true` on the column plus `existsByBookId` check; IDs are normalised to upper-case.

**Q3. Why a separate status endpoint?**  
Issuing/returning is a state change with rules (`PATCH /{id}/status`), different from editing details (`PUT`).

**Q4. What is an enum and why store it as STRING?**  
A fixed set of constants (`AVAILABLE`, `ISSUED`); STRING keeps DB values readable and stable.

**Q5. Which status code means 'duplicate'?**  
409 Conflict.

**Q6. Why block deletion of issued books?**  
A real library would lose track of a borrowed book; the rule is enforced in `BookService.delete`.

**Q7. What does `@RequestParam(required = false)` do?**  
Makes the `search` query parameter optional so the same endpoint lists everything.

**Q8. What is a Spring Data repository?**  
An interface extending `JpaRepository`; Spring generates the implementation at runtime.

**Q9. How does the frontend call the API?**  
Axios instance in `api/client.js` with base URL from `VITE_API_BASE_URL`; `bookApi.js` wraps each endpoint.
