import { useModal } from "../../hooks/useModal";
import CenteredModal from "./CenteredModal";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  const onConfirm = async () => {
    const action = modal.onConfirm;
    closeModal();
    if (action) {
      await action();
    }
  };

  return (
    <CenteredModal
      title={modal.title || "Action"}
      message={modal.message}
      type={modal.type || "info"}   
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      hideCancel={modal.hideCancel}
      onConfirm={onConfirm}
      onCancel={closeModal}
    />
  );
}