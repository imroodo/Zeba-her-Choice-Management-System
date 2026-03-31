# Zeba Her Choice - Boutique Management System

A modern web application for managing a boutique business, built with React 19, TypeScript, and Supabase.

## Features

- **Customer Management**: Add, edit, view, and delete customers
- **Measurements**: Track customer measurements for different dress types
- **Orders**: Create orders with stitching or readymade items
- **Billing**: Generate invoices, manage discounts, track payment status
- **Dashboard**: View statistics, order status distribution, revenue, and upcoming deliveries
- **Cloud Database**: All data stored in PostgreSQL via Supabase
- **Responsive UI**: Works on desktop and mobile with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **React Router v7** for client-side routing
- **Tailwind CSS v3** for styling
- **Supabase** (PostgreSQL) for cloud database
- **No authentication** (public database access)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free)

### 1. Supabase Setup (One-time)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**, paste the contents of `SUPABASE_SCHEMA.sql` and click **Run**
3. **Important**: Disable Row Level Security (RLS) on all 4 tables:
   - Go to **Authentication** → **Policies**
   - For each table (`customers`, `measurements`, `orders`, `order_items`), toggle **Enable RLS** to OFF
4. Get your API keys from **Project Settings** → **API**:
   - `URL`
   - `anon` public key

### 2. Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Start development server:
```bash
npm run dev
```

Open http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── billing/          # Invoice page
│   ├── common/           # Reusable UI components (Button)
│   ├── customers/        # Customer management (list, form, detail)
│   ├── dashboard/        # Statistics and charts
│   ├── layout/           # Header, Layout
│   ├── measurements/     # Measurement management
│   └── orders/           # Order creation and list
├── hooks/                # Custom React hooks (Supabase integration)
│   ├── useCustomers.ts
│   ├── useMeasurements.ts
│   └── useOrders.ts
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── types/                # TypeScript type definitions
├── utils/                # Helpers, constants, validators
├── App.tsx               # Main app with routing
├── index.css             # Tailwind imports and global styles
└── main.tsx              # Entry point
```

## Usage Guide

### Dashboard
The home page shows quick stats and navigation shortcuts.

### Customers
- View all customers in a card layout
- Search by name or phone
- Add new customer
- Edit existing customer
- Delete customer (with confirmation)
- Click a customer to view details

### Customer Detail Page
Tabs for:
- **Measurements**: Add/edit/delete measurements for different dress types
- **Orders**: View orders for this customer, create new order
- **Billing**: View all orders and access invoices

### Measurements
- Add measurements for specific dress types
- All measurement fields are optional
- View measurements in a card with summary and expandable full details
- Edit and delete measurements

### Orders
- Select a customer first
- Add multiple items (Stitching or Readymade)
- **Stitching**: Select dress type, choose existing measurement, enter stitching charge
- **Readymade**: Enter product name, quantity, and price
- Set expected delivery date using the calendar picker
- Dynamic add/remove items
- Real-time total calculation
- Apply discount
- Order status starts as "Pending"

### Invoices
- View complete invoice with customer details, order items, and delivery date
- Editable discount field with live total recalculation
- Print-friendly layout
- Back to customer or create new order

## Data Model

### Customer
```typescript
{
  id: string
  name: string
  phone: string        // 10-digit Indian phone
  address: string
  notes: string
  createdAt: string
  updatedAt: string
}
```

### Measurement
```typescript
{
  id: string
  customerId: string
  dressType: 'Blouse' | 'Churudhar' | 'Skirt/Top' | 'Gown'
  length: number
  shoulder: number
  sleeveLength: number
  armHole: number
  chest: number
  waist: number
  hip: number
  frontNeck: number
  backNeck: number
  bottom: number
  bottomHip: number
  createdAt: string
}
```

### Order
```typescript
{
  id: string
  customerId: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered'
  paymentStatus: 'Paid' | 'Not Paid'
  deliveryDate?: string  // ISO date string (YYYY-MM-DD)
  createdAt: string
}
```

### OrderItem
```typescript
{
  id: string
  type: 'Stitching' | 'Readymade'
  // For Stitching:
  dressType?: string
  measurementId?: string
  stitchingCharge?: number
  // For Readymade:
  productName?: string
  quantity?: number
  price?: number
}
```

## Notes

- **No Authentication**: Database is publicly accessible (RLS disabled). For multi-user scenarios, enable RLS and add Supabase Auth.
- **Cloud Database**: All data persists in Supabase PostgreSQL. Works across devices.
- **Deployment**: Build creates static files. Deploy `dist/` to Vercel/Netlify/GitHub Pages. Add environment variables in hosting dashboard.
- **Designed for single shop owner use** (can be extended for multi-user with auth)
- **Measurements** are stored separately and can be reused across orders
- **Invoices** can be printed using the browser's print dialog
- **Currency**: Indian Rupee (INR). Modify `formatCurrency` in `src/utils/helpers.ts` to change.

## Future Enhancements

- Export invoices to PDF
- SMS/WhatsApp integration for order updates
- Dark mode support
- Data backup/restore functionality
- More detailed reporting dashboard
