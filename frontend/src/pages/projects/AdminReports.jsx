import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
    Activity,
    UploadCloud,
    Brain,
    Wand2,
    Download,
    FileCode,
    AlertTriangle,
    RefreshCw,
    ShieldCheck,
    Server,
    Clock3,
    Search,
    BarChart3,
    CheckCircle2,
    XCircle,
    Trash2,
} from "lucide-react";

export default function AdminReports() {
    const [collapsed, setCollapsed] = useState(false);
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await API.get("/projects/admin/reports/");
            setStats(res.data.stats);
            setLogs(res.data.logs || []);
        } catch (err) {
            console.log("REPORTS ERROR:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredLogs = useMemo(() => {
        if (!searchTerm.trim()) return logs;

        const term = searchTerm.toLowerCase();

        return logs.filter((log) => {
            return (
                String(log.user || "").toLowerCase().includes(term) ||
                String(log.action || "").toLowerCase().includes(term) ||
                String(log.project_name || "").toLowerCase().includes(term) ||
                String(log.method || "").toLowerCase().includes(term) ||
                String(log.status_code || "").toLowerCase().includes(term) ||
                String(log.message || "").toLowerCase().includes(term)
            );
        });
    }, [logs, searchTerm]);

    const successRequests = useMemo(() => {
        return logs.filter((log) => Number(log.status_code) < 400).length;
    }, [logs]);

    const failedRequests = stats?.failed_requests || 0;
    const totalRequests = stats?.total_requests || 0;

    const cards = [
        {
            title: "Total Requests",
            value: totalRequests,
            icon: <Activity size={24} />,
            bg: "from-green-50 to-emerald-50",
            text: "text-green-700",
            note: "All tracked actions",
        },
        {
            title: "Project Uploads",
            value: stats?.project_uploads || 0,
            icon: <UploadCloud size={24} />,
            bg: "from-blue-50 to-sky-50",
            text: "text-blue-700",
            note: "Uploaded ZIP projects",
        },
        {
            title: "Project Analyses",
            value: stats?.project_analyzed || 0,
            icon: <Brain size={24} />,
            bg: "from-purple-50 to-violet-50",
            text: "text-purple-700",
            note: "AI reuse scans",
        },
        {
            title: "Code Fixes",
            value: stats?.code_fixed || 0,
            icon: <Wand2 size={24} />,
            bg: "from-emerald-50 to-green-50",
            text: "text-emerald-700",
            note: "Improved code requests",
        },
        {
            title: "File Downloads",
            value: stats?.file_downloaded || 0,
            icon: <Download size={24} />,
            bg: "from-yellow-50 to-amber-50",
            text: "text-yellow-700",
            note: "Downloaded files",
        },
        {
            title: "Failed Requests",
            value: failedRequests,
            icon: <AlertTriangle size={24} />,
            bg: "from-red-50 to-rose-50",
            text: "text-red-700",
            note: "Errors / denied actions",
        },
    ];

    const getActionStyle = (action = "") => {
        if (action.includes("UPLOADED")) {
            return "bg-blue-50 text-blue-700 border-blue-100";
        }

        if (action.includes("ANALYZED")) {
            return "bg-purple-50 text-purple-700 border-purple-100";
        }

        if (action.includes("FIXED")) {
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        }

        if (action.includes("DOWNLOADED")) {
            return "bg-yellow-50 text-yellow-700 border-yellow-100";
        }

        if (action.includes("DELETED")) {
            return "bg-red-50 text-red-700 border-red-100";
        }

        return "bg-slate-50 text-slate-700 border-slate-100";
    };

    const formatAction = (action = "") => {
        return action.replaceAll("_", " ");
    };

    return (
        <div className="min-h-screen bg-[#f5f8f6] text-slate-900">
            <Sidebar role="ADMIN" collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className={`${collapsed ? "ml-[110px]" : "ml-[280px]"
                    } transition-all duration-300`}
            >
                <Navbar />

                <main className="relative mt-[82px] min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">
                    {/* Soft background */}
                    <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-10 left-1/2 h-80 w-80 rounded-full bg-green-100/70 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-[1400px] space-y-7">
                        {/* HERO */}
                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-[34px] border border-white/80 bg-gradient-to-br from-[#062419] via-[#0b3b2a] to-[#0f5f3f] p-8 text-white shadow-2xl shadow-green-950/20"
                        >
                            <div className="relative">
                                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
                                <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

                                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">
                                            <ShieldCheck size={16} />
                                            Admin Reporting Center
                                        </div>

                                        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                            System Reports
                                        </h1>

                                        <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/75 lg:text-base">
                                            Monitor real platform activity, AI usage, project uploads,
                                            file downloads, failed actions, and recent user activity from
                                            one organized reporting dashboard.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[440px]">
                                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                            <Server className="mb-3 text-emerald-300" size={24} />
                                            <p className="text-3xl font-black">
                                                {totalRequests}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                                                Total Logs
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                            <CheckCircle2 className="mb-3 text-green-300" size={24} />
                                            <p className="text-3xl font-black">
                                                {successRequests}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                                                Successful
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                            <XCircle className="mb-3 text-red-300" size={24} />
                                            <p className="text-3xl font-black">
                                                {failedRequests}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                                                Failed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* TOP ACTION BAR */}
                        <section className="rounded-[30px] border border-white bg-white/90 p-5 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <BarChart3 size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-slate-950">
                                            Live Activity Overview
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Latest values are loaded from your database logs.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative">
                                        <Search
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search logs..."
                                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-100 sm:w-[260px]"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={fetchReports}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <RefreshCw
                                            size={17}
                                            className={loading ? "animate-spin" : ""}
                                        />
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </section>

                        {loading ? (
                            <section className="rounded-[32px] border border-white bg-white/90 p-12 text-center shadow-xl shadow-green-900/5">
                                <RefreshCw
                                    className="mx-auto mb-4 animate-spin text-green-600"
                                    size={38}
                                />
                                <p className="text-lg font-black text-slate-900">
                                    Loading reports...
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Please wait while we fetch latest system activity.
                                </p>
                            </section>
                        ) : (
                            <>
                                {/* STATS */}
                                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
                                    {cards.map((card, index) => (
                                        <motion.div
                                            key={card.title}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className={`group rounded-[28px] border border-white bg-gradient-to-br ${card.bg} p-5 shadow-xl shadow-green-900/5 transition hover:-translate-y-1 hover:shadow-2xl`}
                                        >
                                            <div
                                                className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-white/80 ${card.text} shadow-sm transition group-hover:scale-110`}
                                            >
                                                {card.icon}
                                            </div>

                                            <p className="text-sm font-black text-slate-500">
                                                {card.title}
                                            </p>

                                            <h2 className="mt-2 text-4xl font-black text-slate-950">
                                                {card.value}
                                            </h2>

                                            <p className="mt-3 text-xs font-semibold text-slate-400">
                                                {card.note}
                                            </p>
                                        </motion.div>
                                    ))}
                                </section>

                                {/* LOGS */}
                                <section className="overflow-hidden rounded-[34px] border border-white bg-white/90 shadow-2xl shadow-green-900/5 backdrop-blur">
                                    <div className="border-b border-slate-100 p-7">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                    <FileCode size={28} />
                                                </div>

                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-950">
                                                        Recent Activity Logs
                                                    </h2>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Showing {filteredLogs.length} of {logs.length} recorded system actions.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                                                <Clock3 size={17} />
                                                Latest 100 entries
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto p-6">
                                        {filteredLogs.length > 0 ? (
                                            <table className="w-full min-w-[980px] border-separate border-spacing-y-3">
                                                <thead>
                                                    <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-400">
                                                        <th className="px-4">User</th>
                                                        <th className="px-4">Action</th>
                                                        <th className="px-4">Project</th>
                                                        <th className="px-4">Method</th>
                                                        <th className="px-4">Status</th>
                                                        <th className="px-4">Message</th>
                                                        <th className="px-4">Date</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredLogs.map((log) => (
                                                        <tr
                                                            key={log.id}
                                                            className="group bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                                        >
                                                            <td className="rounded-l-2xl border-y border-l border-slate-100 px-4 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-sm font-black text-green-700">
                                                                        {(log.user || "U").charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="text-sm font-black text-slate-700">
                                                                        {log.user || "Unknown"}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="border-y border-slate-100 px-4 py-4">
                                                                <span
                                                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getActionStyle(
                                                                        log.action
                                                                    )}`}
                                                                >
                                                                    {formatAction(log.action)}
                                                                </span>
                                                            </td>

                                                            <td className="border-y border-slate-100 px-4 py-4 text-sm font-semibold text-slate-600">
                                                                {log.project_name || "-"}
                                                            </td>

                                                            <td className="border-y border-slate-100 px-4 py-4">
                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                                                    {log.method}
                                                                </span>
                                                            </td>

                                                            <td className="border-y border-slate-100 px-4 py-4">
                                                                <span
                                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${Number(log.status_code) >= 400
                                                                            ? "bg-red-50 text-red-700"
                                                                            : "bg-green-50 text-green-700"
                                                                        }`}
                                                                >
                                                                    {Number(log.status_code) >= 400 ? (
                                                                        <XCircle size={13} />
                                                                    ) : (
                                                                        <CheckCircle2 size={13} />
                                                                    )}
                                                                    {log.status_code}
                                                                </span>
                                                            </td>

                                                            <td className="max-w-[340px] border-y border-slate-100 px-4 py-4 text-sm leading-6 text-slate-500">
                                                                {log.message || "-"}
                                                            </td>

                                                            <td className="rounded-r-2xl border-y border-r border-slate-100 px-4 py-4 text-sm font-semibold text-slate-500">
                                                                {new Date(log.created_at).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-10 text-center">
                                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                    <FileCode size={34} />
                                                </div>

                                                <h3 className="text-xl font-black text-slate-950">
                                                    No reports found
                                                </h3>

                                                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                                                    Perform actions such as uploading projects, analyzing code,
                                                    fixing code, opening files, or downloading files to generate reports.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}