import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
    const features = [
        {
            icon: "📁",
            title: "Project Upload",
            desc: "Upload real-world repositories and prepare them for structured AI reuse analysis.",
        },
        {
            icon: "⚡",
            title: "AI Experiments",
            desc: "Run controlled experiments to evaluate how models generate, adapt, and reuse code.",
        },
        {
            icon: "👥",
            title: "Code Reuse Analysis",
            desc: "Measure whether AI reuses existing components or rewrites logic from scratch.",
        },
        {
            icon: "🎯",
            title: "Comparison Engine",
            desc: "Compare multiple experiment runs side by side with clear result tracking.",
        },
        {
            icon: "📊",
            title: "Analytics Dashboard",
            desc: "Visualize reuse rates, failures, confidence, and overall experiment performance.",
        },
        {
            icon: "🧠",
            title: "Context Control",
            desc: "Test how different context windows impact AI decision-making and code reuse.",
        },
        {
            icon: "💬",
            title: "Logs & Debugging",
            desc: "Inspect prompts, outputs, and runtime logs to better understand model behavior.",
        },
        {
            icon: "📦",
            title: "Project Snapshots",
            desc: "Run experiments safely using isolated snapshots without damaging source code.",
        },
    ];

    const steps = [
        {
            number: "1",
            icon: "📂",
            title: "Upload your project",
            desc: "Import your real software project so the platform can understand its structure, files, and reusable components.",
        },
        {
            number: "2",
            icon: "⚙️",
            title: "Configure experiment",
            desc: "Choose prompts, context size, and task settings to test how the AI behaves in different reuse scenarios.",
        },
        {
            number: "3",
            icon: "🤖",
            title: "Run AI analysis",
            desc: "The system evaluates generated code and checks whether the model reused existing logic or rewrote it.",
        },
        {
            number: "4",
            icon: "📈",
            title: "Review insights",
            desc: "Compare outputs, inspect logs, and analyze reuse quality through clear metrics and research-grade results.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B1D17] text-white overflow-hidden">
            {/* NAVBAR */}
            <Navbar />
            {/* ================= HERO ================= */}
            <div className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-44">
                <div className="absolute w-[600px] h-[600px] bg-[#4ADE80]/20 blur-[140px] rounded-full top-0"></div>

                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl z-10"
                >
                    AI-powered platform that{" "}
                    <span className="relative inline-block text-[#86EFAC]">
                        reuses code
                        <span className="absolute left-0 right-0 bottom-1 h-2 bg-[#4ADE80]/30 rounded-full blur-sm"></span>
                    </span>{" "}
                    intelligently
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-lg text-[#D1D5DB] max-w-2xl z-10"
                >
                    Upload real-world projects, run AI experiments, and analyze how
                    code is reused instead of rewritten. Build smarter systems.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 flex gap-4 flex-wrap justify-center z-10"
                >
                    <Link
                        to="/register"
                        className="bg-[#4ADE80] text-black px-7 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(74,222,128,0.6)] transition"
                    >
                        Start Experimenting 🚀
                    </Link>

                    <Link
                        to="/login"
                        className="bg-white/10 border border-white/20 px-7 py-3 rounded-lg hover:bg-white/20 transition"
                    >
                        Login
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-sm text-white/50 z-10"
                >
                    ✔ AI-powered analysis • ✔ Real project testing • ✔ Research-grade insights
                </motion.div>
            </div>

            {/* ================= FEATURES ================= */}
            <section className="relative py-28 px-6 bg-[#EEEEEE] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#4ADE80]/10 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-10 right-0 w-[260px] h-[260px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-6xl mx-auto text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border border-[#22C55E]/20 bg-white/80 text-[#15803D] backdrop-blur-md shadow-sm"
                    >
                        ✦ Our Features
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-6 text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        <span className="text-[#111827]">Built for </span>
                        <span className="text-[#16A34A]">serious AI code reuse research</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-5 text-[#4B5563] max-w-2xl mx-auto text-lg leading-8"
                    >
                        A premium experimentation environment where you can upload projects,
                        control AI context, compare outputs, and deeply inspect how reuse
                        actually happens inside real software systems.
                    </motion.p>
                </div>

                <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.07 }}
                            className="group relative rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:border-[#22C55E] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_0_30px_rgba(34,197,94,0.18),0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#22C55E]/0 via-transparent to-[#22C55E]/0 group-hover:from-[#22C55E]/[0.04] pointer-events-none transition-all duration-300"></div>

                            <div className="relative mb-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-[#22C55E]/20 bg-[#F8FAFC] shadow-inner group-hover:border-[#22C55E]/60 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.18)] transition-all duration-300">
                                    {item.icon}
                                </div>
                            </div>

                            <h3 className="relative text-xl font-semibold text-[#111827] group-hover:text-[#15803D] transition-colors duration-300">
                                {item.title}
                            </h3>

                            <p className="relative mt-3 text-sm leading-7 text-[#6B7280] group-hover:text-[#374151] transition-colors duration-300">
                                {item.desc}
                            </p>

                            <div className="relative mt-6 h-[2px] w-12 bg-[#D1D5DB] group-hover:w-20 group-hover:bg-[#22C55E] transition-all duration-300 rounded-full"></div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative text-center text-[#6B7280] mt-14 text-sm"
                >
                    Designed for developers, researchers, and teams building intelligent software systems.
                </motion.p>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="relative bg-[#EEEEEE] px-6 pb-28 overflow-hidden">
                {/* soft background glow like feature section */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[720px] h-[260px] bg-[#4ADE80]/10 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-10 left-10 w-[260px] h-[260px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-20 right-10 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-7xl mx-auto rounded-[36px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.10)] border border-white/70 bg-white">
                    {/* Top header with green premium styling */}
                    <div className="relative bg-gradient-to-r from-[#0F1F19] via-[#133126] to-[#10261D] px-6 pt-20 pb-40 text-center overflow-hidden">
                        <div className="absolute -top-10 left-10 w-40 h-40 bg-[#4ADE80]/10 blur-3xl rounded-full"></div>
                        <div className="absolute top-10 right-10 w-52 h-52 bg-[#86EFAC]/10 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[140px] bg-[#22C55E]/10 blur-[100px] rounded-full"></div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative text-4xl md:text-5xl font-bold"
                        >
                            <span className="text-white">How It </span>
                            <span className="text-[#86EFAC]">Works</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="relative mt-5 text-white/75 text-lg max-w-2xl mx-auto leading-8"
                        >
                            A simple step-by-step workflow to test, measure, and understand
                            AI-based code reuse inside real software projects.
                        </motion.p>
                    </div>

                    {/* Cards */}
                    <div className="relative px-6 md:px-10 lg:px-14 pb-16 -mt-24">
                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="group relative bg-white rounded-[24px] px-6 pt-12 pb-8 text-center border border-[#D1D5DB] shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-[#22C55E] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_0_30px_rgba(34,197,94,0.18),0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300"
                                >
                                    {/* hover overlay like features */}
                                    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-[#22C55E]/0 via-transparent to-[#22C55E]/0 group-hover:from-[#22C55E]/[0.04] pointer-events-none transition-all duration-300"></div>

                                    {/* Step Number */}
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-[3px] border-[#22C55E] bg-white text-[#15803D] font-bold flex items-center justify-center shadow-[0_8px_22px_rgba(34,197,94,0.18)]">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="relative mx-auto w-20 h-20 rounded-full border border-[#22C55E]/20 bg-[#F8FAFC] flex items-center justify-center text-4xl shadow-inner group-hover:border-[#22C55E]/60 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.18)] group-hover:scale-105 transition-all duration-300">
                                        {step.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="relative mt-6 text-xl font-bold text-[#111827] leading-snug group-hover:text-[#15803D] transition-colors duration-300">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="relative mt-4 text-sm leading-7 text-[#6B7280] group-hover:text-[#374151] transition-colors duration-300">
                                        {step.desc}
                                    </p>

                                    {/* bottom accent line */}
                                    <div className="relative mt-6 mx-auto h-[2px] w-12 bg-[#D1D5DB] group-hover:w-20 group-hover:bg-[#22C55E] transition-all duration-300 rounded-full"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= USE CASE / WHY THIS MATTERS ================= */}
            <section className="relative bg-[#EEEEEE] px-6 pb-28 overflow-hidden">
                {/* soft glow background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[680px] h-[240px] bg-[#4ADE80]/10 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-0 left-10 w-[260px] h-[260px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-20 right-10 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border border-[#22C55E]/20 bg-white/80 text-[#15803D] backdrop-blur-md shadow-sm"
                        >
                            ✦ Why This Matters
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-6 text-4xl md:text-5xl font-bold tracking-tight"
                        >
                            <span className="text-[#111827]">Real value for </span>
                            <span className="text-[#16A34A]">developers, teams, and researchers</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-5 text-[#4B5563] max-w-2xl mx-auto text-lg leading-8"
                        >
                            This platform is not only about running AI experiments — it helps reduce waste,
                            improve software quality, and better understand how intelligent systems behave
                            inside real-world projects.
                        </motion.p>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: "🧩",
                                title: "Avoid code duplication",
                                desc: "Identify when AI reuses existing logic properly and when it unnecessarily rewrites code, helping reduce duplication across software systems.",
                            },
                            {
                                icon: "✅",
                                title: "Improve software quality",
                                desc: "Better reuse decisions can lead to cleaner architecture, fewer inconsistencies, and more maintainable code in real development environments.",
                            },
                            {
                                icon: "⏱️",
                                title: "Save developer time",
                                desc: "Developers and teams can spend less time manually reviewing repeated implementations and more time focusing on higher-value work.",
                            },
                            {
                                icon: "🔬",
                                title: "Research AI behavior",
                                desc: "The platform provides a controlled way to study how AI understands project context, selects reusable code, and adapts it to new requirements.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="group relative rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:border-[#22C55E] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_0_30px_rgba(34,197,94,0.18),0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#22C55E]/0 via-transparent to-[#22C55E]/0 group-hover:from-[#22C55E]/[0.04] pointer-events-none transition-all duration-300"></div>

                                <div className="relative mb-5">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-[#22C55E]/20 bg-[#F8FAFC] shadow-inner group-hover:border-[#22C55E]/60 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.18)] transition-all duration-300">
                                        {item.icon}
                                    </div>
                                </div>

                                <h3 className="relative text-xl font-semibold text-[#111827] group-hover:text-[#15803D] transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="relative mt-3 text-sm leading-7 text-[#6B7280] group-hover:text-[#374151] transition-colors duration-300">
                                    {item.desc}
                                </p>

                                <div className="relative mt-6 h-[2px] w-12 bg-[#D1D5DB] group-hover:w-20 group-hover:bg-[#22C55E] transition-all duration-300 rounded-full"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= ANALYTICS PREVIEW ================= */}
            <section className="relative bg-[#EEEEEE] px-6 pb-28 overflow-hidden">
                {/* soft background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[680px] h-[240px] bg-[#4ADE80]/10 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-0 left-10 w-[260px] h-[260px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-20 right-10 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border border-[#22C55E]/20 bg-white/80 text-[#15803D] backdrop-blur-md shadow-sm"
                        >
                            ✦ Analytics Preview
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-6 text-4xl md:text-5xl font-bold tracking-tight"
                        >
                            <span className="text-[#111827]">See the insights </span>
                            <span className="text-[#16A34A]">your platform can reveal</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-5 text-[#4B5563] max-w-2xl mx-auto text-lg leading-8"
                        >
                            Even before backend integration, this preview shows the type of
                            analytics users will get — including experiment outcomes, reuse scores,
                            logs, and performance summaries.
                        </motion.p>
                    </div>

                    {/* Main Layout */}
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                        {/* Left: stat cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: "✅",
                                    title: "Success Rate",
                                    value: "82%",
                                    desc: "Experiments where the AI reused code successfully.",
                                },
                                {
                                    icon: "❌",
                                    title: "Fail Rate",
                                    value: "18%",
                                    desc: "Cases where reuse failed or code was rewritten poorly.",
                                },
                                {
                                    icon: "📝",
                                    title: "Logs Tracked",
                                    value: "124",
                                    desc: "Prompts, responses, and runtime events captured clearly.",
                                },
                                {
                                    icon: "🎯",
                                    title: "Average Score",
                                    value: "8.6/10",
                                    desc: "Overall reuse quality score based on evaluation metrics.",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="group relative rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:border-[#22C55E] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_0_30px_rgba(34,197,94,0.18),0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#22C55E]/0 via-transparent to-[#22C55E]/0 group-hover:from-[#22C55E]/[0.04] pointer-events-none transition-all duration-300"></div>

                                    <div className="relative mb-5">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-[#22C55E]/20 bg-[#F8FAFC] shadow-inner group-hover:border-[#22C55E]/60 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.18)] transition-all duration-300">
                                            {item.icon}
                                        </div>
                                    </div>

                                    <p className="relative text-sm font-medium text-[#6B7280]">
                                        {item.title}
                                    </p>

                                    <h3 className="relative mt-2 text-3xl font-bold text-[#111827] group-hover:text-[#15803D] transition-colors duration-300">
                                        {item.value}
                                    </h3>

                                    <p className="relative mt-3 text-sm leading-7 text-[#6B7280] group-hover:text-[#374151] transition-colors duration-300">
                                        {item.desc}
                                    </p>

                                    <div className="relative mt-6 h-[2px] w-12 bg-[#D1D5DB] group-hover:w-20 group-hover:bg-[#22C55E] transition-all duration-300 rounded-full"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: fake dashboard preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="relative rounded-[28px] border border-[#D1D5DB] bg-white p-6 md:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                        >
                            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-[#22C55E]/[0.03] via-transparent to-transparent pointer-events-none"></div>

                            {/* Dashboard header */}
                            <div className="relative flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-[#6B7280]">Experiment Dashboard</p>
                                    <h3 className="text-2xl font-bold text-[#111827]">
                                        AI Reuse Summary
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
                                    <span className="text-sm text-[#6B7280]">Live Preview</span>
                                </div>
                            </div>

                            {/* fake mini summary row */}
                            <div className="relative grid grid-cols-3 gap-4 mb-6">
                                <div className="rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-4">
                                    <p className="text-xs text-[#6B7280]">Runs</p>
                                    <p className="mt-1 text-xl font-bold text-[#111827]">48</p>
                                </div>
                                <div className="rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-4">
                                    <p className="text-xs text-[#6B7280]">Reuse Score</p>
                                    <p className="mt-1 text-xl font-bold text-[#111827]">86%</p>
                                </div>
                                <div className="rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-4">
                                    <p className="text-xs text-[#6B7280]">Errors</p>
                                    <p className="mt-1 text-xl font-bold text-[#111827]">06</p>
                                </div>
                            </div>

                            {/* fake bars */}
                            <div className="relative mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#111827]">Success rate</span>
                                    <span className="text-sm text-[#15803D] font-semibold">82%</span>
                                </div>
                                <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                                    <div className="h-full w-[82%] bg-gradient-to-r from-[#22C55E] to-[#86EFAC] rounded-full"></div>
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#111827]">Fail rate</span>
                                    <span className="text-sm text-[#DC2626] font-semibold">18%</span>
                                </div>
                                <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                                    <div className="h-full w-[18%] bg-gradient-to-r from-[#F87171] to-[#EF4444] rounded-full"></div>
                                </div>
                            </div>

                            {/* logs list */}
                            <div className="relative rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-[#111827]">Recent Logs</h4>
                                    <span className="text-xs text-[#6B7280]">Last 4 events</span>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { status: "Success", text: "Experiment #12 reused existing module correctly." },
                                        { status: "Warning", text: "Experiment #14 rewrote helper logic instead of reusing it." },
                                        { status: "Success", text: "Experiment #15 selected the best reusable component." },
                                        { status: "Score", text: "Experiment #16 received reuse quality score: 9.1/10." },
                                    ].map((log, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 rounded-xl bg-white border border-[#E5E7EB] p-3"
                                        >
                                            <div
                                                className={`mt-1 w-2.5 h-2.5 rounded-full ${log.status === "Success"
                                                    ? "bg-[#22C55E]"
                                                    : log.status === "Warning"
                                                        ? "bg-[#F59E0B]"
                                                        : "bg-[#3B82F6]"
                                                    }`}
                                            ></div>

                                            <div>
                                                <p className="text-sm font-medium text-[#111827]">
                                                    {log.status}
                                                </p>
                                                <p className="text-sm text-[#6B7280] leading-6">
                                                    {log.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= COMPARISON SECTION ================= */}
            <section className="relative bg-[#EEEEEE] px-6 pb-28 overflow-hidden">
                {/* soft background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[760px] h-[260px] bg-[#4ADE80]/10 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-0 left-10 w-[280px] h-[280px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-24 right-10 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border border-[#22C55E]/20 bg-white/80 text-[#15803D] backdrop-blur-md shadow-sm"
                        >
                            ✦ Context Comparison
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-6 text-4xl md:text-5xl font-bold tracking-tight"
                        >
                            <span className="text-[#111827]">See how </span>
                            <span className="text-[#16A34A]">different context sizes change AI results</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-5 text-[#4B5563] max-w-3xl mx-auto text-lg leading-8"
                        >
                            This is the core research value of the platform. Compare how the same task behaves
                            under limited context and full project context to discover when AI fails, when it
                            duplicates code, and when it successfully reuses the right components.
                        </motion.p>
                    </div>

                    {/* Top task summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="mb-8 rounded-[28px] border border-[#D1D5DB] bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <p className="text-sm font-medium text-[#6B7280]">Sample Research Task</p>
                                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-[#111827]">
                                    Add user authentication to an existing backend module
                                </h3>
                                <p className="mt-3 text-[#6B7280] leading-7 max-w-3xl">
                                    The platform runs the same development task under different context conditions
                                    and evaluates whether the AI reuses the existing authentication logic or creates
                                    unnecessary duplicate code.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="rounded-full border border-[#22C55E]/20 bg-[#F0FDF4] px-4 py-2 text-sm font-medium text-[#15803D]">
                                    Same task
                                </span>
                                <span className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#374151]">
                                    Different context
                                </span>
                                <span className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#374151]">
                                    Measurable results
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Comparison cards */}
                    <div className="grid xl:grid-cols-2 gap-8">
                        {/* Small Context */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55 }}
                            className="group relative rounded-[30px] border border-[#D1D5DB] bg-white p-6 md:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#F87171] transition-all duration-300"
                        >
                            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-b from-[#EF4444]/[0.03] via-transparent to-transparent pointer-events-none"></div>

                            <div className="relative flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-[#6B7280]">Experiment A</p>
                                    <h3 className="text-2xl font-bold text-[#111827] mt-1">
                                        Small Context
                                    </h3>
                                    <p className="text-sm text-[#6B7280] mt-2">
                                        Only partial files and limited prompt context were provided.
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-2 rounded-full border border-[#FCA5A5]/30 bg-[#FEF2F2] px-4 py-2 text-sm font-semibold text-[#DC2626]">
                                    ❌ Weak Result
                                </span>
                            </div>

                            <div className="relative grid sm:grid-cols-3 gap-4 mb-6">
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Reuse Score</p>
                                    <p className="mt-2 text-xl font-bold text-[#111827]">41%</p>
                                </div>
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Duplication Risk</p>
                                    <p className="mt-2 text-xl font-bold text-[#DC2626]">68%</p>
                                </div>
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Confidence</p>
                                    <p className="mt-2 text-xl font-bold text-[#111827]">Low</p>
                                </div>
                            </div>

                            <div className="relative space-y-4 mb-6">
                                <div className="rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] p-4">
                                    <p className="text-sm font-semibold text-[#B91C1C]">Observed behavior</p>
                                    <p className="mt-2 text-sm text-[#7F1D1D] leading-6">
                                        The model generated a new authentication flow instead of reusing the
                                        shared auth service that already existed in the project.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-sm font-semibold text-[#111827]">Problems detected</p>
                                    <ul className="mt-3 space-y-2 text-sm text-[#6B7280] leading-6">
                                        <li>• Duplicated login validation logic</li>
                                        <li>• Ignored existing reusable auth module</li>
                                        <li>• Higher risk of inconsistent implementation</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#111827]">Outcome quality</span>
                                    <span className="text-sm font-semibold text-[#DC2626]">Below expected</span>
                                </div>
                                <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                                    <div className="h-full w-[41%] bg-gradient-to-r from-[#F87171] to-[#EF4444] rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Full Context */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.08 }}
                            className="group relative rounded-[30px] border border-[#D1D5DB] bg-white p-6 md:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#22C55E] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_0_30px_rgba(34,197,94,0.12),0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300"
                        >
                            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-b from-[#22C55E]/[0.03] via-transparent to-transparent pointer-events-none"></div>

                            <div className="relative flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-[#6B7280]">Experiment B</p>
                                    <h3 className="text-2xl font-bold text-[#111827] mt-1">
                                        Full Context
                                    </h3>
                                    <p className="text-sm text-[#6B7280] mt-2">
                                        The model received broader project structure, reusable modules, and related files.
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/20 bg-[#F0FDF4] px-4 py-2 text-sm font-semibold text-[#15803D]">
                                    ✅ Strong Result
                                </span>
                            </div>

                            <div className="relative grid sm:grid-cols-3 gap-4 mb-6">
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Reuse Score</p>
                                    <p className="mt-2 text-xl font-bold text-[#111827]">91%</p>
                                </div>
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Duplication Risk</p>
                                    <p className="mt-2 text-xl font-bold text-[#15803D]">09%</p>
                                </div>
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-xs text-[#6B7280]">Confidence</p>
                                    <p className="mt-2 text-xl font-bold text-[#111827]">High</p>
                                </div>
                            </div>

                            <div className="relative space-y-4 mb-6">
                                <div className="rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
                                    <p className="text-sm font-semibold text-[#166534]">Observed behavior</p>
                                    <p className="mt-2 text-sm text-[#166534] leading-6">
                                        The model identified the shared authentication service, adapted it to the
                                        new task, and integrated the solution with much less duplication.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                                    <p className="text-sm font-semibold text-[#111827]">Strengths detected</p>
                                    <ul className="mt-3 space-y-2 text-sm text-[#6B7280] leading-6">
                                        <li>• Correctly reused existing auth module</li>
                                        <li>• Preserved project consistency</li>
                                        <li>• Reduced duplicate implementation risk</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#111827]">Outcome quality</span>
                                    <span className="text-sm font-semibold text-[#15803D]">Research-grade result</span>
                                </div>
                                <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                                    <div className="h-full w-[91%] bg-gradient-to-r from-[#22C55E] to-[#86EFAC] rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom conclusion strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="mt-8 rounded-[28px] border border-[#D1D5DB] bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                    >
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
                            <div>
                                <p className="text-sm font-medium text-[#6B7280]">Research Insight</p>
                                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-[#111827]">
                                    Better context leads to better code reuse decisions
                                </h3>
                                <p className="mt-4 text-[#6B7280] leading-7">
                                    This comparison demonstrates the main research objective of the platform:
                                    understanding how prompt engineering and context size influence whether AI
                                    reuses existing software components or introduces unnecessary duplication.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                                    <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                                        Main Finding
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-[#111827]">
                                        Full context improved reuse reliability
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                                    <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                                        Platform Value
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-[#111827]">
                                        Turns AI output into measurable research evidence
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="relative bg-[#EEEEEE] px-6 pb-28 overflow-hidden">
                {/* ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[280px] bg-[#4ADE80]/10 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-0 left-12 w-[260px] h-[260px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-10 right-10 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-6xl mx-auto rounded-[34px] overflow-hidden border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.10)]"
                >
                    {/* premium dark block */}
                    <div className="relative bg-gradient-to-r from-[#0F1F19] via-[#133126] to-[#10261D] px-6 md:px-10 py-14 md:py-16 text-center overflow-hidden">
                        <div className="absolute -top-16 left-10 w-48 h-48 bg-[#4ADE80]/10 blur-3xl rounded-full"></div>
                        <div className="absolute top-0 right-10 w-56 h-56 bg-[#86EFAC]/10 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[140px] bg-[#22C55E]/10 blur-[100px] rounded-full"></div>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="relative inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border border-[#4ADE80]/20 bg-white/5 text-[#86EFAC] backdrop-blur-md shadow-[0_0_20px_rgba(74,222,128,0.08)]"
                        >
                            ✦ Start Your Research Journey
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="relative mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                        >
                            <span className="text-white">Start experimenting with </span>
                            <span className="text-[#86EFAC]">AI code reuse today 🚀</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.18 }}
                            className="relative mt-5 text-white/75 max-w-2xl mx-auto text-lg leading-8"
                        >
                            Upload real projects, compare context-driven results, measure code reuse,
                            and turn AI behavior into meaningful software research insights.
                        </motion.p>

                        {/* action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.26 }}
                            className="relative mt-10 flex flex-wrap items-center justify-center gap-4"
                        >
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-[#4ADE80] text-black px-8 py-3.5 font-semibold hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(74,222,128,0.55)] transition-all duration-300"
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white px-8 py-3.5 font-medium hover:bg-white/10 hover:border-white/25 transition-all duration-300"
                            >
                                Login
                            </Link>
                        </motion.div>

                        {/* trust points */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.34 }}
                            className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55"
                        >
                            <span>✔ Real project testing</span>
                            <span>✔ AI reuse analytics</span>
                            <span>✔ Research-grade comparison</span>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="relative bg-[#071712] px-6 lg:px-10 pt-20 pb-8 overflow-hidden border-t border-white/5">
                {/* soft glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-[#22C55E]/10 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-10 right-0 w-[240px] h-[240px] bg-[#86EFAC]/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 xl:gap-14 items-start pb-12 border-b border-white/10">
                        {/* Brand */}
                        <div className="pr-4">
                            <h3 className="text-3xl font-bold text-white leading-tight">
                                AI Code Reuse <span className="text-[#86EFAC]">Platform</span>
                            </h3>

                            <p className="mt-5 text-[#9CA3AF] max-w-xl leading-8 text-[15px]">
                                A research-driven platform for analyzing how AI reuses existing
                                code, avoids duplication, compares context-based outcomes,
                                and generates measurable insights for modern software systems.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="rounded-full border border-[#22C55E]/20 bg-white/5 px-4 py-2 text-sm text-[#86EFAC]">
                                    AI Reuse Analysis
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                                    Experiment Tracking
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                                    Research Insights
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">About</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Our Platform
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Features
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    How It Works
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Analytics
                                </a>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Contact</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Contact Us
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Support
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Help Center
                                </a>
                                <a href="#" className="text-[#9CA3AF] hover:text-[#86EFAC] transition">
                                    Documentation
                                </a>
                            </div>
                        </div>

                        {/* GitHub */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">GitHub</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    Repository
                                </a>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    Source Code
                                </a>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    Issues
                                </a>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    Releases
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Email</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a
                                    href="mailto:your@email.com"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    your@email.com
                                </a>
                                <a
                                    href="mailto:support@email.com"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    support@email.com
                                </a>
                                <a
                                    href="mailto:research@email.com"
                                    className="text-[#9CA3AF] hover:text-[#86EFAC] transition"
                                >
                                    research@email.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative pt-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-[#6B7280]">
                        <p>© 2026 AI Code Reuse Platform. All rights reserved.</p>

                        <div className="flex flex-wrap items-center gap-6">
                            <a href="#" className="hover:text-[#86EFAC] transition">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-[#86EFAC] transition">
                                Terms
                            </a>
                            <a href="#" className="hover:text-[#86EFAC] transition">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}