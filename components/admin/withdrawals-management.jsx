"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_WITHDRAWALS, APPROVE_WITHDRAWAL, REJECT_WITHDRAWAL } from "@/src/graphql/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Clock, Euro, Mail, User } from "lucide-react";
import { toast } from "sonner";

export function WithdrawalsManagement() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, loading, refetch } = useQuery(GET_ALL_WITHDRAWALS, {
    variables: { status: selectedStatus === "all" ? null : selectedStatus },
    fetchPolicy: "network-only",
  });

  const [approveWithdrawal, { loading: approving }] = useMutation(APPROVE_WITHDRAWAL, {
    onCompleted: () => {
      toast.success("Retrait approuvé avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'approbation");
    },
  });

  const [rejectWithdrawal, { loading: rejecting }] = useMutation(REJECT_WITHDRAWAL, {
    onCompleted: () => {
      toast.success("Retrait rejeté");
      setRejectDialogOpen(false);
      setRejectionReason("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors du rejet");
    },
  });

  const handleApprove = async (withdrawalId) => {
    if (confirm("Êtes-vous sûr de vouloir approuver ce retrait ?")) {
      await approveWithdrawal({ variables: { withdrawalId } });
    }
  };

  const handleReject = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedWithdrawal) return;
    
    await rejectWithdrawal({
      variables: {
        withdrawalId: selectedWithdrawal.id,
        reason: rejectionReason || "Non spécifié",
      },
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "warning", icon: Clock, label: "En attente" },
      completed: { variant: "success", icon: CheckCircle2, label: "Approuvé" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejeté" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatIban = (iban) => {
    if (!iban) return "N/A";
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const withdrawals = data?.getAllWithdrawals || [];

  const stats = {
    pending: withdrawals.filter(w => w.status === "pending").length,
    completed: withdrawals.filter(w => w.status === "completed").length,
    rejected: withdrawals.filter(w => w.status === "rejected").length,
    totalAmount: withdrawals
      .filter(w => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0),
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant en attente</CardTitle>
            <Euro className="h-4 w-4 text-[#5b50ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount.toFixed(2)}€</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de retrait</CardTitle>
          <CardDescription>
            Gérez les demandes de retrait des partenaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="completed">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
              <TabsTrigger value="all">Tous</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="mt-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b50ff] mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun retrait à afficher
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Partenaire</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Solde disponible</TableHead>
                        <TableHead>IBAN</TableHead>
                        <TableHead>Date demande</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{withdrawal.partner.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {withdrawal.partner.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {withdrawal.amount.toFixed(2)}€
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span>{withdrawal.partner.availableBalance.toFixed(2)}€</span>
                              <span className="text-xs text-muted-foreground">
                                Total: {withdrawal.partner.totalEarnings.toFixed(2)}€
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatIban(withdrawal.bankDetails?.iban)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(withdrawal.requestedAt)}
                          </TableCell>
                          <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                          <TableCell className="text-right">
                            {withdrawal.status === "pending" && (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(withdrawal.id)}
                                  disabled={approving}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(withdrawal)}
                                  disabled={rejecting}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejeter
                                </Button>
                              </div>
                            )}
                            {withdrawal.status !== "pending" && (
                              <span className="text-sm text-muted-foreground">
                                {withdrawal.processedAt && `Traité le ${formatDate(withdrawal.processedAt)}`}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande de retrait</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de cette demande.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Raison du rejet</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Coordonnées bancaires incorrectes, solde insuffisant..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={rejecting}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
