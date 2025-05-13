export type Company = {
  name: string;
  policies: number;
  premium: string;
  revenue: string;
  hubspot: string;
};

export type Invoice = {
  id: string;
  company: string;
  amount: string;
  issue: string;
  due: string;
  status: string;
  days: string;
};

export type Policy = {
  company: string;
  type: string;
  status: string;
  premium: string;
  carrier: string;
  effective: string;
  number: string;
};

export type Renewal = {
  company: string;
  policyType: string;
  expiration: string;
  premium: string;
  status: string;
  days: string;
};

export type Deal = {
  company: string;
  contact: string;
  stage: string;
  value: string;
  source: string;
  created: string;
  last: string;
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
} 