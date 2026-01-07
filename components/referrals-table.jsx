"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PARTNER_REFERRALS } from "@/src/graphql/partner";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { toast } from "sonner";

export function ReferralsTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data: session } = useSession();

  // Récupérer les vraies données depuis l'API
  const { data, loading, error } = useQuery(GET_PARTNER_REFERRALS);

  const referrals = data?.getPartnerReferrals || [];

  // Générer le code de parrainage à partir de l'email
  const generateReferralCode = (email) => {
    if (!email) return "partner";
    const username = email.split("@")[0].toLowerCase();
    return username.replace(/[^a-z0-9]/g, "").slice(0, 10);
  };

  const handleCopyLink = () => {
    const referralCode = generateReferralCode(session?.user?.email);
    const referralLink = `https://www.newbi.fr/auth/signup?partner=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Lien copié dans le presse-papier !");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3 justify-start"
            >
              Nom
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const referral = row.original;
          return (
            <div className="flex flex-col pl-2">
              <span className="font-medium">{referral.name}</span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {referral.company}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: () => <div className="pl-2">Email</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pl-2">
            <Mail className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <span className="text-sm">{row.getValue("email")}</span>
          </div>
        ),
      },
      {
        accessorKey: "registrationDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3 justify-start"
            >
              Inscription
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("registrationDate"));
          return (
            <div className="flex items-center gap-2 text-sm pl-2">
              <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
              {date.toLocaleDateString("fr-FR")}
            </div>
          );
        },
      },
      {
        accessorKey: "subscriptionPrice",
        header: () => <div className="pl-2">Abonnement</div>,
        cell: ({ row }) => {
          const price = row.getValue("subscriptionPrice");
          const type = row.original.subscriptionType;
          return (
            <div className="flex flex-col pl-2">
              <span className="text-sm font-medium">{price.toFixed(2)} €</span>
              <span className="text-xs text-muted-foreground">
                {type === "MONTHLY" ? "Mensuel" : "Annuel"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "commission",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3 justify-start"
            >
              Commission
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("commission"));
          return (
            <div className="font-semibold text-[#5b50ff] pl-2">
              {amount.toFixed(2)} €
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: referrals,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Afficher un état vide si pas de filleuls ou erreur
  if (error || referrals.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto bg-[#5b50ff]/10 rounded-full p-4 w-fit mb-4">
          <Users className="h-8 w-8 text-[#5b50ff]" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun filleul pour le moment</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Partagez votre lien de parrainage avec vos contacts pour commencer à gagner des commissions sur chaque client référé.
        </p>
        <Button onClick={handleCopyLink} className="gap-2 bg-[#5b50ff] hover:bg-[#5b50ff]/90 text-white">
          <Copy className="h-4 w-4" />
          Copier mon lien de parrainage
        </Button>
        <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          <LinkIcon className="h-3 w-3" />
          Envoyez ce lien à vos clients potentiels
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un filleul..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun filleul trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} filleul(s) au total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
