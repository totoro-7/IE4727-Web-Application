<?php
header('Content-Type: application/json');

// Connect to database
@ $db = new mysqli('localhost', 'root', '', 'javajam');

if (mysqli_connect_errno()) {
    echo json_encode(['error' => 'Could not connect to database']);
    exit;
}

// Get all products
$query = "SELECT product_id, product_name, size_type, price, description FROM products ORDER BY product_id";
$result = $db->query($query);

$products = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // fetch_assoc() returns: ['product_id' => 1, 'product_name' => 'Just Java', ...]
        $products[] = $row;
    }
}

echo json_encode($products);
/* Output looks like:
[
    {"product_id":1,"product_name":"Just Java","size_type":"Endless Cup","price":"2.00",...},
    {"product_id":2,"product_name":"Cafe au Lait","size_type":"Single","price":"2.00",...},
    ...
]
*/
$db->close();
?>