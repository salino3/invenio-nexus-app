export interface AccountFavoritesProps {
  account_id: number;
  company_uuid: string;
  created_at: Date;
}

export interface FavoritesPayload extends Pick<
  AccountFavoritesProps,
  "account_id" | "company_uuid"
> {}

export interface AccountFavoritesResponse extends AccountFavoritesProps {}
