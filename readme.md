# 🍔 Food Delivery App (with Reels)

A **fully functional full-stack Food Delivery web application** with modern UI, secure payments, and a social twist — **Reels**!  
Users can explore restaurants, order food, pay securely using Stripe, and upload or watch **short food videos** powered by **ImageKit**.

---

## 🌟 Features

### 👤 User & Restaurant
- 🔐 Authentication (Register / Login with JWT)
- 🍱 Browse restaurants & menus
- 🛒 Add to cart, checkout, and pay via Stripe
- 🚖 Order tracking with status updates
- 🎥 Upload & watch short food Reels
- ❤️ Like, comment, and share Reels
- 🧑‍🍳 Restaurant dashboard for menu management
- 📸 Cloud media uploads using **ImageKit**

### ⚙️ Admin & Backend
- 🧩 Role-based access (User / Restaurant / Admin)
- 📦 CRUD APIs for menu, orders, reels
- 💳 Stripe integration for payments & refunds
- ☁️ Media upload & optimization via ImageKit
- 🧾 MongoDB for flexible data modeling
- 🔁 Secure REST APIs built with Express.js

---

## 🧠 Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB (Mongoose)  
**Payments:** Stripe  
**Cloud Media:** ImageKit  
**Authentication:** JWT Tokens  
**Optional:** Socket.IO for live updates

---

## 📁 Folder Structure

project-root/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ ├── utils/
│ │ └── app.js
│ ├── .env
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── .env
│ └── package.json
│
└── README.md



---

## 🔧 Environment Variables

### 🗄️ Backend (.env)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/foodapp
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_folder
FRONTEND_URL=http://localhost:5173

💻 Frontend (.env)
env

VITE_API_BASE_URL=http://localhost:4000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_folder

⚙️ Setup Instructions

1️⃣ Backend
bash

cd backend
npm install
npm run dev
➡ Runs at: http://localhost:3000

2️⃣ Frontend
bash

cd frontend
npm install
npm run dev
➡ Runs at: http://localhost:5173

🧩 ImageKit Integration
All images and videos (like food photos, restaurant banners, and reels) are uploaded and optimized via ImageKit.

Example Upload Code
js
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadResponse = await imagekit.upload({
  file: req.file.buffer,
  fileName: `food_${Date.now()}.jpg`,
  folder: "foods"
});
✅ Automatic optimization and CDN delivery

🖼️ URL transformations for thumbnails

🎬 Video uploads supported (for Reels)

💳 Stripe Payment Flow
Backend
js

const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100, // in paise
  currency: 'inr',
  metadata: { orderId }
});
res.json({ clientSecret: paymentIntent.client_secret });
Frontend
js

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const { data } = await axios.post(`${API}/payments/create-intent`);
🎥 Reels Feature
Users can upload, view, like, and comment on food-related short videos.

📤 Upload Flow
Select a video (15–90 seconds)

Upload via POST /api/reels/upload

Backend sends file to ImageKit

Store:

video URL

thumbnail URL

caption, tags, userId

🧱 Sample Reel Schema
js

const reelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videoUrl: String,
  thumbnailUrl: String,
  caption: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
    }
  ]
}, { timestamps: true });
🧾 Key API Endpoints
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user
GET	/restaurants	Get all restaurants
POST	/restaurants/:id/menu	Add new menu item
POST	/orders	Create order + Stripe intent
GET	/orders/:id	Get specific order
POST	/reels/upload	Upload new reel
GET	/reels/feed	Get reel feed
POST	/reels/:id/like	Like a reel
POST	/reels/:id/comment	Comment on reel

🔐 Security
Passwords hashed with bcrypt

JWT Authentication with access & refresh tokens

Input validation via express-validator

CORS configured for frontend origin

HTTPS recommended for deployment

☁️ Deployment Tips
Frontend: Deploy on Vercel or Netlify

Backend: Deploy on Render or Railway

Database: Use MongoDB Atlas

Media: ImageKit handles CDN and storage

Payments: Switch Stripe keys to live mode before production

🧠 Future Improvements
📦 Delivery partner live tracking

🔔 Push notifications for order updates

🤖 AI-based food recommendations

📊 Reel analytics (views, engagement)

🗺️ Advanced search with filters

👨‍💻 Author
Abhay Singh
Full Stack Developer | MERN Stack | AI & Web Enthusiast

📧 Email: abhay88716@gmail.com
💼 GitHub: https://github.com/Abhayjicoder
🪪 License: MIT
