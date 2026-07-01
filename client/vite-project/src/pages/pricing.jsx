import React from "react";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";


function Pricing() {
    // Pricing States
    const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
    
    return (
        <>
            {/* PRICING SECTION */}
            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Flexible Plans Built for Growth</h2>
                    <p className="text-neutral-400">Upgrade to unlock advanced AI avatars, custom profile matches, and unlimited coaching audits.</p>

                    {/* Toggle Billing */}
                    <div className="inline-flex items-center gap-2.5 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${billingCycle === "monthly" ? "bg-violet-600 text-white shadow-md" : "text-neutral-400 hover:text-neutral-200"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${billingCycle === "yearly" ? "bg-violet-600 text-white shadow-md" : "text-neutral-400 hover:text-neutral-200"}`}
                        >
                            Yearly <span className="text-[10px] text-violet-300 font-extrabold bg-violet-950 px-1.5 py-0.5 rounded-full ml-1">Save 20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <div className="bg-neutral-900/30 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-neutral-700 transition">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Free Starter</p>
                            <div className="space-y-1">
                                <span className="text-4xl font-extrabold text-white">$0</span>
                                <span className="text-sm text-neutral-500"> / month</span>
                            </div>
                            <p className="text-sm text-neutral-400">Core exploration toolset for candidates discovering the platform.</p>
                        </div>

                        <div className="border-t border-neutral-800 pt-6">
                            <ul className="space-y-3 text-sm text-neutral-300">
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> 3 Resume Scans / Mo
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> 1 AI Interview Session
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Standard Job Board Access
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => window.location.href = "/auth"}
                            variant="outline"
                            className="w-full h-11 border-neutral-800 text-white hover:bg-neutral-800 cursor-pointer"
                        >
                            Start For Free
                        </Button>
                    </div>

                    {/* Pro Tier (Popular) */}
                    <div className="bg-neutral-900/60 border-2 border-violet-600 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:shadow-[0_0_30px_rgba(109,40,217,0.25)] transition">
                        <div className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full">
                            Most Popular
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Career Pro</p>
                            <div className="space-y-1">
                                <span className="text-4xl font-extrabold text-white">
                                    {billingCycle === "monthly" ? "$19" : "$15"}
                                </span>
                                <span className="text-sm text-neutral-400"> / month</span>
                            </div>
                            <p className="text-sm text-neutral-300">Premium comprehensive tools for candidates actively seeking placements.</p>
                        </div>

                        <div className="border-t border-neutral-850 pt-6">
                            <ul className="space-y-3 text-sm text-neutral-200">
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Unlimited Resume Matches
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Unlimited AI Mock Interviews
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Access all AI coach avatars
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Direct Resume Editor Export
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => window.location.href = "/auth"}
                            className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer"
                        >
                            Unlock Pro Access
                        </Button>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="bg-neutral-900/30 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-neutral-700 transition">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Unlimited Scale</p>
                            <div className="space-y-1">
                                <span className="text-4xl font-extrabold text-white">
                                    {billingCycle === "monthly" ? "$49" : "$39"}
                                </span>
                                <span className="text-sm text-neutral-500"> / month</span>
                            </div>
                            <p className="text-sm text-neutral-400">Enterprise tools for agencies, universities and career placement squads.</p>
                        </div>

                        <div className="border-t border-neutral-800 pt-6">
                            <ul className="space-y-3 text-sm text-neutral-300">
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Everything in Career Pro
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Dedicated cohort reporting
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> API integration endpoints
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-4 text-violet-400" /> Custom branding setups
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => window.location.href = "/auth"}
                            variant="outline"
                            className="w-full h-11 border-neutral-800 text-white hover:bg-neutral-800 cursor-pointer"
                        >
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pricing