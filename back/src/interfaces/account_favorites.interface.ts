export interface AccountFavoritesProps {
  account_id: number;
  company_uuid: string;
  created_at: Date;
}

export interface FavoritesOperationPayload {
  account_id: number;
  company_uuid: string;
}

export interface AccountFavoritesResponse {
  account_id: number;
  company_uuid: string;
  created_at: Date;
}
