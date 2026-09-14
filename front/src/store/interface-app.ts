export interface PropsTabs {
  key: number;
  title: string;
  component: React.ReactNode;
}

export interface CompanyErrorProps {
  uuid: string;
  name: string;
  tax_id: string;
  description: string;
  hashtags: string;
  sector: string;
  location: string;
  country_code: string;
  funding_required_min: string;
  funding_required_max: string;
  ticket_investor_min: string;
  ticket_investor_max: string;
  connection_objectives: string;
  contacts?: string;
  logo: string;
  multimedia: string;
}
