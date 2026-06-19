import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/api";
import { motion } from "framer-motion";
import {
    Users,
    Folder,
    BarChart3,
    Activity,
    Brain,
    ShieldCheck,
    TrendingUp,
    Server,
    Sparkles,
    ArrowUpRight,
    Clock,
    CheckCircle2,
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/projects/admin/dashboard/");
                setStats(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const avgDuplication = Number(stats?.avg_duplication || 0);

    const statCards = useMemo(
        () => [
            {
                title: "Total Users",
                value: stats?.users ?? 0,
                subtitle: "Registered platform users",
                icon: Users,
                color: "blue",
                accent: "from-blue-500 to-cyan-400",
                bg: "bg-blue-50",
                text: "text-blue-600",
            },
            {
                title: "Total Projects",
                value: stats?.projects ?? 0,
                subtitle: "Submitted code projects",
                icon: Folder,
                color: "emerald",
                accent: "from-emerald-500 to-green-400",
                bg: "bg-emerald-50",
                text: "text-emerald-600",
            },
            {
                title: "Total Reports",
                value: stats?.reports ?? 0,
                subtitle: "Generated analysis reports",
                icon: BarChart3,
                color: "violet",
                accent: "from-violet-500 to-fuchsia-400",
                bg: "bg-violet-50",
                text: "text-violet-600",
            },
            {
                title: "Avg Duplication",
                value: `${avgDuplication}%`,
                subtitle: "Average similarity score",
                icon: Activity,
                color: "rose",
                accent: "from-rose-500 to-orange-400",
                bg: "bg-rose-50",
                text: "text-rose-600",
            },
            {
                title: "AI Analyses",
                value: stats?.ai_usage ?? 0,
                subtitle: "AI-powered inspections",
                icon: Brain,
                color: "amber",
                accent: "from-amber-500 to-yellow-400",
                bg: "bg-amber-50",
                text: "text-amber-600",
            },
        ],
        [stats, avgDuplication]
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1250px]">
                    {/* HERO */}
                    <motion.section
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="relative overflow-hidden rounded-[2rem] bg-[#071b13] px-5 py-8 shadow-2xl shadow-emerald-900/20 sm:px-8 md:px-10 lg:px-12"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-lime-400/10" />
                        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />

                        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50 backdrop-blur-md">
                                    <Sparkles size={16} />
                                    AI Code Reuse Platform
                                </div>

                                <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                    Admin Dashboard
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/75 sm:text-base md:text-lg">
                                    Monitor users, projects, reports, AI analysis activity, and code
                                    duplication performance from one clean control center.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    <InfoPill icon={ShieldCheck} label="Admin Control" />
                                    <InfoPill icon={Server} label="System Monitoring" />
                                    <InfoPill icon={TrendingUp} label="Live Insights" />
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-emerald-50/70">System Score</p>
                                        <h3 className="mt-1 text-3xl font-black text-white">
                                            {loading ? "--" : "98%"}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-emerald-400/20 p-3 text-emerald-200">
                                        <CheckCircle2 size={28} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <ProgressRow label="Platform Health" value={98} />
                                    <ProgressRow label="AI Engine" value={92} />
                                    <ProgressRow
                                        label="Duplication Risk"
                                        value={Math.min(avgDuplication, 100)}
                                        reverse
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* STATS */}
                    <section className="mt-7">
                        {loading ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <SkeletonCard key={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {statCards.map((item, index) => (
                                    <StatCard key={item.title} item={item} index={index} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* MAIN CONTENT */}
                    <section className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                        {/* SYSTEM OVERVIEW */}
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-[2rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7 lg:p-8"
                        >
                            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                        <Activity size={24} />
                                    </div>

                                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                        System Overview
                                    </h2>

                                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                                        You are managing a full AI-powered code reuse platform.
                                        Analyze duplication patterns, track project activity, monitor
                                        users, and evaluate how AI improves code quality across the
                                        system.
                                    </p>
                                </div>

                                <div className="min-w-[190px] rounded-2xl bg-slate-50 px-5 py-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                                        Status
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"></span>

                                        <span className="whitespace-nowrap text-sm font-black text-emerald-600">
                                            Running Smoothly
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <MiniInsight
                                    icon={Folder}
                                    title="Active Projects"
                                    value={stats?.projects ?? 0}
                                    description="Projects currently stored"
                                />
                                <MiniInsight
                                    icon={Users}
                                    title="Active Users"
                                    value={stats?.users ?? 0}
                                    description="Users using the platform"
                                />
                                <MiniInsight
                                    icon={Brain}
                                    title="AI Usage"
                                    value={stats?.ai_usage ?? 0}
                                    description="AI analysis requests"
                                />
                            </div>
                        </motion.div>

                        {/* QUICK INSIGHTS */}
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18 }}
                            className="rounded-[2rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">
                                        Quick Insights
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Latest platform summary
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                                    <Clock size={22} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <InsightRow
                                    title="Average duplication"
                                    value={`${avgDuplication}%`}
                                    positive={avgDuplication < 30}
                                />
                                <InsightRow
                                    title="Reports generated"
                                    value={stats?.reports ?? 0}
                                    positive
                                />
                                <InsightRow
                                    title="AI analyses completed"
                                    value={stats?.ai_usage ?? 0}
                                    positive
                                />
                            </div>

                            <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-50 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-2xl bg-white p-3 text-emerald-600 shadow-sm">
                                        <Sparkles size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-black text-slate-900">AI Suggestion</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Keep monitoring projects with high duplication scores and
                                            encourage users to improve originality before final
                                            submission.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

/* STAT CARD */
function StatCard({ item, index }) {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[1.7rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/70 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/70"
        >
            <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.accent} opacity-10 blur-2xl transition group-hover:opacity-20`}
            />

            <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className={`rounded-2xl ${item.bg} p-3 ${item.text}`}>
                        <Icon size={24} />
                    </div>

                    <div className="rounded-full bg-slate-50 p-2 text-slate-400 transition group-hover:bg-slate-100 group-hover:text-slate-700">
                        <ArrowUpRight size={17} />
                    </div>
                </div>

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {item.value}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.subtitle}
                </p>
            </div>
        </motion.div>
    );
}

/* MINI INSIGHT */
function MiniInsight({ icon: Icon, title, value, description }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <Icon size={22} />
            </div>

            <p className="text-sm font-bold text-slate-500">{title}</p>
            <h4 className="mt-1 text-2xl font-black text-slate-900">{value}</h4>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}

/* INFO PILL */
function InfoPill({ icon: Icon, label }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-md">
            <Icon size={16} />
            {label}
        </div>
    );
}

/* PROGRESS ROW */
function ProgressRow({ label, value, reverse = false }) {
    const finalValue = reverse ? 100 - value : value;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-emerald-50/80">{label}</span>
                <span className="font-black text-white">{Math.round(value)}%</span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(finalValue, 100))}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-lime-300"
                />
            </div>
        </div>
    );
}

/* INSIGHT ROW */
function InsightRow({ title, value, positive }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            <div>
                <p className="font-bold text-slate-800">{title}</p>
                <p className="mt-1 text-xs text-slate-500">Updated from dashboard API</p>
            </div>

            <div
                className={`rounded-2xl px-3 py-2 text-sm font-black ${positive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                    }`}
            >
                {value}
            </div>
        </div>
    );
}

/* SKELETON */
function SkeletonCard() {
    return (
        <div className="rounded-[1.7rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="mt-6 h-3 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-4 h-3 w-36 animate-pulse rounded-full bg-slate-100" />
        </div>
    );
}