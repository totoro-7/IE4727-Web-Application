(function(){
  const API_BASE = '../html-codes';

  async function generateReport() {
    const showProduct = document.getElementById('sales-by-product').checked;
    const showCategory = document.getElementById('sales-by-category').checked;

    try {
      const res = await fetch(`${API_BASE}/get_sales_report.php`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Hide all sections initially
      document.getElementById('product-table').classList.add('d-none');
      document.getElementById('category-table').classList.add('d-none');
      document.getElementById('popular-result').classList.add('d-none');
      document.getElementById('popular-input').value = '';

      if (showProduct) displayProductReport(data.by_product);
      if (showCategory) displayCategoryReport(data.by_category, data.category_totals);
      if (Array.isArray(data.by_product) && data.by_product.length) displayPopularOption(data.by_product, data.by_category);
    } catch (e) {
      alert(`Error generating report: ${e.message}`);
    }
  }

  function displayProductReport(products) {
    const tbody = document.getElementById('product-tbody');
    tbody.innerHTML = '';
    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.product_name}</td><td>$${parseFloat(p.total_sales).toFixed(2)}</td><td>${p.quantity_sold}</td>`;
      tbody.appendChild(tr);
    });
    document.getElementById('product-table').classList.remove('d-none');
  }

  function displayCategoryReport(categories, categoryTotals) {
    const tbody = document.getElementById('category-tbody');
    tbody.innerHTML = '';
    categories.forEach(c => {
      const tr = document.createElement('tr');
      const name = c.category || 'Endless Cup';
      tr.innerHTML = `<td>${name}</td><td>$${parseFloat(c.total_sales).toFixed(2)}</td><td>${c.quantity_sold}</td>`;
      tbody.appendChild(tr);
    });

    // Aggregate Single and Double rows across products
    if (Array.isArray(categoryTotals)) {
      let singleSales = 0, singleQty = 0;
      let doubleSales = 0, doubleQty = 0;
      categoryTotals.forEach(ct => {
        const cat = (ct.category || '').toLowerCase();
        if (cat === 'single') { singleSales += parseFloat(ct.total_sales || 0); singleQty += parseInt(ct.quantity_sold || 0, 10); }
        if (cat === 'double') { doubleSales += parseFloat(ct.total_sales || 0); doubleQty += parseInt(ct.quantity_sold || 0, 10); }
      });
      if (singleSales || singleQty) {
        const trS = document.createElement('tr');
        trS.className = 'table-warning';
        trS.innerHTML = `<td>Single (all coffees)</td><td>$${singleSales.toFixed(2)}</td><td>${singleQty}</td>`;
        tbody.appendChild(trS);
      }
      if (doubleSales || doubleQty) {
        const trD = document.createElement('tr');
        trD.className = 'table-warning';
        trD.innerHTML = `<td>Double (all coffees)</td><td>$${doubleSales.toFixed(2)}</td><td>${doubleQty}</td>`;
        tbody.appendChild(trD);
      }
    }

    document.getElementById('category-table').classList.remove('d-none');
  }

  function displayPopularOption(products, categories) {
    const best = products.reduce((m, p) => parseFloat(p.total_sales) > parseFloat(m.total_sales) ? p : m, products[0]);
    let popular = 'Endless Cup';
    let maxQty = 0;
    categories.forEach(cat => {
      if (cat.product_name === best.product_name) {
        const qty = parseInt(cat.quantity_sold, 10);
        if (qty > maxQty) { maxQty = qty; popular = cat.category || 'Endless Cup'; }
      }
    });
    const res = document.getElementById('popular-result');
    res.innerHTML = `<p class="mb-1"><strong>Best Selling Product:</strong> ${best.product_name}</p>
                     <p class="mb-1"><strong>Total Sales:</strong> $${parseFloat(best.total_sales).toFixed(2)}</p>
                     <p class="mb-1"><strong>Most Popular Option:</strong> ${popular}</p>
                     <p class="mb-0"><strong>Quantity Sold (${popular}):</strong> ${maxQty}</p>`;
    res.classList.remove('d-none');
    document.getElementById('popular-input').value = `${popular} of ${best.product_name}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn').addEventListener('click', generateReport);
  });
})();
