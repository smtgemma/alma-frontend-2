"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar/Navbar";
import { IoIosShareAlt, IoIosDownload, IoIosEye } from "react-icons/io";
import { MdEdit, MdCheckCircle, MdSchedule } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { GrDownload } from "react-icons/gr";
import GeneratedBusinessPlanforAdmin from "./GeneratedBusinessPlanforAdmin";
import FinancialDashboard from "../generated-plans-graph/FinancialHighlights";
import MarketingDashboard from "../generated-plans-graph/Marketing";
import OperationsDashboard from "../generated-plans-graph/OperationPlan";
import DebtDashboard from "../generated-plans-graph/DebtStructure";
import BalanceSheet from "../generated-plans-graph/BalanceSheet";

interface PlanApprovedbyAdminProps {
    businessPlan?: {
        businessOverview?: string;
        businessOrigins?: string;
        competitiveAdvantage?: string;
        approvedAt?: string;
        approvedBy?: string;
        planId?: string;
        businessName?: string;
        industry?: string;
        targetMarket?: string;
        financialProjections?: string;
        marketingStrategy?: string;
        riskAnalysis?: string;
    };
    executiveSummary?: string;
    businessOverview?: string;
    marketAnalysis?: string;
    financialHighlights?: any[];
    businessModel?: string;
    cashFlowAnalysis?: any[];
    marketingSalesStrategy?: string;
    profitLossProjection?: any[];
    sectorStrategy?: string;
    balanceSheet?: any[];
    netFinancialPosition?: any[];
    debtStructure?: any[];
    fundingSources?: string;
    operationsPlan?: string;
    keyRatios?: any[];
    operatingCostBreakdown?: any[];
}

