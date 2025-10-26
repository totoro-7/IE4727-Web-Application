# JavaJam Coffee House — modern-css (Bootstrap)

This folder contains the Bootstrap-styled UI for JavaJam. It reuses the backend PHP endpoints defined in `../html-codes` (same MySQL database), so there’s a single source of truth for data.

Features included:
- Menu (Bootstrap): live product options from DB, total calculations, checkout
- Admin (Bootstrap): update prices inline per size option
- Sales Report (Bootstrap): by product and by category with aggregate rows, plus popular option summary
- Jobs and Music pages (Bootstrap layout)

## Contents and purpose

- index.html — Home page with Bootstrap layout and updated navigation
- menu-bootstrap.html — Menu UI container. Rows are injected dynamically
- bootstrap-menu.js — Fetches products from `../html-codes/get_products.php`, builds menu rows, calculates totals, and posts checkout to `../html-codes/checkout.php`
- admin-bootstrap.html — Admin UI container (Bootstrap)
- bootstrap-admin.js — Loads products, groups by product_name, toggles inline price inputs when a row is selected, posts updates to `../html-codes/update_price.php`
- sales-report-bootstrap.html — Sales report UI container (Bootstrap)
- bootstrap-sales-report.js — Fetches `../html-codes/get_sales_report.php` and renders
  - Sales by product
  - Sales by category
  - Aggregate rows: “Single (all coffees)” and “Double (all coffees)” across all products
  - Popular option of the best-selling product
- jobs-bootstrap.html — Jobs page (Bootstrap)
- music-bootstrap.html — Music page (Bootstrap)
- custom.css — Coffee-themed palette and Bootstrap overrides
- bootstrap-validation.js — Form validation helpers (if used by forms)
- show_post.php — Example POST echo page for demos

## How data flows

- Menu (menu-bootstrap.html + bootstrap-menu.js)
  1) On load, GET `../html-codes/get_products.php`
  2) Group items by product_name (Just Java, Cafe au Lait, Iced Cappuccino) and render radio options using each product’s `size_type` and `price`
  3) Each radio carries `data-product-id` so checkout references the correct product
  4) Quantities and selected options update line totals and grand total
  5) Checkout builds a payload:
     - order_items: [{ product_id, quantity, unit_price, subtotal }]
     - total_amount: sum of subtotals
     - POST to `../html-codes/checkout.php` as FormData

- Admin (admin-bootstrap.html + bootstrap-admin.js)
  1) GET `../html-codes/get_products.php`
  2) Group by product_name; select a row to reveal inline price inputs for its size options
  3) Click Update to POST each changed price to `../html-codes/update_price.php`
  4) On success, the display updates and a Bootstrap alert is shown

- Sales Report (sales-report-bootstrap.html + bootstrap-sales-report.js)
  1) GET `../html-codes/get_sales_report.php`
  2) Optionally show tables for by-product and by-category
  3) Append two highlighted rows: “Single (all coffees)” and “Double (all coffees)” aggregated across products
  4) Display the most popular option for the best-selling product

## Backend endpoints (reused)

All API calls point to `../html-codes`:
- `get_products.php` → products list
- `checkout.php` → inserts an order and items
- `update_price.php` → updates a price
- `get_sales_report.php` → aggregates sales

Ensure the PHP files can run from a PHP-enabled server and can reach MySQL. Credentials are configured inside the PHP files (default: host `localhost`, user `root`, empty password, database `javajam`).

## Running the Bootstrap pages

Serve the parent folder with PHP so these pages can call the PHP in `../html-codes`.

Example (PowerShell):
```powershell
# From IE4727/week_10/CaseStudy_05
php -S localhost:8000
```
Then open:
- http://localhost:8000/modern-css/menu-bootstrap.html
- http://localhost:8000/modern-css/admin-bootstrap.html
- http://localhost:8000/modern-css/sales-report-bootstrap.html

## Troubleshooting

- “subtotal cannot be null” during checkout
  - The Bootstrap script now includes `subtotal` per item. Verify your `order_items` table has `subtotal` NOT NULL and that the selected radios have `data-product-id` attributes.

- Fetch errors / 404
  - Confirm you’re serving through PHP (not opening HTML as file://)
  - Verify the relative path to `../html-codes` from this folder

- Empty products
  - Ensure the `products` table is populated. Import `../html-codes/javajam.sql` if needed

## Notes

- These pages are client-side apps calling PHP endpoints; authentication/authorization are not implemented
- For production, consider CSRF protection, validation, and server-side checks on price/ID integrity
