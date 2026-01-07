"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PartnerSidebar } from "@/components/partner-sidebar";
import { PartnerHeader } from "@/components/partner-header";
import { ProfileModalProvider } from "@/src/contexts/profile-modal-context";
import PartnerRouteGuard from "@/src/components/partner-route-guard";

export default function AdminLayout({ children }) {
  return (
    <PartnerRouteGuard>
      <ProfileModalProvider>
        <SidebarProvider>
          <PartnerSidebar />
          <SidebarInset className="md:pt-0 pt-12">
            <PartnerHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 rounded-tl-xl rounded-tr-xl">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProfileModalProvider>
    </PartnerRouteGuard>
  );
}
