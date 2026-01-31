# OnRequestLab – Frontend Documentation

> **Environment:** Development  
> **Frontend Stack:** React + Vite + Tailwind CSS  
> **Backend Base URL:** `https://dev.onrequestlab.com/api/v1`

---

## 🎯 Purpose of This Document

This document is for **frontend developers** working on the OnRequestLab platform.  
It explains **UI flow, state management, API integration, authentication handling, and best practices**.

---

## 🧱 Tech Stack

- **React 18**
- **Vite** (build tool)
- **Tailwind CSS** (UI styling)
- **Axios** (API calls)
- **React Router DOM** (routing)
- **React Toastify** (notifications)

---

## 📂 Recommended Folder Structure

```text
src/
│── assets/
│── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│
│── pages/
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Labs/
│   │   └── LabPricing.jsx
│
│── services/
│   └── api.js
│
│── utils/
│   └── auth.js
│
│── App.jsx
│── main.jsx
```

---

## 🔐 Authentication Handling (Frontend)

### Token Storage
Frontend supports multiple token sources:
- Cookies (`access`, `user_id`)
- `localStorage`

```js
const token =
  getCookie("access") ||
  localStorage.getItem("jwt-auth") ||
  localStorage.getItem("token");
```

### Axios Header Setup

```js
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${token}`;
```

---

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://dev.onrequestlab.com
```

Usage:

```js
const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
```

---

## 🧪 Labs Page (LabPricing.jsx)

### Responsibilities

- Fetch user subscriptions
- Fetch lab instances
- Launch new lab
- Reboot / Destroy lab
- Pagination & search
- Status-based UI control

---

## 🔄 Instance Lifecycle (UI Flow)

```text
Inactive Plan → Upgrade → Launch

Launched → WebSSH / Reboot / Destroy

Destroyed → Removed from list
```

---

## 📊 Instance Status Handling

| Status | UI Behaviour |
|------|-------------|
| Launched | Enable all actions |
| Pending | Disable actions |
| Failed | Show error color |
| Destroyed | Remove from list |

Example:

```js
const isActionAllowed = (inst) => inst.status === "Launched";
```

---

## 🕒 Date & Time Formatting

Backend provides ISO timestamps.

```js
const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString("en-IN");
```

Displayed under instance name:

```
Created: 28 Jan 2026, 04:32 PM
```

---

## 🔍 Search Implementation

```js
const filteredInstances = instances.filter((i) =>
  i.instance_name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
```

---

## 📄 Pagination Logic

```js
const ITEMS_PER_PAGE = 5;

const paginatedInstances = filteredInstances.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);
```

UI Rules:
- Center aligned
- Limited buttons
- Prev / Next enabled

---

## 🔔 Notifications (Toast)

```js
toast.success("Instance launched");
toast.error("Something went wrong");
```

Rules:
- Auto close: 2.5s
- Position: Top center

---

## 🧠 UI/UX Best Practices

- Disable buttons when action not allowed
- Always show loading state
- Keep pagination short
- Show Launched instances at top
- Mobile-first layout

---

## ❌ Error Handling Strategy

```js
catch (err) {
  toast.error(
    err.response?.data?.error || "Action failed"
  );
}
```

---

## 🧪 Sample API Call (Axios)

```js
axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🔒 Security Guidelines

- Never log JWT tokens
- Prefer HTTP-only cookies
- Clear tokens on logout
- Validate API responses

---

## 🚀 Build & Deployment

```bash
npm install
npm run build
```

Output folder:
```text
dist/
```

---

## 📞 Support

For frontend issues:

📧 frontend@onrequestlab.com  
🌐 https://onrequestlab.com

---

## 📄 License

© 2026 OnRequestLab. All rights reserved.

