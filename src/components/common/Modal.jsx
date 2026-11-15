import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
  className = "",
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    full: "max-w-[90%] max-h-[90%]",
  };

  const handleBackdropClick = useCallback(
    (e) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose, closeOnBackdrop]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      />
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizes[size]} bg-white dark:bg-dark-secondary rounded-3xl border border-border shadow-2xl transform transition-all duration-300 z-50 ${className}`}
        role="document"
      >
        {title && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-primary-text dark:text-white" id="modal-title">
              {title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
    >
      <p className="text-secondary-text dark:text-gray-300 mb-8">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;
