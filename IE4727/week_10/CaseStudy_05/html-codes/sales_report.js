async function generateReport() {
    const showProduct = document.getElementById('sales-by-product').checked;
    const showCategory = document.getElementById('sales-by-category').checked;
    
    try {
        const response = await fetch('get_sales_report.php');
        const data = await response.json();
        
        if (data.error) {
            alert('Error generating report: ' + data.error);
            return;
        }
        
        // Hide all tables initially
        document.getElementById('product-table').style.display = 'none';
        document.getElementById('category-table').style.display = 'none';
        document.getElementById('popular-result').style.display = 'none';
        document.getElementById('popular-input').value = '';
        
        // Show selected reports
        if (showProduct) {
            displayProductReport(data.by_product);
        }
        
        if (showCategory) {
            displayCategoryReport(data.by_category, data.category_totals);
        }
        
        // Always calculate and show popular option
        if (data.by_product && data.by_product.length > 0) {
            displayPopularOption(data.by_product, data.by_category);
        }
        
    } catch (error) {
        alert('Error generating report: ' + error.message);
    }
}

function displayProductReport(products) {
    const tbody = document.getElementById('product-tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.product_name}</td>
            <td>$${parseFloat(product.total_sales).toFixed(2)}</td>
            <td>${product.quantity_sold}</td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('product-table').style.display = 'table';
}

function displayCategoryReport(categories, categoryTotals) {
    const tbody = document.getElementById('category-tbody');
    tbody.innerHTML = '';
    
    categories.forEach(category => {
        const tr = document.createElement('tr');
        const categoryName = category.category || 'Null';
        tr.innerHTML = `
            <td>${categoryName}</td>
            <td>$${parseFloat(category.total_sales).toFixed(2)}</td>
            <td>${category.quantity_sold}</td>
        `;
        tbody.appendChild(tr);
    });

    // Append aggregate rows for Single and Double across all products
    if (Array.isArray(categoryTotals) && categoryTotals.length > 0) {
        let singleSales = 0, singleQty = 0;
        let doubleSales = 0, doubleQty = 0;

        categoryTotals.forEach(ct => {
            const cat = (ct.category || '').toString().toLowerCase();
            if (cat === 'single') {
                singleSales += parseFloat(ct.total_sales || 0);
                singleQty += parseInt(ct.quantity_sold || 0, 10);
            } else if (cat === 'double') {
                doubleSales += parseFloat(ct.total_sales || 0);
                doubleQty += parseInt(ct.quantity_sold || 0, 10);
            }
        });

        // Only append rows if there is data
        if (singleSales > 0 || singleQty > 0) {
            const trSingle = document.createElement('tr');
            trSingle.className = 'highlight';
            trSingle.innerHTML = `
                <td>Single (all coffees)</td>
                <td>$${singleSales.toFixed(2)}</td>
                <td>${singleQty}</td>
            `;
            tbody.appendChild(trSingle);
        }

        if (doubleSales > 0 || doubleQty > 0) {
            const trDouble = document.createElement('tr');
            trDouble.className = 'highlight';
            trDouble.innerHTML = `
                <td>Double (all coffees)</td>
                <td>$${doubleSales.toFixed(2)}</td>
                <td>${doubleQty}</td>
            `;
            tbody.appendChild(trDouble);
        }
    }
    
    document.getElementById('category-table').style.display = 'table';
}

function displayPopularOption(products, categories) {
    // Find best selling product (highest total sales)
    let bestProduct = products.reduce((max, p) => 
        parseFloat(p.total_sales) > parseFloat(max.total_sales) ? p : max
    , products[0]);
    
    // Find most popular category for this product
    let popularCategory = null;
    let maxCategoryQty = 0;
    
    categories.forEach(cat => {
        if (cat.product_name === bestProduct.product_name) {
            const qty = parseInt(cat.quantity_sold);
            if (qty > maxCategoryQty) {
                maxCategoryQty = qty;
                popularCategory = cat.category || 'Endless Cup';
            }
        }
    });
    
    // Display result
    const resultDiv = document.getElementById('popular-result');
    resultDiv.innerHTML = `
        <p><strong>Best Selling Product:</strong> ${bestProduct.product_name}</p>
        <p><strong>Total Sales:</strong> $${parseFloat(bestProduct.total_sales).toFixed(2)}</p>
        <p><strong>Most Popular Option:</strong> ${popularCategory}</p>
        <p><strong>Quantity Sold (${popularCategory}):</strong> ${maxCategoryQty}</p>
    `;
    resultDiv.style.display = 'block';
    
    // Set popular input
    document.getElementById('popular-input').value = `${popularCategory} of ${bestProduct.product_name}`;
}