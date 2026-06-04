import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    BarChart3,
    Folder,
    Flame,
    RefreshCw,
    FileCode,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Code2,
    FolderOpen,
    Gauge,
    X,
    ExternalLink,
} from "lucide-react";

// CODE HIGHLIGHTER
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ProjectResults() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [showFilesPopup, setShowFilesPopup] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await API.get(`/projects/${id}/analysis/`);
                setAnalysis(res.data);
            } catch (err) {
                console.log("ERROR:", err.response?.data);
                setAnalysis(null);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    const getDuplicationStatus = () => {
        const percentage = Number(analysis?.duplicate_percentage || 0);

        if (percentage > 50) {
            return {
                title: "High Duplication",
                message:
                    "High duplication detected. Consider refactoring repeated logic into reusable functions or shared modules.",
                color: "red",
                icon: <AlertTriangle size={28} />,
            };
        }

        if (percentage > 20) {
            return {
                title: "Moderate Duplication",
                message:
                    "Moderate duplication found. Some areas can be improved by extracting repeated code.",
                color: "yellow",
                icon: <Activity size={28} />,
            };
        }

        return {
            title: "Clean Structure",
            message:
                "Clean code structure detected. Your project has a good reuse level.",
            color: "green",
            icon: <CheckCircle2 size={28} />,
        };
    };

    const openFile = (file) => {
        navigate(`/dashboard/student/projects/${id}/file?name=${encodeURIComponent(file)}`);
    };

    // AI FORMATTER
    const renderAISuggestions = (text) => {
        if (!text) return null;

        const parts = text.split(/```/);

        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <SyntaxHighlighter
                        key={index}
                        language="python"
                        style={oneDark}
                        customStyle={{
                            borderRadius: "18px",
                            padding: "18px",
                            marginTop: "16px",
                            marginBottom: "16px",
                            fontSize: "13px",
                        }}
                    >
                        {part.trim()}
                    </SyntaxHighlighter>
                );
            }

            return (
                <p
                    key={index}
                    className="mb-4 whitespace-pre-line text-sm leading-7 text-gray-300"
                >
                    {part}
                </p>
            );
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl shadow-green-900/5 backdrop-blur">
                    <RefreshCw
                        className="mx-auto mb-4 animate-spin text-green-600"
                        size={36}
                    />
                    <p className="text-lg font-black text-gray-900">
                        Loading analysis...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Please wait while we fetch your project results.
                    </p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="min-h-screen bg-[#f5f8f6] text-slate-900">
                <Sidebar
                    role="STUDENT"
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <div
                    className={`${collapsed ? "ml-[110px]" : "ml-[280px]"
                        } transition-all duration-300`}
                >
                    <Navbar />

                    <main className="mt-[82px]">
                        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">
                            <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl"></div>
                            <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl"></div>

                            <div className="relative z-10 w-full max-w-xl rounded-[34px] border border-white bg-white/90 p-10 text-center shadow-2xl shadow-green-900/5 backdrop-blur">
                                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                                    <BarChart3 size={42} />
                                </div>

                                <h1 className="text-3xl font-black text-gray-900">
                                    No Analysis Found
                                </h1>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                                    Please go back to the project detail page and click
                                    Analyze Code first. After analysis is completed, your results
                                    will appear here.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                    >
                                        <ArrowLeft size={17} />
                                        Go Back
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/dashboard/student/projects/${id}`)
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600"
                                    >
                                        Open Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const status = getDuplicationStatus();
    const projectFiles = analysis.files || [];
    const previewFiles = projectFiles.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#f5f8f6] text-slate-900">
            {/* ALL FILES POPUP */}
            <AnimatePresence>
                {showFilesPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 35 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 35 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 22,
                            }}
                            className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-gray-800 bg-[#181818] text-white shadow-2xl"
                        >
                            {/* POPUP HEADER */}
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-400">
                                        <FolderOpen size={26} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black">
                                            All Project Files
                                        </h2>
                                        <p className="mt-1 text-xs font-semibold text-gray-400">
                                            {projectFiles.length} files found in this project
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowFilesPopup(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* POPUP BODY */}
                            <div className="max-h-[520px] overflow-y-auto px-6 py-5">
                                {projectFiles.length > 0 ? (
                                    <div className="space-y-3">
                                        {projectFiles.map((file, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => openFile(file)}
                                                className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-green-400/40 hover:bg-green-500/10"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                                                        <FileCode size={22} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="break-all font-mono text-sm font-bold text-gray-100 group-hover:text-green-300">
                                                            {file}
                                                        </p>
                                                        <p className="mt-1 text-xs font-semibold text-gray-500">
                                                            Click to open file
                                                        </p>
                                                    </div>
                                                </div>

                                                <ExternalLink
                                                    size={18}
                                                    className="shrink-0 text-gray-500 transition group-hover:text-green-300"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
                                        <FolderOpen
                                            className="mx-auto mb-4 text-gray-500"
                                            size={42}
                                        />
                                        <p className="text-sm font-semibold text-gray-400">
                                            No files found.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* POPUP FOOTER */}
                            <div className="flex justify-end border-t border-white/10 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setShowFilesPopup(false)}
                                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-gray-100"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar
                role="STUDENT"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`${collapsed ? "ml-[110px]" : "ml-[280px]"
                    } transition-all duration-300`}
            >
                <Navbar />

                <main className="mt-[82px]">
                    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">
                        {/* SOFT BACKGROUND */}
                        <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl"></div>
                        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl"></div>
                        <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 rounded-full bg-green-100/70 blur-3xl"></div>

                        <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-7">
                            {/* SMALL HEADER */}
                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-[30px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur"
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                        >
                                            <ArrowLeft size={17} />
                                            Back
                                        </button>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <BarChart3 size={34} />
                                            </div>

                                            <div>
                                                <h1 className="text-3xl font-black text-gray-900">
                                                    Analysis Results
                                                </h1>
                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                                    View AI-powered code reuse insights, duplicate code
                                                    details, project files, and improvement suggestions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:flex">
                                        <div className="rounded-2xl bg-green-50 px-5 py-4">
                                            <p className="text-xs font-bold uppercase text-green-700">
                                                Project
                                            </p>
                                            <p className="mt-1 text-2xl font-black text-gray-900">
                                                #{id}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-blue-50 px-5 py-4">
                                            <p className="text-xs font-bold uppercase text-blue-700">
                                                Report
                                            </p>
                                            <p className="mt-1 text-2xl font-black text-gray-900">
                                                Ready
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* STATS */}
                            <section className="grid gap-6 md:grid-cols-4">
                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <FileCode size={25} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Total Files
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black text-gray-900">
                                        {analysis.total_files}
                                    </h2>
                                </div>

                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <Code2 size={25} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Total Lines
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black text-gray-900">
                                        {analysis.total_lines}
                                    </h2>
                                </div>

                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                                        <Flame size={25} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Duplicate Lines
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black text-gray-900">
                                        {analysis.duplicate_lines}
                                    </h2>
                                </div>

                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                                        <Gauge size={25} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Duplication %
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black text-red-500">
                                        {analysis.duplicate_percentage}%
                                    </h2>
                                </div>
                            </section>

                            {/* INSIGHTS */}
                            <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${status.color === "red"
                                                    ? "bg-red-100 text-red-700"
                                                    : status.color === "yellow"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {status.icon}
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">
                                                Code Reuse Insight
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Automatic interpretation of your duplication level.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-2xl px-5 py-3 text-sm font-bold ${status.color === "red"
                                                ? "bg-red-50 text-red-700"
                                                : status.color === "yellow"
                                                    ? "bg-yellow-50 text-yellow-700"
                                                    : "bg-green-50 text-green-700"
                                            }`}
                                    >
                                        {status.title}
                                    </div>
                                </div>

                                <p className="text-sm leading-7 text-gray-600">
                                    {status.message}
                                </p>

                                <div className="mt-6">
                                    <div className="mb-2 flex items-center justify-between text-sm font-bold text-gray-700">
                                        <span>Duplication Level</span>
                                        <span>{analysis.duplicate_percentage}%</span>
                                    </div>

                                    <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${Math.min(
                                                    Number(analysis.duplicate_percentage || 0),
                                                    100
                                                )}%`,
                                            }}
                                            transition={{ duration: 0.8 }}
                                            className={`h-full rounded-full ${status.color === "red"
                                                    ? "bg-red-500"
                                                    : status.color === "yellow"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                }`}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* PROJECT FILES - SHOW ONLY 3 FIRST */}
                            <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <FolderOpen size={28} />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">
                                                Project Files
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Showing first {Math.min(3, projectFiles.length)} files.
                                                Click See All to view the full project file list.
                                            </p>
                                        </div>
                                    </div>

                                    {projectFiles.length > 3 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowFilesPopup(true)}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600"
                                        >
                                            See All Files
                                            <ExternalLink size={17} />
                                        </button>
                                    )}
                                </div>

                                {projectFiles.length > 0 ? (
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {previewFiles.map((file, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => openFile(file)}
                                                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50 hover:shadow-lg"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                                    <FileCode size={21} />
                                                </div>

                                                <div className="min-w-0">
                                                    <span className="block break-all font-mono text-sm font-bold text-gray-700 group-hover:text-green-700">
                                                        {file}
                                                    </span>
                                                    <span className="mt-1 block text-xs font-semibold text-gray-400">
                                                        Click to open
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center">
                                        <p className="text-sm font-semibold text-gray-500">
                                            No files found.
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* DUPLICATE CODE */}
                            <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                                        <Flame size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            Duplicate Code Detected
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Most repeated code lines found during analysis.
                                        </p>
                                    </div>
                                </div>

                                {analysis.top_duplicates?.length > 0 ? (
                                    <div className="space-y-4">
                                        {analysis.top_duplicates.map((item, i) => (
                                            <div
                                                key={i}
                                                className="rounded-[24px] border border-red-100 bg-red-50 p-5"
                                            >
                                                <div className="mb-3 flex items-center justify-between gap-4">
                                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-red-600">
                                                        Duplicate #{i + 1}
                                                    </span>

                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                                                        repeated {item.count} times
                                                    </span>
                                                </div>

                                                <code className="block break-all rounded-2xl bg-white p-4 font-mono text-sm text-red-700">
                                                    {item.line}
                                                </code>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <CheckCircle2 size={30} />
                                        </div>

                                        <h3 className="text-lg font-black text-gray-900">
                                            No duplicate code found
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Nice work. Your project looks clean.
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* AI SUGGESTIONS */}
                            <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                        <Sparkles size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            AI Code Reuse Suggestions
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            AI-generated suggestions to improve reuse and reduce repeated logic.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-gray-800 bg-[#0d1117] p-6 shadow-2xl shadow-black/10">
                                    {analysis.ai_suggestions ? (
                                        renderAISuggestions(analysis.ai_suggestions)
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center">
                                            <Sparkles
                                                className="mx-auto mb-4 text-gray-500"
                                                size={34}
                                            />
                                            <p className="text-sm font-semibold text-gray-400">
                                                No AI suggestions generated yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}