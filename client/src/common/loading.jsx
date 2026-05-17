function Loading({ size = 48, className = "" }) {
  return (
    <div
      className={`flavtam-spinner ${className}`.trim()}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Načítání"
    />
  );
}

export default Loading;
