function validateJobForm() {
    let isValid = true;

    clearAllErrors();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const startDate = document.getElementById("date").value;
    const experience = document.getElementById("exp").value;

    if (!validateName(name)) {
        isValid = false;
        showError("name", "Name must only contain alphabet characters and spaces");
    }

    if (!validateEmail(email)) {
        isValid = false;
        showError("email", "Email must be a valid email address");
    }

    if (!validateDate(startDate)) {
        isValid = false;
        showError("date", "Start date cannot be today or in the past");
    }

    if (!validateExperience(experience)) {
        isValid = false;
        showError("exp", "Experience field cannot be empty");
    }

    return isValid;
}

//Validation function for name field
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

//Validation function for email field
function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return false;
    }
    
    // Check basic email structure: username@domain
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return false;
    }
    
    const username = emailParts[0];
    const domain = emailParts[1];
    
    // Username validation: word characters, hyphens, and periods
    const usernamePattern = /^[\w\.-]+$/;
    if (!usernamePattern.test(username) || username.length === 0) {
        return false;
    }
    
    // Domain validation: 2-4 extensions, separated by periods
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts.length > 4) {
        return false;
    }
    
    // Each domain part should contain only word characters
    for (let part of domainParts) {
        if (!/^[a-zA-Z0-9]+$/.test(part) || part.length === 0) {
            return false;
        }
    }
    
    // Last extension must be 2-3 characters
    const lastExtension = domainParts[domainParts.length - 1];
    return lastExtension.length >= 2 && lastExtension.length <= 3;
}

//Validation function for date field
function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
}

//Validation function for experience field
function validateExperience(exp) {
    return exp.trim() !== "";
}

//Function to show error messages
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "Error");
    if (!fieldId || !errorElement) return;
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "inline";
    }
}

//Function to clear all error messages
function clearAllErrors() {
    const errorElements = document.getElementsByClassName("error");
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].textContent = "";
        errorElements[i].style.display = "none";
    }
}

//Event listener for form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("jobForm");
    if (form) {
        // Add submit event listener with validation
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission for validation
            if (validateJobForm()) {
                form.submit(); // Submit the form if valid
            }
            else {
                console.log("Form validation failed.");
            }
        });
    }
});
