"use client";
import React, { useState, useEffect } from "react";
import { useAdminUpdateBusinessPlanMutation } from "@/redux/api/admin/adminAPI";
import { toast } from "sonner";

interface BusinessPlanData {
  id: string;
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel: string;
  marketingSalesStrategy: string;
  sectorStrategy: string;
  fundingSources: string;
  operationsPlan: string;
}

interface AdminEditBusinessPlanProps {
  planData: BusinessPlanData;
  onUpdate?: (updatedData: BusinessPlanData) => void;
  onCancel?: () => void;
}

export default function AdminEditBusinessPlan({
  planData,
  onUpdate,
  onCancel,
}: AdminEditBusinessPlanProps) {
  const [formData, setFormData] = useState<BusinessPlanData>(() => {
    console.log("Initial plan data:", planData);
    return planData;
  });
  const [updateBusinessPlan, { isLoading: isUpdating }] =
    useAdminUpdateBusinessPlanMutation();

  useEffect(() => {
    console.log("Plan data received:", planData);
    setFormData(planData);
  }, [planData]);

  const handleInputChange = (field: keyof BusinessPlanData, value: string) => {
    console.log(`handleInputChange called: ${field} = ${value}`);
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [field]: value,
      };
      console.log("New form data:", newData);
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      // Extract only the editable fields for API call
      const updateData = {
        executiveSummary: formData.executiveSummary,
        businessOverview: formData.businessOverview,
        marketAnalysis: formData.marketAnalysis,
        businessModel: formData.businessModel,
        marketingSalesStrategy: formData.marketingSalesStrategy,
        sectorStrategy: formData.sectorStrategy,
        fundingSources: formData.fundingSources,
        operationsPlan: formData.operationsPlan,
      };

      console.log("Sending update data:", updateData);
      console.log("Plan ID:", planData.id);
      console.log("API URL will be:", `/businessPlan/${planData.id}`);

      // Call the API
      const result = await updateBusinessPlan({
        id: planData.id,
        data: updateData,
      }).unwrap();

      console.log("API Response:", result);

      // Check if the response indicates success
      if (result?.data?.success || result?.success) {
        toast.success("Business plan updated successfully!");

        // If onUpdate callback is provided, call it with updated data
        if (onUpdate) {
          await onUpdate({ ...planData, ...updateData });
        }
      } else {
        toast.error(
          result?.data?.message ||
            result?.message ||
            "Failed to update business plan"
        );
      }
    } catch (error: any) {
      console.error("Update error:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        error: error?.error
      });
      
      // Handle different error formats
      let errorMessage = "Failed to update business plan";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.status === 404) {
        errorMessage = "Business plan not found";
      } else if (error?.status === 403) {
        errorMessage = "Access denied - Admin permissions required";
      } else if (error?.status === 401) {
        errorMessage = "Authentication required";
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData(planData);
    if (onCancel) {
      onCancel();
    }
  };

  const renderField = (
    title: string,
    field: keyof BusinessPlanData,
    value: string
  ) => (
    <div className="mb-6">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        {title}
      </h3>
      <textarea
        value={value || ""}
        onChange={(e) => {
          console.log(`Changing ${field}:`, e.target.value);
          handleInputChange(field, e.target.value);
        }}
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        rows={6}
        placeholder={`Enter ${title.toLowerCase()}...`}
        style={{ minHeight: "120px" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Business Plan
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => console.log("Current form data:", formData)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Debug
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {renderField(
              "Executive Summary",
              "executiveSummary",
              formData.executiveSummary
            )}
            {renderField(
              "Business Overview",
              "businessOverview",
              formData.businessOverview
            )}
            {renderField(
              "Market Analysis",
              "marketAnalysis",
              formData.marketAnalysis
            )}
            {renderField(
              "Business Model",
              "businessModel",
              formData.businessModel
            )}
            {renderField(
              "Marketing & Sales Strategy",
              "marketingSalesStrategy",
              formData.marketingSalesStrategy
            )}
            {renderField(
              "Sector Strategy",
              "sectorStrategy",
              formData.sectorStrategy
            )}
            {renderField(
              "Funding Sources",
              "fundingSources",
              formData.fundingSources
            )}
            {renderField(
              "Operations Plan",
              "operationsPlan",
              formData.operationsPlan
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
