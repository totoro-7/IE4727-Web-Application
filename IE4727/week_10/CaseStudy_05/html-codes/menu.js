let products = [];

// Load products when page loads
window.onload = function() {
    loadMenu();
    // Wire up checkout button
    const btn = document.getElementById('checkout-btn');
    if (btn) {
        btn.addEventListener('click', checkout);
    }
};

// Load menu items from database via PHP (reusing get_products.php)
async function loadMenu() {
    try {
        const response = await fetch('get_products.php');
        products = await response.json();
        
        if (products.error) {
            console.error('Error loading menu:', products.error);
            return;
        }
        
        displayMenu();
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Display menu items in the table
function displayMenu() {
    const tbody = document.getElementById('menu-body');
    tbody.innerHTML = '';

    // Group products by name
    const groupedProducts = {};
    products.forEach(product => {
        if (!groupedProducts[product.product_name]) {
            groupedProducts[product.product_name] = {
                description: product.description,
                items: []
            };
        }
        groupedProducts[product.product_name].items.push(product);
    });

    // Create table rows for each product (in specific order)
    const productKeys = ['Just Java', 'Cafe au Lait', 'Iced Cappuccino'];
    const productIds = ['java', 'lait', 'capp'];
    
    productKeys.forEach((productKey, index) => {
        if (groupedProducts[productKey]) {
            const data = groupedProducts[productKey];
            const productId = productIds[index];
            
            const tr = document.createElement('tr');
            
            // Product name column
            const tdName = document.createElement('td');
            tdName.className = 'type';
            tdName.innerHTML = '<strong>' + productKey + '</strong>';
            tr.appendChild(tdName);

            // Description and options column
            const tdDescription = document.createElement('td');
            let descriptionHTML = data.description + '<br>';
            
            // Add price options
            if (data.items.length === 1) {
                // Single price item (like Just Java)
                const item = data.items[0];
                descriptionHTML += `
                    <input type="radio" 
                           name="${productId}_price" 
                           id="${productId}_single"
                           value="${item.price}"
                           data-product-id="${item.product_id}"
                           checked>
                    <label for="${productId}_single">${item.size_type} $${parseFloat(item.price).toFixed(2)}</label>
                `;
            } else {
                // Multiple price options (like Cafe au Lait - Single/Double)
                data.items.forEach((item, idx) => {
                    const sizeId = item.size_type.toLowerCase();
                    descriptionHTML += `
                        <input type="radio" 
                               name="${productId}_price" 
                               id="${productId}_${sizeId}"
                               value="${item.price}"
                               data-product-id="${item.product_id}"
                               ${idx === 0 ? 'checked' : ''}>
                        <label for="${productId}_${sizeId}">${item.size_type} $${parseFloat(item.price).toFixed(2)}</label><br>
                    `;
                });
            }
            
            tdDescription.innerHTML = descriptionHTML;
            tr.appendChild(tdDescription);

            // Quantity column
            const tdQuantity = document.createElement('td');
            tdQuantity.innerHTML = `
                Quantity: 
                <input type="number" 
                       id="${productId}_qty"
                       class="quantity-input"
                       min="0" 
                       value="0">
            `;
            tr.appendChild(tdQuantity);

            // Subtotal column
            const tdSubtotal = document.createElement('td');
            tdSubtotal.className = 'subtotal';
            tdSubtotal.innerHTML = `<input type="text" id="${productId}_total" value="$0.00" readonly>`;
            tr.appendChild(tdSubtotal);

            tbody.appendChild(tr);
        }
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="3" style="text-align: right; padding-right: 10px;"><strong>Total:</strong></td>
        <td class="subtotal">
            <input type="text" id="grand_total" value="$0.00" readonly style="font-weight: bold;">
        </td>
    `;
    tbody.appendChild(totalRow);
    
    // After creating all elements, run your existing menuupdate.js logic
    initializeMenuCalculations();
}

// Initialize the calculations (from your menuupdate.js)
function initializeMenuCalculations() {
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
}

// Calculate totals (from your menuupdate.js)
function calculateTotal() {
    // Calculate Just Java total
    const javaQty = parseInt(document.getElementById('java_qty')?.value) || 0;
    const javaRadio = document.querySelector('input[name="java_price"]:checked');
    const javaPrice = javaRadio ? parseFloat(javaRadio.value) : 0;
    const javaTotal = javaQty * javaPrice;
    const javaTotalInput = document.getElementById('java_total');
    if (javaTotalInput) {
        javaTotalInput.value = '$' + javaTotal.toFixed(2);
    }
    
    // Calculate Cafe au Lait total
    const laitQty = parseInt(document.getElementById('lait_qty')?.value) || 0;
    const laitRadio = document.querySelector('input[name="lait_price"]:checked');
    const laitPrice = laitRadio ? parseFloat(laitRadio.value) : 0;
    const laitTotal = laitQty * laitPrice;
    const laitTotalInput = document.getElementById('lait_total');
    if (laitTotalInput) {
        laitTotalInput.value = '$' + laitTotal.toFixed(2);
    }
    
    // Calculate Iced Cappuccino total
    const cappQty = parseInt(document.getElementById('capp_qty')?.value) || 0;
    const cappRadio = document.querySelector('input[name="capp_price"]:checked');
    const cappPrice = cappRadio ? parseFloat(cappRadio.value) : 0;
    const cappTotal = cappQty * cappPrice;
    const cappTotalInput = document.getElementById('capp_total');
    if (cappTotalInput) {
        cappTotalInput.value = '$' + cappTotal.toFixed(2);
    }
    
    // Calculate grand total
    const grandTotal = javaTotal + laitTotal + cappTotal;
    const grandTotalInput = document.getElementById('grand_total');
    if (grandTotalInput) {
        grandTotalInput.value = '$' + grandTotal.toFixed(2);
    }
}

// Checkout function - saves order to database
async function checkout() {
    // Collect order items
    const orderItems = [];
    
    // Just Java
    const javaQty = parseInt(document.getElementById('java_qty')?.value) || 0;
    const javaRadio = document.querySelector('input[name="java_price"]:checked');
    if (javaQty > 0 && javaRadio) {
        orderItems.push({
            product_id: javaRadio.dataset.productId,
            quantity: javaQty,
            unit_price: parseFloat(javaRadio.value),
            subtotal: javaQty * parseFloat(javaRadio.value)
        });
    }
    
    // Cafe au Lait
    const laitQty = parseInt(document.getElementById('lait_qty')?.value) || 0;
    const laitRadio = document.querySelector('input[name="lait_price"]:checked');
    if (laitQty > 0 && laitRadio) {
        orderItems.push({
            product_id: laitRadio.dataset.productId,
            quantity: laitQty,
            unit_price: parseFloat(laitRadio.value),
            subtotal: laitQty * parseFloat(laitRadio.value)
        });
    }
    
    // Iced Cappuccino
    const cappQty = parseInt(document.getElementById('capp_qty')?.value) || 0;
    const cappRadio = document.querySelector('input[name="capp_price"]:checked');
    if (cappQty > 0 && cappRadio) {
        orderItems.push({
            product_id: cappRadio.dataset.productId,
            quantity: cappQty,
            unit_price: parseFloat(cappRadio.value),
            subtotal: cappQty * parseFloat(cappRadio.value)
        });
    }
    
    // Validate that there are items in the order
    if (orderItems.length === 0) {
        showMessage('Please add items to your order before checking out.', 'error');
        return;
    }
    
    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Send order to server
    try {
        const formData = new FormData();
        formData.append('order_items', JSON.stringify(orderItems));
        formData.append('total_amount', total);
        
        const response = await fetch('checkout.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`Order placed successfully! Order ID: ${result.order_id}`, 'success');
            
            // Reset form
            document.getElementById('java_qty').value = 0;
            document.getElementById('lait_qty').value = 0;
            document.getElementById('capp_qty').value = 0;
            calculateTotal();
        } else {
            showMessage('Error placing order: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error placing order: ' + error.message, 'error');
    }
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}