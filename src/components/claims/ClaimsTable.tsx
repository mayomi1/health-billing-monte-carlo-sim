"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  BillingRecord,
  PaymentStatus
} from "@/types/billingTypes";
import { formatCurrency } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CircleDashed,
  FilterX,
  Search,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClaimsTableProps {
  records: BillingRecord[];
}

const PAGE_SIZES = [10, 20, 50, 100];

export default function ClaimsTable({ records }: ClaimsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof BillingRecord>("claim_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter(record => {
        if (statusFilter !== "All" && record.payment_status !== statusFilter) {
          return false;
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            record.patient_name.toLowerCase().includes(query) ||
            record.patient_id.toLowerCase().includes(query) ||
            record.billing_code.toLowerCase().includes(query) ||
            record.insurance_provider.toLowerCase().includes(query) ||
            record.payment_status.toLowerCase().includes(query) ||
            record.amount.toString().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortColumn === "amount") {
          return sortDirection === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortColumn === "claim_date") {
          return sortDirection === "asc"
            ? new Date(a.claim_date).getTime() - new Date(b.claim_date).getTime()
            : new Date(b.claim_date).getTime() - new Date(a.claim_date).getTime();
        } else {
          const aValue = a[sortColumn].toString().toLowerCase();
          const bValue = b[sortColumn].toString().toLowerCase();
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
  }, [records, searchQuery, sortColumn, sortDirection, statusFilter]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize);

  const handleSort = (column: keyof BillingRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortColumn("claim_date");
    setSortDirection("desc");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-chart-2 hover:bg-chart-2/80">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="outline" className="border-chart-1 text-chart-1">
            <CircleDashed className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "Denied":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Denied
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as PaymentStatus | "All");
                  setCurrentPage(1);
                }}
              >
                <DropdownMenuRadioItem value="All">All Statuses</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Approved">Approved</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Denied">Denied</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-10"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("patient_id")}
              >
                <div className="flex items-center">
                  Patient ID
                  {sortColumn === "patient_id" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("patient_name")}
              >
                <div className="flex items-center">
                  Patient Name
                  {sortColumn === "patient_name" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("insurance_provider")}
              >
                <div className="flex items-center">
                  Insurance
                  {sortColumn === "insurance_provider" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortColumn === "amount" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("payment_status")}
              >
                <div className="flex items-center">
                  Status
                  {sortColumn === "payment_status" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("claim_date")}
              >
                <div className="flex items-center">
                  Claim Date
                  {sortColumn === "claim_date" ? (
                    sortDirection === "asc" ?
                      <SortAsc className="ml-1 h-4 w-4" /> :
                      <SortDesc className="ml-1 h-4 w-4" />
                  ) : (
                    <SortAsc className="ml-1 h-4 w-4 opacity-20" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((record) => (
                <TableRow key={record.patient_id + record.billing_code}>
                  <TableCell className="font-medium">{record.patient_id}</TableCell>
                  <TableCell>{record.patient_name}</TableCell>
                  <TableCell>{record.insurance_provider}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.amount)}</TableCell>
                  <TableCell>{getStatusBadge(record.payment_status)}</TableCell>
                  <TableCell>{format(new Date(record.claim_date), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(pageSize, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} claims
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Page</span>
              <span className="text-sm font-medium">{currentPage}</span>
              <span className="text-sm text-muted-foreground">of</span>
              <span className="text-sm font-medium">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
