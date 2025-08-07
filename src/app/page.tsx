import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 violet-bloom-hover rounded-md p-2" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="grid auto-rows-min gap-6 md:grid-cols-3">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 aspect-video rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Analytics</h3>
                  <div className="w-3 h-3 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors"></div>
                </div>
                <p className="text-muted-foreground text-sm">View detailed analytics</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent border border-secondary/30 aspect-video rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Reports</h3>
                  <div className="w-3 h-3 bg-secondary/30 rounded-full group-hover:bg-primary/40 transition-colors"></div>
                </div>
                <p className="text-muted-foreground text-sm">Generate reports</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 aspect-video rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Statistics</h3>
                  <div className="w-3 h-3 bg-accent/30 rounded-full group-hover:bg-primary/40 transition-colors"></div>
                </div>
                <p className="text-muted-foreground text-sm">View statistics</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-card via-card/50 to-primary/5 border border-border hover:border-primary/30 min-h-[60vh] flex-1 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">Welcome to your Dashboard</h2>
              <p className="text-muted-foreground text-lg">Start building your application with violet-bloom theme</p>
              <div className="mt-8 flex justify-center">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
