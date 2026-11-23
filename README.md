# 🛒 Bluvia — Full-Stack E-Commerce Platform

A production-ready MERN stack e-commerce application featuring JWT authentication, role-based access control, an interactive admin dashboard, and secure Razorpay payment integration.

🔗 **Live Demo:** https://full-stack-e-commerce-15xe.vercel.app/

## 🌟 Key Features

* **Authentication & Security:** Secure user signup/login using JWT (JSON Web Tokens) with HTTP-only cookies, password hashing, and role-based route protection (User/Admin).
* **Admin Dashboard:** Dedicated portal to manage inventory, add/edit/delete products, and track customer orders.
* **Shopping Experience:** Product catalog with category filtering, keyword search, interactive cart management, and smooth checkout flow.
* **Payment Gateway:** Integrated **Razorpay Checkout** for real-time payment processing.
* **Cloud Media Management:** Product image uploads and optimization powered by **Cloudinary**.

## 🛠️ Tech Stack

* **Frontend:** React.js, Context API / Redux, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, JWT, bcryptjs
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Deployment & Services:** Vercel (Frontend), Render (Backend), Cloudinary, Razorpay

## 📂 Folder Structure

```text
├── frontend/             # React client application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Storefront, Cart, Checkout & Admin pages
│       └── context/      # Global state management
└── backend/              # Node.js & Express REST API
    ├── config/           # MongoDB, Cloudinary & Razorpay setup
    ├── controllers/      # Route handlers & business logic
    ├── middleware/       # JWT verification & admin authorization
    ├── models/           # Mongoose schemas
    └── routes/           # API endpoints
