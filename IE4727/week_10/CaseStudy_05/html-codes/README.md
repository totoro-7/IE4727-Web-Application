# IE4727 Web Application Workspace

Quick start (CaseStudy_05)
1. Install PHP and MySQL (or use XAMPP/MAMP).
2. Create a database (default name: javajam), and import [IE4727/week_10/CaseStudy_05/html-codes/javajam.sql](IE4727/week_10/CaseStudy_05/html-codes/javajam.sql).
3. From the folder [IE4727/week_10/CaseStudy_05/html-codes](IE4727/week_10/CaseStudy_05/html-codes), start a PHP server:
   - php -S localhost:8000
4. Open:
   - Customer menu: http://localhost:8000/menu.html
   - Admin update: http://localhost:8000/admin.html
   - Sales report: http://localhost:8000/sales_report.html

Main CaseStudy_05 files
- Frontend pages
  - [menu.html](IE4727/week_10/CaseStudy_05/html-codes/menu.html): Menu and cart.
  - [admin.html](IE4727/week_10/CaseStudy_05/html-codes/admin.html): Update product pricing (admin).
  - [sales_report.html](IE4727/week_10/CaseStudy_05/html-codes/sales_report.html): Sales summary.
  - [jobs.html](IE4727/week_10/CaseStudy_05/html-codes/jobs.html), [music.html](IE4727/week_10/CaseStudy_05/html-codes/music.html): Additional pages and forms.
- Frontend scripts
  - [menu.js](IE4727/week_10/CaseStudy_05/html-codes/menu.js): Menu rendering, cart logic, checkout.
  - [menuupdate.js](IE4727/week_10/CaseStudy_05/html-codes/menuupdate.js): Admin page logic to update product prices.
  - [sales_report.js](IE4727/week_10/CaseStudy_05/html-codes/sales_report.js): Fetch and render sales report.
  - [admin.js](IE4727/week_10/CaseStudy_05/html-codes/admin.js): Extra admin interactions (if any).
  - [formvalidation.js](IE4727/week_10/CaseStudy_05/html-codes/formvalidation.js): Client-side validation helpers.
- Backend endpoints (PHP)
  - [get_products.php](IE4727/week_10/CaseStudy_05/html-codes/get_products.php): Returns product list as JSON.
  - [checkout.php](IE4727/week_10/CaseStudy_05/html-codes/checkout.php): Accepts cart checkout JSON and stores sales.
  - [update_price.php](IE4727/week_10/CaseStudy_05/html-codes/update_price.php): Updates product price.
  - [get_sales_report.php](IE4727/week_10/CaseStudy_05/html-codes/get_sales_report.php): Aggregates sales and returns a report as JSON.
  - [show_post.php](IE4727/week_10/CaseStudy_05/html-codes/show_post.php): Debug helper to display POSTed data (if used).
- Database
  - [javajam.sql](IE4727/week_10/CaseStudy_05/html-codes/javajam.sql): Schema and seed data for products/sales tables.

Key frontend functions
- Menu/cart (in [`initMenu`](IE4727/week_10/CaseStudy_05/html-codes/menu.js), [`loadProducts`](IE4727/week_10/CaseStudy_05/html-codes/menu.js), [`renderProducts`](IE4727/week_10/CaseStudy_05/html-codes/menu.js), [`addToCart`](IE4727/week_10/CaseStudy_05/html-codes/menu.js), [`renderCart`](IE4727/week_10/CaseStudy_05/html-codes/menu.js), [`checkout`](IE4727/week_10/CaseStudy_05/html-codes/menu.js)):
  - Loads products via fetch from [get_products.php](IE4727/week_10/CaseStudy_05/html-codes/get_products.php).
  - Renders products with Add buttons.
  - Manages an in-memory cart (Map keyed by product id).
  - Posts JSON checkout to [checkout.php](IE4727/week_10/CaseStudy_05/html-codes/checkout.php).
- Admin price update (in [menuupdate.js](IE4727/week_10/CaseStudy_05/html-codes/menuupdate.js)):
  - Reads selected product and new price; POSTs to [update_price.php](IE4727/week_10/CaseStudy_05/html-codes/update_price.php); shows success/error.
- Sales report (in [sales_report.js](IE4727/week_10/CaseStudy_05/html-codes/sales_report.js)):
  - Calls [get_sales_report.php](IE4727/week_10/CaseStudy_05/html-codes/get_sales_report.php); displays totals.

Endpoints (request/response)
- Products: GET [get_products.php](IE4727/week_10/CaseStudy_05/html-codes/get_products.php) -> 200 JSON:
  - [{ id: number, name: string, price: number }]
