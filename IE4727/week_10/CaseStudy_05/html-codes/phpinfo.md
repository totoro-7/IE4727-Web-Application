# CaseStudy_05 PHP Endpoints — Deep Dive

This README explains how the PHP endpoints in this folder work from the ground up. It covers PHP basics, MySQLi usage (prepare/bind/execute), each endpoint’s flow, date filtering for reports, and common pitfalls.

Contents
- PHP and MySQL basics used here
- MySQLi quick reference (prepare/bind/execute, transactions)
- SQL concepts used (JOIN/GROUP/SUM/ORDER/DATES)
- Endpoint by endpoint
  - get_products.php
  - update_price.php
  - checkout.php
  - get_sales_report.php
- Date filtering in reports (DATE_ADD vs DATE)
- Best practices and robustness tips
- Troubleshooting

--------------------------------------------------------------------------------

PHP and MySQL basics used here
- $variable: All PHP variables start with $. Examples: $product_id, $db.
- Arrays:
  - Indexed: $a = [10, 20];
  - Associative: $row = ['product_id' => 1, 'price' => 2.50];
- Superglobals for HTTP input:
  - $_GET: query string params (?id=1)
  - $_POST: form fields sent via POST
  - file_get_contents('php://input'): raw request body (useful for JSON)
- Null coalescing (??): $x = $_POST['foo'] ?? null; // null if not provided
- Response headers: header('Content-Type: application/json'); // tell browser it’s JSON
- JSON output: echo json_encode($data);
- Early exit on error: exit; // stop script after sending an error response
- Error suppression: @ $db = new mysqli(...); // hides warnings (use sparingly)

MySQLi quick reference
- Connecting:
  - $db = new mysqli($host, $user, $pass, $dbname);
  - if (mysqli_connect_errno()) { /* handle error */ }
- Direct query (no user input in SQL string): $db->query($sql)
- Prepared statements (safe for user inputs):
  - $stmt = $db->prepare("UPDATE products SET price = ? WHERE product_id = ?");
  - $stmt->bind_param('di', $new_price, $product_id);
    - Types: i=integer, d=double, s=string, b=blob
  - $stmt->execute();
  - SELECT results: $result = $stmt->get_result(); while ($row = $result->fetch_assoc()) { ... }
- insert_id: $db->insert_id // last AUTO_INCREMENT id
- Transactions:
  - $db->begin_transaction();
  - $db->commit();
  - $db->rollback();

SQL concepts used here
- JOIN: Combine tables by a key (e.g., order_items.product_id = products.product_id).
- Aggregations: SUM(), COUNT() used with GROUP BY.
- GROUP BY: Collapse many rows into one per group (e.g., per product).
- ORDER BY ... DESC: Sort results descending (largest values first).
- Date functions:
  - DATE_ADD(ts, INTERVAL 1 DAY): add 1 day to a date/timestamp (built-in MySQL).
  - DATE(ts): extract date part (YYYY-MM-DD) from a datetime (built-in MySQL).

--------------------------------------------------------------------------------

Endpoint walkthroughs

1) get_products.php
- Purpose: Return all products for the frontend to render.
- Flow:
  1) Set JSON header.
  2) Connect to DB and check for errors.
  3) Run a SELECT:
     - SELECT product_id, product_name, size_type, price, description
       FROM products
       ORDER BY product_id
  4) Build an array of rows: while ($row = $result->fetch_assoc()) { $products[] = $row; }
  5) echo json_encode($products); then close the DB connection.
- Notes:
  - Safe to use $db->query here since there’s no user input in the SQL string.

2) update_price.php
- Purpose: Admin endpoint to update a product’s price.
- Inputs (POST form fields):
  - product_id
  - price (the new price)
- Flow:
  1) Set JSON header.
  2) Read and validate inputs:
     - Ensure both are provided.
     - Ensure price is numeric and > 0.
  3) Connect to DB and check for errors.
  4) Use a prepared statement:
     - $stmt = $db->prepare("UPDATE products SET price = ? WHERE product_id = ?");
     - $stmt->bind_param('di', $new_price, $product_id);
     - $stmt->execute();
  5) Optionally fetch the updated product to return to the client for UI refresh.
  6) Return JSON { success: true, ... } on success or { success: false, error: '...' } on failure.
- Key bits:
  - ->prepare($query) compiles SQL with ? placeholders.
  - ->bind_param('di', ...) binds PHP variables with declared types (double, int).
  - Prevents SQL injection and formatting issues.

3) checkout.php
- Purpose: Save an order (order header + each line item) sent from the frontend.
- Inputs (POST form fields):
  - order_items: JSON string of items, e.g., [{ product_id, quantity, unit_price, subtotal }]
  - total_amount: numeric total for the entire order
- Flow:
  1) Set JSON header.
  2) Validate required fields and decode order_items JSON to a PHP array.
  3) Connect to DB and check errors.
  4) Begin transaction to keep header/items consistent.
  5) Insert order header:
     - INSERT INTO orders (total_amount) VALUES (?)
     - bind_param('d', $total_amount)
     - execute
     - $order_id = $db->insert_id;
  6) Prepare a statement for items once:
     - INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
       VALUES (?, ?, ?, ?, ?)
  7) Loop through decoded $order_items and bind/execute each:
     - bind_param('iiidd', $order_id, $pid, $qty, $price, $lineSubtotal)
  8) Commit the transaction; return JSON with success + order_id.
  9) On any failure, rollback and return an error JSON.
