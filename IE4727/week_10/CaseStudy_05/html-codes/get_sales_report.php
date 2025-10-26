<?php
// filepath: c:\Users\yinyu\Documents\projects\IE4727-Web-Application\IE4727\week_10\CaseStudy_05\html-codes\get_sales_report.php
header('Content-Type: application/json');

@ $db = new mysqli('localhost', 'root', '', 'javajam');

if (mysqli_connect_errno()) {
    echo json_encode(['error' => 'Could not connect to database']);
    exit;
}

// Get sales by product
$query = "SELECT 
    p.product_name,
    SUM(oi.subtotal) as total_sales,
    SUM(oi.quantity) as quantity_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.product_name
ORDER BY total_sales DESC";

$result = $db->query($query);
$by_product = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $by_product[] = $row;
    }
}

// Get sales by category (size type)
$query = "SELECT 
    p.product_name,
    p.size_type as category,
    SUM(oi.subtotal) as total_sales,
    SUM(oi.quantity) as quantity_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.size_type, p.product_name
ORDER BY p.product_name, total_sales DESC";

$result = $db->query($query);
$by_category = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $by_category[] = $row;
    }
}

// Also get overall category totals
$query = "SELECT 
    CASE 
        WHEN p.size_type = 'Endless Cup' THEN NULL
        ELSE p.size_type
    END as category,
    SUM(oi.subtotal) as total_sales,
    SUM(oi.quantity) as quantity_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY category
ORDER BY total_sales DESC";

$result = $db->query($query);
$category_totals = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $category_totals[] = $row;
    }
}

echo json_encode([
    'by_product' => $by_product,
    'by_category' => $by_category,
    'category_totals' => $category_totals
]);

$db->close();
?>