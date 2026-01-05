export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

const STORAGE_KEY = "employees_data";

export const getEmployees = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export const generateId = (existingEmployees = []) => {
  const existingIds = existingEmployees.map(emp => typeof emp.id === 'number' ? emp.id : parseInt(emp.id)).filter(id => !isNaN(id));
  let newId;
  do {
    newId = Math.floor(10000 + Math.random() * 90000); // 5-digit number (10000-99999)
  } while (existingIds.includes(newId));
  return newId;
};
