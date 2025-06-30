import { VALIDATION_ERRORS } from "./constants.js";

export function validateUserPayload(data) {
  const errors = [];

  if (!data.name || !/^[A-Za-z]{1,20}$/.test(data.name)) {
    errors.push(VALIDATION_ERRORS.name);
  }

  if (!data.role) {
    errors.push(VALIDATION_ERRORS.role);
  }

  if (!data.age || isNaN(data.age) || data.age < 1 || data.age > 99) {
    errors.push(VALIDATION_ERRORS.age);
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push(VALIDATION_ERRORS.email);
  }

  if (!data.gender) {
    errors.push(VALIDATION_ERRORS.gender);
  }

  return errors;
}
