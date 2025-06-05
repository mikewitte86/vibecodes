import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { AscendInvoice } from "@/types/ascend";
import { format, formatDistanceToNow, parseISO, differenceInDays } from "date-fns";

const formatStatus = (status: string) => {
  switch (status) {
    case 'awaiting_payment':
      return 'Awaiting Payment';
    case 'paid':
      return 'Paid';
    case 'draft':
      return 'Draft';
    default:
      return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    paid: "bg-green-50 text-green-700",
    draft: "bg-gray-50 text-gray-600",
    awaiting_payment: "bg-amber-50 text-amber-700",
    overdue: "bg-red-50 text-red-700",
  };
  return statusMap[status] || "bg-gray-50 text-gray-600";
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return format(parseISO(date), 'M/d/yyyy');
};

const formatDaysOutstanding = (dueDate: string, status: string, paid_at: string | null) => {
  if (!dueDate) return '-';
  if (status === 'paid' && paid_at) return '-';
  
  const parsedDueDate = parseISO(dueDate);
  const today = new Date();
  const daysDiff = differenceInDays(parsedDueDate, today);

  if (daysDiff < 0) {
    return `${Math.abs(daysDiff)} days overdue`;
  }

  if (daysDiff === 0) {
    return 'Due today';
  }

  if (daysDiff <= 7) {
    return `Due in ${daysDiff} days`;
  }

  if (daysDiff <= 30) {
    return 'Due in 1 month';
  }

  if (daysDiff <= 60) {
    return 'Due in 2 months';
  }

  const months = Math.floor(daysDiff / 30);
  return `Due in ${months} months`;
};

export const invoiceColumns: ColumnDef<AscendInvoice>[] = [
  {
    accessorKey: "due_date",
    header: "Due Date",
    size: 100,
    cell: ({ row }) => {
      const date = row.getValue("due_date") as string;
      return <span className="font-medium">{formatDate(date)}</span>;
    }
  },
  { 
    accessorKey: "invoice_number", 
    header: "Invoice #",
    size: 110,
    cell: ({ row }) => {
      const invoiceNumber = row.getValue("invoice_number") as string;
      return <span className="font-mono text-gray-600">{invoiceNumber}</span>;
    }
  },
  { 
    accessorKey: "payer_name",
    header: "Payer",
    size: 250,
    cell: ({ row }) => {
      const payerName = row.getValue("payer_name") as string;
      return <span className="font-medium text-gray-900">{payerName}</span>;
    }
  },
  { 
    accessorKey: "total_amount_cents", 
    header: "Amount", 
    size: 110,
    cell: ({ row }) => {
      const amount = row.getValue("total_amount_cents") as number;
      return amount ? (
        <span className="font-mono font-medium">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(amount / 100)}
        </span>
      ) : '-';
    }
  },
  {
    accessorKey: "issued_at",
    header: "Issued Date",
    size: 100,
    cell: ({ row }) => {
      const date = row.getValue("issued_at") as string;
      return <span className="text-gray-600">{formatDate(date)}</span>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge value={formatStatus(status)} color={getStatusColor(status)} />;
    },
  },
  {
    id: "days_outstanding",
    header: "Days Outstanding",
    size: 150,
    cell: ({ row }) => {
      const dueDate = row.getValue("due_date") as string;
      const status = row.getValue("status") as string;
      const paid_at = row.original.paid_at;
      const daysText = formatDaysOutstanding(dueDate, status, paid_at);
      return <span className="text-gray-600">{daysText}</span>;
    },
  },
  {
    id: "actions",
    header: "Action",
    size: 100,
    cell: ({ row }) => {
      const invoiceUrl = row.original.invoice_url;
      return (
        <a
          href={invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-medium flex items-center gap-1 hover:text-blue-600 hover:underline transition-colors"
        >
          View Inv <ExternalLink className="h-3 w-3" />
        </a>
      );
    },
  },
]; 