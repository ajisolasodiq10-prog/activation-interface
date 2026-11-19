// Text loading indicator (no images or animation needed).
export default function Loading({ children = "Loading..." }) {
  return (
    <p className="loading" role="status" aria-live="polite">
      {children}
    </p>
  );
}
