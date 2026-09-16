import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "MyFavTool — Check WhatsApp Numbers Instantly",
    template: "%s · MyFavTool",
  },
  description:
    "Validate any phone number and instantly check whether it is active on WhatsApp. Fast, private and completely free.",
  keywords: [
    "whatsapp checker",
    "whatsapp number check",
    "phone number validator",
    "whatsapp online check",
  ],
  openGraph: {
    title: "MyFavTool — Check WhatsApp Numbers Instantly",
    description:
      "Validate any phone number and instantly check whether it is active on WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
