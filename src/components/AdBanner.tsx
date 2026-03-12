import { useState, useEffect } from 'react'

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(true)

  // Simple banner - can be replaced with actual ad code later
  return (
    <>
      {isVisible && (
        <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 text-center">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <span className="text-sm font-medium">
              🎉 Learn English for Free with SpeakUp!
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white text-sm ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// For future: Google AdSense placeholder
export function AdSensePlaceholder() {
  return (
    <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p className="text-gray-500 text-sm">
        Advertisement Space
      </p>
      <p className="text-gray-400 text-xs mt-1">
        (Google AdSense will be displayed here)
      </p>
    </div>
  )
}
