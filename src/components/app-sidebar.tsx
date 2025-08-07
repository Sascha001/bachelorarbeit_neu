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
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
          url: "/statistik",
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
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
