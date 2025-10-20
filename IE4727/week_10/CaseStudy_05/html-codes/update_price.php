<?php
header('Content-Type: application/json');

// Get POST data
$product_id = $_POST['product_id'] ?? null;
$new_price = $_POST['price'] ?? null;

// Validate inputs
if (!$product_id || !$new_price) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Validate price is a positive number
if (!is_numeric($new_price) || $new_price <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid price']);
    exit;
}

// Connect to database
@ $db = new mysqli('localhost', 'root', '', 'javajam');

if (mysqli_connect_errno()) {
    echo json_encode(['success' => false, 'error' => 'Could not connect to database']);
    exit;
}

// Update the price
$query = "UPDATE products SET price = ? WHERE product_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param('di', $new_price, $product_id);

if ($stmt->execute()) {
    // Get updated product details to send back
    $query = "SELECT product_id, product_name, size_type, price FROM products WHERE product_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true, 
        'product' => $product,
        'message' => 'Price updated successfully'
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update price']);
}

$stmt->close();
$db->close();
?>