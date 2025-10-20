// Bootstrap Version - Form Validation with Modern JavaScript
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.initializeValidation();
    }

    // Validation rules
    validateName(name) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        return nameRegex.test(name) && name.trim().length > 0;
    }

    validateEmail(email) {
        if (!email || email.trim().length === 0) return false;
        
        const emailParts = email.split('@');
        if (emailParts.length !== 2) return false;
        
        const [username, domain] = emailParts;
        const usernamePattern = /^[\w\.-]+$/;
        
        if (!usernamePattern.test(username) || username.length === 0) return false;
        
        const domainParts = domain.split('.');
        if (domainParts.length < 2 || domainParts.length > 4) return false;
        
        for (let part of domainParts) {
            if (!/^[a-zA-Z0-9]+$/.test(part) || part.length === 0) return false;
        }
        
        const lastExtension = domainParts[domainParts.length - 1];
        return lastExtension.length >= 2 && lastExtension.length <= 3;
    }

    validateDate(date) {
        if (!date) return true; // Optional field
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate > today;
    }

    validateExperience(exp) {
        return exp.trim() !== "";
    }

    // Show error message
    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
        }
    }

    // Clear error message
    clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        }
    }

    // Clear all errors
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-control');
        
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        inputElements.forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
    }

    // Validate form
    validateForm() {
        let isValid = true;
        this.clearAllErrors();

        const formData = new FormData(this.form);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const startDate = formData.get('startDate') || '';
        const experience = formData.get('experience') || '';

        if (!this.validateName(name)) {
            this.showError('name', 'Name must only contain alphabet characters and spaces');
            isValid = false;
        } else {
            this.clearError('name');
        }

        if (!this.validateEmail(email)) {
            this.showError('email', 'Email must be a valid email address');
            isValid = false;
        } else {
            this.clearError('email');
        }

        if (!this.validateDate(startDate)) {
            this.showError('startDate', 'Start date cannot be today or in the past');
            isValid = false;
        } else if (startDate) {
            this.clearError('startDate');
        }

        if (!this.validateExperience(experience)) {
            this.showError('experience', 'Experience field cannot be empty');
            isValid = false;
        } else {
            this.clearError('experience');
        }

        return isValid;
    }

    // Initialize validation
    initializeValidation() {
        if (!this.form) return;

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateSingleField(input);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                // Show success message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <strong>Success!</strong> Your application has been submitted successfully.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                
                this.form.parentNode.insertBefore(alertDiv, this.form);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.form.reset();
                    this.clearAllErrors();
                }, 3000);
            }
        });
    }

    // Validate single field
    validateSingleField(input) {
        const fieldName = input.name;
        const value = input.value;

        switch(fieldName) {
            case 'name':
                if (value && !this.validateName(value)) {
                    this.showError('name', 'Name must only contain alphabet characters and spaces');
                } else if (value) {
                    this.clearError('name');
                }
                break;
            case 'email':
                if (value && !this.validateEmail(value)) {
                    this.showError('email', 'Email must be a valid email address');
                } else if (value) {
                    this.clearError('email');
                }
                break;
            case 'startDate':
                if (value && !this.validateDate(value)) {
                    this.showError('startDate', 'Start date cannot be today or in the past');
                } else if (value) {
                    this.clearError('startDate');
                }
                break;
            case 'experience':
                if (value && !this.validateExperience(value)) {
                    this.showError('experience', 'Experience field cannot be empty');
                } else if (value) {
                    this.clearError('experience');
                }
                break;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator('jobForm');
});