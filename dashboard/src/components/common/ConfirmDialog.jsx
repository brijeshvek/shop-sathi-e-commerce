import React from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">{message}</p>
        <div className="flex items-center justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} size="sm">
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading} size="sm">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
