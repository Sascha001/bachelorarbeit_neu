'use client'

import { useEffect, useRef } from 'react'

interface VioletBloomScrollbarOptions {
  fadeDelay?: number // Delay in ms before fading back to 20%
}

export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>(
  options: VioletBloomScrollbarOptions = {}
) {
  const { fadeDelay = 1000 } = options // 1 second default
  const elementRef = useRef<T>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Apply violet bloom scrollbar styling
    element.classList.add('violet-bloom-scrollbar')
    console.log('🎨 Violet Bloom Scrollbar applied to:', element)

    const startScrolling = () => {
      // Immediately show scrollbar at 100% opacity
      element.classList.add('scrolling')
      
      // Clear any existing fade timeout
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
        fadeTimeoutRef.current = null
      }
    }

    const stopScrolling = () => {
      // Start fade-out timer after scroll stops
      fadeTimeoutRef.current = setTimeout(() => {
        element.classList.remove('scrolling')
        fadeTimeoutRef.current = null
      }, fadeDelay)
    }

    const handleScroll = () => {
      startScrolling()
      stopScrolling() // Reset timer on each scroll
    }

    // Add scroll event listener
    element.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      element.removeEventListener('scroll', handleScroll)
      element.classList.remove('violet-bloom-scrollbar', 'scrolling')
      
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [fadeDelay])

  return elementRef
}