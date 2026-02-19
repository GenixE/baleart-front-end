# Baleart Frontend

Frontend application built with React and Vite as part of a full-stack learning project.

This project connects to the Baleart Laravel backend and provides a client-facing interface for browsing and interacting with spaces.

🔗 Backend repository: https://github.com/GenixE/baleart-back-office

---

## 🛠 Tech Stack

- React 18
- Vite
- TailwindCSS v4
- React Router v7
- Axios
- Styled Components
- Swiper (carousel functionality)
- RC Slider (UI components)
- EmailJS (contact functionality)

---

## 🎯 Project Purpose

This project was built to:

- Practice modern React architecture
- Implement client-side routing with React Router
- Integrate with a RESTful backend API
- Manage application state and asynchronous requests
- Design responsive UI with TailwindCSS
- Build reusable components
- Structure a scalable frontend application

It serves as the frontend layer for the Baleart full-stack system.

---

## 🧱 Architecture & Design

The application follows a component-based React architecture:

- React Router handles client-side routing
- Axios manages API communication with the backend
- Reusable UI components promote modular design
- TailwindCSS provides utility-first styling
- Styled Components used for additional scoped styling
- Feature-based page structure

The frontend communicates with the backend via REST API endpoints secured by Sanctum.

---

## 🚀 Core Features

- User authentication integration
- Space browsing and filtering
- Dynamic routing for space details
- Comment interactions
- Responsive layout
- Carousel functionality (Swiper)
- Interactive UI components (Slider)
- Contact form integration (EmailJS)

---

## 🔌 API Integration

The frontend consumes REST endpoints provided by the Laravel backend.

- Axios handles asynchronous API requests
- Authentication state is managed client-side
- Protected routes rely on backend authorization

---

## ⚙️ Installation

```bash
git clone https://github.com/GenixE/baleart-front-end.git
cd baleart-front-end
npm install
npm run dev
