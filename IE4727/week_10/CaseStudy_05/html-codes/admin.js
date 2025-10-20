let products = [];
let selectedProducts = new Set();

// Load products when page loads
window.onload = function() {
    loadProducts();
};

// Load products from database via PHP
async function loadProducts() {
    try {
        const response = await fetch('get_products.php');
        products = await response.json();
        
        if (products.error) {
            showMessage('Error loading products: ' + products.error, 'error');
            return;
        }
        
        displayProducts();
    } catch (error) {
        showMessage('Error loading products: ' + error.message, 'error');
        console.error('Error:', error);
    }
}

// Display products in the table
function displayProducts() {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';

    // Group products by name
    // Input: [{name:"Just Java",...}, {name:"Cafe au Lait",...}, {name:"Cafe au Lait",...}]
    // Output: {"Just Java": [...], "Cafe au Lait": [..., ...]}
    const groupedProducts = {};
    products.forEach(product => {
        if (!groupedProducts[product.product_name]) {
            groupedProducts[product.product_name] = [];
        }
        groupedProducts[product.product_name].push(product);
    });

    // Create table rows for each product group
    for (const [name, items] of Object.entries(groupedProducts)) {
        const tr = document.createElement('tr');
        
        // Checkbox column
        const tdCheckbox = document.createElement('td');
        tdCheckbox.style.width = '32px';
        tdCheckbox.style.textAlign = 'center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'row-select';
        checkbox.dataset.productGroup = name;
        checkbox.onchange = function() { handleRowSelect(this, name); };
        tdCheckbox.appendChild(checkbox);
        tr.appendChild(tdCheckbox);

        // Product name column
        const tdName = document.createElement('td');
        tdName.style.width = '150px';
        tdName.className = 'type';
        tdName.innerHTML = '<b>' + name + '</b>';
        tr.appendChild(tdName);

        // Description and prices column
        const tdDetails = document.createElement('td');
        tdDetails.innerHTML = items[0].description + '<div class="radio-group">';
        
        items.forEach(item => {
            tdDetails.innerHTML += `
                <label>
                    <b>${item.size_type}</b>
                    <span class="price-display" id="price-display-${item.product_id}">
                        $${parseFloat(item.price).toFixed(2)}
                    </span>
                    <input type="number" 
                           class="price-input" 
                           id="price-input-${item.product_id}"
                           data-product-id="${item.product_id}"
                           data-original-price="${item.price}"
                           value="${parseFloat(item.price).toFixed(2)}"
                           step="0.01"
                           min="0.01"
                           style="display: none;">
                </label>
            `;
        });
        
        tdDetails.innerHTML += '</div>';
        tr.appendChild(tdDetails);
        
        tbody.appendChild(tr);
    }
}

// Handle checkbox selection
function handleRowSelect(checkbox, productName) {
    // Find all products in this group
    const groupProducts = products.filter(p => p.product_name === productName);
    
    // Get the price inputs and displays for this row
    const row = checkbox.closest('tr');
    const priceInputs = row.querySelectorAll('.price-input');
    const priceDisplays = row.querySelectorAll('.price-display');

    if (checkbox.checked) {
        // Show price inputs, hide displays
        priceInputs.forEach(input => {
            input.style.display = 'inline-block';
            selectedProducts.add(input.dataset.productId);
        });
        priceDisplays.forEach(display => {
            display.style.display = 'none';
        });
    } else {
        // Hide price inputs, show displays
        priceInputs.forEach(input => {
            input.style.display = 'none';
            selectedProducts.delete(input.dataset.productId);
        });
        priceDisplays.forEach(display => {
            display.style.display = 'inline';
        });
    }

    // Enable/disable update button based on selection
    document.getElementById('update-btn').disabled = selectedProducts.size === 0;
}

// Update prices - send to PHP
async function updatePrices() {
    const updates = [];
    
    // Collect all price changes
    selectedProducts.forEach(productId => {
        const input = document.getElementById(`price-input-${productId}`);
        const newPrice = parseFloat(input.value);
        const originalPrice = parseFloat(input.dataset.originalPrice);
        
        // Only update if price changed
        if (newPrice !== originalPrice) {
            updates.push({ 
                productId: productId, 
                newPrice: newPrice 
            });
        }
    });

    if (updates.length === 0) {
        showMessage('No price changes detected', 'error');
        return;
    }

    // Update each product
    let successCount = 0;
    let failCount = 0;

    for (const update of updates) {
        try {
            const formData = new FormData();
            formData.append('product_id', update.productId);
            formData.append('price', update.newPrice);

            const response = await fetch('update_price.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                successCount++;
                
                // Update the display price
                const priceDisplay = document.getElementById(`price-display-${update.productId}`);
                priceDisplay.innerHTML = `$${parseFloat(result.product.price).toFixed(2)}`;
                priceDisplay.classList.add('updated-price');
                
                // Update the original price in the input data
                const input = document.getElementById(`price-input-${update.productId}`);
                input.dataset.originalPrice = result.product.price;
                
                // Update the products array
                const productIndex = products.findIndex(p => p.product_id == update.productId);
                if (productIndex !== -1) {
                    products[productIndex].price = result.product.price;
                }
            } else {
                failCount++;
                console.error('Failed to update product:', update.productId, result.error);
            }
        } catch (error) {
            failCount++;
            console.error('Error updating product:', update.productId, error);
        }
    }

    // Reset all selections
    document.querySelectorAll('.row-select').forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false;
            handleRowSelect(checkbox, checkbox.dataset.productGroup);
        }
    });

    selectedProducts.clear();
    document.getElementById('update-btn').disabled = true;

    // Show success/error message
    if (successCount > 0) {
        showMessage(`Successfully updated ${successCount} of ${updates.length} prices`, 'success');
    }
    if (failCount > 0) {
        showMessage(`Failed to update ${failCount} prices`, 'error');
    }

    // Remove highlight after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.updated-price').forEach(el => {
            el.classList.remove('updated-price');
        });
    }, 3000);
}

// Show success/error message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}