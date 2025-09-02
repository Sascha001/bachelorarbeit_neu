"use client"

import * as React from "react"
import {
  AudioWaveform,
  BarChart3,
  Briefcase,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useNotifications } from "@/hooks/use-notifications"

// This is sample data.
const data = {
  user: {
    name: "Sascha Cristul",
    email: "saschacristul@BA.com",
    avatar: "/avatars/sascha.jpg",
  },
  teams: [
    {
      name: "Uncertainty Visualization",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Depot",
      url: "/depot",
      icon: Briefcase,
      items: [
        {
          title: "Übersicht & Performance",
          url: "/depot",
        },
      ],
    },
    {
      title: "Statistik",
      url: "/statistik",
      icon: BarChart3,
      items: [
        {
          title: "Trading Statistik",
          url: "/statistik",
        },
        {
          title: "Unsicherheits Analyse",
          url: "/statistik/unsicherheits-analyse",
        },
        {
          title: "Validierung",
          url: "/statistik/validierung",
        },
      ],
    },
    {
      title: "Überprüfung",
      url: "/ueberpruefung",
      icon: Shield,
      items: [
        {
          title: "Modell",
          url: "/ueberpruefung",
        },
        {
          title: "Daten",
          url: "/ueberpruefung",
        },
        {
          title: "Mensch",
          url: "/ueberpruefung",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { unreadValidationCount } = useNotifications()

  // Add notification count to Validierung menu item
  const navMainWithNotifications = data.navMain.map(item => {
    if (item.title === "Statistik" && item.items) {
      return {
        ...item,
        items: item.items.map(subItem => {
          if (subItem.title === "Validierung") {
            return {
              ...subItem,
              notificationCount: unreadValidationCount
            }
          }
          return subItem
        })
      }
    }
    return item
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithNotifications} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
