export const STORAGE_KEYS = {
  CUSTOMERS: 'boutique_customers',
  MEASUREMENTS: 'boutique_measurements',
  ORDERS: 'boutique_orders',
};

export const DRESS_TYPES = ['Blouse', 'Churudhar', 'Skirt/Top', 'Gown'] as const;

export const ORDER_STATUSES = ['Pending', 'In Progress', 'Completed', 'Delivered'] as const;

export const MEASUREMENT_FIELDS = [
  { key: 'length', label: 'Length', placeholder: 'e.g., 60' },
  { key: 'shoulder', label: 'Shoulder', placeholder: 'e.g., 18' },
  { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g., 22' },
  { key: 'sleeveLoose', label: 'Sleeve Loose', placeholder: 'e.g., 24' },
  { key: 'armHole', label: 'Arm Hole', placeholder: 'e.g., 20' },
  { key: 'chest', label: 'Chest', placeholder: 'e.g., 38' },
  { key: 'waist', label: 'Waist', placeholder: 'e.g., 32' },
  { key: 'hip', label: 'Hip', placeholder: 'e.g., 40' },
  { key: 'frontNeck', label: 'Front Neck', placeholder: 'e.g., 8' },
  { key: 'backNeck', label: 'Back Neck', placeholder: 'e.g., 6' },
  { key: 'bottom', label: 'Bottom', placeholder: 'e.g., 60' },
  { key: 'bottomHip', label: 'Bottom Hip', placeholder: 'e.g., 42' },
] as const;