- Tips:
  - Ensure the frontend includes subtotal per line if your schema requires NOT NULL.
  - Use integers for ids/qty and doubles for prices/subtotals.

4) get_sales_report.php
- Purpose: Provide aggregated sales data for the report page.
- Typical outputs (as JSON arrays):
  - by_product: [{ product_name, total_sales, quantity_sold }]
  - by_category: [{ product_name, category, total_sales, quantity_sold }]
  - category_totals (optional): [{ category, total_sales, quantity_sold }]
- Flow:
  1) Set JSON header and connect to DB.
  2) Query “by product”:
     - SELECT p.product_name,
              SUM(oi.subtotal) AS total_sales,
              SUM(oi.quantity) AS quantity_sold
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       GROUP BY p.product_name
       ORDER BY total_sales DESC
  3) Query “by category (size type) per product”:
     - SELECT p.product_name,
              p.size_type AS category,
              SUM(oi.subtotal) AS total_sales,
              SUM(oi.quantity) AS quantity_sold
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       GROUP BY p.size_type, p.product_name
       ORDER BY p.product_name, total_sales DESC
  4) Optional overall category totals:
     - SELECT
         CASE WHEN p.size_type = 'Endless Cup' THEN NULL ELSE p.size_type END AS category,
         SUM(oi.subtotal) AS total_sales,
         SUM(oi.quantity) AS quantity_sold
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       GROUP BY category
       ORDER BY total_sales DESC
  5) json_encode the arrays and return.

- Why ORDER BY total_sales DESC?
  - total_sales is the alias for SUM(oi.subtotal).
  - DESC sorts so the highest revenue rows appear first.

--------------------------------------------------------------------------------

Date filtering for reports (inclusive end date)

Why join orders?
- Timestamps typically live on orders.created_at, not order_items. So we join orders:
  - FROM order_items oi
  - JOIN products p ON oi.product_id = p.product_id
  - JOIN orders o ON oi.order_id = o.order_id

Two patterns for WHERE date filters:

A) Recommended (index-friendly, inclusive end date)
WHERE o.created_at >= :start_date
  AND o.created_at < DATE_ADD(:end_date, INTERVAL 1 DAY)

- Include the full end date without worrying about 23:59:59.
- Keeps the column o.created_at unwrapped, so an index on orders.created_at can be used.

B) Simpler but less efficient
WHERE DATE(o.created_at) BETWEEN :start_date AND :end_date

- DATE() strips the time portion; easy to read.
- But wrapping the column with DATE() can prevent index usage (slower on big tables).

What are DATE_ADD and DATE()?
- DATE_ADD(datetime, INTERVAL N unit): Built-in MySQL function that adds time.
  - Example: DATE_ADD('2025-10-27', INTERVAL 1 DAY) -> '2025-10-28'
- DATE(datetime): Built-in MySQL function extracting only YYYY-MM-DD.
  - Example: DATE('2025-10-27 14:23:05') -> '2025-10-27'

Example query (by product with date filter)
SELECT
  p.product_name,
  SUM(oi.subtotal) AS total_sales,
  SUM(oi.quantity) AS quantity_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.created_at >= :start_date
  AND o.created_at < DATE_ADD(:end_date, INTERVAL 1 DAY)
GROUP BY p.product_name
ORDER BY total_sales DESC;

Implementation tips
- Bind :start_date and :end_date as 'YYYY-MM-DD'.
- Apply the same WHERE clause to all report queries so totals align.
- Add an index: CREATE INDEX idx_orders_created_at ON orders(created_at);

--------------------------------------------------------------------------------

Best practices and robustness
- Enable mysqli exceptions during development:
  - mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  - Then wrap DB code in try/catch for clearer error handling.
- Validate and cast:
  - $product_id = (int)$_POST['product_id'];
  - $new_price = (float)$_POST['price'];
- Consistent JSON APIs (optional improvement):
  - $payload = json_decode(file_get_contents('php://input'), true);
  - Accept and return JSON consistently (set appropriate headers).
- Security:
  - Always use prepared statements for any user-influenced SQL.
- Performance:
  - Add indexes on foreign keys (order_items.order_id, order_items.product_id) and orders.created_at.
- Transactions:
  - Use for multi-step writes (like checkout) to keep data consistent.

Troubleshooting
- “subtotal cannot be NULL”:
  - Ensure the frontend sends subtotal for each line if DB column is NOT NULL.
- 500 errors or empty responses:
  - Check PHP error log, enable mysqli exceptions to see exact DB errors.
- Report not filtering by date:
  - Confirm the JOIN to orders and WHERE clause are added to all report queries.
  - Verify the bound date values and formats (YYYY-MM-DD).
- Admin price doesn’t update:
  - Verify update_price.php returns success:true.
  - Confirm product_id exists and price is numeric > 0.

This folder’s endpoints are consumed by both:
- html-codes/*.html (classic UI)
- ../modern-css/* (Bootstrap UI)
Both call the same PHP files here to query/update the MySQL database.