- Checkout: POST [checkout.php](IE4727/week_10/CaseStudy_05/html-codes/checkout.php) with JSON:
  - { items: [{ product_id, quantity, unit_price }], total: number }
  - Response: { success: boolean, orderId?: string, message?: string }
- Update price: POST [update_price.php](IE4727/week_10/CaseStudy_05/html-codes/update_price.php) form or JSON:
  - { product_id, new_price }
  - Response: { success: boolean, message?: string }
- Sales report: GET [get_sales_report.php](IE4727/week_10/CaseStudy_05/html-codes/get_sales_report.php) -> 200 JSON:
  - { totals: [{ product_id, name, qty, revenue }], grandTotal: number }

Running notes
- Use a real server (http:// or https://). fetch() will not work on file://.
- Configure DB credentials inside PHP files or via environment vars: DB_HOST, DB_USER, DB_PASS, DB_NAME.
- See [IE4727/week_10/CaseStudy_05/html-codes/README.md](IE4727/week_10/CaseStudy_05/html-codes/README.md) for detailed function documentation and troubleshooting.

Troubleshooting
- Checkout button does nothing:
  - Ensure menu is opened via PHP server, not file://.
  - Open browser devtools Console and Network tabs to check errors from [checkout.php](IE4727/week_10/CaseStudy_05/html-codes/checkout.php).
  - Verify [get_products.php](IE4727/week_10/CaseStudy_05/html-codes/get_products.php) returns JSON.
  - Check PHP error log for DB connection issues and table names.

  # CaseStudy_05 Application

A minimal coffee shop app with:
- Customer menu and cart with checkout
- Admin price updates
- Sales reporting

Pages
- [menu.html](menu.html): Customer-facing menu, cart, and checkout UI.
- [admin.html](admin.html): Admin page to update product prices.
- [sales_report.html](sales_report.html): Sales summary for admin.
- [jobs.html](jobs.html), [music.html](music.html): Extra pages showcasing forms and validation.

Backend (PHP)
- [get_products.php](get_products.php): Returns product list as JSON.
- [checkout.php](checkout.php): Accepts checkout JSON; stores sales rows.
- [update_price.php](update_price.php): Updates a product price.
- [get_sales_report.php](get_sales_report.php): Aggregates sales for the report.
- [show_post.php](show_post.php): Utility to display incoming POSTs (for debugging).
- DB schema: [javajam.sql](javajam.sql).

How it works (data flow)
1. menu.html loads [menu.js](menu.js). On DOM ready, [`initMenu`](menu.js) calls [`loadProducts`](menu.js) -> GET [get_products.php](get_products.php) -> JSON list of products.
2. Products are shown with “Add” buttons. Clicking “Add” calls [`addToCart`](menu.js), then [`renderCart`](menu.js).
3. Clicking “Checkout” calls [`checkout`](menu.js), which POSTs JSON to [checkout.php](checkout.php). On success, cart clears and a success message shows.
4. admin.html with [menuupdate.js](menuupdate.js) sends price changes to [update_price.php](update_price.php). The DB is updated.
5. sales_report.html with [sales_report.js](sales_report.js) GETs [get_sales_report.php](get_sales_report.php) and renders totals.

Frontend JavaScript API

Menu/cart ([menu.js](menu.js))
- [`initMenu`](menu.js)
  - Bootstraps the page: loads products, renders them, wires click handlers for Add and Checkout.
- [`loadProducts`](menu.js)
  - GETs [get_products.php](get_products.php)
  - Returns: Promise<Array<{ id:number, name:string, price:number }>>
- [`renderProducts`](menu.js)
  - Renders the product list into the page with Add buttons.
- [`addToCart`](menu.js)
  - Adds or increments an item (by id) to an in-memory Map cart: { id, name, price, qty }.
- [`renderCart`](menu.js)
  - Recalculates and displays line items and total; disables Checkout if cart is empty.
- [`checkout`](menu.js)
  - POSTs { items, total } to [checkout.php](checkout.php); shows success or error and clears the cart on success.

Admin price update ([menuupdate.js](menuupdate.js))
- Typical flow:
  - Read selected product and input price.
  - POST to [update_price.php](update_price.php) as form-encoded or JSON.
  - Render success/error messages.

Sales report ([sales_report.js](sales_report.js))
- Typical flow:
  - GET [get_sales_report.php](get_sales_report.php)
  - Render a table or list:
    - Columns: product name, quantity sold, revenue
    - Footer: grand total

Form validation ([formvalidation.js](formvalidation.js))
- Example helpers:
  - Required field checks
  - Email/phone/number validation
  - Prevent submit and render error messages next to invalid inputs

Backend endpoints (details)

get_products.php
- Method: GET
- Response 200 JSON: [{ id, name, price }]
- Behavior:
  - Reads from products table.
  - May return a fallback list if DB is empty/unavailable (for development).

checkout.php
- Method: POST
- Request JSON:
  - { items: [{ product_id, quantity, unit_price }], total: number }
- Response JSON:
  - { success: boolean, orderId?: string, message?: string }
- Behavior:
  - Validates payload.
  - Ensures sales table exists.
  - Inserts one row per cart item with computed line total.
  - Returns a generated orderId.

update_price.php
- Method: POST (form or JSON)
- Body: { product_id, new_price }
- Response JSON: { success: boolean, message?: string }
- Behavior:
  - Validates input; updates the products table price.

get_sales_report.php
- Method: GET
- Response JSON:
  - { totals: [{ product_id, name, qty, revenue }], grandTotal: number }
- Behavior:
  - Sums quantity and revenue from sales table and joins with products.

Database
- Import [javajam.sql](javajam.sql) to create required tables (products, sales).
- Configure DB connection in PHP via env vars or inline:
  - DB_HOST, DB_USER, DB_PASS, DB_NAME (default DB name: javajam).

Running locally
1. From this folder, start PHP:
   - php -S localhost:8000
2. Open:
   - Menu: http://localhost:8000/menu.html
   - Admin: http://localhost:8000/admin.html
   - Report: http://localhost:8000/sales_report.html

Common issues and fixes
- Checkout button does nothing:
  - Open via http://localhost (not file://). fetch() won’t run on file://.
  - Check Console and Network tabs for errors (e.g., 500 from [checkout.php](checkout.php)).
  - Ensure JSON body is sent with Content-Type: application/json.
  - Verify DB credentials and that tables from [javajam.sql](javajam.sql) exist.
- Products list empty:
  - Confirm [get_products.php](get_products.php) is reachable and returns valid JSON.
  - Check that products table has rows (or implement fallback seed).
- Price update not reflected:
  - Confirm [update_price.php](update_price.php) returns success:true.
  - Refresh menu page so it re-GETs products.

Testing checklist
- Add items to cart; total updates in UI.
- Click Checkout; success message appears and cart clears.
- Change a price in Admin; reload Menu and verify price changes.
- View Sales Report; totals reflect recent checkouts.

Conventions and patterns
- fetch JSON pattern:
  - GET: fetch(url, { headers: { Accept: 'application/json' }})
  - POST: fetch(url, { method:'POST', headers: { 'Content-Type':'application/json', Accept:'application/json' }, body: JSON.stringify(data) })
- Error handling:
  - Check res.ok; show user-friendly message; log details to console.
- Accessibility:
  - Use aria-live regions for status messages (e.g., checkout success/failure).
```// filepath: IE4727/week_10/CaseStudy_05/html-codes/README.md
# CaseStudy_05 Application

A minimal coffee shop app with:
- Customer menu and cart with checkout
- Admin price updates
- Sales reporting

Pages
- [menu.html](menu.html): Customer-facing menu, cart, and checkout UI.
- [admin.html](admin.html): Admin page to update product prices.
- [sales_report.html](sales_report.html): Sales summary for admin.
- [jobs.html](jobs.html), [music.html](music.html): Extra pages showcasing forms and validation.

Backend (PHP)
- [get_products.php](get_products.php): Returns product list as JSON.
- [checkout.php](checkout.php): Accepts checkout JSON; stores sales rows.
- [update_price.php](update_price.php): Updates a product price.
- [get_sales_report.php](get_sales_report.php): Aggregates sales for the report.
- [show_post.php](show_post.php): Utility to display incoming POSTs (for debugging).
- DB schema: [javajam.sql](javajam.sql).

How it works (data flow)
1. menu.html loads [menu.js](menu.js). On DOM ready, [`initMenu`](menu.js) calls [`loadProducts`](menu.js) -> GET [get_products.php](get_products.php) -> JSON list of products.
2. Products are shown with “Add” buttons. Clicking “Add” calls [`addToCart`](menu.js), then [`renderCart`](menu.js).
3. Clicking “Checkout” calls [`checkout`](menu.js), which POSTs JSON to [checkout.php](checkout.php). On success, cart clears and a success message shows.
4. admin.html with [menuupdate.js](menuupdate.js) sends price changes to [update_price.php](update_price.php). The DB is updated.
5. sales_report.html with [sales_report.js](sales_report.js) GETs [get_sales_report.php](get_sales_report.php) and renders totals.

Frontend JavaScript API

Menu/cart ([menu.js](menu.js))
- [`initMenu`](menu.js)
  - Bootstraps the page: loads products, renders them, wires click handlers for Add and Checkout.
- [`loadProducts`](menu.js)
  - GETs [get_products.php](get_products.php)
  - Returns: Promise<Array<{ id:number, name:string, price:number }>>
- [`renderProducts`](menu.js)
  - Renders the product list into the page with Add buttons.
- [`addToCart`](menu.js)
  - Adds or increments an item (by id) to an in-memory Map cart: { id, name, price, qty }.
- [`renderCart`](menu.js)
  - Recalculates and displays line items and total; disables Checkout if cart is empty.
- [`checkout`](menu.js)
  - POSTs { items, total } to [checkout.php](checkout.php); shows success or error and clears the cart on success.

Admin price update ([menuupdate.js](menuupdate.js))
- Typical flow:
  - Read selected product and input price.
  - POST to [update_price.php](update_price.php) as form-encoded or JSON.
  - Render success/error messages.

Sales report ([sales_report.js](sales_report.js))
- Typical flow:
  - GET [get_sales_report.php](get_sales_report.php)
  - Render a table or list:
    - Columns: product name, quantity sold, revenue
    - Footer: grand total

Form validation ([formvalidation.js](formvalidation.js))
- Example helpers:
  - Required field checks
  - Email/phone/number validation
  - Prevent submit and render error messages next to invalid inputs

Backend endpoints (details)

get_products.php
- Method: GET
- Response 200 JSON: [{ id, name, price }]
- Behavior:
  - Reads from products table.
  - May return a fallback list if DB is empty/unavailable (for development).

checkout.php
- Method: POST
- Request JSON:
  - { items: [{ product_id, quantity, unit_price }], total: number }
- Response JSON:
  - { success: boolean, orderId?: string, message?: string }
- Behavior:
  - Validates payload.
  - Ensures sales table exists.
  - Inserts one row per cart item with computed line total.
  - Returns a generated orderId.

update_price.php
- Method: POST (form or JSON)
- Body: { product_id, new_price }
- Response JSON: { success: boolean, message?: string }
- Behavior:
  - Validates input; updates the products table price.

get_sales_report.php
- Method: GET
- Response JSON:
  - { totals: [{ product_id, name, qty, revenue }], grandTotal: number }
- Behavior:
  - Sums quantity and revenue from sales table and joins with products.

Database
- Import [javajam.sql](javajam.sql) to create required tables (products, sales).
- Configure DB connection in PHP via env vars or inline:
  - DB_HOST, DB_USER, DB_PASS, DB_NAME (default DB name: javajam).

Running locally
1. From this folder, start PHP:
   - php -S localhost:8000
2. Open:
   - Menu: http://localhost:8000/menu.html
   - Admin: http://localhost:8000/admin.html
   - Report: http://localhost:8000/sales_report.html

Common issues and fixes
- Checkout button does nothing:
  - Open via http://localhost (not file://). fetch() won’t run on file://.
  - Check Console and Network tabs for errors (e.g., 500 from [checkout.php](checkout.php)).
  - Ensure JSON body is sent with Content-Type: application/json.
  - Verify DB credentials and that tables from [javajam.sql](javajam.sql) exist.
- Products list empty:
  - Confirm [get_products.php](get_products.php) is reachable and returns valid JSON.
  - Check that products table has rows (or implement fallback seed).
- Price update not reflected:
  - Confirm [update_price.php](update_price.php) returns success:true.
  - Refresh menu page so it re-GETs products.

Testing checklist
- Add items to cart; total updates in UI.
- Click Checkout; success message appears and cart clears.
- Change a price in Admin; reload Menu and verify price changes.
- View Sales Report; totals reflect recent checkouts.

Conventions and patterns
- fetch JSON pattern:
  - GET: fetch(url, { headers: { Accept: 'application/json' }})
  - POST: fetch(url, { method:'POST', headers: { 'Content-Type':'application/json', Accept:'application/json' }, body: JSON.stringify(data) })
- Error handling:
  - Check res.ok; show user-friendly message; log details to console.
- Accessibility:
  - Use aria-live regions for status messages (e.g., checkout success/failure).


  SELECT
    p.product_name,
    SUM(oi.subtotal) AS total_sales,
    SUM(oi.quantity) AS quantity_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.created_at >= :start_date
    AND o.created_at < DATE_ADD(:end_date, INTERVAL 1 DAY)
    GROUP BY p.product_name
    ORDER BY total_sales DESC;