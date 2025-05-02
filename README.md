Requirements : https://docs.google.com/document/d/1L6m2MxZx7m7ilTDyeCrLnv5QTuxPtA_5nGXSh-QqYZ0/edit?tab=t.67axls8qnxay

<h1 align="center">
  Assignment  project - 6 
</h1>

# 📝 Basa Vara Management API

I developed a powerful backend for a blogging platform, enabling both user and admin operations with full CRUD functionality, authentication, and authorization. Users can create, read, update, and delete their blogs, while admins have extended privileges to manage all content.

Key features include advanced search and filtering for efficient content discovery. The backend is built using Node.js, Express.js, TypeScript, and MongoDB, ensuring scalability, type safety, and high performance. JWT-based authentication secures user sessions, while role-based authorization safeguards resources. Designed with clean architecture and modularity, this backend provides a robust, efficient, and secure foundation for a modern blogging platform.

---

## Technologies

- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB with Mongoose**
- **Zod**
- **cors**
- **dotenv**
- **http-status-codes**
- **JWT**
- **bcrypt**
- **Stripe**

---

## 🚀 Features

### User Roles

- **Admin**:
  - Block users.
  - Delete any blog.
  - **Cannot update blogs.**
- **User**:
  - Register and log in.
  - Create, update, and delete their own blogs.
  - **Cannot perform admin actions.**

### Core Features

- **Authentication & Authorization**:
  - Secure JWT-based authentication.
  - Role-based access control for admin and users.
- **Blog API**:
  - Public access to blog listings.
  - Advanced functionalities: search, sort, and filter.

---

## 🛠️ API Endpoints

### Authentication

- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`

### Blog Management

- **Create Blog**: `POST  /blogs` (Logged-in users only)
- **Update Blog**: `PATCH  /blogs/:id` (Blog owner only)
- **Delete Blog**: `DELETE  /blogs/:id` (Blog owner only)
- **View Blogs**: `GET /blogs` (Public API with search, sort, filter)

### Category Management

- **Create Blog**: `POST /api/categorys`
- **Update Blog**: `PATCH /api/categorys/:id`
- **Delete Blog**: `DELETE /api/categorys/:id`
- **View Blogs**: `GET /api/categorys`

### Admin Actions

- **Block User**: `PATCH /api/admin/users/:userId/block`
- **Delete Any Blog**: `DELETE /api/admin/blogs/:id`

---

## 🛡️ Error Handling

All errors are returned in a structured format with clear messages and status codes.

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "error": { "details" }
}
```

Thank you for exploring this project! 🚀

# assignment-4-server
