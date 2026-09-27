# StreamX

StreamX is an educational, portfolio-oriented streaming platform inspired by modern OTT services. It uses original fictional branding and demo content; it does not use Amazon or Prime Video logos, trademarks, or proprietary artwork.

## Features

- Responsive React interface with a cinematic home hero, movie rows, movie cards, and category browsing.
- Movies and categories loaded from the Django API, with a fictional demo catalog seed command.
- Search across movie titles, descriptions, and genres; fictional TV series are currently included from local demo data.
- Movie detail pages, related titles, and a custom HTML5 player using a CC0 demo clip and local sample captions.
- JWT registration, login, profile, logout, and protected watchlist routes.
- Watchlist add, remove, and retrieval persisted through the API for database-backed movies.
- SQLite development database with optional PostgreSQL configuration through `DATABASE_URL`.
- Loading, empty, retry, API error, and invalid-route states.

## Technology

- Frontend: React, Vite, JavaScript, React Router, Axios, Context API, Lucide React, CSS.
- Backend: Python, Django, Django REST Framework, Simple JWT, django-cors-headers.
- Database: SQLite by default; PostgreSQL supported through a database URL.

## Project Structure

```text
.
├── backend/
│   ├── accounts/                 # Custom user, registration and profile APIs
│   ├── config/                   # Django settings and root API routes
│   ├── movies/                   # Movie/category models, catalog APIs and seed command
│   ├── watchlist/                # User watchlist model and API
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/                   # Favicon and demo captions
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/                 # Fictional fallback and TV demo data
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/             # Axios API and domain services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── streamx.css
│   └── package.json
└── README.md
```

## Requirements

- Node.js 24 or newer recommended.
- Python 3.12 or newer.
- PowerShell on Windows for the commands below.

## Backend Setup

From the workspace root, open a terminal and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_catalog
python manage.py runserver 127.0.0.1:8000
```

The seed command creates or updates 16 fictional movies and nine categories. It is safe to run more than once. The SQLite database is created at `backend/db.sqlite3`.

To use PostgreSQL instead, set `DATABASE_URL` before starting Django. For example:

```powershell
$env:DATABASE_URL = "postgresql://USERNAME:PASSWORD@localhost:5432/streamx"
```

Replace the example connection values with your local PostgreSQL configuration. The `psycopg` driver is included in `requirements.txt`.

Optional backend environment variables:

- `DJANGO_SECRET_KEY`: Django signing secret. Set a private value outside local development.
- `DJANGO_DEBUG`: defaults to `true`; set to `false` outside development.
- `DJANGO_ALLOWED_HOSTS`: comma-separated host names; defaults to `localhost,127.0.0.1`.
- `CORS_ALLOWED_ORIGINS`: comma-separated frontend origins; defaults to the local Vite origins.
- `DATABASE_URL`: optional PostgreSQL connection URL.

The fallback Django secret key is for local development only. Do not deploy with it.

## Frontend Setup

Open a second terminal from the workspace root:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/`. The frontend defaults to the API at `http://127.0.0.1:8000/api`. To use another API base URL, set `VITE_API_URL` (including the `/api` path) in the frontend environment and restart Vite.

Useful frontend commands, run from the workspace root:

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
```

## Database Setup

For a fresh database, run `python manage.py migrate` from `backend/`, then `python manage.py seed_demo_catalog`. The seed command can be rerun to restore or update the demo movies and categories. User accounts and watchlists are stored in the same database.

## API Documentation

All endpoints are under `/api/`. JSON movie fields use the backend model names, such as `release_year`, `video_url`, and `created_at`.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | Create a user with `username`, `email`, and `password`. |
| `POST` | `/api/auth/login/` | Public | Exchange `username` and `password` for access and refresh JWTs. |
| `POST` | `/api/auth/token/refresh/` | Public | Exchange a valid refresh JWT for an access JWT. |
| `POST` | `/api/auth/logout/` | JWT | Blacklist the supplied `refresh` token. |
| `GET` | `/api/auth/profile/` | JWT | Return the current user and watchlist count. |

Send authenticated requests with `Authorization: Bearer <access-token>`.

### Movies and Categories

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/movies/` | Public | List movies. |
| `GET` | `/api/movies/{id}/` | Public | Retrieve one movie. |
| `POST` | `/api/movies/` | Staff JWT | Create a movie. |
| `PUT` | `/api/movies/{id}/` | Staff JWT | Replace a movie. |
| `DELETE` | `/api/movies/{id}/` | Staff JWT | Delete a movie. |
| `GET` | `/api/movies/search/?q=orbit` | Public | Search movies by title, description, genre, or category. An optional `genre` parameter is supported. |
| `GET` | `/api/categories/` | Public | List categories. |
| `GET` | `/api/categories/{id}/movies/` | Public | List movies assigned to a category. |

### Watchlist

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/watchlist/` | JWT | List the current user's saved movies. |
| `POST` | `/api/watchlist/` | JWT | Add a movie with JSON body `{"movie": 1}`. Re-adding an existing movie is idempotent. |
| `DELETE` | `/api/watchlist/{movie_id}/` | JWT | Remove a movie from the current user's watchlist. |

## Testing

Run the backend tests from `backend/`:

```powershell
python manage.py test
python manage.py check
python manage.py makemigrations --check --dry-run
```

Run frontend production checks from the workspace root:

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
```

## Demo Content and Limitations

- The movie catalog seed uses fictional titles and Unsplash image URLs. An internet connection is needed for remote imagery.
- The player uses a short CC0 demo clip from MDN; it is not a feature-film stream. Its quality selector is fixed to the single available source.
- Fictional TV series currently use local frontend demo data. The backend schema and watchlist API currently persist movies only, so series are not saved to the backend watchlist.
- The demo JWT access token is stored in browser local storage. Review token storage, secret management, HTTPS, and deployment security before production use.

## Future Improvements

- Add a backend series/media-type model and persist series in search and watchlists.
- Add pagination, caching, and richer catalog filters.
- Use production video delivery, multiple quality encodes, and caption tracks.
- Add automated frontend component and end-to-end test suites.
- Add production storage/CDN for artwork and deployment configuration.
