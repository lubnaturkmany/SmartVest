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
      <div className={`modal ${type}`}>
        
        <h3 className="modal-title">{title}</h3>

        {message ? (
          <p className="modal-message">{message}</p>
        ) : null}

        <div className="modal-actions">
          {!hideCancel ? (
            <button
              type="button"
              className="ghost"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          ) : null}

          <button
            type="button"
            className="modal-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}