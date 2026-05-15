export default function CenteredModal({
  title,
  message,
  type , // info | warning | danger | success
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideCancel = false
}) {
  return (
    <div className="modal-backdrop">
      <div className={`modal ${type === "acknowledge" ? "info" : type}`}>
        
        <h3 className="modal-title">{title}</h3>

        {message ? (
          <p className="modal-message">{message}</p>
        ) : null}

        <div className="modal-actions">
         {type === "danger" || type === "warning" ? null : (
  <button
    type="button"
    className="ghost"
    onClick={onCancel}
  >
    {cancelText}
  </button>
)}

          <button
          type="button"
          className="modal-confirm"
          onClick={onConfirm}
          >
              {type === "danger" || type === "warning"
    ? "Acknowledge"
    : confirmText}
            </button>
        </div>
      </div>
    </div>
  );
}