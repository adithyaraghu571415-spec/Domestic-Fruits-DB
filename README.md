# 🍎 Domestic Fruits Dashboard

A real-time business analytics dashboard for tracking domestic fruit trade — sales, margins, dispatch, and performance metrics across owners and markets.

---

## 🚀 Features

### 📊 Dashboard KPIs
- **MTD Closed Sales** — Total revenue from closed trades for the selected period
- **MTD Margin** — Gross margin from closed trades
- **Total Volume (Boxes)** — Dispatched closed boxes
- **Avg Price / Box** — Realisation per box
- **Top Source Market** — Ranked by best price per box
- **Active Customers** — Unique customers in the selected period

### 🗓️ Date Filtering
- **Year** dropdown — filter by financial year
- **Month** dropdown — dynamically updates to only show months available in the selected year
- Defaults to the **latest available month** on load

### 🧾 Ownership Matrix
- Tracks performance by trade owner: Karan, Kishore, Central, Amit, etc.
- Displays **Closed Boxes**, **Open Boxes**, **Sales vs. Target** (with progress bar), **Margin vs. Target**, and **Yield %**
- Click any row to open a **Trade Drill-Down** modal — filtered by active date selection, sorted by dispatch date (newest first)

### 📦 Demand Matrix
- Tracks sales & boxes by **Product → Market**
- Header row shows totals vs. targets for Boxes, Sales, and Margin
- Each market row shows achieved vs. target with progress bars
- Click any market row to open a **Customer Breakdown** modal showing:
  - Per-customer: Boxes achieved vs. target, Sales achieved vs. target, Margin, Yield
  - Progress bars and % completion per customer

### 📈 Cumulative GMV Chart
- Daily cumulative closed sales trend for the selected period

### 🚛 Dispatch Chart
- Last-7-day dispatch activity split by owner (Karan OM/CM, Kishore OM/CM)

### 🔝 Top Markets & Top Customers
- Side panels showing top 5 markets and customers by margin/sales

### 🔐 Role-Based Access Control (RBAC)
| Role | Permissions |
|------|-------------|
| **Admin** | Full access — view, edit settings, manage users (cannot demote other Admins) |
| **Central** | View + promote Viewers to Central (cannot demote Centrals) |
| **Viewer** | Read-only access |

---

## 🗂️ Data Sources

| Source | Description |
|--------|-------------|
| **Main Data CSV** (Google Sheets) | Trade records — dispatch date, closure date, customer, market, product, boxes, sales, margin, mark, mode, year |
| **Targets CSV** (Google Sheets) | Monthly sales, margin, and boxes targets by owner, product, market, and customer |
| **Firebase Realtime DB** | User authentication, roles, settings, and URL storage |

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML + CSS + JavaScript (no build step)
- **Charts**: Chart.js
- **Auth & DB**: Firebase Authentication + Firebase Realtime Database
- **Data**: Google Sheets CSV export (fetched with CORS fallbacks)
- **Hosting**: GitHub → Vercel (static site)

---

## 🚢 Deployment

### Option A — Deploy via GitHub + Vercel (Recommended)
1. Push to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Vercel auto-detects and deploys the static site

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔧 Configuration

All configuration is managed through the **Settings sidebar** inside the dashboard (⚙️ icon):
- **CSV URL** — link to the Google Sheets main data export
- **Targets CSV** — automatically fetched from the hardcoded `TARGETS_CSV_URL` constant in `index.html`
- **Estimated Price / Box** — global override for price calculations
- **User Management** — promote/demote users (Admin/Central only)
