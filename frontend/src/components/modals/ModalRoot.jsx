import { useModal } from "../../hooks/useModal";
import CenteredModal from "./CenteredModal";
import { useNavigate } from "react-router-dom";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  const navigate = useNavigate();

  if (!modal) return null;

  const onConfirm = async () => {
  const action = modal.onConfirm;

  if (action) {
    await action();
  }

  closeModal();

  const isDanger =
    modal?.type === "danger" || modal?.type === "warning";

  if (isDanger) {
    navigate("/alerts");
  }
};

  const isDanger =
    modal?.type === "danger" || modal?.type === "warning";

  return (
    <CenteredModal
      title={modal.title || "Alert"}
      message={modal.message}
      type={modal.type || "info"}
      confirmText={isDanger ? "Acknowledge" : "Confirm"}
      hideCancel={isDanger}
      onConfirm={onConfirm}
      onCancel={closeModal}
    />
  );
}