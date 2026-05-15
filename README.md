# MealCare — Mess Food Delivery for Sick Students

MealCare is a web-based platform that replaces the manual, form-heavy process for requesting sick meal delivery from the college mess. When a student falls ill, they can use this streamlined digital workflow to get illness-appropriate meals delivered to their room, complete with dietary flags, prescription OCR verification, and warden approval.

## 🚀 Features

*   **For Sick Students:**
    *   **Quick Request:** Submit a meal request in under 3 minutes.
    *   **Smart Menu:** AI-powered menu filtering based on the declared illness and dietary flags.
    *   **Prescription OCR:** Auto-extracts dietary restrictions directly from uploaded medical documents.
    *   **Real-time Tracking:** Step-by-step order tracking from submission to delivery.
*   **For Wardens/Admins:**
    *   **Warden Dashboard:** A centralized queue for one-tap approvals and rejections.
    *   **Inline Prescription Viewer:** Easily verify student medical documents without leaving the dashboard.
*   **For Mess Staff:**
    *   **Digital Staff Queue:** Clear view of approved orders with prominent dietary flags.
    *   **Printable Meal Tickets:** Generate formatted PDF tickets for simple physical delivery tracking.

## 🛠 Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), Lucide React (Icons)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Backend & Database:** [Convex](https://www.convex.dev/)

## 📂 Project Structure

```
.
├── app/               # Next.js App Router (Pages, Layouts, API routes)
│   ├── dashboard/     # Student, Warden, and Mess Staff dashboards
│   ├── sign-up/       # Clerk authentication pages
│   └── page.tsx       # Landing page
├── components/        # Reusable React components (UI elements)
├── convex/            # Backend functions and database schema for Convex
│   ├── orders.ts      # Order management endpoints
│   └── students.ts    # Student profile management
├── public/            # Static assets
├── mess_delivery_prd-2.md # Product Requirements Document (PRD)
└── package.json       # Project dependencies and scripts
```

## 🏁 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v20+) and an appropriate package manager (`npm`, `yarn`, `pnpm`, or `bun`) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/smdw.git
    cd smdw
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your keys for Clerk and Convex:
    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    
    # Convex Backend
    CONVEX_DEPLOYMENT=your_convex_deployment
    NEXT_PUBLIC_CONVEX_URL=your_convex_url
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    bun dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📜 Product Requirements

For a comprehensive overview of the product requirements, user roles, feature details, and the data model, please refer to the [`mess_delivery_prd-2.md`](./mess_delivery_prd-2.md) file included in this repository.

## 📄 License

This project is made with care for student welfare. See the LICENSE file for details.
