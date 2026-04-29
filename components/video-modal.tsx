'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  videoId: string
  title: string
  onClose: () => void
}

export function VideoModal({ isOpen, videoId, title, onClose }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <X size={32} />
        </button>

        {/* Video container with 16:9 aspect ratio */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&fs=1&showinfo=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Video title */}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>
    </div>
  )
}
