"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Building,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  Users,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

interface PlanSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  isLoading?: boolean;
}

const PlanSlideModal: React.FC<PlanSlideModalProps> = ({
  isOpen,
  onClose,
  plan,
  isLoading = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeButton, setActiveButton] = useState<'left' | 'right' | null>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Debug: Log plan data to see what's available
  console.log("PlanSlideModal Plan Data:", plan);

  // Show loading state if plan is being fetched
  if (isLoading || !plan) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-800 z-50 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={onClose}
        />

        {/* Slide Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-white px-8 py-4 flex items-center justify-between shadow-sm z-10">
            {/* Logo */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Descriptive alt text"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-black font-medium text-2xl ">
                  Business AII Plan
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>

          {/* Loading Content */}
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Plan Details...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the business plan information.
            </p>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create slides data
  const createSlides = () => {
    const slides = [];

    // Slide 1: Executive Summary
    if (plan.executiveSummary) {
      slides.push({
        title: "Executive Summary",
        content: plan.executiveSummary,
        icon: Building
      });
    }

    // Slide 2: Business Overview
    if (plan.businessOverview) {
      slides.push({
        title: "Business Overview",
        content: plan.businessOverview,
        icon: Building
      });
    }

    // Slide 3: Market Analysis
    if (plan.marketAnalysis) {
      slides.push({
        title: "Market Analysis",
        content: plan.marketAnalysis,
        icon: TrendingUp
      });
    }

    // Slide 4: Financial Highlights
    if (plan.financialHighlights && plan.financialHighlights.length > 0) {
      slides.push({
        title: "Financial Highlights",
        content: plan.financialHighlights,
        icon: BarChart3,
        isFinancial: true
      });
    }

    // Slide 5: Business Model
    if (plan.businessModel) {
      slides.push({
        title: "Business Model",
        content: plan.businessModel,
        icon: Target
      });
    }
    // Slide 6: Cash Flow Analysis
    if (plan.cashFlowAnalysis && plan.cashFlowAnalysis.length > 0) {
      slides.push({
        title: "Cash Flow Analysis",
        content: plan.cashFlowAnalysis,
        icon: TrendingUp,
        isFinancial: true
      });
    }

    // Slide 7: Marketing Sales Strategy
    if (plan.marketingSalesStrategy) {
      slides.push({
        title: "Marketing Sales Strategy",
        content: plan.marketingSalesStrategy,
        icon: Lightbulb
      });
    }
    // Slide 8: Profit & Loss Projection
    if (plan.profitLossProjection && plan.profitLossProjection.length > 0) {
      slides.push({
        title: "Profit & Loss Projection",
        content: plan.profitLossProjection,
        icon: DollarSign,
        isFinancial: true
      });
    }

    // Slide 9: Sector Strategy
    if (plan.sectorStrategy) {
      slides.push({
        title: "Sector Strategy",
        content: plan.sectorStrategy,
        icon: BarChart3
      });
    }

    // Slide 10: Balance Sheet
    if (plan.balanceSheet && plan.balanceSheet.length > 0) {
      slides.push({
        title: "Balance Sheet",
        content: plan.balanceSheet,
        icon: Building,
        isFinancial: true
      });
    }

     // Slide 11: Net Financial Position
     if (plan.netFinancialPosition && plan.netFinancialPosition.length > 0) {
      slides.push({
        title: "Net Financial Position",
        content: plan.netFinancialPosition,
        icon: DollarSign,
        isFinancial: true
      });
    }

    // Slide 12: Debt Structure
    if (plan.debtStructure && plan.debtStructure.length > 0) {
      slides.push({
        title: "Debt Structure",
        content: plan.debtStructure,
        icon: BarChart3,
        isFinancial: true
      });
    }
    // Slide 13: Funding Sources
    if (plan.fundingSources) {
      slides.push({
        title: "Funding Sources",
        content: plan.fundingSources,
        icon: DollarSign
      });
    }
    

    // Slide 14: Operations Plan
    if (plan.operationsPlan) {
      slides.push({
        title: "Operations Plan",
        content: plan.operationsPlan,
        icon: Users
      });
    }

    // Slide 15: Key Ratios
    if (plan.keyRatios && plan.keyRatios.length > 0) {
      slides.push({
        title: "Key Ratios",
        content: plan.keyRatios,
        icon: BarChart3,
        isFinancial: true
      });
    }

    // Slide 16: Operating Cost Breakdown
    if (plan.operatingCostBreakdown && plan.operatingCostBreakdown.length > 0) {
      slides.push({
        title: "Operating Cost Breakdown",
        content: plan.operatingCostBreakdown,
        icon: Users,
        isFinancial: true
      });
    }


    return slides;
  };

  const slides = createSlides();
  const totalSlides = slides.length;

  const nextSlide = () => {
    setActiveButton('right');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveButton('left');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-800 z-50 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div>
              <Image
                src="/images/logo.png"
                alt="Descriptive alt text"
                width={40}
                height={40}
                className="rounded-lg sm:w-12 sm:h-12"
              />
            </div>
            <div>
              <h3 className="text-black font-medium text-lg sm:text-xl lg:text-2xl">
                Business AII Plan
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Back
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center z-20 rounded-full transition-colors cursor-pointer bg-black/20 hover:bg-black/30 ${activeButton === 'left' ? 'bg-primary/40' : ''}`}
        >
          <FaCaretLeft className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-colors ${activeButton === 'left' ? 'text-primary' : 'text-white'}`} />
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center z-20 rounded-full transition-colors cursor-pointer bg-black/20 hover:bg-black/30 ${activeButton === 'right' ? 'bg-primary/40' : ''}`}
        >
          <FaCaretRight className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-colors ${activeButton === 'right' ? 'text-primary' : 'text-white'}`} />
        </button>

        {/* Main Slide Content */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto mx-2 sm:mx-4 md:mx-8 lg:mx-16 my-8 sm:my-12 lg:my-16 p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
          {/* Company Info and Slide Counter */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {plan.planName || "InnovateX/"}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                {plan.businessType || "Early stage paper company"}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-gray-400 text-xs sm:text-sm">
                Slide {currentSlide + 1} out of {totalSlides}
              </p>
            </div>
          </div>

          {/* Slide Content */}
          {currentSlideData && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {currentSlideData.title}
              </h2>

              {currentSlideData.isFinancial ? (
                <div className="space-y-6">
                  {/* Charts Section */}
                  {currentSlideData.title === "Financial Highlights" && (
                    <div className="space-y-6">
                      {/* Revenue Growth Bar Chart */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Revenue Growth Trend
                        </h4>
                        <div className="flex items-end justify-between h-40 gap-3">
                          {currentSlideData.content.map((item: any, index: number) => {
                            const maxRevenue = Math.max(
                              ...currentSlideData.content.map((i: any) => i.revenue || 0)
                            );
                            const height = ((item.revenue || 0) / maxRevenue) * 100;
                            return (
                              <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="relative">
                                  <div
                                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg w-full min-h-[20px] transition-all duration-500 hover:from-green-600 hover:to-green-500 shadow-lg"
                                    style={{ height: `${Math.max(height, 10)}%` }}
                                  ></div>
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                      €{item.revenue?.toLocaleString() || "0"}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 text-center">
                                  <p className="text-sm font-medium text-gray-600">Year {item.year}</p>
                                  <p className="text-sm font-bold text-green-600">
                                    €{(item.revenue / 1000)?.toFixed(0)}K
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Financial Data Table */}
                      {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800">Financial Summary Table</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capex</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt Repayment</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentSlideData.content.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                    €{item.revenue?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                                    €{item.net_income?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                                    €{item.capex?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                                    €{item.debt_repayment?.toLocaleString() || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  )}

                  {/* Net Income vs Capex Comparison Chart */}
                  {/* {currentSlideData.title === "Financial Highlights" && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        Net Income vs Capex Comparison
                      </h4>
                      <div className="flex items-end justify-between h-32 gap-2">
                        {currentSlideData.content.map((item: any, index: number) => {
                          const maxValue = Math.max(
                            ...currentSlideData.content.map((i: any) =>
                              Math.max(i.net_income || 0, i.capex || 0)
                            )
                          );
                          const incomeHeight = ((item.net_income || 0) / maxValue) * 100;
                          const capexHeight = ((item.capex || 0) / maxValue) * 100;
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div className="flex items-end gap-1 w-full">
                                <div
                                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-1/2 min-h-[20px] transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                                  style={{ height: `${Math.max(incomeHeight, 10)}%` }}
                                ></div>
                                <div
                                  className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t w-1/2 min-h-[20px] transition-all duration-500 hover:from-purple-600 hover:to-purple-500"
                                  style={{ height: `${Math.max(capexHeight, 10)}%` }}
                                ></div>
                              </div>
                              <div className="mt-2 text-center">
                                <p className="text-xs font-medium text-gray-600">Year {item.year}</p>
                                <p className="text-xs font-bold text-blue-600">
                                  €{(item.net_income / 1000)?.toFixed(0)}K
                                </p>
                                <p className="text-xs font-bold text-purple-600">
                                  €{(item.capex / 1000)?.toFixed(0)}K
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Net Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Capex</span>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Key Ratios Pie Chart */}
                  {currentSlideData.title === "Key Ratios" && currentSlideData.content.length > 0 && (
                    <div className="space-y-6">
                      {/* Pie Charts Section */}
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-orange-600" />
                          Key Performance Ratios - Year {currentSlideData.content[currentSlideData.content.length - 1]?.year}
                        </h4>

                        {/* Bar Chart Section */}
                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                          <div className="h-64 sm:h-80 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                              {(() => {
                                const maxValue = Math.max(
                                  ...currentSlideData.content.map((item: any) => 
                                    Math.max(
                                      (item.roi || 0) * 100,
                                      (item.roe || 0) * 100,
                                      (item.gross_margin || 0) * 100,
                                      item.current_ratio || 0
                                    )
                                  )
                                );
                                const step = maxValue / 4;
                                
                                return [maxValue, maxValue - step, maxValue - (step * 2), maxValue - (step * 3), 0].map((value, index) => (
                                  <div key={index} className="text-right">
                                    {value.toFixed(1)}
                                  </div>
                                ));
                              })()}
                            </div>
                            
                            {/* Chart area */}
                            <div className="ml-12 h-full relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className="border-t border-gray-200"></div>
                                ))}
                              </div>
                              
                              {/* Bar Chart */}
                              <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-4">
                                {currentSlideData.content.map((item: any, index: number) => {
                                  const maxValue = Math.max(
                                    ...currentSlideData.content.map((i: any) => 
                                      Math.max(
                                        (i.roi || 0) * 100,
                                        (i.roe || 0) * 100,
                                        (i.gross_margin || 0) * 100,
                                        i.current_ratio || 0
                                      )
                                    )
                                  );
                                  
                                  const roiHeight = ((item.roi || 0) * 100 / maxValue) * 100;
                                  const roeHeight = ((item.roe || 0) * 100 / maxValue) * 100;
                                  const grossMarginHeight = ((item.gross_margin || 0) * 100 / maxValue) * 100;
                                  const currentRatioHeight = ((item.current_ratio || 0) / maxValue) * 100;
                                  
                                  return (
                                    <div key={index} className="flex flex-col items-center group flex-1 mx-0.5 sm:mx-1">
                                      <div className="flex items-end gap-0.5 sm:gap-1 w-full h-40 sm:h-48">
                                        {/* ROI Bar */}
                                        <div className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                            style={{ height: `${Math.max(roiHeight, 5)}%` }}
                              ></div>
                                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                              ROI: {((item.roi || 0) * 100).toFixed(1)}%
                                </div>
                              </div>
                          </div>

                                        {/* ROE Bar */}
                                        <div className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                            style={{ height: `${Math.max(roeHeight, 5)}%` }}
                              ></div>
                                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                              ROE: {((item.roe || 0) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                                        
                                        {/* Gross Margin Bar */}
                                        <div className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                            style={{ height: `${Math.max(grossMarginHeight, 5)}%` }}
                                          ></div>
                                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                              GM: {((item.gross_margin || 0) * 100).toFixed(1)}%
                                            </div>
                                          </div>
                          </div>

                                        {/* Current Ratio Bar */}
                                        <div className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                            style={{ height: `${Math.max(currentRatioHeight, 5)}%` }}
                              ></div>
                                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                              CR: {(item.current_ratio || 0).toFixed(2)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Year label */}
                                      <div className="mt-2 sm:mt-3 text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">Year {item.year}</p>
                                        <div className="space-y-0.5 sm:space-y-1 mt-1 sm:mt-2">
                                          <p className="text-xs font-bold text-green-600">
                                            ROI: {((item.roi || 0) * 100).toFixed(1)}%
                                          </p>
                                          <p className="text-xs font-bold text-blue-600">
                                            ROE: {((item.roe || 0) * 100).toFixed(1)}%
                                          </p>
                                          <p className="text-xs font-bold text-purple-600">
                                            GM: {((item.gross_margin || 0) * 100).toFixed(1)}%
                                          </p>
                                          <p className="text-xs font-bold text-orange-600">
                                            CR: {(item.current_ratio || 0).toFixed(2)}
                                          </p>
                                </div>
                              </div>
                            </div>
                                  );
                                })}
                              </div>
                          </div>
                        </div>

                        {/* Legend */}
                          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-600">ROI</span>
                          </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-600">ROE</span>
                          </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-600">Gross Margin</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-600">Current Ratio</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Ratios Table */}
                      {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800">Key Ratios Summary Table</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROE (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Margin (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Ratio</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentSlideData.content.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                    {((item.roi || 0) * 100)?.toFixed(1)}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                                    {((item.roe || 0) * 100)?.toFixed(1)}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                                    {((item.gross_margin || 0) * 100)?.toFixed(1)}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                                    {item.current_ratio?.toFixed(2) || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  )}

                  {/* Cash Flow Chart */}
                  {currentSlideData.title === "Cash Flow Analysis" && (
                    <div className="space-y-6">
                      {/* Cash Flow Bar Chart */}
                      {/* <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-600" />
                          Cash Flow Trends
                        </h4>
                        <div className="flex items-end justify-between h-40 gap-3">
                          {currentSlideData.content.map((item: any, index: number) => {
                            const maxValue = Math.max(
                              ...currentSlideData.content.map((i: any) =>
                                Math.max(Math.abs(i.operating || 0), Math.abs(i.investing || 0), Math.abs(i.financing || 0))
                              )
                            );
                            const operatingHeight = ((Math.abs(item.operating || 0)) / maxValue) * 100;
                            const investingHeight = ((Math.abs(item.investing || 0)) / maxValue) * 100;
                            const financingHeight = ((Math.abs(item.financing || 0)) / maxValue) * 100;
                            return (
                              <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="flex items-end gap-1 w-full">
                                  <div className="flex flex-col items-center flex-1">
                                    <div
                                      className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg"
                                      style={{ height: `${Math.max(operatingHeight, 10)}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        €{item.operating?.toLocaleString() || "0"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center flex-1">
                                    <div
                                      className="bg-gradient-to-t from-red-500 to-red-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg"
                                      style={{ height: `${Math.max(investingHeight, 10)}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        €{item.investing?.toLocaleString() || "0"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center flex-1">
                                    <div
                                      className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t w-full min-h-[20px] transition-all duration-500 shadow-lg"
                                      style={{ height: `${Math.max(financingHeight, 10)}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        €{item.financing?.toLocaleString() || "0"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 text-center">
                                  <p className="text-sm font-medium text-gray-600">Year {item.year}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs font-bold text-green-600">
                                      €{(item.operating / 1000)?.toFixed(0)}K
                                    </p>
                                    <p className="text-xs font-bold text-red-600">
                                      €{(item.investing / 1000)?.toFixed(0)}K
                                    </p>
                                    <p className="text-xs font-bold text-purple-600">
                                      €{(item.financing / 1000)?.toFixed(0)}K
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-6 flex justify-center gap-8">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm font-medium text-gray-600">Operating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-sm font-medium text-gray-600">Investing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-sm font-medium text-gray-600">Financing</span>
                          </div>
                        </div>
                      </div> */}

                      {/* Cash Flow Table */}
                      {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800">Cash Flow Analysis Table</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investing</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financing</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Cash</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentSlideData.content.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                    €{item.operating?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                    €{item.investing?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                                    €{item.financing?.toLocaleString() || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                                    €{item.net_cash?.toLocaleString() || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  )}

                  {/* Operating Cost Breakdown Chart */}
                  {currentSlideData.title === "Operating Cost Breakdown" && (
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-200 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-600" />
                        Operating Cost Distribution
                      </h4>
                      <div className="flex items-end justify-between h-32 gap-2">
                        {currentSlideData.content.map((item: any, index: number) => {
                          const maxCost = Math.max(
                            ...currentSlideData.content.map((i: any) =>
                              Math.max(i.employee_costs || 0, i.marketing || 0, i.rent || 0, i.administration || 0)
                            )
                          );
                          const employeeHeight = ((item.employee_costs || 0) / maxCost) * 100;
                          const marketingHeight = ((item.marketing || 0) / maxCost) * 100;
                          const rentHeight = ((item.rent || 0) / maxCost) * 100;
                          const adminHeight = ((item.administration || 0) / maxCost) * 100;
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div className="flex items-end gap-1 w-full">
                                <div
                                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-1/4 min-h-[20px] transition-all duration-500"
                                  style={{ height: `${Math.max(employeeHeight, 10)}%` }}
                                ></div>
                                <div
                                  className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-1/4 min-h-[20px] transition-all duration-500"
                                  style={{ height: `${Math.max(marketingHeight, 10)}%` }}
                                ></div>
                                <div
                                  className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t w-1/4 min-h-[20px] transition-all duration-500"
                                  style={{ height: `${Math.max(rentHeight, 10)}%` }}
                                ></div>
                                <div
                                  className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t w-1/4 min-h-[20px] transition-all duration-500"
                                  style={{ height: `${Math.max(adminHeight, 10)}%` }}
                                ></div>
                              </div>
                              <div className="mt-2 text-center">
                                <p className="text-xs font-medium text-gray-600">Year {item.year}</p>
                                <p className="text-xs font-bold text-blue-600">
                                  €{(item.employee_costs / 1000)?.toFixed(0)}K
                                </p>
                                <p className="text-xs font-bold text-green-600">
                                  €{(item.marketing / 1000)?.toFixed(0)}K
                                </p>
                                <p className="text-xs font-bold text-purple-600">
                                  €{(item.rent / 1000)?.toFixed(0)}K
                                </p>
                                <p className="text-xs font-bold text-orange-600">
                                  €{(item.administration / 1000)?.toFixed(0)}K
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Employee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Marketing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Rent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-600">Admin</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Balance Sheet Chart */}
                  {currentSlideData.title === "Balance Sheet" && (
                    <div className="space-y-6">
                      {/* Balance Sheet Visualization */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <Building className="w-5 h-5 text-indigo-600" />
                          Balance Sheet Overview
                        </h4>
                        <div className="flex flex-col items-center">
                          {/* Calculate Average Values */}
                          {(() => {
                            const totalAssets = currentSlideData.content.reduce((sum: number, item: any) => sum + (item.assets || 0), 0);
                            const totalLiabilities = currentSlideData.content.reduce((sum: number, item: any) => sum + (item.liabilities || 0), 0);
                            const totalEquity = currentSlideData.content.reduce((sum: number, item: any) => sum + (item.equity || 0), 0);
                            const dataCount = currentSlideData.content.length;

                            const avgAssets = totalAssets / dataCount;
                            const avgLiabilities = totalLiabilities / dataCount;
                            const avgEquity = totalEquity / dataCount;

                            const totalValue = avgAssets + avgLiabilities + avgEquity;
                            if (totalValue === 0) return null;

                            const assetsPercentage = (avgAssets / totalValue) * 100;
                            const liabilitiesPercentage = (avgLiabilities / totalValue) * 100;
                            const equityPercentage = (avgEquity / totalValue) * 100;

                            // Create pie chart using CSS conic-gradient
                            const conicGradient = `conic-gradient(
                              from 0deg,
                              #10b981 0deg ${assetsPercentage * 3.6}deg,
                              #ef4444 ${assetsPercentage * 3.6}deg ${(assetsPercentage + liabilitiesPercentage) * 3.6}deg,
                              #3b82f6 ${(assetsPercentage + liabilitiesPercentage) * 3.6}deg 360deg
                            )`;

                            return (
                              <>
                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                                  {/* Pie Chart */}
                                  <div className="relative mb-4 lg:mb-8">
                                    <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                                      <div
                                        className="w-full h-full rounded-full border-2 sm:border-4 border-white shadow-lg"
                                        style={{ 
                                          background: conicGradient,
                                          aspectRatio: '1 / 1'
                                        }}
                                      ></div>
                                      {/* Center circle */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                          <div className="text-center">
                                            <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-700">Average</div>
                                            <div className="text-xs sm:text-sm text-gray-500">Balance Sheet</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Legend with Average Values */}
                                  <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm lg:max-w-md p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></div>
                                        <span className="text-xs sm:text-sm font-medium text-gray-600">Average Assets</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                                          €{avgAssets.toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                          {assetsPercentage.toFixed(1)}%
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
                                        <span className="text-xs sm:text-sm font-medium text-gray-600">Average Liabilities</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm sm:text-base lg:text-lg font-bold text-red-600">
                                          €{avgLiabilities.toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                          {liabilitiesPercentage.toFixed(1)}%
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded"></div>
                                        <span className="text-xs sm:text-sm font-medium text-gray-600">Average Equity</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                                          €{avgEquity.toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                          {equityPercentage.toFixed(1)}%
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Balance Sheet Table */}
                      {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800">Balance Sheet Details</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Assets</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Liabilities</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt-to-Equity</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentSlideData.content.map((item: any, index: number) => {
                                const debtToEquity = item.liabilities && item.equity ? (item.liabilities / item.equity).toFixed(2) : "N/A";
                                return (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {item.year}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                      €{item.assets?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                      €{item.liabilities?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                                      €{item.equity?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                      {debtToEquity}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  )}

                  {/* Net Financial Position Chart */}
                  {currentSlideData.title === "Net Financial Position" && (
                    <div className="space-y-6">
                      {/* Net Financial Position Line Chart */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                            Net Financial Position Trend
                          </h4>
                          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                            <div className="h-64 sm:h-80 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                              {(() => {
                                const maxValue = Math.max(...currentSlideData.content.map((item: any) => item.net_position || 0));
                                const minValue = Math.min(...currentSlideData.content.map((item: any) => item.net_position || 0));
                                const range = maxValue - minValue;
                                const step = range / 4;
                                
                                return [maxValue, maxValue - step, maxValue - (step * 2), maxValue - (step * 3), minValue].map((value, index) => (
                                  <div key={index} className="text-right">
                                    €{(value / 1000).toFixed(0)}K
                                  </div>
                                ));
                              })()}
                            </div>
                            
                            {/* Chart area */}
                            <div className="ml-12 h-full relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className="border-t border-gray-200"></div>
                                ))}
                              </div>
                              
                              {/* Data points and line */}
                              <div className="absolute inset-0 flex items-end justify-between px-4">
                                {currentSlideData.content.map((item: any, index: number) => {
                                  const maxValue = Math.max(...currentSlideData.content.map((i: any) => i.net_position || 0));
                                  const minValue = Math.min(...currentSlideData.content.map((i: any) => i.net_position || 0));
                                  const range = maxValue - minValue;
                                  const height = range > 0 ? ((item.net_position - minValue) / range) * 100 : 50;
                                  
                                  return (
                                    <div key={index} className="flex flex-col items-center group">
                                      {/* Data point */}
                                      <div 
                                        className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform"
                                        style={{ marginBottom: `${height}%` }}
                                      >
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            €{item.net_position?.toLocaleString() || "0"}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Year label */}
                                      <div className="mt-2 text-xs font-medium text-gray-600">
                                        {item.year ? `Year ${item.year}` : `Year ${index + 1}`}
                                      </div>
                                    </div>
                                  );
                                })}
                                
                                {/* Line connecting points */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                                  <polyline
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    points={currentSlideData.content.map((item: any, index: number) => {
                                      const maxValue = Math.max(...currentSlideData.content.map((i: any) => i.net_position || 0));
                                      const minValue = Math.min(...currentSlideData.content.map((i: any) => i.net_position || 0));
                                      const range = maxValue - minValue;
                                      const height = range > 0 ? ((item.net_position - minValue) / range) * 100 : 50;
                                      const x = (index / (currentSlideData.content.length - 1)) * 100;
                                      const y = 100 - height;
                                      return `${x}%,${y}%`;
                                    }).join(' ')}
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Legend */}
                          <div className="mt-4 flex justify-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-600">Net Position</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Debt Structure Table */}
                  {currentSlideData.title === "Debt Structure" && (
                    <div className="space-y-6">
                      {/* Debt Structure Table */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-800">Debt Structure Details</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment</th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non Current Assets</th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding Debt</th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt-to-Equity Ratio</th>
                                </tr>
                              </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentSlideData.content.map((item: any, index: number) => {
                                const debtToEquity = item.outstanding_debt && item.equity ? (item.outstanding_debt / item.equity).toFixed(2) : "N/A";
                                return (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                      {item.year || `Year ${index + 1}`}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-red-600 font-semibold">
                                      €{item.repayment?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600 font-semibold">
                                      {item.interest_rate || "N/A"}%
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600 font-semibold">
                                      {item.non_current_assets || "N/A"}%
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-purple-600 font-semibold">
                                      €{item.outstanding_debt?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                                      {debtToEquity}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data Tables */}
                  <div className="space-y-4">
                    {currentSlideData.content.map((item: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Year {item.year}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Financial Highlights */}
                          {item.revenue !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Revenue</p>
                              <p className="font-bold text-green-600">€{item.revenue?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.net_income !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Net Income</p>
                              <p className="font-bold text-blue-600">€{item.net_income?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.capex !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Capex</p>
                              <p className="font-bold text-purple-600">€{item.capex?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.debt_repayment !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Debt Repayment</p>
                              <p className="font-bold text-orange-600">€{item.debt_repayment?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Cash Flow Analysis */}
                          {item.operating !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Operating</p>
                              <p className="font-bold text-green-600">€{item.operating?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.investing !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Investing</p>
                              <p className="font-bold text-red-600">€{item.investing?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.financing !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Financing</p>
                              <p className="font-bold text-purple-600">€{item.financing?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.net_cash !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Net Cash</p>
                              <p className="font-bold text-blue-600">€{item.net_cash?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Profit & Loss */}
                          {item.cogs !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">COGS</p>
                              <p className="font-bold text-red-600">€{item.cogs?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.gross_profit !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Gross Profit</p>
                              <p className="font-bold text-blue-600">€{item.gross_profit?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.ebitda !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">EBITDA</p>
                              <p className="font-bold text-purple-600">€{item.ebitda?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Balance Sheet */}
                          {item.assets !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Total Assets</p>
                              <p className="font-bold text-green-600">€{item.assets?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.current_assets !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Current Assets</p>
                              <p className="font-bold text-blue-600">€{item.current_assets?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.liabilities !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Total Liabilities</p>
                              <p className="font-bold text-red-600">€{item.liabilities?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.equity !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Equity</p>
                              <p className="font-bold text-purple-600">€{item.equity?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Key Ratios */}
                          {item.roi !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">ROI</p>
                              <p className="font-bold text-green-600">{(item.roi * 100)?.toFixed(1) || "N/A"}%</p>
                            </div>
                          )}
                          {item.roe !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">ROE</p>
                              <p className="font-bold text-blue-600">{(item.roe * 100)?.toFixed(1) || "N/A"}%</p>
                            </div>
                          )}
                          {item.gross_margin !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Gross Margin</p>
                              <p className="font-bold text-purple-600">{(item.gross_margin * 100)?.toFixed(1) || "N/A"}%</p>
                            </div>
                          )}
                          {item.current_ratio !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Current Ratio</p>
                              <p className="font-bold text-orange-600">{item.current_ratio?.toFixed(2) || "N/A"}</p>
                            </div>
                          )}
                          {/* Operating Cost Breakdown */}
                          {item.employee_costs !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Employee Costs</p>
                              <p className="font-bold text-blue-600">€{item.employee_costs?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.marketing !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Marketing</p>
                              <p className="font-bold text-green-600">€{item.marketing?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.rent !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Rent</p>
                              <p className="font-bold text-purple-600">€{item.rent?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.administration !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Administration</p>
                              <p className="font-bold text-orange-600">€{item.administration?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Net Financial Position */}
                          {item.net_position !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Net Position</p>
                              <p className="font-bold text-teal-600">€{item.net_position?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {/* Debt Structure */}
                          {item.repayment !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Repayment</p>
                              <p className="font-bold text-red-600">€{item.repayment?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                          {item.interest_rate !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Interest Rate</p>
                              <p className="font-bold text-blue-600">{item.interest_rate || "N/A"}%</p>
                            </div>
                          )}
                          {item.non_current_assets !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Non Current Assets</p>
                              <p className="font-bold text-blue-600">{item.non_current_assets || "N/A"}%</p>
                            </div>
                          )}
                          {item.outstanding_debt !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Outstanding Debt</p>
                              <p className="font-bold text-purple-600">€{item.outstanding_debt?.toLocaleString() || "N/A"}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentSlideData.content}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No slides available */}
          {totalSlides === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Plan Data Available
              </h3>
              <p className="text-gray-500">
                This plan doesn't have any content to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanSlideModal;