"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { store } from "@/redux/store";

import { toast } from "sonner";
import {
  useGetTeamQuery,
  useInviteMemberMutation,
} from "@/redux/api/team/teamApi";
import TeamMemberSummary from "./TeamMemberSummary";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [inviteMember, { isLoading }] = useInviteMemberMutation();
  const { data: team } = useGetTeamQuery({});

  const { token } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.user
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const data = {
      teamId: team?.data?.id,
      email,
    };

    try {
      const response = await inviteMember(data).unwrap();

      if (response?.success) {
        toast.success(response?.message);
        router.push("/dashboard/manage-users");
      }
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Qualcosa è andato storto. Riprova.");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/manage-users");
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <TeamMemberSummary />

      {/* Add New User Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 px-4 lg:px-6">
          Aggiungi Nuovo Utente
        </h1>

        {/* Add New User Card */}
        <div className="bg-white rounded-[20px] shadow-md border border-gray-100 p-6 mx-0 md:mx-28">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aggiungi Nuovo Utente al Tuo Team
          </h2>

          {/* <p className="text-gray-600 mb-6 leading-relaxed">
            Invite up to 5 team members to join your plan. Once they accept your
            invitation, they'll get full access to generate and manage business
            plans under your subscription.
          </p> */}

          <p className="text-gray-600 mb-6 leading-relaxed">
            Scrivi l'Email per aggiungere il membro
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Indirizzo Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci indirizzo email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                {isLoading ? "Invio..." : "Invia Invito"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
