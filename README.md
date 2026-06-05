# BachelorsNest

![License](https://img.shields.io/badge/License-MIT-blue)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Django-0C4B33)
![API](https://img.shields.io/badge/API-Django%20REST%20Framework-red)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

BachelorsNest is a full-stack flat rental platform built for bachelors, property owners, and platform administrators. It helps bachelors discover approved rental properties, save listings, send rent requests, and chat with owners after requests are accepted. Owners can publish properties, manage listings, and approve or reject rent requests. Admins control users, properties, requests, notifications, security settings, and platform activity logs.

The application uses a Django REST backend and a React + Vite frontend. It is organized around three protected role areas: `bachelor`, `owner`, and `admin`.

## Table Of Contents

- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Role-Based Access](#role-based-access)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Apps](#backend-apps)
- [Frontend Architecture](#frontend-architecture)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Installation And Setup](#installation-and-setup)
- [Testing And Verification](#testing-and-verification)
- [Development Notes](#development-notes)
- [License](#license)

## Screenshots

All screenshots are stored in `Documentations/SystemImages`.

### Authentication

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; justify-items: center;">
<a href="Documentations/SystemImages/Login.png" target="_blank">
<img src="Documentations/SystemImages/Login.png" width="300" alt="Login page" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/Registration.png" target="_blank">
<img src="Documentations/SystemImages/Registration.png" width="300" alt="Registration page" style="border-radius:10px;"/>
</a>
</div>

### Bachelor Workspace

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; justify-items: center;">
<a href="Documentations/SystemImages/BachelorHome.png" target="_blank">
<img src="Documentations/SystemImages/BachelorHome.png" width="250" alt="Bachelor home" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/MyRequest.png" target="_blank">
<img src="Documentations/SystemImages/MyRequest.png" width="250" alt="Bachelor rent requests" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/Notifications.png" target="_blank">
<img src="Documentations/SystemImages/Notifications.png" width="250" alt="Bachelor notifications" style="border-radius:10px;"/>
</a>
</div>

### Owner Workspace

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; justify-items: center;">
<a href="Documentations/SystemImages/OwnerDashboard.png" target="_blank">
<img src="Documentations/SystemImages/OwnerDashboard.png" width="250" alt="Owner dashboard" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/MyProperties.png" target="_blank">
<img src="Documentations/SystemImages/MyProperties.png" width="250" alt="Owner properties" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/AddProperty.png" target="_blank">
<img src="Documentations/SystemImages/AddProperty.png" width="250" alt="Add property" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/RentRequest.png" target="_blank">
<img src="Documentations/SystemImages/RentRequest.png" width="250" alt="Owner rent requests" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/OwnerNotification.png" target="_blank">
<img src="Documentations/SystemImages/OwnerNotification.png" width="250" alt="Owner notifications" style="border-radius:10px;"/>
</a>
</div>

### Admin Workspace

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; justify-items: center;">
<a href="Documentations/SystemImages/AdminUsers.png" target="_blank">
<img src="Documentations/SystemImages/AdminUsers.png" width="250" alt="Admin users" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/AdminProperties.png" target="_blank">
<img src="Documentations/SystemImages/AdminProperties.png" width="250" alt="Admin properties" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/AdminUserLogs.png" target="_blank">
<img src="Documentations/SystemImages/AdminUserLogs.png" width="250" alt="Admin user logs" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/AdminEditUsers.png" target="_blank">
<img src="Documentations/SystemImages/AdminEditUsers.png" width="250" alt="Admin edit users" style="border-radius:10px;"/>
</a>
<a href="Documentations/SystemImages/AdminEditProperties.png" target="_blank">
<img src="Documentations/SystemImages/AdminEditProperties.png" width="250" alt="Admin edit properties" style="border-radius:10px;"/>
</a>
</div>

### Chat

<div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 10px; justify-items: center;">
<a href="Documentations/SystemImages/Chat.png" target="_blank">
<img src="Documentations/SystemImages/Chat.png" width="320" alt="Chat system" style="border-radius:10px;"/>
</a>
</div>

## Core Features

### Authentication And Accounts

- Register as a `bachelor`, `owner`, or `admin`.
- Login with JWT access and refresh tokens.
- Automatic access token refresh through Axios interceptors.
- Logout with token cleanup.
- Password reset request, token verification, and password reset confirmation.
- Profile view and update support.
- Role-aware redirects after login.
- Banned user protection during authentication.
- User activity logging for admin review.

### Bachelor Features

- Browse approved rental properties.
- View property details and property images.
- Save and unsave properties through wishlist support.
- View saved properties.
- Send rent requests to property owners.
- Track rent request status.
- Cancel active rent requests when allowed.
- Receive request and platform notifications.
- Chat with owners after a rent request is accepted.
- View and edit profile.

### Owner Features

- Owner dashboard with property and request summary.
- Add rental properties with image uploads.
- View own properties.
- Edit property details and images.
- Delete own properties.
- Track approval status of submitted properties.
- View incoming rent requests.
- Accept, reject, or cancel rent requests.
- Receive notifications for rent requests and saved properties.
- Chat with bachelors after a rent request is accepted.
- View and edit profile.

### Admin Features

- Admin dashboard metrics.
- Manage users.
- Add users.
- Edit user data.
- Delete users.
- Ban and unban users.
- Change user roles between `bachelor`, `owner`, and `admin`.
- View user logs.
- Manage property approval workflow.
- Approve submitted properties.
- Reject submitted properties.
- Revert properties to pending.
- Edit properties.
- Delete properties.
- View all rent requests.
- View platform reports.
- Send broadcast notifications.
- Send role-based notifications.
- Send individual notifications.
- View notification/system logs.
- Manage security settings.

### Property Management

- Property listing creation.
- Multiple image support.
- Owner-only property management.
- Admin approval workflow.
- Public approved-property browsing.
- Saved property/wishlist support for bachelors.
- Property availability and metadata support.

### Rent Request Workflow

- Bachelor sends a request for a property.
- Duplicate active requests are blocked.
- Owner accepts or rejects requests.
- Accepted request can unlock chat between bachelor and owner.
- Status values include pending, accepted, rejected, and cancelled.
- Admin can view all rent requests.
- Request updates create notifications.

### Chat And Messaging

- Chat users are based on accepted rent requests.
- Bachelors can chat with owners after an accepted request.
- Owners can chat with accepted bachelors.
- Conversation endpoint returns message history.
- Send message endpoint stores messages.
- Unread message count endpoint supports message badges.
- WebSocket consumer support exists for chat/status behavior.

### Notifications

- User notification list.
- Mark notification as read.
- Notifications for rent request activity.
- Notifications for saved properties.
- Admin broadcast notifications.
- Admin role-based notifications.
- Admin individual notifications.
- Admin notification logs.

### Security And Administration

- JWT authentication with refresh support.
- Role-guarded frontend routes.
- Backend permission checks.
- Admin security settings endpoint.
- User logs for login/admin activity.
- Banned-user handling.
- Password reset email support through SMTP or Resend configuration.

## Role-Based Access

### Public Routes

- `/login`
- `/register`
- `/forget-password`
- `/reset-password/:token`

### Bachelor Routes

Protected by `allowedRole="bachelor"`:

- `/bachelor`
- `/bachelor/requests`
- `/bachelor/saved`
- `/bachelor/profile`
- `/bachelor/profile/:userId`
- `/bachelor/notifications`
- `/bachelor/chats`

### Owner Routes

Protected by `allowedRole="owner"`:

- `/owner`
- `/owner/requests`
- `/owner/notifications`
- `/owner/properties`
- `/owner/properties/add`
- `/owner/properties/edit/:id`
- `/owner/profile`
- `/owner/profile/:userId`
- `/owner/chats`

### Admin Routes

Protected by `allowedRole="admin"`:

- `/admin`
- `/admin/users`
- `/admin/properties`
- `/admin/requests`
- `/admin/reports`
- `/admin/notifications`
- `/admin/security`
- `/admin/settings`
- `/admin/profile`
- `/admin/profile/:userId`

## Tech Stack

### Frontend

- React 19
- Vite
- React Router 7
- Tailwind CSS 3
- Axios
- JWT Decode
- Lucide React icons
- WebSocket client package

### Backend

- Django 6
- Django REST Framework
- Simple JWT
- Django Filter
- Django CORS Headers
- Django Channels
- Channels Redis
- PostgreSQL
- Pillow
- Supabase storage integration
- python-dotenv
- Requests

## Project Structure

```text
BachelorsNest/
  Documentations/
    SystemImages/

  backend/
    accounts/
    backend/
      settings.py
      urls.py
      asgi.py
      wsgi.py
    messaging/
    notifications/
    properties/
    rentals/
    manage.py
    requirements.txt

  frontend/
    src/
      api/
        adminPropertyApi.js
        adminSecurityApi.js
        adminUserApi.js
        authApi.js
        axios.js
        chatApi.js
        notificationApi.js
        propertyApi.js
        rentalApi.js
      components/
      context/
        AuthContext.jsx
        ThemeContext.jsx
      layouts/
        AdminLayout.jsx
        BachelorLayout.jsx
        OwnerLayout.jsx
      pages/
        admin/
        auth/
        bachelor/
        chat/
        owner/
        Profile.jsx
      routes/
        ProtectedRoute.jsx
      App.jsx
      main.jsx
    package.json

  README.md
```

## Backend Apps

### `accounts`

Custom user model, registration, profile, JWT login behavior, password reset, owner/admin dashboards, user admin CRUD, role changes, ban toggle, user logs, and security settings.

### `properties`

Property creation, owner property list, property update/delete, approved property browsing, admin property list, approval/rejection workflow, pending revert, saved properties, and wishlist toggle.

### `rentals`

Rent request creation, bachelor request list, owner request list, admin request list, status updates, duplicate active-request prevention, and request deletion/cancellation.

### `messaging`

Chat user discovery, conversation history, message sending, unread counts, and WebSocket consumer support.

### `notifications`

User notifications, read state, admin broadcast messages, role-based notifications, individual messages, system logs, and admin user notification targeting.

## Frontend Architecture

### `App.jsx`

Defines public routes, bachelor routes, owner routes, admin routes, protected layouts, and fallback redirect behavior.

### `routes/ProtectedRoute.jsx`

Loads the authenticated user from `AuthContext` and blocks access when the user is missing or the role does not match the route.

### Layouts

- `BachelorLayout.jsx` for bachelor navigation and page shell.
- `OwnerLayout.jsx` for owner navigation and page shell.
- `AdminLayout.jsx` for admin navigation and page shell.

### API Layer

Frontend API calls are split by domain:

- `authApi.js`
- `propertyApi.js`
- `rentalApi.js`
- `chatApi.js`
- `notificationApi.js`
- `adminUserApi.js`
- `adminPropertyApi.js`
- `adminSecurityApi.js`
- `axios.js`

`axios.js` centralizes the base API URL, JWT bearer token attachment, refresh token flow, and login redirect on expired sessions.

## API Overview

Default backend URL:

```text
http://localhost:8000
```

Default API base:

```text
http://localhost:8000/api
```

Frontend environment variable:

```env
VITE_API_URL=http://localhost:8000
```

### Authentication And Accounts

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/token/` | Login with JWT |
| POST | `/api/token/refresh/` | Refresh access token |
| POST | `/api/accounts/register/` | Register user |
| GET/PATCH | `/api/accounts/profile/` | Current user profile |
| GET | `/api/accounts/users/<id>/` | User details |
| POST | `/api/accounts/logout/` | Logout |
| POST | `/api/accounts/password-reset/` | Request password reset |
| POST | `/api/accounts/password-reset-verify/` | Verify reset token |
| POST | `/api/accounts/password-reset-confirm/` | Confirm password reset |

### Properties

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/properties/approved/` | Approved public listings |
| GET | `/api/properties/saved/` | Bachelor saved listings |
| POST | `/api/properties/<id>/wishlist/` | Toggle saved property |
| POST | `/api/properties/add/` | Owner adds property |
| GET | `/api/properties/owner/` | Owner properties |
| PUT/DELETE | `/api/properties/update-delete/<id>/` | Update or delete property |
| GET | `/api/properties/admin/all/` | Admin property list |
| PATCH | `/api/properties/approve/<id>/` | Approve property |
| PATCH | `/api/properties/reject/<id>/` | Reject property |
| PATCH | `/api/properties/revert-pending/<id>/` | Revert to pending |

### Rent Requests

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/rentals/request/` | Bachelor sends request |
| GET | `/api/rentals/bachelor/` | Bachelor requests |
| GET | `/api/rentals/owner/` | Owner requests |
| GET | `/api/rentals/admin/` | Admin request list |
| PATCH | `/api/rentals/update/<id>/` | Update request status |
| DELETE | `/api/rentals/delete/<id>/` | Cancel/delete request |

### Messaging

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/messages/users/` | Users available for chat |
| GET | `/api/messages/conversation/<user_id>/` | Conversation history |
| POST | `/api/messages/send/` | Send message |
| GET | `/api/messages/unread-count/` | Unread count |

### Notifications

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/notifications/` | Current user notifications |
| PATCH | `/api/notifications/read/<id>/` | Mark read |
| POST | `/api/notifications/admin/broadcast/` | Admin broadcast |
| POST | `/api/notifications/admin/role/` | Admin role notification |
| POST | `/api/notifications/admin/individual/` | Admin individual message |
| GET | `/api/notifications/admin/logs/` | System logs |
| GET | `/api/notifications/admin/users/` | Users for notification targeting |

### Admin Accounts And Security

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/accounts/admin/users/` | Admin user list |
| POST | `/api/accounts/admin/users/add/` | Admin add user |
| PATCH/DELETE | `/api/accounts/admin/users/<id>/` | Edit/delete user |
| PATCH | `/api/accounts/admin/users/<id>/ban/` | Ban/unban user |
| PATCH | `/api/accounts/admin/users/<id>/role/` | Change role |
| GET | `/api/accounts/admin/users/<id>/logs/` | User logs |
| GET/PUT | `/api/accounts/admin/security-settings/` | Security settings |
| GET | `/api/accounts/admin-dashboard/` | Admin dashboard |
| GET | `/api/accounts/owner-dashboard/` | Owner dashboard |

## Environment Variables

Backend `.env` example:

```env
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=BachelorsNest
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_MEDIA_BUCKET=StudyMaterials

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@bachelorsnest.com

FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Frontend `.env` example:

```env
VITE_API_URL=http://localhost:8000
```

## Installation And Setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL
- Redis if switching Channels to Redis in production
- Supabase project/bucket for media storage

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend URL:

```text
http://localhost:8000
```

Django admin:

```text
http://localhost:8000/admin/
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### Production Build

```bash
cd frontend
npm run build
```

### Optional ASGI/Daphne Run

```bash
cd backend
python -m daphne backend.asgi:application
```

## Testing And Verification

Backend system check:

```bash
cd backend
python manage.py check
```

Frontend build:

```bash
cd frontend
npm run build
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Useful route checks:

```text
/login
/register
/bachelor
/owner
/admin
/admin/users
/admin/properties
```

## Development Notes

- The frontend uses separate layouts for bachelor, owner, and admin areas.
- Route protection is role-based through `ProtectedRoute`.
- Axios automatically attaches JWT access tokens.
- Axios attempts token refresh on `401` responses.
- Chat access is based on accepted rent requests.
- Only approved properties are shown to bachelors.
- Property owners manage only their own listings.
- Admins can moderate users and properties across the platform.
- Supabase storage is used for uploaded media through the configured Django storage backend.
- The current Channels configuration uses an in-memory channel layer by default.

## Future Improvements

- Payment integration for deposits or booking fees.
- Rental agreement generation.
- Map-based property discovery.
- Advanced property filtering and recommendations.
- Owner verification and bachelor identity verification.
- Real-time notification transport.
- Production Redis channel layer.
- More detailed admin analytics.

## License

MIT License. See `LICENSE` if present in the repository.

## Support

If this project is useful, consider starring the repository and keeping the documentation up to date as features evolve.
