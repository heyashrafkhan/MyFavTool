import type { Metadata } from "next";
import { CurrencyConverter } from "@/components/currency-converter";

export const metadata: Metadata = {
  title: "Currency Converter",
  description:
    "Convert between 30+ world currencies with live exchange rates. Free and private.",
};

export default function CurrencyConverterPage() {
  return <CurrencyConverter />;
}