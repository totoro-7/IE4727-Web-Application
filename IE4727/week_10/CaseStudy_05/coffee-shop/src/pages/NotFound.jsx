function NotFound() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      minHeight: '400px' 
    }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Return to Home</a>
    </div>
  );
}

export default NotFound;