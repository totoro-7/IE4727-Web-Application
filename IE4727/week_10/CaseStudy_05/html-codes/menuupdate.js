
// Function to calculate individual item totals and grand total
function calculateTotal() {
    // Calculate Just Java total
    const javaQty = parseInt(document.getElementById('java_qty').value) || 0;
    const javaPrice = parseFloat(document.querySelector('input[name="java_price"]:checked').value);
    const javaTotal = javaQty * javaPrice;
    document.getElementById('java_total').value = '$' + javaTotal.toFixed(2);
    
    // Calculate Cafe au Lait total
    const laitQty = parseInt(document.getElementById('lait_qty').value) || 0;
    const laitPrice = parseFloat(document.querySelector('input[name="lait_price"]:checked').value);
    const laitTotal = laitQty * laitPrice;
    document.getElementById('lait_total').value = '$' + laitTotal.toFixed(2);
    
    // Calculate Iced Cappuccino total
    const cappQty = parseInt(document.getElementById('capp_qty').value) || 0;
    const cappPrice = parseFloat(document.querySelector('input[name="capp_price"]:checked').value);
    const cappTotal = cappQty * cappPrice;
    document.getElementById('capp_total').value = '$' + cappTotal.toFixed(2);
    
    // Calculate grand total
    const grandTotal = javaTotal + laitTotal + cappTotal;
    document.getElementById('grand_total').value = '$' + grandTotal.toFixed(2);
}

// Add event listeners for radio button changes
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });
    
    // Add event listeners to quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
    
    // Initial calculation
    calculateTotal();
});
