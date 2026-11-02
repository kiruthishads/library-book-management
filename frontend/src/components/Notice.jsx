import { useEffect } from "react";

/** Success / error banner that closes itself after a few seconds. */
export default function Notice({ notice, onClose }) {
  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [notice, onClose]);

  if (!notice) return null;
  return (
    <div className={`notice ${notice.type}`} role="alert">
      <span>{notice.text}</span>
      <button className="notice-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}
