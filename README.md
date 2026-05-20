# MealCare — Mess Food Delivery for Sick Students

MealCare is a state-of-the-art web-based platform designed to replace the archaic, manual, and paper-based request process for sick meal deliveries in college hostels. When a student falls ill, they should not have to navigate complex bureaucracy to get appropriate food. MealCare digitizes the entire lifecycle—from the student's initial illness declaration and prescription upload to warden approval, kitchen preparation, and delivery tracking—all within an intuitive, mobile-optimized interface.

---

## 📖 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Key Workflows & User Journeys](#-key-workflows--user-journeys)
3. [Core Features](#-core-features)
4. [Smart Logic: Illness-to-Menu Mapping](#-smart-logic-illness-to-menu-mapping)
5. [Technology Stack](#-technology-stack)
6. [Project Structure](#-project-structure)
7. [Database Schema (Convex)](#-database-schema-convex)
8. [Installation & Local Setup](#-installation--local-setup)
9. [Security & Privacy](#-security--privacy)
10. [Product Requirements Document (PRD)](#-product-requirements-document-prd)
11. [License](#-license)

---

## 🌟 Executive Summary & Problem Statement

### The Problem
At college campuses, sick students often face administrative hurdles when requesting meals to be delivered to their rooms:
* **For Students:** Physically visiting the warden's office or hostel supervisor for approval is difficult when unwell. Specifying diet restrictions manually is tedious and error-prone.
* **For Wardens:** Approvals are requested via disorganized channels (WhatsApp, phone calls, paper slips), with no central queue or audit trail.
* **For Mess Staff:** Kitchen supervisors receive verbal or handwritten notes, causing errors in allergen/dietary considerations.

### The Solution
**MealCare** streamlines this process into a structured digital workflow:
1. **Student** submits a request in under 3 minutes, declaring their symptoms and uploading a prescription (which is parsed via OCR).
2. **Warden** receives an instant dashboard notification, reviews the details/prescription inline, and approves or rejects with a single tap.
3. **Mess Staff** views approved orders in real time, prepares meals using clear dietary flags, and prints physical delivery tickets.

---

## 🔄 Key Workflows & User Journeys

The application serves three distinct user roles:

### 1. Student Journey
* **Identity Verification:** Students log in via SSO (provided by Clerk). Profile info (name, roll number, hostel) is pre-populated.
* **Health Declaration & Upload:** The student selects their illness type and uploads a prescription. The system extracts dietary flags (e.g., "no dairy", "bland food only") via OCR.
* **Smart Meal Selection:** The mess menu is dynamically filtered to show recommended items for the illness at the top, warning the student about discouraged items.
* **Real-time Tracking:** After submission, the student tracks their order status from `Submitted` → `Pending Review` → `Approved` → `Preparing` → `Dispatched` → `Delivered`.

### 2. Warden Dashboard
* Centralized queue of pending requests with real-time updates.
* **Inline PDF/Image Preview:** Wardens can inspect prescription documents directly in the dashboard modal.
* **Quick Actions:** One-tap approval or rejection with custom notes.

### 3. Mess Staff View
* A dedicated dashboard displaying only approved orders.
* Colour-coded warning tags for food allergies and specific dietary preferences (Veg, Vegan, Jain, Non-Veg).
* **Printable Tickets:** One-click PDF generation of physical tickets for delivery staff containing delivery room, name, and special instructions.

---

## 🚀 Core Features

* **Prescription OCR Extraction:** Auto-detects dietary constraints directly from uploaded medical documents.
* **Smart Menu Filtering:** AI-driven menu adjustments recommending soft/bland food (like Khichdi) for fever/stomach issues, while flagging deep-fried or oily foods.
* **Local Auto-save:** The submission form auto-saves progress locally so students do not lose their draft if their network drops.
* **Escalation Alerts:** Alerts backup approvers if an order is pending warden review for more than 15 minutes.
* **Recurring Order Templates:** Students can save a successful order configuration as a named template for quick multi-day resubmissions.

---

## 🥦 Smart Logic: Illness-to-Menu Mapping

The platform includes seed data mapping common illnesses to suitable meals, which admins can configure through the dashboard:

| Illness Type | Recommended Foods | Discouraged Foods |
| :--- | :--- | :--- |
| **Fever / Flu** | Khichdi, plain dal, soft rice, clear vegetable soup, banana, warm milk, curd | Fried food (pakoda, puri), spicy curries, heavy desserts, raw salads |
| **Stomach infection / Nausea** | Plain rice, curd rice, banana, plain toast, ORS, boiled potato | Dairy except curd, oily/fatty food, raw vegetables, legumes, spicy food |
| **Throat infection / Cold** | Warm clear soup, soft khichdi, warm turmeric milk, honey, steamed rice | Cold items (ice cream, cold milk), hard/crunchy food, spicy food |
| **Post-surgery / Recovery** | High-protein dal, eggs, soft paneer, fruits (banana, apple), soft rice, boiled vegetables | Deep fried food, heavily spiced items, hard-to-chew items |
| **Injury / Mobility restriction** | Balanced standard meal with reduced spice; easy-to-eat items | No specific restrictions; spice tolerance from preferences |
| **General weakness** | Light khichdi, dal, fruit, warm milk, curd | Heavy or oily items |

---

## 🛠 Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Authentication:** [Clerk](https://clerk.com/)
* **Database & Realtime Backend:** [Convex](https://www.convex.dev/)
* **Vector/Storage Bucket:** Convex File Storage
* **Icons:** Lucide React

---

## 📂 Project Structure

```
.
├── app/                           # Next.js App Router (Pages & Layouts)
│   ├── dashboard/                 # Role-specific dashboards (Student, Warden, Mess)
│   ├── sign-up/                   # Clerk authentication pages
│   ├── layout.tsx                 # Core HTML structure & providers
│   └── page.tsx                   # Landing page
├── components/                    # Reusable React UI components
├── convex/                        # Convex backend codebase
│   ├── _generated/                # Auto-generated type definitions for Convex
│   ├── schema.ts                  # Database schema definitions
│   ├── menuItems.ts               # Menu management resolvers & mutations
│   ├── orders.ts                  # Order creation, updates, and status mutations
│   ├── prescriptionAnalysis.ts    # OCR logic & AI processing functions
│   └── students.ts                # Student profile creation & queries
├── public/                        # Static assets (images, icons)
├── mess_delivery_prd-2.md         # Comprehensive Product Requirements Document (PRD)
├── LICENSE                        # Project LICENSE file (Proprietary)
└── package.json                   # Project dependencies and run scripts
```

---

## 🗄 Database Schema (Convex)

The database schema is defined in [convex/schema.ts](./convex/schema.ts). Below is an overview of the core tables:

### 1. `students` Table
Tracks profile information auto-filled from the college directory and authentication details.
* **`clerkId`** (`string`): Unique user identifier from Clerk SSO.
* **`name`** (`string`), **`email`** (`string`), **`phone`** (`string`, optional)
* **`rollNumber`** (`string`, optional), **`hostel`** (`string`, optional), **`roomNumber`** (`string`, optional)
* **`dietaryPreference`** (`veg` | `non-veg` | `vegan` | `jain`)
* **`knownAllergies`** (`string[]`)
* **`role`** (`student` | `warden` | `mess_staff` | `admin`)

### 2. `orders` Table
Stores each sick meal delivery request and tracks status transitions.
* **`orderId`** (`string`): Human-readable unique ID (e.g., `MC-2026-04821`).
* **`studentId`** (Reference to `students` table).
* **`deliverySlot`** (`breakfast` | `lunch` | `dinner`).
* **`illnessType`** (`string`) & **`illnessSeverity`** (`mild` | `moderate` | `severe`).
* **`selectedItems`** (Array of References to `menuItems`).
* **`prescriptionStorageId`** (Reference to Convex `_storage` bucket).
* **`prescriptionStatus`** (`pending` | `verified` | `flagged` | `self_certified`).
* **`ocrFlags`** (`string[]`): Extracted dietary constraints from OCR.
* **`orderStatus`** (`submitted` | `pending_review` | `approved` | `rejected` | `preparing` | `dispatched` | `delivered` | `cancelled`).
* **`statusHistory`** (Array of status transition objects with timestamps and actors).

### 3. `menuItems` Table
Stores the mess menu options.
* **`name`** (`string`), **`description`** (`string`, optional).
* **`dietaryTags`** (Array of `veg` | `non-veg` | `vegan` | `jain`).
* **`allergens`** (`string[]`).
* **`spiceLevel`** (`none` | `low` | `medium` | `high`).
* **`recommendedFor`** / **`discouragedFor`** (`string[]`): Illness mappings.
* **`availableForSickDelivery`** (`boolean`).

---

## 🏁 Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* A package manager (e.g., `npm` or `bun`)
* A [Convex](https://www.convex.dev/) account
* A [Clerk](https://clerk.com/) account

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shaik-Imaduddin/smdw.git
cd smdw
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a [`.env.local`](./.env.local) file in the root directory and populate it with your environment keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Integration
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...
```

### Step 4: Run Convex Development Server
Start the Convex backend sync. This command reads your [schema.ts](./convex/schema.ts) and deploys your serverless functions:
```bash
npx convex dev
```

### Step 5: Start the Frontend Next.js Server
In a new terminal window, spin up the local development web server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔒 Security & Privacy

* **Access Control Matrix:** Role-based restrictions ensure students can only view and edit their own orders, wardens can only access orders within their assigned hostels, and mess staff see no medical details other than the required dietary flags.
* **Prescription Privacy:** Uploaded documents are kept in secure, private storage. Access is limited using secure signed URLs that expire after 1 hour.
* **Auto-deletion:** To comply with data privacy regulations (e.g., DPDP Act 2023), prescription documents are automatically deleted 30 days after the corresponding order is marked as delivered.

---

## 📄 Product Requirements Document (PRD)

For a complete breakdown of functional requirements, non-functional requirements (performance SLA, availability, accessibility), and release milestones, consult the [mess_delivery_prd-2.md](./mess_delivery_prd-2.md) file.

---

## 📄 License

This software is proprietary and confidential. See the [LICENSE](./LICENSE) file for the full text.

**Copyright (c) 2026 Shaik Imaduddin. All rights reserved.**
