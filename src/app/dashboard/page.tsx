"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardData {
  total: number;
  bySource: { source: string; count: number }[];
  byCampaign: { campaign: string; count: number }[];
  daily: { date: string; count: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
              Evo Growth
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Lead Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Home
            </Link>
            <a
              href="/api/leads/export"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
            >
              Export CSV
            </a>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {!data && !error && <p className="text-neutral-500">Loading metrics…</p>}

        {data && (
          <div className="space-y-8">
            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm text-neutral-500">Total leads</p>
              <p className="mt-1 text-4xl font-semibold">{data.total}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <MetricTable title="Leads by source" rows={data.bySource} labelKey="source" />
              <MetricTable title="Leads by campaign" rows={data.byCampaign} labelKey="campaign" />
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <h2 className="mb-4 text-lg font-medium">Daily lead count</h2>
              {data.daily.length === 0 ? (
                <p className="text-sm text-neutral-500">No leads yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium text-right">Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.map((row) => (
                      <tr key={row.date} className="border-b border-neutral-100 dark:border-neutral-900">
                        <td className="py-2">{row.date}</td>
                        <td className="py-2 text-right">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function MetricTable({
  title,
  rows,
  labelKey,
}: {
  title: string;
  rows: { [key: string]: string | number }[];
  labelKey: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-500">No data yet.</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[labelKey])} className="border-b border-neutral-100 dark:border-neutral-900">
                <td className="py-2">{row[labelKey]}</td>
                <td className="py-2 text-right font-medium">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
