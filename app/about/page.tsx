import { Metadata } from "next";
import {
  CheckCircle2,
  Eye,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getCategories, totalTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MyFavTool and how our free WhatsApp Number Checker works.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Instant validation",
    description:
      "Enter any phone number and our checker instantly verifies the format against the selected country's dialing rules.",
  },
  {
    icon: MessageCircle,
    title: "Verify on WhatsApp",
    description:
      "After validating the format, we query WhatsApp to check whether the number is actually registered.",
  },
  {
    icon: Lock,
    title: "Private by design",
    description:
      "Phone numbers are only used for the lookup and are never stored, logged, or shared beyond the check.",
  },
  {
    icon: Zap,
    title: "No sign-up required",
    description:
      "Use the tool immediately — no account, no email, no friction. Just check and go.",
  },
];

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We explain exactly what the tool does: format validation plus a server-side WhatsApp lookup. No hidden logic.",
  },
  {
    icon: Heart,
    title: "User-first",
    description:
      "The tool is free and fast. Your phone number is only used for the WhatsApp lookup and is never stored.",
  },
  {
    icon: Globe,
    title: "Global coverage",
    description:
      "Supports phone number formats from 200+ countries with accurate dial codes and length rules.",
  },
];

export default function AboutPage() {
  const categories = getCategories();

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          About MyFavTool
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          MyFavTool is home to a free WhatsApp Number Checker that lets you
          validate any phone number&apos;s format and then check whether it is
          actually registered on WhatsApp.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          We built this tool because checking WhatsApp numbers shouldn&apos;t require
          installing an app or creating an account. Just enter a number, and
          we&apos;ll validate the format and check whether it&apos;s registered on
          WhatsApp.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
            >
              <feature.icon className="h-5 w-5 text-ink-400" />
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">
                {feature.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
          Our values
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
            >
              <value.icon className="h-5 w-5 text-ink-400" />
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">
                {value.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-ink-200 bg-ink-50/50 p-8 sm:p-10">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            Available categories
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            The directory covers {categories.length} categories spanning
            development, design, productivity and more.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat.slug} className="badge bg-white text-ink-600 ring-1 ring-inset ring-ink-200">
                {cat.name}
                <span className="text-ink-400">{cat.count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
