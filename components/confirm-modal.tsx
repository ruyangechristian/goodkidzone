'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const confirmBg = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400'

  const iconBg = variant === 'danger'
    ? 'bg-red-100 text-red-600'
    : 'bg-amber-100 text-amber-600'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] transition-opacity animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-muted overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p className="text-muted-foreground leading-relaxed ml-16">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 bg-muted/40 border-t border-muted">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-muted font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBg}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
