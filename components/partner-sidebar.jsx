"use client";

import * as React from "react";
import {
  Home,
  Users,
  Link as LinkIcon,
  Copy,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { isAdmin } from "@/src/lib/admin-utils";
import { PartnerNavUser } from "@/components/partner-nav-user";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Mes Filleuls",
    url: "/dashboard/referrals",
    icon: Users,
  },
  {
    title: "Mon Lien",
    icon: LinkIcon,
    isCopyAction: true,
  },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Générer le code de parrainage à partir de l'email
  const generateReferralCode = (email) => {
    if (!email) return "partner";
    const username = email.split("@")[0].toLowerCase();
    return username.replace(/[^a-z0-9]/g, "").slice(0, 10);
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const referralCode = generateReferralCode(session?.user?.email);
    const referralLink = `https://www.newbi.fr/auth/signup?partner=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Lien copié dans le presse-papier !");
  };

  // Vérifier si l'utilisateur est admin
  const userIsAdmin = session?.user ? isAdmin(session.user) : false;

  // Créer le menu dynamiquement en fonction du rôle
  const menuItems = [
    ...items,
    ...(userIsAdmin ? [{
      title: "Administration",
      url: "/admin/withdrawals",
      icon: Shield,
    }] : []),
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_Texte_White.png"
            alt="Logo Newbi"
            className="h-8 w-auto"
          />
          <span className="text-sm font-semibold text-muted-foreground">
            Partenaire
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isCopyAction ? (
                    <SidebarMenuButton
                      onClick={handleCopyLink}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      <Copy className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <PartnerNavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
