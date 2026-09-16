import type { Metadata } from "next";
import { HolidayFinder } from "@/components/holiday-finder";

export const metadata: Metadata = {
  title: "Public Holidays",
  description:
    "Find public holidays for any country and year. Free and private.",
};

export default function HolidayFinderPage() {
  return <HolidayFinder />;
}