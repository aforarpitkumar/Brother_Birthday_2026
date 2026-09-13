import { useEffect, useState } from "react";
import { onFx } from "../../lib/fx.js";
import "./ToastHost.css";

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() =>
    onFx((event) => {
      if (event.type !== "toast") return;
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list.slice(-2), { id, ...event }]);
      setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id));
      }, 2600);
    }), []);

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span aria-hidden="true">{t.emoji}</span> {t.message}
        </div>
      ))}
    </div>
  );
}
