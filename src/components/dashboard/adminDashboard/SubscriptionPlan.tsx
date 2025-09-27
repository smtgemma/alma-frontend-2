"use client";
import Loading from "@/components/Others/Loading";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "@/redux/api/plans/plansApi";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const SubscriptionPlan = () => {
  const [activeTab, setActiveTab] = useState<"solo" | "team">("solo");

  // fetch plans
  const { data: plansData, isLoading } = useGetPlansQuery({});
  const [updatePlan] = useUpdatePlanMutation();

  // state for solo and team
  const [soloPlanData, setSoloPlanData] = useState<any>(null);
  const [teamPlanData, setTeamPlanData] = useState<any>(null);

  // when data comes from backend, set in state
  useEffect(() => {
    if (plansData?.data?.length) {
      const solo = plansData.data.find((p: any) =>
        p.publicName.toLowerCase().includes("solo")
      );
      const team = plansData.data.find((p: any) =>
        p.publicName.toLowerCase().includes("team")
      );

      if (solo) {
        setSoloPlanData({
          id: solo.id,
          title: solo.publicName,
          price: solo.price.toString(),
          supportingText: solo.description,
          facilities: solo.features,
        });
      }
      if (team) {
        setTeamPlanData({
          id: team.id,
          title: team.publicName,
          price: team.price.toString(),
          supportingText: team.description,
          facilities: team.features,
        });
      }
    }
  }, [plansData]);
  console.log("soloPlanData, teamPlanData", soloPlanData, teamPlanData);

  // get active plan
  const currentPlanData = activeTab === "solo" ? soloPlanData : teamPlanData;
  const setCurrentPlanData =
    activeTab === "solo" ? setSoloPlanData : setTeamPlanData;

  // save/update API call
  const handleSave = async () => {
    if (!currentPlanData) return;
    try {
      await updatePlan({
        id: currentPlanData.id,
        body: {
          publicName: currentPlanData.title,
          description: currentPlanData.supportingText,
          price: Number(currentPlanData.price),
          features: currentPlanData.facilities,
        },
      }).unwrap();
      toast.success("Piano aggiornato con successo!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Impossibile aggiornare il piano");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!soloPlanData && !teamPlanData) {
    return <div>Nessun piano trovato</div>;
  }
  console.log("currentPlanData", currentPlanData);

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">
      <div className="">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-6">
          Piano di Abbonamento
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab("solo")}
              className={`pb-2 px-1 transition-colors text-lg sm:text-xl md:text-[2rem] duration-200  font-medium text-accent ${
                activeTab === "solo"
                  ? "text-primary border-b-3 border-primary/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Piano Solo
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`pb-2 px-1 text-lg sm:text-xl md:text-[2rem] font-medium text-accent transition-colors duration-200 ${
                activeTab === "team"
                  ? "text-primary border-b-3 border-primary/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Piano Team
            </button>
          </div>
        </div>

        {/* Plan Details Form */}
        <div className="space-y-6">
          <div className="md:flex gap-6 ">
            {/* Plan Title */}
            <div className="md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo Piano
              </label>
              <input
                type="text"
                value={currentPlanData.title}
                onChange={(e) =>
                  setCurrentPlanData((prev: any) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Plan Price */}
            <div className="md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo Piano/Per {activeTab === "solo" ? "Piano" : "Mese"}
              </label>
              <div className="flex">
                <button className="bg-primary text-white px-4 py-2 rounded-l-lg border border-primary/80">
                  €
                </button>
                <input
                  type="text"
                  value={currentPlanData.price}
                  onChange={(e) =>
                    setCurrentPlanData((prev: any) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Supporting Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testo di Supporto (Massimo 50 caratteri)
            </label>
            <textarea
              value={currentPlanData.supportingText}
              onChange={(e) =>
                setCurrentPlanData((prev: any) => ({
                  ...prev,
                  supportingText: e.target.value,
                }))
              }
              rows={3}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {currentPlanData.supportingText.length}/100
            </div>
          </div>

          {/* Plan Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Strutture del Piano
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentPlanData.facilities.map(
                (facility: string, index: number) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Strutture del Piano{" "}
                      {(index + 1).toString().padStart(2, "0")}
                    </label>
                    <input
                      type="text"
                      value={facility}
                      onChange={(e) => {
                        const newFacilities = [...currentPlanData.facilities];
                        newFacilities[index] = e.target.value;
                        setCurrentPlanData((prev: any) => ({
                          ...prev,
                          facilities: newFacilities,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
          <button
            className="px-6 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="px-6 cursor-pointer py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-200"
          >
            Salva Modifiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
