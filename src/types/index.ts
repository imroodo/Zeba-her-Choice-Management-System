export type DressType = 'Blouse' | 'Churudhar' | 'Skirt/Top' | 'Gown';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  id: string;
  customerId: string;
  dressType: DressType;
  length: number;
  shoulder: number;
  sleeveLength: number;
  sleeveLoose: number;
  armHole: number;
  chest: number;
  waist: number;
  hip: number;
  frontNeck: number;
  backNeck: number;
  bottom: number;
  bottomHip: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  type: 'Stitching' | 'Readymade';
  dressType?: string;
  measurementId?: string;
  stitchingCharge?: number;
  deliveryDate?: string;
  productName?: string;
  quantity?: number;
  price?: number;
  // Manual measurement fields for Stitching
  length?: number;
  shoulder?: number;
  sleeveLength?: number;
  sleeveLoose?: number;
  armHole?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  frontNeck?: number;
  backNeck?: number;
  bottom?: number;
  bottomHip?: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
  paymentStatus: 'Paid' | 'Not Paid';
  deliveryDate?: string;
  createdAt: string;
}

export type TabType = 'measurements' | 'orders' | 'billing';
