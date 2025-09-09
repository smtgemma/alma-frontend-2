"use client";
import React, { useState } from "react";
import SmartNavbar from "../ai-smart-form/SmartNavbar";
import { IoIosArrowBack } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSubmitExpertReviewMutation } from "@/redux/api/expertReview/expertReviewApi";
import { toast } from "sonner";

interface RequestConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: "existing" | "startup";
  description: string;
  documents: File[];
}

const RequestConsultation: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("planId");
  const [submitExpertReview, { isLoading: isSubmitting }] =
    useSubmitExpertReviewMutation();

  const [formData, setFormData] = useState<RequestConsultationFormData>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "existing",
    description: "",
    documents: [],
  });

  const [errors, setErrors] = useState<Partial<RequestConsultationFormData>>(
    {}
  );
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleInputChange = (
    field: keyof RequestConsultationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({ ...prev, documents: files }));
    setUploadSuccess(true);
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
    if (formData.documents.length === 1) {
      setUploadSuccess(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RequestConsultationFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (!planId) {
        toast.error("Plan ID is missing. Please try again.");
        return;
      }

      try {
        const result = await submitExpertReview(planId).unwrap();
        toast.success("Expert review request submitted successfully!");
        console.log("Expert review submitted:", result);

        // Redirect back to the previous page (approved-ai-plan)
        setTimeout(() => {
          router.push(`/approved-ai-plan/${planId}`);
        }, 1500); // Wait 1.5 seconds to show success message
      } catch (error: any) {
        console.error("Error submitting expert review:", error);
        toast.error(
          error?.data?.message || "Failed to submit expert review request"
        );
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] text-info font-medium mb-2">
            Request Expert Consultation
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Let us know how we can
              <br />
              assist you further
            </h2>
            <p className="text-[1rem] text-gray-600 mt-4 max-w-2xl mx-auto">
              Our expert consultants will review your request and respond
              shortly.
            </p>
          </div>

          {/* Form */}
          <div className="p-2 md:p-8 relative">
            {/* Top Right Decorative Image */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
              <img
                src="/images/dotted-top.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="bg-white rounded-2xl p-4 m-2 md:p-8 md:m-8 shadow-lg relative"
              style={{
                boxShadow:
                  "0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="question-text">
                    What is your full name? (Required)
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Enter your full legal name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.fullName ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="question-text">
                    What is your email address? (Required)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Provide a valid email to receive updates"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="question-text">
                    What is your phone number? (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="question-text">
                    What is your business name? (Optional)
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="Enter your business name"
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="question-text">
                    Is this an existing or an upcoming business? (Required)
                  </label>

                  {/* Radio Button Options */}
                  <div className="mt-4 space-y-4">
                    {errors.businessType && (
                      <p className="text-red-500 text-sm">
                        {errors.businessType}
                      </p>
                    )}

                    {/* Existing Business Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          formData.businessType === "existing"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, businessType: "existing" })
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.businessType === "existing"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          Existing Business
                        </span>
                      </div>
                    </div>

                    {/* Startup Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          formData.businessType === "startup"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, businessType: "startup" })
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.businessType === "startup"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          Startup
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="question-text">
                    Brief description of support needed (Required)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={1}
                    placeholder="Describe what kind of support or consultation you need..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                      errors.description
                        ? "border-red-500"
                        : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="question-text">
                    Attach business documents (Optional)
                  </label>

                  {/* Show attachment option when no files uploaded */}
                  {!uploadSuccess && (
                    <div
                      className="flex items-center gap-2 cursor-pointer mt-3"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <div className="bg-gray-50 p-3 rounded-full">
                        <GrAttachment className="text-primary" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Attach business documents
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                    </div>
                  )}

                  {/* Show uploaded files */}
                  {uploadSuccess && formData.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FiCheck className="text-green-600 w-4 h-4" />
                          <span className="text-sm text-green-600">
                            {file.name} uploaded successfully
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex justify-center gap-4 max-w-md mx-auto">
                  {/* Back Button */}
                  <Link
                    href={
                      planId ? `/approved-ai-plan/${planId}` : "/approved-plan"
                    }
                    className="block"
                  >
                    <button
                      type="button"
                      className="border border-[#888888]/50 text-accent bg-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-[1rem]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {/* <IoIosArrowBack className="w-5 h-5" /> */}
                        Back
                      </div>
                    </button>
                  </Link>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !planId}
                    className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-[1rem] ${
                      isSubmitting || !planId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 cursor-pointer text-white"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Left Decorative Image */}
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 z-[-1] md:z-0">
              <img
                src="/images/dotted-down.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestConsultation;
