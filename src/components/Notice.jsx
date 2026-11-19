// Message box. tone: "error" | "success" | "info". Errors are announced to screen readers.
export default function Notice({ tone = "info", title, children }) {
  const role = tone === "error" ? "alert" : "status";
  return (
    <div className={`notice notice-${tone}`} role={role}>
      {title && <p className="notice-title">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
