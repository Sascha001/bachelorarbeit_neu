'use client'

import { useEffect, useRef } from 'react'

export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }

    // Add scroll container class for violet-pink scrollbar
    element.classList.add('scroll-container')

    return () => {
      element.classList.remove('scroll-container')
    }
  }, [])

  return elementRef
}