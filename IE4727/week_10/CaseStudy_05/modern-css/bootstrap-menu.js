// Bootstrap Version - Dynamic Menu + Checkout using existing PHP endpoints in html-codes
(function () {
    const API_BASE = '../html-codes';

    let products = [];

    function showMessage(text, type = 'info') {
        const msg = document.getElementById('message');
        if (!msg) return;
        msg.textContent = text;
        msg.className = `alert alert-${type}`;
        msg.classList.remove('d-none');
        setTimeout(() => msg.classList.add('d-none'), 5000);
    }

    function fmt(n) { return (Math.round(n * 100) / 100).toFixed(2); }

    async function loadMenu() {
        try {
            const res = await fetch(`${API_BASE}/get_products.php`);
            products = await res.json();
            if (products.error) throw new Error(products.error);
            displayMenu();
            initializeCalculator();
            bindCheckout();
        } catch (err) {
            showMessage(`Failed to load menu: ${err.message}`, 'danger');
        }
    }

    function displayMenu() {
        const tbody = document.getElementById('menu-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const grouped = {};
        products.forEach(p => {
            if (!grouped[p.product_name]) grouped[p.product_name] = { description: p.description, items: [] };
            grouped[p.product_name].items.push(p);
        });

        const productKeys = ['Just Java', 'Cafe au Lait', 'Iced Cappuccino'];
        const productIds = ['java', 'lait', 'capp'];

        productKeys.forEach((name, idx) => {
            const data = grouped[name];
            if (!data) return;
            const pid = productIds[idx];

            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.className = 'coffee-type col-md-2';
            tdName.innerHTML = `<strong>${name}</strong>`;
            tr.appendChild(tdName);

            const tdDesc = document.createElement('td');
            tdDesc.className = 'col-md-5';
            let html = `<p class="mb-2">${data.description || ''}</p>`;
            if (data.items.length === 1) {
                const item = data.items[0];
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="${pid}_price" id="${pid}_single" value="${item.price}" data-product-id="${item.product_id}" checked>
                        <label class="form-check-label fw-bold" for="${pid}_single">${item.size_type} $${fmt(parseFloat(item.price))}</label>
                    </div>`;
            } else {
                data.items.forEach((item, i) => {
                    const sid = item.size_type.toLowerCase();
                    html += `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="${pid}_price" id="${pid}_${sid}" value="${item.price}" data-product-id="${item.product_id}" ${i === 0 ? 'checked' : ''}>
                            <label class="form-check-label fw-bold" for="${pid}_${sid}">${item.size_type} $${fmt(parseFloat(item.price))}</label>
                        </div>`;
                });
            }
            tdDesc.innerHTML = html;
            tr.appendChild(tdDesc);

            const tdQty = document.createElement('td');
            tdQty.className = 'col-md-2';
            tdQty.innerHTML = `
                <label class="form-label"><strong>Quantity:</strong></label>
                <input type="number" class="form-control quantity-input" id="${pid}_qty" value="0" min="0">`;
            tr.appendChild(tdQty);

            const tdSubtotal = document.createElement('td');
            tdSubtotal.className = 'col-md-3';
            tdSubtotal.innerHTML = `
                <label class="form-label"><strong>Total:</strong></label>
                <input type="text" class="form-control total-input" id="${pid}_total" value="$0.00" readonly>`;
            tr.appendChild(tdSubtotal);

            tbody.appendChild(tr);
        });

        // Grand total row
        const totalRow = document.createElement('tr');
        totalRow.className = 'table-warning';
        totalRow.innerHTML = `
            <td colspan="3" class="text-end"><strong class="fs-5">Grand Total:</strong></td>
            <td><input type="text" class="form-control total-input fw-bold" id="grand_total" value="$0.00" readonly></td>`;
        tbody.appendChild(totalRow);
    }

    // Calculation logic
    function calculateTotal() {
        const javaQty = parseInt(document.getElementById('java_qty')?.value) || 0;
        const javaRadio = document.querySelector('input[name="java_price"]:checked');
        const javaPrice = javaRadio ? parseFloat(javaRadio.value) : 0;
        const javaTotal = javaQty * javaPrice;
        const javaTotalInput = document.getElementById('java_total');
        if (javaTotalInput) javaTotalInput.value = `$${javaTotal.toFixed(2)}`;

        const laitQty = parseInt(document.getElementById('lait_qty')?.value) || 0;
        const laitRadio = document.querySelector('input[name="lait_price"]:checked');
        const laitPrice = laitRadio ? parseFloat(laitRadio.value) : 0;
        const laitTotal = laitQty * laitPrice;
        const laitTotalInput = document.getElementById('lait_total');
        if (laitTotalInput) laitTotalInput.value = `$${laitTotal.toFixed(2)}`;

        const cappQty = parseInt(document.getElementById('capp_qty')?.value) || 0;
        const cappRadio = document.querySelector('input[name="capp_price"]:checked');
        const cappPrice = cappRadio ? parseFloat(cappRadio.value) : 0;
        const cappTotal = cappQty * cappPrice;
        const cappTotalInput = document.getElementById('capp_total');
        if (cappTotalInput) cappTotalInput.value = `$${cappTotal.toFixed(2)}`;

        const grand = javaTotal + laitTotal + cappTotal;
        const grandInput = document.getElementById('grand_total');
        if (grandInput) grandInput.value = `$${grand.toFixed(2)}`;
    }

    function initializeCalculator() {
        document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', calculateTotal));
        document.querySelectorAll('.quantity-input').forEach(i => i.addEventListener('input', calculateTotal));
        calculateTotal();
    }

    async function checkout() {
        const items = [];
        const javaQty = parseInt(document.getElementById('java_qty')?.value) || 0;
        const javaRadio = document.querySelector('input[name="java_price"]:checked');
        if (javaQty > 0 && javaRadio) {
            const price = parseFloat(javaRadio.value) || 0;
            const qty = javaQty;
            items.push({
                product_id: parseInt(javaRadio.dataset.productId, 10),
                quantity: qty,
                unit_price: price,
                subtotal: qty * price
            });
        }
        const laitQty = parseInt(document.getElementById('lait_qty')?.value) || 0;
        const laitRadio = document.querySelector('input[name="lait_price"]:checked');
        if (laitQty > 0 && laitRadio) {
            const price = parseFloat(laitRadio.value) || 0;
            const qty = laitQty;
            items.push({
                product_id: parseInt(laitRadio.dataset.productId, 10),
                quantity: qty,
                unit_price: price,
                subtotal: qty * price
            });
        }
        const cappQty = parseInt(document.getElementById('capp_qty')?.value) || 0;
        const cappRadio = document.querySelector('input[name="capp_price"]:checked');
        if (cappQty > 0 && cappRadio) {
            const price = parseFloat(cappRadio.value) || 0;
            const qty = cappQty;
            items.push({
                product_id: parseInt(cappRadio.dataset.productId, 10),
                quantity: qty,
                unit_price: price,
                subtotal: qty * price
            });
        }

        if (items.length === 0) {
            showMessage('Please add items to your order before checking out.', 'warning');
            return;
        }

        const total = items.reduce((s, i) => s + i.subtotal, 0);

        try {
            const form = new FormData();
            form.append('order_items', JSON.stringify(items));
            form.append('total_amount', total);
            const res = await fetch(`${API_BASE}/checkout.php`, { method: 'POST', body: form });
            const result = await res.json();
            if (!result.success) throw new Error(result.error || 'Checkout failed');

            // Reset quantities
            ['java_qty','lait_qty','capp_qty'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });
            calculateTotal();
            showMessage(`Order placed successfully! Order ID: ${result.order_id}`, 'success');
        } catch (err) {
            showMessage(`Error placing order: ${err.message}`, 'danger');
        }
    }

    function bindCheckout() {
        const btn = document.getElementById('checkout-btn');
        if (btn) btn.addEventListener('click', checkout);
    }

    // Expose reset for the Reset button
    window.resetOrder = function resetOrder() {
        ['java_qty','lait_qty','capp_qty'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });
        calculateTotal();
        showMessage('Your order has been cleared.', 'info');
    };

    document.addEventListener('DOMContentLoaded', loadMenu);
})();