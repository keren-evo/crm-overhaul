"use client";

import { FormEvent, useEffect, useState } from "react";
import { captureUtmFromUrl, getStoredUtm } from "@/lib/utm";
import { trackMetaLead } from "@/components/MetaPixel";

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const initial: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const utm = getStoredUtm();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...utm }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      trackMetaLead(form.email);

      setStatus("success");
      setMessage(
        data.deduplicated
          ? "Thanks — we already have your info on file."
          : "Thanks! Your details have been submitted."
      );
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="mb-1 block text-sm font-medium">
            First name
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={form.first_name}
            onChange={handleChange("first_name")}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="mb-1 block text-sm font-medium">
            Last name
          </label>
          <input
            id="last_name"
            type="text"
            required
            value={form.last_name}
            onChange={handleChange("last_name")}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange("email")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone <span className="text-neutral-400">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange("phone")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {status === "loading" ? "Submitting…" : "Get in touch"}
      </button>

      {message && (
        <p
          className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
