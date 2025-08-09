'use client'

import { useRef } from 'react'

// Simple ref hook - no scrollbar customization
export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T>(null)
  return elementRef
}