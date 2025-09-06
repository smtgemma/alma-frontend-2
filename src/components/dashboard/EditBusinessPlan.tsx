"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import { useUpdateBusinessPlanMutation } from "@/redux/api/businessPlan/businessPlanApi";

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
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface EditBusinessPlanProps {
  planData: BusinessPlanData;
  onUpdate?: (data: BusinessPlanData) => Promise<void>;
  isLoading?: boolean;
}

export default function EditBusinessPlan({
  planData,
  onUpdate,
  isLoading = false,
}: EditBusinessPlanProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessPlanData>(planData);
  const [updateBusinessPlan, { isLoading: isUpdating }] =
    useUpdateBusinessPlanMutation();

  useEffect(() => {
    setFormData(planData);
  }, [planData]);

  const handleInputChange = (field: keyof BusinessPlanData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
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

      // Call the API
      const result = await updateBusinessPlan({
        id: planData.id,
        data: updateData,
      }).unwrap();

      if (result.success) {
        toast.success("Business plan updated successfully!");
        setIsEditing(false);

        // If onUpdate callback is provided, call it with updated data
        if (onUpdate) {
          await onUpdate({ ...planData, ...updateData });
        }
      } else {
        toast.error("Failed to update business plan");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update business plan");
    }
  };

  const handleCancel = () => {
    setFormData(planData);
    setIsEditing(false);
  };

  const renderField = (
    title: string,
    field: keyof BusinessPlanData,
    placeholder: string
  ) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      {isEditing ? (
        <textarea
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-gray-700 leading-relaxed text-lg">
          {formData[field] || `No ${title.toLowerCase()} available.`}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Business Plan
          </h1>
          <p className="text-gray-600 mt-2">
            Plan ID: {planData.id} | Created:{" "}
            {new Date(planData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit3 className="w-5 h-5" />
              Edit Plan
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-5 h-5" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Business Plan Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 space-y-8">
          {/* Executive Summary */}
          {renderField(
            "Executive Summary",
            "executiveSummary",
            "Enter executive summary..."
          )}

          {/* Business Overview */}
          {renderField(
            "Business Overview",
            "businessOverview",
            "Enter business overview..."
          )}

          {/* Market Analysis */}
          {renderField(
            "Market Analysis",
            "marketAnalysis",
            "Enter market analysis..."
          )}

          {/* Business Model */}
          {renderField(
            "Business Model",
            "businessModel",
            "Enter business model..."
          )}

          {/* Marketing & Sales Strategy */}
          {renderField(
            "Marketing & Sales Strategy",
            "marketingSalesStrategy",
            "Enter marketing and sales strategy..."
          )}

          {/* Sector Strategy */}
          {renderField(
            "Sector Strategy",
            "sectorStrategy",
            "Enter sector strategy..."
          )}

          {/* Funding Sources */}
          {renderField(
            "Funding Sources",
            "fundingSources",
            "Enter funding sources..."
          )}

          {/* Operations Plan */}
          {renderField(
            "Operations Plan",
            "operationsPlan",
            "Enter operations plan..."
          )}
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Plan Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                planData.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {planData.status}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2 text-gray-600">
              {new Date(planData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="ml-2 text-gray-600">
              {new Date(planData.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
