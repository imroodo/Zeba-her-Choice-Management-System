import { v4 as uuidv4 } from 'uuid';
import type { Customer, Measurement, Order } from '../types';

const sampleCustomers: Customer[] = [
  {
    id: uuidv4(),
    name: 'Priya Sharma',
    phone: '9876543210',
    address: '42, Gandhi Nagar, Delhi',
    notes: 'Regular customer, prefers cotton fabrics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Kavya Reddy',
    phone: '9876543211',
    address: '15, Koramangala, Bangalore',
    notes: 'Prefers designer blouses',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Anjali Devi',
    phone: '9876543212',
    address: '78, T Nagar, Chennai',
    notes: 'Likes traditional churidhars',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Meena Patel',
    phone: '9876543213',
    address: '23, Andheri West, Mumbai',
    notes: 'Prefers modern gowns',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleMeasurements: Measurement[] = [
  {
    id: uuidv4(),
    customerId: sampleCustomers[0].id,
    dressType: 'Blouse',
    length: 24,
    shoulder: 18,
    sleeveLength: 22,
    sleeveLoose: 24,
    armHole: 20,
    chest: 38,
    waist: 32,
    hip: 40,
    frontNeck: 8,
    backNeck: 6,
    bottom: 60,
    bottomHip: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[0].id,
    dressType: 'Churudhar',
    length: 56,
    shoulder: 18,
    sleeveLength: 22,
    sleeveLoose: 24,
    armHole: 20,
    chest: 38,
    waist: 32,
    hip: 40,
    frontNeck: 8,
    backNeck: 6,
    bottom: 60,
    bottomHip: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[1].id,
    dressType: 'Blouse',
    length: 25,
    shoulder: 17,
    sleeveLength: 20,
    sleeveLoose: 22,
    armHole: 18,
    chest: 36,
    waist: 30,
    hip: 38,
    frontNeck: 7,
    backNeck: 5,
    bottom: 58,
    bottomHip: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[2].id,
    dressType: 'Churudhar',
    length: 58,
    shoulder: 19,
    sleeveLength: 24,
    sleeveLoose: 26,
    armHole: 21,
    chest: 40,
    waist: 34,
    hip: 42,
    frontNeck: 9,
    backNeck: 7,
    bottom: 62,
    bottomHip: 44,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[2].id,
    dressType: 'Gown',
    length: 62,
    shoulder: 18,
    sleeveLength: 26,
    sleeveLoose: 28,
    armHole: 22,
    chest: 40,
    waist: 34,
    hip: 42,
    frontNeck: 10,
    backNeck: 8,
    bottom: 62,
    bottomHip: 44,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[3].id,
    dressType: 'Skirt/Top',
    length: 48,
    shoulder: 17,
    sleeveLength: 18,
    sleeveLoose: 20,
    armHole: 19,
    chest: 36,
    waist: 28,
    hip: 38,
    frontNeck: 8,
    backNeck: 6,
    bottom: 60,
    bottomHip: 40,
    createdAt: new Date().toISOString(),
  },
];

const sampleOrders: Order[] = [
  {
    id: uuidv4(),
    customerId: sampleCustomers[0].id,
    items: [
      {
        id: uuidv4(),
        type: 'Stitching',
        dressType: 'Blouse',
        measurementId: sampleMeasurements[0].id,
        stitchingCharge: 800,
      },
      {
        id: uuidv4(),
        type: 'Readymade',
        productName: 'Silk Scarf',
        quantity: 2,
        price: 450,
      },
    ],
    subtotal: 800 + (450 * 2),
    discount: 100,
    total: 800 + 900 - 100,
    status: 'Completed',
    paymentStatus: 'Paid',
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[0].id,
    items: [
      {
        id: uuidv4(),
        type: 'Stitching',
        dressType: 'Churudhar',
        measurementId: sampleMeasurements[1].id,
        stitchingCharge: 2500,
      },
    ],
    subtotal: 2500,
    discount: 0,
    total: 2500,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[1].id,
    items: [
      {
        id: uuidv4(),
        type: 'Readymade',
        productName: 'Designer Blouse',
        quantity: 1,
        price: 1200,
      },
    ],
    subtotal: 1200,
    discount: 200,
    total: 1000,
    status: 'In Progress',
    paymentStatus: 'Not Paid',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    customerId: sampleCustomers[2].id,
    items: [
      {
        id: uuidv4(),
        type: 'Stitching',
        dressType: 'Gown',
        measurementId: sampleMeasurements[4].id,
        stitchingCharge: 4500,
      },
      {
        id: uuidv4(),
        type: 'Stitching',
        dressType: 'Churudhar',
        measurementId: sampleMeasurements[3].id,
        stitchingCharge: 2200,
      },
    ],
    subtotal: 4500 + 2200,
    discount: 500,
    total: 6700 - 500,
    status: 'Pending',
    paymentStatus: 'Not Paid',
    deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let initialized = false;

export function generateSampleData() {
  if (initialized) return;

  const customersKey = 'boutique_customers';
  const measurementsKey = 'boutique_measurements';
  const ordersKey = 'boutique_orders';

  try {
    // Check if data already exists
    if (!localStorage.getItem(customersKey)) {
      localStorage.setItem(customersKey, JSON.stringify(sampleCustomers));
    }
    if (!localStorage.getItem(measurementsKey)) {
      localStorage.setItem(measurementsKey, JSON.stringify(sampleMeasurements));
    }
    if (!localStorage.getItem(ordersKey)) {
      localStorage.setItem(ordersKey, JSON.stringify(sampleOrders));
    }
    initialized = true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

export { sampleCustomers, sampleMeasurements, sampleOrders };
