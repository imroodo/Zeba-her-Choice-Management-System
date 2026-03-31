-- Zeba Her Choice - Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Measurements table (linked to customers)
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  dress_type TEXT NOT NULL,
  length DECIMAL(5,2),
  shoulder DECIMAL(5,2),
  sleeve_length DECIMAL(5,2),
  sleeve_loose DECIMAL(5,2),
  arm_hole DECIMAL(5,2),
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hip DECIMAL(5,2),
  front_neck DECIMAL(5,2),
  back_neck DECIMAL(5,2),
  bottom DECIMAL(5,2),
  bottom_hip DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Delivered')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Paid', 'Not Paid')),
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Stitching', 'Readymade')),
  dress_type TEXT,
  measurement_id UUID REFERENCES measurements(id),
  stitching_charge DECIMAL(10,2),
  product_name TEXT,
  quantity INTEGER,
  price DECIMAL(10,2)
);

-- Indexes for better query performance
CREATE INDEX idx_measurements_customer_id ON measurements(customer_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
