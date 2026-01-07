"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function PartnerHeader() {
  const pathname = usePathname();

  // Générer les breadcrumbs à partir du pathname
  const breadcrumbs = React.useMemo(() => {
    if (!pathname) return null;
    const pathWithoutFirstSlash = pathname.slice(1);
    const segments = pathWithoutFirstSlash.split("/");

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      let formattedSegment =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      // Traductions personnalisées
      const translations = {
        Dashboard: "Tableau de bord",
        Referrals: "Mes Filleuls",
        Link: "Mon Lien",
        Earnings: "Mes Gains",
        Admin: "Administration",
        Withdrawals: "Retraits",
      };

      formattedSegment = translations[formattedSegment] || formattedSegment;

      return {
        href,
        label: formattedSegment,
        isLast: index === segments.length - 1,
      };
    });
  }, [pathname]);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 md:relative md:top-auto md:z-auto fixed top-0 z-50 bg-background w-full rounded-tl-xl rounded-tr-xl">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs?.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage className="text-sm">{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.href} className="text-sm">
                    {breadcrumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
