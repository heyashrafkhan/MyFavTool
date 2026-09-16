import type { Metadata } from "next";
import { IpLookup } from "@/components/ip-lookup";

export const metadata: Metadata = {
  title: "IP Address Lookup",
  description:
    "Look up any IP address to see its city, region, country, ISP and timezone. Free and private.",
};

export default function IpLookupPage() {
  return <IpLookup />;
}