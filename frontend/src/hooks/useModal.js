import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState
} from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  // 🔥 FIX: ضمان وجود type دائمًا
  const openModal = (config) => {
    setModal({
      ...config,
      type: config?.type || "info"
    });
  };

  const closeModal = () => setModal(null);

  const value = useMemo(
    () => ({ modal, openModal, closeModal }),
    [modal]
  );

  return createElement(ModalContext.Provider, { value }, children);
}

export function useModal() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return ctx;
}