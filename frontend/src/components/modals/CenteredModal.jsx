export default function CenteredModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideCancel = false
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        {message ? <p>{message}</p> : null}
        <div className="modal-actions">
          {!hideCancel ? (
            <button type="button" className="ghost" onClick={onCancel}>
              {cancelText}
            </button>
          ) : null}
          <button type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
