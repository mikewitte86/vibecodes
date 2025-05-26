import { ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types/tables";
import { Customer } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState, useEffect } from "react";

const customerStatusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  PENDING: "bg-yellow-100 text-yellow-800",
};

function TruncatedCell({ text, maxWidth }: { text: string; maxWidth: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  const content = (
    <span ref={textRef} className={`truncate block ${maxWidth}`}>
      {text}
    </span>
  );

  if (!isTruncated) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: () => <span>COMPANY NAME</span>,
    size: 250,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "policies",
    header: "ACTIVE POLICIES",
    size: 150,
    cell: ({ row }) => row.getValue("policies"),
  },
  {
    accessorKey: "premium",
    header: "PREMIUM",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("premium")}</span>
    ),
  },
  {
    accessorKey: "revenue",
    header: "REVENUE",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("revenue")}</span>
    ),
  },
  {
    accessorKey: "hubspot",
    header: "ACTIONS",
    size: 120,
    enableSorting: false,
    cell: ({ row }) => (
      <a
        href={row.original.hubspot}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
      >
        HubSpot <ExternalLink className="h-4 w-4 inline" />
      </a>
    ),
  },
];

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "tenant_id",
    header: () => (
      <TruncatedCell text="Sub-agency Name" maxWidth="max-w-[100px]" />
    ),
    size: 120,
    cell: ({ row }) => (
      <TruncatedCell
        text={row.getValue("tenant_id") as string}
        maxWidth="max-w-[100px]"
      />
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <TruncatedCell text="Company Name" maxWidth="max-w-[120px]" />
    ),
    size: 150,
    cell: ({ row }) => (
      <TruncatedCell
        text={row.getValue("name") as string}
        maxWidth="max-w-[130px]"
      />
    ),
  },
  {
    accessorKey: "id",
    header: () => <TruncatedCell text="Company ID" maxWidth="max-w-[80px]" />,
    size: 100,
    cell: ({ row }) => (
      <TruncatedCell
        text={row.getValue("id") as string}
        maxWidth="max-w-[80px]"
      />
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <TruncatedCell text="Company Status" maxWidth="max-w-[90px]" />
    ),
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusBadge
          value={status}
          color={customerStatusColor[status] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => (
      <TruncatedCell text="Primary Contact Name" maxWidth="max-w-[110px]" />
    ),
    size: 120,
    cell: ({ row }) => (
      <TruncatedCell
        text={(row.getValue("phone") as string | null) || "N/A"}
        maxWidth="max-w-[100px]"
      />
    ),
  },
  {
    accessorKey: "is_prospect",
    header: () => <TruncatedCell text="Profile Data" maxWidth="max-w-[80px]" />,
    size: 80,
    cell: ({ row }) => {
      const hasProfile = !(row.getValue("is_prospect") as boolean);
      return (
        <span className="whitespace-nowrap">{hasProfile ? "Yes" : "No"}</span>
      );
    },
  },
  {
    accessorKey: "nowcerts_id",
    header: () => (
      <TruncatedCell text="Active Policies" maxWidth="max-w-[90px]" />
    ),
    size: 80,
    cell: ({ row }) => {
      const nowcertsId = row.getValue("nowcerts_id") as string;
      return (
        <span className="whitespace-nowrap font-mono">
          {nowcertsId === "UNKNOWN" ? "0" : nowcertsId}
        </span>
      );
    },
  },
  {
    accessorKey: "hubspot_id",
    header: () => (
      <TruncatedCell text="Total Premium" maxWidth="max-w-[90px]" />
    ),
    size: 100,
    cell: ({ row }) => {
      const hubspotId = row.getValue("hubspot_id") as string;
      return (
        <span className="whitespace-nowrap font-mono">
          {hubspotId ? `$${hubspotId}` : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "broker_buddha_id",
    header: () => (
      <TruncatedCell text="Total Commission" maxWidth="max-w-[100px]" />
    ),
    size: 100,
    cell: ({ row }) => {
      const brokerBuddhaId = row.getValue("broker_buddha_id") as string | null;
      return (
        <span className="whitespace-nowrap font-mono">
          {brokerBuddhaId ? `$${brokerBuddhaId}` : "N/A"}
        </span>
      );
    },
  },
];
