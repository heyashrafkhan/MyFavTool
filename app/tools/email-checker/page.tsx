import type { Metadata } from "next";
import { EmailChecker } from "@/components/email-checker";

export const metadata: Metadata = {
  title: "Email Checker",
  description:
    "Check whether an email address is valid and deliverable. Free and private.",
};

export default function EmailCheckerPage() {
  return <EmailChecker />;
}