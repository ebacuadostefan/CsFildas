import { useRef, type FC } from "react";
import { useEffect } from "react";
import ModalCloseButton from "../Button/ModalCloseButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullScreen?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  className,
  children,
  showCloseButton,
  isFullScreen,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const contentClass = isFullScreen
    ? "relative w-full h-full rounded-lg bg-white flex flex-col"
    : "relative w-full sm:max-w-md md:max-w-1g lg:max-w-2xl rounded-lg bg-white max-h-[90vh] flex flex-col";

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999 p-4">
        {!isFullScreen && (
          <div className="fixed insert-0 w-full h-full bg-gray-400/50 backdrop-blur-1g" />
        )}
        <div
          ref={modalRef}
          className={`${contentClass} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && <ModalCloseButton onClose={onClose} />}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
