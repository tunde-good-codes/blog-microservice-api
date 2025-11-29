# 📰 Blog Microservice Api

A fully–scalable **blog microservice backend** built with Node.js, Express, PostgreSQL/MongoDB, Redis, RabbitMQ, Cloudinary, Google OAuth, and Gemini AI.  
This backend powers a modern blog platform with secure authentication, multi–database architecture, inter-service communication, and AI-assisted blog creation.

---

## 🚀 Microservice Architecture

This project is divided into **three independent services**, each with its own database and runtime:

### **1. User Service**
- User registration & login  
- Google OAuth integration  
- JWT-based authentication  
- Profile management  
- Image upload via Cloudinary  

### **2. Author Service**
- Author onboarding  
- Author permissions  
- Manage blog publishing privileges  
- Syncs user profile data

### **3. Blog Service**
- Blog creation, editing & deletion  
- Cloudinary image uploads  
- AI-generated blog descriptions (Gemini AI)  
- Blog filtering (by category, title, keywords)  
- Redis caching for fast retrieval  
- RabbitMQ listener for cache invalidation events  

---

## 🧠 AI Integration (Gemini)
Integrated **Google Gemini AI** to assist authors by:

- Checking blog title quality
- Suggesting SEO-friendly blog descriptions
- Generating writing ideas

This makes content creation faster, smarter, and more consistent.

---

## 🗂 Databases Per Service

Each microservice uses a **dedicated database**:

| Service | Database |
|--------|----------|
| User Service | MongoDB |
| Author Service | MongoDB |
| Blog Service | PostgreSQL (Neon) |

This ensures:
- decoupling  
- independent scaling  
- easier migrations  
- improved reliability  

---

## ⚡ Redis Caching

Used to speed up blog listing queries.

### Cached features:
- All blogs list  
- Category-filtered blogs  
- Search-filtered blogs  

### Cache flow:
1. API receives request  
2. Checks Redis → if found, return cached response  
3. If not, query database  
4. Save result to Redis  
5. Return response  

This results in **major performance improvements**.

---

## 🐇 RabbitMQ (Message Queue)

RabbitMQ is used for **inter-service communication**, especially for cache invalidation.

### Example:
When a new blog is created:
- Blog service publishes a **cache-invalidation event**
- Cache consumer removes the old keys from Redis
- Ensures users always see updated content

---

## ☁ Cloudinary (Image Uploads)

All blog images and user profile photos are uploaded using Cloudinary.

- fast & optimized delivery  
- secure media storage  
- automatic resizing/compression  

---

## 🔐 Authentication

### User login supports:
- Email + password  
- Google Auth  
- JWT-based sessions  

### Auth flow with multiple services:
Auth tokens generated in User Service are reused across Author Service and Blog Service — enabling secure, multi-service authentication.



---

## 🛠 Tech Stack

- **Node.js + Express**
- **RabbitMQ**
- **Redis**
- **MongoDB + PostgreSQL (Neon)**
- **Google OAuth**
- **Gemini AI API**
- **Cloudinary**
- **TypeScript**
- **JWT Authentication**

---

## ▶ Running Locally

1. Clone microservices  
2. Install dependencies  
3. Set each service's `.env`  
4. Start each microservice individually  

Example:

```bash
cd blog-service
npm install
npm run dev
