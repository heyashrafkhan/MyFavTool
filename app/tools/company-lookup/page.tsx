import type { Metadata } from "next";
import { CompanyLookup } from "@/components/company-lookup";

export const metadata: Metadata = {
  title: "Company Lookup",
  description:
    "Enter a company domain to see its name, industry, size, location and more. Free and private.",
};

export default function CompanyLookupPage() {
  return <CompanyLookup />;
}