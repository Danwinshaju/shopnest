function LoadingSpinner({ message = "Loading products..." }) {
  return (
    <div className="loading-container" role="status">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;