const PlanApprovedbyAdmin: React.FC<PlanApprovedbyAdminProps> = ({
    businessPlan,
    executiveSummary,
    businessOverview,
    marketAnalysis,
    financialHighlights,
    businessModel,
    cashFlowAnalysis,
    marketingSalesStrategy,
    profitLossProjection,
    sectorStrategy,
    balanceSheet,
    netFinancialPosition,
    debtStructure,
    fundingSources,
    operationsPlan,
    keyRatios,
    operatingCostBreakdown
}) => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [copied, setCopied] = useState(false);

    // Default content if no business plan data is provided
    const defaultContent = {
        businessOverview: "Our innovative tech startup focuses on revolutionizing the way businesses handle customer relationships through AI-powered automation. We combine cutting-edge machine learning algorithms with intuitive user interfaces to create seamless customer experiences that drive growth and retention. Our platform serves multiple user types including small businesses, enterprise clients, and individual entrepreneurs, providing scalable solutions that adapt to various business needs and market positions.",
        businessOrigins: "Founded in 2023 by a team of experienced entrepreneurs and AI researchers, our company emerged from the growing need for businesses to leverage artificial intelligence in customer service. After witnessing the inefficiencies in traditional CRM systems, we set out to create a solution that would transform how companies interact with their customers. Our journey began with extensive market research and user interviews, leading to the development of a platform that addresses real pain points in customer relationship management.",
        competitiveAdvantage: "Our unique approach combines proprietary AI algorithms with industry-specific knowledge bases, allowing us to provide personalized solutions that adapt to each business's unique needs. Unlike competitors who offer one-size-fits-all solutions, our platform learns and evolves with your business, continuously improving performance and ROI. We maintain a competitive edge through continuous innovation, strategic partnerships, and a deep understanding of market dynamics.",
        approvedAt: "2024-01-15",
        approvedBy: "Admin Team",
        planId: "BP-2024-001",
        businessName: "TechFlow Solutions",
        industry: "Technology",
        targetMarket: "Small to Medium Businesses",
        financialProjections: "Projected revenue growth of 300% over 3 years with strong market penetration in the SaaS sector.",
        marketingStrategy: "Multi-channel approach including digital marketing, partnerships, and thought leadership content.",
        riskAnalysis: "Market competition and technology evolution are primary risks, mitigated through continuous innovation and customer feedback loops."
    };


    const content = businessPlan || defaultContent;
    const approvedDate = content.approvedAt || "2024-01-15";
    const approvedBy = content.approvedBy || "Admin Team";
    
    // Default values for the new props
    const defaultProps = {
        executiveSummary: executiveSummary || content.businessOverview || "",
        businessOverview: businessOverview || content.businessOverview || "",
        marketAnalysis: marketAnalysis || content.competitiveAdvantage || "",
        financialHighlights: financialHighlights || [],
        businessModel: businessModel || "",
        cashFlowAnalysis: cashFlowAnalysis || [],
        marketingSalesStrategy: marketingSalesStrategy || content.marketingStrategy || "",
        profitLossProjection: profitLossProjection || [],
        sectorStrategy: sectorStrategy || "",
        balanceSheet: balanceSheet || [],
        netFinancialPosition: netFinancialPosition || [],
        debtStructure: debtStructure || [],
        fundingSources: fundingSources || "",
        operationsPlan: operationsPlan || content.businessOrigins || "",
        keyRatios: keyRatios || [],
        operatingCostBreakdown: operatingCostBreakdown || []
    };

    // Handle scroll to show/hide scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Copy plan ID to clipboard
    const copyPlanId = async () => {
        try {
            await navigator.clipboard.writeText(content.planId || "BP-2024-001");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header Section */}
            <header className="  px-4 py-6 sm:px-6 lg:px-8 pt-28">
                <div className="max-w-[1440px] mx-auto">
                    <h2 className="text-xl sm:text-2xl text-center font-semibold text-[#015BE9] mb-2">
                        ✨ Congratulations! Your Business Plan Is Ready!
                    </h2>

                </div>
            </header>

            {/* Expert Review Section */}
            <section className=" ">
                <div className="max-w-[1440px] mx-auto border-b border-gray-300">
                    <div className="  px-4 py-8 md:px-4  ">
                        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6">
                            {/* Left Content */}
                            <div className="flex-1">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                    Expert's Review
                                </h3>
                                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                                    Reviewed by industry professionals to ensure accuracy, strategy, and <br /> investor readiness.
                                    Actionable insights included.
                                </p>
                                <Link href="/request-consultation">
                                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                                        View Expert Review
                                    </button>

                                </Link>
                            </div>

                            {/* Right Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-44 h-44  rounded-full flex items-center justify-center">
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                                        <Image src="/images/approve.png" alt="Expert" width={200} height={200} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div id="businessplan" className="max-w-[1440px] mx-4 xl:mx-auto">
                <GeneratedBusinessPlanforAdmin executiveSummary={defaultProps.executiveSummary} businessOverview={defaultProps.businessOverview} marketAnalysis={defaultProps.marketAnalysis} />
                <FinancialDashboard financialHighlights={defaultProps.financialHighlights} businessModel={defaultProps.businessModel} cashFlowAnalysis={defaultProps.cashFlowAnalysis} />
                <MarketingDashboard marketingSalesStrategy={defaultProps.marketingSalesStrategy} profitLossProjection={defaultProps.profitLossProjection} sectorStrategy={defaultProps.sectorStrategy}/>
                <BalanceSheet balanceSheet={defaultProps.balanceSheet} netFinancialPosition={defaultProps.netFinancialPosition} />
                <DebtDashboard debtStructure={defaultProps.debtStructure}  fundingSources={defaultProps.fundingSources}/>
                <OperationsDashboard operationsPlan={defaultProps.operationsPlan} keyRatios={defaultProps.keyRatios} operatingCostBreakdown={defaultProps.operatingCostBreakdown}/>
                <p className="text-base font-normal text-[#B6BEC8] text-center py-10">This plan document is generated and secured by [BusinessplanAI]. <br />
                Unauthorized sharing or reproduction is strictly prohibited.</p>
            </div>


            {/* ----------------------------- ------------------------ */}


            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="w-14 h-14 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg transition-colors flex items-center justify-center text-white"
                        aria-label="Scroll to top"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                )}

                {/* Edit Plan Button */}
                <Link href="">
                    <button
                        className="w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors flex items-center justify-center text-white"
                        aria-label="Edit plan"
                    >
                        <GrDownload className="w-6 h-6" />
                    </button>
                </Link>


            </div>
        </div>
    );
};

export default PlanApprovedbyAdmin;