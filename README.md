<p align="center">
  <img src="public/img/logo-green-round.png" alt="Natours logo" width="180">
</p>

<p align="center">
  <img src="public/img/logo-green.png" alt="Natours" width="220">
</p>

<h1 align="center">Connect With Nature</h1>

<p align="center">
  <strong>Exciting tours for adventurous people</strong>
</p>

<p align="center">
  Discover wild places. Follow expert guides. Come home with stories — not souvenirs from a gift shop.
</p>

<p align="center">
  <a href="#getting-started"><strong>Get started</strong></a>
  ·
  <a href="#website-routes">Website</a>
  ·
  <a href="#api-overview">API</a>
</p>

---

<table>
  <tr>
    <td align="center" width="33%">
      <strong>Adventure, not a checklist</strong><br>
      Multi-day tours with real locations on the map — from the first trailhead to the last camp.
    </td>
    <td align="center" width="33%">
      <strong>People you can trust</strong><br>
      Rated by travelers. Led by guides. Booked in minutes with a secure checkout.
    </td>
    <td align="center" width="33%">
      <strong>Your trip, your account</strong><br>
      Sign up, save your profile, review the places you loved, and reopen the tours you already booked.
    </td>
  </tr>
</table>

<p align="center">
  <em>What are you waiting for? One adventure. Infinite memories. Make it yours today.</em>
</p>

---

**Natours** is a nature-tour booking product: a REST API plus a server-rendered website. Travelers browse tours, sign up, update their profile, leave reviews, and pay with Stripe. Admins and lead guides manage tours and bookings.

