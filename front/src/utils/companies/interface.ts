import type { CompanyProps } from "@/store/interface";
import type {
  CompanyErrorProps,
  RegisterCompanyResponse,
} from "@/store/interface-app";

export interface StateCompanyPage {
  success: boolean;
  error: Error | string;
  data: CompanyProps | null;
  fieldErrors: CompanyErrorProps | null;
  formData: RegisterCompanyResponse | null;
}
