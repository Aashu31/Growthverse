export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  if (!phone) return true; // Phone is optional
  const re = /^[\d\s\+\-\(\)]{7,}$/;
  return re.test(phone);
}

export function validateRequired(value) {
  return value != null && String(value).trim() !== "";
}

export function validateMinLength(value, min) {
  return String(value).length >= min;
}

export function validateContactForm(data) {
  const errors = {};

  if (!validateRequired(data.fullName)) {
    errors.fullName = "Full name is required.";
  } else if (!validateMinLength(data.fullName, 2)) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!validateRequired(data.email)) {
    errors.email = "Email is required.";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!validateRequired(data.companyName)) {
    errors.companyName = "Company name is required.";
  }

  if (!validateRequired(data.serviceRequired)) {
    errors.serviceRequired = "Please select a service.";
  }

  if (!validateRequired(data.budgetRange)) {
    errors.budgetRange = "Please select a budget range.";
  }

  if (!validateRequired(data.projectTimeline)) {
    errors.projectTimeline = "Please select a project timeline.";
  }

  if (!validateRequired(data.projectDescription)) {
    errors.projectDescription = "Please describe your project.";
  } else if (!validateMinLength(data.projectDescription, 10)) {
    errors.projectDescription = "Please provide more details (at least 10 characters).";
  }

  return errors;
}

export function validateAuthForm(data, type = "login") {
  const errors = {};

  if (!validateRequired(data.email)) {
    errors.email = "Email is required.";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!validateRequired(data.password)) {
    errors.password = "Password is required.";
  } else if (type === "signup" && !validateMinLength(data.password, 6)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (type === "signup") {
    if (!validateRequired(data.fullName)) {
      errors.fullName = "Full name is required.";
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}
