export interface AscendInvoice {
  id: string;
  account_manager_id: string;
  due_date: string;
  installment_id: string | null;
  installment_plan_id: string | null;
  insured_id: string;
  invoice_number: string;
  invoice_url: string;
  issued_at: string;
  memo: string;
  paid_at: string | null;
  payee: string;
  payer_name: string;
  payment_method: {
    payment_type: string;
    card?: {
      brand: string;
      last_four_digits: string;
    };
  } | null;
  program_id: string;
  status: string;
  subscription_id: string | null;
  total_amount_cents: number;
  invoice_items: {
    id: string;
    amount_cents: number;
    title: string;
    invoice_item_type: string;
  }[];
}

export interface AscendInvoicesResponse {
  data: AscendInvoice[];
  meta: {
    count: number;
    prev: number | null;
    next: number | null;
  };
} 