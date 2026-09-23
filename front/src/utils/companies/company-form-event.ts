import { initialCompanyData, type CompanyProps } from "@/store/interface";
import type { StateCompanyPage } from "./interface";
import { ServicesApp } from "@/store/services";

const createInitialErrorState = (): CompanyProps => initialCompanyData;

const parseNumber = (val: unknown): number | null => {
  if (!val || String(val).trim() === "") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseJson = <T>(val: unknown, fallback: T): T => {
  if (!val || typeof val !== "string") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

export async function formCompanyPageEvent(
  prevState: StateCompanyPage,
  formData: FormData,
  extraData: { name: string; uuid: string; blobImage: File | null },
): Promise<StateCompanyPage> {
  try {
    const rawData = Object.fromEntries(formData.entries());

    let companyData: CompanyProps = {
      ...rawData, // It takes all string values automatically

      id: parseNumber(rawData.id) ?? undefined,
      funding_required_min: parseNumber(rawData.funding_required_min),
      funding_required_max: parseNumber(rawData.funding_required_max),
      ticket_investor_min: parseNumber(rawData.ticket_investor_min),
      ticket_investor_max: parseNumber(rawData.ticket_investor_max),

      tax_id: rawData.tax_id ? String(rawData.tax_id) : null,
      country_code: rawData.country_code ? String(rawData.country_code) : null,
      logo: rawData.logo ? String(rawData.logo) : null,

      // Arrays and complex objects (assuming they arrive as JSON strings from the form)
      hashtags: parseJson(rawData.hashtags, []),
      connection_objectives: parseJson(rawData.connection_objectives, []),
      contacts: parseJson(rawData.contacts, {}),
      multimedia: parseJson(rawData.multimedia, {}),

      created_at: rawData.created_at
        ? new Date(String(rawData.created_at))
        : undefined,
      updated_at: rawData.updated_at
        ? new Date(String(rawData.updated_at))
        : undefined,
    } as unknown as CompanyProps;

    const result = await ServicesApp.registerCompanyForm(companyData);

    return {
      success: false,
      error: "",
      fieldErrors: null,
      data: initialCompanyData,
      formData: result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error : String(error),
      fieldErrors: null,
      data: initialCompanyData,
      formData: null,
    };
  }
}
