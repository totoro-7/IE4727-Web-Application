<?php
// filepath: c:\Users\yinyu\Documents\projects\IE4727-Web-Application\IE4727\week_10\CaseStudy_05\html-codes\checkout.php
header('Content-Type: application/json');

$order_items = $_POST['order_items'] ?? null;
$total_amount = $_POST['total_amount'] ?? null;

if (!$order_items || !$total_amount) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$order_items = json_decode($order_items, true);

if (empty($order_items)) {
    echo json_encode(['success' => false, 'error' => 'No items in order']);
    exit;
}

@ $db = new mysqli('localhost', 'root', '', 'javajam');

if (mysqli_connect_errno()) {
    echo json_encode(['success' => false, 'error' => 'Could not connect to database']);
    exit;
}

// Start transaction
$db->begin_transaction();

try {
    // Insert order
    $query = "INSERT INTO orders (total_amount) VALUES (?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param('d', $total_amount);
    $stmt->execute();
    $order_id = $db->insert_id;
    
    // Insert order items
    $query = "INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    
    foreach ($order_items as $item) {
        $stmt->bind_param('iiidd', 
            $order_id, 
            $item['product_id'], 
            $item['quantity'], 
            $item['unit_price'], 
            $item['subtotal']
        );
        $stmt->execute();
    }
    
    // Commit transaction
    $db->commit();
    
    echo json_encode(['success' => true, 'order_id' => $order_id]);
    
} catch (Exception $e) {
    // Rollback on error
    $db->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$db->close();
?>