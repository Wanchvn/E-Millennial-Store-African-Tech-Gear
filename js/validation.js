// js/validation.js
function validateName(name) {
  return name.trim().length > 0;
}
function validateEmail(email) {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
}
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}
function validateFormFields() {
  let isValid = true;
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const nameErr = document.getElementById("nameError");
  const emailErr = document.getElementById("emailError");
  const phoneErr = document.getElementById("phoneError");

  if(name == "" || email == "" || phone == "") {
    document.getElementById("fullName").style.borderColor = "red";
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("phone").style.borderColor = "red";
    return false;
  }

  if (!validateName(name)) { nameErr.innerText = "Name is required"; 
    nameErr.style.borderColor = "red";
    isValid = false; } else nameErr.innerText = "";
  if (!validateEmail(email)) { emailErr.innerText = "Valid email required"; 
    emailErr.style.borderColor = "red";
    isValid = false; } else emailErr.innerText = "";
  if (!validatePhone(phone)) { phoneErr.innerText = "Enter valid phone number (10-13 digits)"; 
    phoneErr.style.borderColor = "red";
    isValid = false; } else phoneErr.innerText = "";
  return isValid;
}
function attachValidationEvents() {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  if(nameInput) nameInput.addEventListener("blur", () => validateFormFields());
  if(emailInput) emailInput.addEventListener("blur", () => validateFormFields());
  if(phoneInput) phoneInput.addEventListener("blur", () => validateFormFields());
}