Built with Node.js, Express, and MongoDB (inspired by the Jonas Schmedtmann Node.js course), maintained by [Oussama Ennadafy](https://github.com/oussamaennadafy).

## Features

- Tour catalog with ratings, guides, start dates, and GeoJSON start locations
- Nested reviews (a review belongs to a tour and a user)
- JWT authentication in an HTTP-only cookie (and in the JSON response)
- Role-based access: `user`, `guide`, `lead-guid` / `lead-guide`, `admin`
- Password reset emails (Mailtrap in development, SendGrid in production)
- Stripe Checkout for bookings, confirmed via webhook
- Mapbox map on each tour page
- Image uploads for user avatars and tour photos (Multer + Sharp)
- Query API: filter, sort, field limiting, pagination
- Geospatial queries: tours within a radius, distances from a point
- Aggregation: tour stats and monthly plans
- Security middleware: Helmet, rate limiting, CORS, XSS and NoSQL sanitization, HPP
- Pug templates for the website and transactional emails

## Tech stack

| Layer | Tools |
| --- | --- |
| Runtime | Node.js `^22.19.0` |
| Server | Express 5 |
| Database | MongoDB with Mongoose 8 |
| Views | Pug |
| Auth | JWT (`jsonwebtoken`), bcrypt |
| Payments | Stripe Checkout + webhooks |
| Maps | Mapbox GL JS |
| Email | Nodemailer, Pug templates, html-to-text |
| Uploads | Multer, Sharp |
| Security | helmet, express-rate-limit, cors, xss-clean, express-mongo-sanitize, hpp, compression |

## Project structure

```
natours/
├── app.js                 # Express app, middleware, route mounting
├── server.js              # Env, MongoDB connection, HTTP server
├── controllers/           # Auth, tours, users, reviews, bookings, views, errors
├── models/                # Tour, User, Review, Booking
├── routes/                # API and website routers
├── views/                 # Pug pages and email templates
├── public/                # CSS, client JS, images
├── utils/                 # ApiFeatures, AppError, catchAsync, Email
├── dev-data/data/         # Sample JSON + import script
└── local.env              # Environment variable template
```

## Getting started

### Prerequisites

- Node.js 22 (see `engines` in `package.json`)
- A MongoDB database (Atlas or local)
- Stripe account (for bookings)
- Email credentials (Mailtrap for development, SendGrid for production)
- Mapbox token if you change the one used in `public/js/mapbox.js`

### 1. Clone and install

```bash
git clone https://github.com/oussamaennadafy/natours.git
cd natours
npm install
```

### 2. Configure environment

The server loads `config.env` from the project root (`dotenv` in `server.js`). That file is gitignored. Copy the template and fill in values:

```bash
cp local.env config.env
```

Variables:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | HTTP port (defaults to `3000`) |
| `DATABASE_STRING` | MongoDB URI. Use `<PASSWORD>` as a placeholder for the password |
| `DATABASE_PASSWORD` | Replaces `<PASSWORD>` in the connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (for example `90d`) |
| `JWT_COOKIE_EXPIRES_IN` | Cookie lifetime in **days** |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PAWWSORD` | Dev SMTP (typo in the variable name is intentional — it matches the code) |
| `EMAIL_FROM` | From address for outgoing mail |
| `SENDGRID_USERNAME`, `SENDGRID_PASSWORD` | Used when `NODE_ENV=production` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/webhook-checkout` |

Example connection string:

```
DATABASE_STRING=mongodb+srv://user:<PASSWORD>@cluster.mongodb.net/natours
DATABASE_PASSWORD=yourActualPassword
```

### 3. Load sample data (optional)

Sample tours, users, and reviews live in `dev-data/data/`. Users are imported with validation skipped so pre-hashed passwords in `users.json` work.

```bash
# wipe tours, users, and reviews
node dev-data/data/import-dev-data.js --delete

# import sample data
node dev-data/data/import-dev-data.js --import
```

`--delete` removes those collections. It does not touch bookings.

### 4. Run the app

```bash
# development (nodemon + morgan)
npm run dev

# production-like
npm start
# or
npm run start:prod
```

Open [http://localhost:3000](http://localhost:3000). The API is under `/api/v1`.

## Website routes

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | optional login | Tour overview |
| GET | `/tour/:slug` | optional login | Tour details and Mapbox map |
| GET | `/login` | — | Login form |
| GET | `/me` | logged in | Account settings |
| GET | `/my-tours` | logged in | Tours the user booked |
| PATCH | `/submit-user-data` | logged in | Update name/email from the account form |

Client scripts in `public/js/` handle login, logout, profile/password updates, and Stripe checkout.

## API overview

Base URL: `/api/v1`

JSON responses generally look like:

```json
{
  "status": "success",
  "token": "...",
  "data": { "data": {} }
}
```

Errors go through a global handler. In development you get a full stack; in production the message is sanitized.

API routes are rate-limited to **100 requests per IP per hour**.

### Authentication — `/api/v1/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/signup` | public | Create account (`name`, `email`, `password`, `passwordConfirm`) |
| POST | `/login` | public | Log in; sets `jwt` cookie |
| GET | `/logout` | public | Clears the cookie |
| POST | `/forgetPassword` | public | Email a reset token |
| PATCH | `/resetPassword/:token` | public | Set a new password |
| PATCH | `/updatePassword` | logged in | Change password (`passwordCurrent`, `password`, `passwordConfirm`) |

Send the JWT as a cookie, or as `Authorization: Bearer <token>`.

### Tours — `/api/v1/tours`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | public | List tours (filter / sort / fields / page) |
| GET | `/top-5-cheap` | public | Alias: 5 highest-rated cheapest tours |
| GET | `/tour-stats` | public | Aggregation by difficulty |
| GET | `/monthly-plan/:year` | admin, lead-guide, guide | Starts per month |
| GET | `/tours-within/:distance/center/:latlng/unit/:unit` | public | Geospatial radius search |
| GET | `/distances/:latlng/unit/:unit` | public | Distance from a point |
| POST | `/` | admin, lead-guide | Create tour |
| GET | `/:id` | public | One tour, including reviews |
| PATCH | `/:id` | admin, lead-guide | Update tour (optional cover + 3 images) |
| DELETE | `/:id` | admin, lead-guide | Delete tour |

Reviews for a tour are nested:

- `GET/POST /api/v1/tours/:tour/reviews`
- `GET/PATCH/DELETE /api/v1/tours/:tour/reviews/:id`

There is no standalone `/api/v1/reviews` mount; use the nested tour routes.

**Query examples**

```http
GET /api/v1/tours?duration[gte]=5&difficulty=easy&sort=-price&fields=name,price,duration&page=1&limit=10
GET /api/v1/tours/tours-within/233/center/34.111745,-118.113491/unit/mi
GET /api/v1/tours/distances/34.111745,-118.113491/unit/mi
```

Operators supported in filters: `gte`, `gt`, `lte`, `lt`.

### Users — `/api/v1/users`

All user routes require a logged-in user.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/me` | logged in | Current user |
| PATCH | `/updateMe` | logged in | Name, email, photo (multipart) |
| DELETE | `/deleteMe` | logged in | Soft-delete (sets `active: false`) |
| GET | `/` | admin | List users |
| DELETE | `/:id` | admin | Delete a user |

### Bookings — `/api/v1/bookings`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/checkout-session/:tourId` | logged in | Create a Stripe Checkout session |
| GET/POST | `/` | admin, lead-guide | List / create bookings |
| GET/PATCH/DELETE | `/:id` | admin, lead-guide | Single booking CRUD |

### Stripe webhook

```http
POST /webhook-checkout
```

This route is **outside** `/api/v1` and uses the raw JSON body so Stripe can verify the signature. On `checkout.session.completed` a booking is created for the customer email and tour id stored on the session.

Point Stripe (or the Stripe CLI) at:

```text
https://<your-host>/webhook-checkout
```

The Checkout success URL is `/my-tour?alert=booking` (see `bookingController.js`); confirm that path matches the website route you want users to land on after payment.

## Data model (short)

- **Tour** — name, slug, duration, group size, difficulty, price, images, start dates, GeoJSON `startLocation` / `locations`, guide refs, virtual `reviews` and `durationWeeks`. Secret tours are hidden from find queries. Indexes: price + rating, slug, 2dsphere on `startLocation`.
- **User** — name, email, photo, role, hashed password, reset token, `active` flag. Inactive users are excluded from find queries.
- **Review** — text, rating 1–5, tour + user refs. Average rating on the tour is recalculated when reviews change.
- **Booking** — tour, user, price, `paid` (defaults to `true`).

## Security notes

- Helmet sets security headers. Tour pages extend CSP so Mapbox, Stripe, and jsDelivr can load.
- `mongoSanitize` and `xss-clean` run after a small Express 5 shim that makes `req.query` writable.
- `hpp` allows repeated query keys only for tour fields such as `duration`, `price`, and `difficulty`.
- JWT cookies are `httpOnly` and `secure` when the request is HTTPS (including `x-forwarded-proto`).
- `app.enable("trust proxy", 1)` is set for deployments behind a proxy.

Do not commit `config.env`. Keep Stripe secret keys and JWT secrets out of git.

## Scripts

| Script | Command |
| --- | --- |
| `npm start` | `node server.js` |
| `npm run dev` | `NODE_ENV=development nodemon server.js` |
| `npm run start:prod` | `NODE_ENV=production nodemon server.js` |
| `npm run start:debug` | `ndb server.js` |
| `npm run watch:js` / `build:js` | Parcel watch on `public/js/index.js` |

`nodemon`, `ndb`, and `parcel` are used in scripts but are not listed in `package.json`. Install them globally or as extra dev dependencies if you use those commands.

## License

ISC
