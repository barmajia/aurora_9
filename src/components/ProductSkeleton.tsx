export default function ProductSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="skeleton-image" />
      <div className="product-info">
        <div className="skeleton-category" />
        <div className="skeleton-title" />
        <div className="skeleton-description" />
        <div className="skeleton-description short" />
        <div className="product-footer">
          <div className="skeleton-price" />
          <div className="skeleton-button" />
        </div>
      </div>
    </div>
  );
}
