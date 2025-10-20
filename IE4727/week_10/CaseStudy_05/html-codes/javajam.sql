USE javajam;

-- Table to store coffee products and their prices
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    size_type VARCHAR(20) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial coffee products
INSERT INTO products (product_name, size_type, price, description) VALUES
('Just Java', 'Endless Cup', 2.00, 'Regular house blend, decaffeinated coffee, or flavor of the day.'),
('Cafe au Lait', 'Single', 2.00, 'House blended coffee infused into a smooth, steamed milk.'),
('Cafe au Lait', 'Double', 3.00, 'House blended coffee infused into a smooth, steamed milk.'),
('Iced Cappuccino', 'Single', 4.75, 'Sweetened espresso blended with icy-cold milk and served in a chilled glass.'),
('Iced Cappuccino', 'Double', 5.75, 'Sweetened espresso blended with icy-cold milk and served in a chilled glass.');

-- Table to store sales/revenue data
CREATE TABLE revenue (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    sale_price DECIMAL(6,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);