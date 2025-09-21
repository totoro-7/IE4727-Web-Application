// Bootstrap Version - Menu Calculator with Modern JavaScript
class MenuCalculator {
    constructor() {
        this.menuItems = {
            java: { price: 0, quantity: 0 },
            lait: { price: 0, quantity: 0 },
            capp: { price: 0, quantity: 0 }
        };
        this.initializeCalculator();
    }

    // Calculate individual item total
    calculateItemTotal(price, quantity) {
        return price * quantity;
    }

    // Update item totals and grand total
    updateTotals() {
        let grandTotal = 0;

        Object.keys(this.menuItems).forEach(item => {
            const { price, quantity } = this.menuItems[item];
            const total = this.calculateItemTotal(price, quantity);
            
            // Update individual total display
            const totalElement = document.getElementById(`${item}_total`);
            if (totalElement) {
                totalElement.value = `$${total.toFixed(2)}`;
            }
            
            grandTotal += total;
        });

        // Update grand total
        const grandTotalElement = document.getElementById('grand_total');
        if (grandTotalElement) {
            grandTotalElement.value = `$${grandTotal.toFixed(2)}`;
        }
    }

    // Handle price selection
    handlePriceChange(item, price) {
        this.menuItems[item].price = parseFloat(price) || 0;
        this.updateTotals();
    }

    // Handle quantity change
    handleQuantityChange(item, quantity) {
        this.menuItems[item].quantity = parseInt(quantity) || 0;
        this.updateTotals();
    }

    // Reset all values
    resetOrder() {
        // Reset internal state
        Object.keys(this.menuItems).forEach(item => {
            this.menuItems[item] = { price: 0, quantity: 0 };
        });

        // Reset form elements
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.value = 0;
        });

        // Update display
        this.updateTotals();

        // Show feedback
        this.showToast('Order Reset', 'Your order has been cleared.');
    }

    // Show toast notification
    showToast(title, message) {
        // Create toast element
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.setAttribute('role', 'alert');
        toastElement.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        toastContainer.appendChild(toastElement);

        // Initialize and show toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove element after hiding
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Create toast container if it doesn't exist
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
        return container;
    }

    // Initialize event listeners
    initializeCalculator() {
        // Price radio button listeners
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const name = e.target.name;
                const value = e.target.value;
                
                if (name.includes('java')) {
                    this.handlePriceChange('java', value);
                } else if (name.includes('lait')) {
                    this.handlePriceChange('lait', value);
                } else if (name.includes('capp')) {
                    this.handlePriceChange('capp', value);
                }
            });
        });

        // Quantity input listeners
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.id;
                const value = e.target.value;
                
                if (id.includes('java')) {
                    this.handleQuantityChange('java', value);
                } else if (id.includes('lait')) {
                    this.handleQuantityChange('lait', value);
                } else if (id.includes('capp')) {
                    this.handleQuantityChange('capp', value);
                }
            });
        });

        // Initial calculation
        this.updateTotals();
    }
}

// Global reset function for the reset button
function resetOrder() {
    if (window.menuCalculator) {
        window.menuCalculator.resetOrder();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuCalculator = new MenuCalculator();
});