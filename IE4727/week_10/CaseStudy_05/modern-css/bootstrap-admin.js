(function () {
  const API_BASE = '../html-codes';
  let products = [];
  const selected = new Set();

  function showMessage(text, type = 'info') {
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = text;
    el.className = `alert alert-${type}`;
    el.classList.remove('d-none');
    setTimeout(() => el.classList.add('d-none'), 5000);
  }

  async function loadProducts() {
    try {
      const res = await fetch(`${API_BASE}/get_products.php`);
      products = await res.json();
      if (products.error) throw new Error(products.error);
      renderProducts();
    } catch (e) {
      showMessage(`Error loading products: ${e.message}`, 'danger');
    }
  }

  function renderProducts() {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';

    const grouped = {};
    products.forEach(p => {
      if (!grouped[p.product_name]) grouped[p.product_name] = [];
      grouped[p.product_name].push(p);
    });

    Object.entries(grouped).forEach(([name, items]) => {
      const tr = document.createElement('tr');

      const tdChk = document.createElement('td');
      tdChk.style.width = '42px';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'form-check-input';
      chk.addEventListener('change', () => toggleRow(tr, items, chk.checked));
      tdChk.appendChild(chk);
      tr.appendChild(tdChk);

      const tdName = document.createElement('td');
      tdName.className = 'coffee-type';
      tdName.style.width = '200px';
      tdName.innerHTML = `<strong>${name}</strong>`;
      tr.appendChild(tdName);

      const tdDetails = document.createElement('td');
      let html = `${items[0].description || ''}<div class="row g-2 mt-1">`;
      items.forEach(item => {
        html += `
          <div class="col-12 col-md-6">
            <label class="form-label mb-1"><strong>${item.size_type}</strong></label>
            <span class="ms-2 price-display" id="price-display-${item.product_id}">$${parseFloat(item.price).toFixed(2)}</span>
            <input type="number" class="form-control form-control-sm price-input d-none mt-1" id="price-input-${item.product_id}" data-product-id="${item.product_id}" data-original-price="${item.price}" value="${parseFloat(item.price).toFixed(2)}" min="0.01" step="0.01">
          </div>`;
      });
      html += '</div>';
      tdDetails.innerHTML = html;
      tr.appendChild(tdDetails);

      tbody.appendChild(tr);
    });

    document.getElementById('update-btn').addEventListener('click', updatePrices);
  }

  function toggleRow(row, items, on) {
    const inputs = row.querySelectorAll('.price-input');
    const displays = row.querySelectorAll('.price-display');
    if (on) {
      inputs.forEach(i => { i.classList.remove('d-none'); selected.add(i.dataset.productId); });
      displays.forEach(d => d.classList.add('d-none'));
    } else {
      inputs.forEach(i => { i.classList.add('d-none'); selected.delete(i.dataset.productId); });
      displays.forEach(d => d.classList.remove('d-none'));
    }
    document.getElementById('update-btn').disabled = selected.size === 0;
  }

  async function updatePrices() {
    const updates = [];
    selected.forEach(id => {
      const input = document.getElementById(`price-input-${id}`);
      const newPrice = parseFloat(input.value);
      const orig = parseFloat(input.dataset.originalPrice);
      if (!isNaN(newPrice) && newPrice !== orig) updates.push({ id, price: newPrice });
    });

    if (updates.length === 0) { showMessage('No price changes detected', 'warning'); return; }

    let ok = 0, fail = 0;
    for (const u of updates) {
      try {
        const form = new FormData();
        form.append('product_id', u.id);
        form.append('price', u.price);
        const res = await fetch(`${API_BASE}/update_price.php`, { method: 'POST', body: form });
        const result = await res.json();
        if (result.success) {
          ok++;
          document.getElementById(`price-display-${u.id}`).textContent = `$${parseFloat(result.product.price).toFixed(2)}`;
          document.getElementById(`price-input-${u.id}`).dataset.originalPrice = result.product.price;
        } else {
          fail++;
        }
      } catch (_) { fail++; }
    }

    // Reset selections
    document.querySelectorAll('#products-body input[type="checkbox"]').forEach(c => { if (c.checked) c.click(); });
    selected.clear();
    document.getElementById('update-btn').disabled = true;

    if (ok) showMessage(`Successfully updated ${ok} of ${updates.length} prices`, 'success');
    if (fail) showMessage(`Failed to update ${fail} prices`, 'danger');
  }

  document.addEventListener('DOMContentLoaded', loadProducts);
})();
