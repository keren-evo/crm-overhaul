import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
            Evo Growth
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Growth &amp; attribution sprint
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Lead capture with UTM attribution, Meta tracking, and CRM-ready data.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Try with UTMs:{" "}
            <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
              ?utm_source=meta&amp;utm_medium=paid&amp;utm_campaign=sprint
            </code>
          </p>
        </div>

        <LeadForm />

        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/dashboard" className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
            View lead dashboard →
          </Link>
        </p>
      </div>
    </main>
  );
}
