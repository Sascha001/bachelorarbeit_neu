'use client'

import { useState } from 'react'

export interface Notification {
  id: string
  type: "trade-validation" | "general"
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  tradeId?: string
}

// Mock notification data - matches validation page pending items
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "trade-validation",
    title: "Trade Validierung verfügbar",
    description: "Ihr AAPL Trade vom 15.01.2024 kann jetzt bewertet werden",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
    tradeId: "1" // matches validation page id
  },
  {
    id: "2",
    type: "trade-validation", 
    title: "Trade Validierung verfügbar",
    description: "Ihr MSFT Trade vom 10.01.2024 kann jetzt bewertet werden",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: false,
    tradeId: "2" // matches validation page id
  }
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const unreadValidationCount = notifications.filter(n => !n.isRead && n.type === "trade-validation").length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  return {
    notifications,
    unreadCount,
    unreadValidationCount,
    markAsRead,
    markAllAsRead,
    setNotifications
  }
}