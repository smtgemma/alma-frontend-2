"use client";

import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
};

export default function ContactAdminForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};

    if (!form.name.trim()) nextErrors.name = "Il nome è richiesto";

    if (!form.email.trim()) {
      nextErrors.email = "L'email è richiesta";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Inserisci un'email valida";
    }

    if (!form.subject.trim()) nextErrors.subject = "L'oggetto è richiesto";

    if (!form.message.trim()) nextErrors.message = "Il messaggio è richiesto";

    // Phone optional; basic format check if provided
    if (form.phone && form.phone.length < 7) {
      nextErrors.phone = "Inserisci un numero di telefono valido";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setFailure(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            phone: form.phone.trim(),
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      setSuccess("Il tuo messaggio è stato inviato con successo.");
      setForm(initialState);
    } catch (err: any) {
      setFailure(
        err?.message ||
          "Qualcosa è andato storto durante l'invio del tuo messaggio."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 animate-slide-up">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-accent">
              Contatta Amministratore
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Hai una domanda su Pianifico? Inviaci un messaggio e ti
              risponderemo.
            </p>
          </div>

          <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 gap-5">
            {success && (
              <div className="rounded-md bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                {success}
              </div>
            )}
            {failure && (
              <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {failure}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-accent mb-1">
                  Nome
                </label>
                <input
                  name="name"
                  type="text"
                  className={`input w-full ${
                    errors.name ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="Mario Rossi"
                  value={form.name}
                  onChange={onChange}
                  disabled={submitting}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-accent mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className={`input w-full ${
                    errors.email ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="mario@esempio.com"
                  value={form.email}
                  onChange={onChange}
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-accent mb-1">
                  Telefono (opzionale)
                </label>
                <input
                  name="phone"
                  type="tel"
                  className={`input w-full ${
                    errors.phone ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="+39-123-456-7890"
                  value={form.phone}
                  onChange={onChange}
                  disabled={submitting}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-accent mb-1">
                  Oggetto
                </label>
                <input
                  name="subject"
                  type="text"
                  className={`input w-full ${
                    errors.subject ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="Richiesta su Pianifico"
                  value={form.subject}
                  onChange={onChange}
                  disabled={submitting}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent mb-1">
                Messaggio
              </label>
              <textarea
                name="message"
                className={`input w-full min-h-32 ${
                  errors.message ? "border-red-400 focus:ring-red-300" : ""
                }`}
                placeholder="Ciao, mi piacerebbe saperne di più su Pianifico!"
                value={form.message}
                onChange={onChange}
                disabled={submitting}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-accent bg-white hover:bg-gray-50"
                onClick={() => {
                  setForm(initialState);
                  setErrors({});
                  setSuccess(null);
                  setFailure(null);
                }}
                disabled={submitting}
              >
                Reimposta
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                disabled={submitting}
              >
                {submitting && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {submitting ? "Invio..." : "Invia Messaggio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
