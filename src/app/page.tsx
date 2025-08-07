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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
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
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-muted-foreground font-medium">Analytics</div>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border border-border/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-muted-foreground font-medium">Reports</div>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-border/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-muted-foreground font-medium">Statistics</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-card via-card to-muted/20 border border-border/50 min-h-[60vh] flex-1 rounded-xl p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to your Dashboard</h2>
              <p className="text-muted-foreground">Start building your application here</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
