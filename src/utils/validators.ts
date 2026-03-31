export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid 10-digit Indian phone number';
  }
  return null;
};

export const validateNumber = (value: string, fieldName: string): string | null => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} must be a number`;
  }
  return null;
};

export const validatePositiveNumber = (
  value: string,
  fieldName: string
): string | null => {
  const num = Number(value);
  if (value && (isNaN(num) || num < 0)) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

export const validateCustomer = (customer: {
  name: string;
  phone: string;
  address: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateRequired(customer.name, 'Name');
  if (nameError) errors.name = nameError;

  const phoneError = validatePhone(customer.phone);
  if (phoneError) errors.phone = phoneError;

  const addressError = validateRequired(customer.address, 'Address');
  if (addressError) errors.address = addressError;

  return errors;
};

export const validateMeasurement = (
  measurement: Record<string, number | string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!measurement.dressType) {
    errors.dressType = 'Dress type is required';
  }

  return errors;
};
