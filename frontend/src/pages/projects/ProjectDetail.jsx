import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    FileCode,
    Calendar,
    User,
    Rocket,
    BarChart3,
    ClipboardList,
    Download,
    Sparkles,
    RefreshCw,
    FolderOpen,
    Activity,
    CheckCircle2,
    XCircle,
    Files,
} from "lucide-react";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const [popup, setPopup] = useState(null);

    const CODE_EXTENSIONS = [
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".java",
        ".cs",
        ".cpp",
        ".c",
        ".html",
        ".css",
    ];

    const getFileExtension = (fileName = "") => {
        const cleanName = fileName.toLowerCase();
        const lastDot = cleanName.lastIndexOf(".");
        if (lastDot === -1) return "";
        return cleanName.slice(lastDot);
    };

    const getAllProjectFilesCount = () => {
        if (analysis?.files && Array.isArray(analysis.files)) {
            return analysis.files.length;
        }

        return analysis?.total_project_files || analysis?.total_files || 0;
    };

    const getAnalyzedCodeFilesCount = () => {
        if (analysis?.files && Array.isArray(analysis.files)) {
            return analysis.files.filter((fileName) =>
                CODE_EXTENSIONS.includes(getFileExtension(fileName))
            ).length;
        }

        return analysis?.analyzed_code_files || analysis?.total_files || 0;
    };

    const allProjectFiles = getAllProjectFilesCount();
    const analyzedCodeFiles = getAnalyzedCodeFilesCount();

    const showPopup = (message, type = "success") => {
        setPopup({ message, type });

        setTimeout(() => {
            setPopup(null);
        }, 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectRes = await API.get(`/projects/${id}/`);
                setProject(projectRes.data);

                try {
                    const analysisRes = await API.get(`/projects/${id}/analysis/`);
                    setAnalysis(analysisRes.data);
                } catch {
                    console.log("No previous analysis");
                }
            } catch (err) {
                console.log("ERROR:", err.response?.data);
                navigate("/dashboard");
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleAnalyze = async () => {
        try {
            setLoadingAnalysis(true);

            const res = await API.post(`/projects/${id}/analyze/`);
            setAnalysis(res.data);

            showPopup("Analysis completed successfully", "success");
        } catch (err) {
            console.log(err);
            showPopup("Analysis failed. Please try again", "error");
        } finally {
            setLoadingAnalysis(false);
        }
    };

    if (!project) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl shadow-green-900/5 backdrop-blur">
                    <RefreshCw className="mx-auto mb-4 animate-spin text-green-600" size={34} />
                    <p className="text-lg font-black text-gray-900">
                        Loading project...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Please wait while we fetch your project details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f8f6] text-slate-900">

            {/* CENTER ANIMATED POPUP */}
            <AnimatePresence>
                {popup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.75, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.75, y: 40 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            className="w-full max-w-md rounded-[32px] border border-white bg-white p-8 text-center shadow-2xl"
                        >
                            <div
                                className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${popup.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {popup.type === "success" ? (
                                    <CheckCircle2 size={46} />
                                ) : (
                                    <XCircle size={46} />
                                )}
                            </div>

                            <h2
                                className={`text-3xl font-black ${popup.type === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {popup.type === "success" ? "Success!" : "Failed!"}
                            </h2>

                            <p className="mt-3 text-base font-semibold leading-7 text-gray-600">
                                {popup.message}
                            </p>

                            <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className={`h-full ${popup.type === "success"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                        }`}
                                />
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

            <div className={`${collapsed ? "ml-[110px]" : "ml-[280px]"} transition-all duration-300`}>
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
                                                <FolderOpen size={34} />
                                            </div>

                                            <div>
                                                <h1 className="text-3xl font-black text-gray-900">
                                                    {project.name}
                                                </h1>
                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                                    Manage your uploaded project, create focused tasks, analyze code reuse, and view AI results.
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
                                                #{project.id}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-blue-50 px-5 py-4">
                                            <p className="text-xs font-bold uppercase text-blue-700">
                                                Status
                                            </p>
                                            <p className="mt-1 text-2xl font-black text-gray-900">
                                                Active
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* PROJECT INFO CARDS */}
                            <section className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <User size={25} />
                                    </div>

                                    <p className="text-sm font-semibold text-gray-500">
                                        Owner
                                    </p>
                                    <h2 className="mt-2 text-xl font-black text-gray-900">
                                        {project.user || "You"}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Project uploaded by this account.
                                    </p>
                                </div>

                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <Calendar size={25} />
                                    </div>

                                    <p className="text-sm font-semibold text-gray-500">
                                        Created
                                    </p>
                                    <h2 className="mt-2 text-xl font-black text-gray-900">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {new Date(project.created_at).toLocaleTimeString()}
                                    </p>
                                </div>

                                <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                        <FileCode size={25} />
                                    </div>

                                    <p className="text-sm font-semibold text-gray-500">
                                        Source File
                                    </p>

                                    <a
                                        href={project.file}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-black text-green-700 transition hover:bg-green-100"
                                    >
                                        <Download size={17} />
                                        Download ZIP
                                    </a>
                                </div>
                            </section>

                            {/* PROJECT ACTIONS */}
                            <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <Rocket size={28} />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">
                                                Project Actions
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Start working with your project using AI-powered tools.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700">
                                        AI Code Reuse Ready
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/dashboard/student/projects/${project.id}/tasks`)}
                                        className="group rounded-[24px] bg-green-500 p-5 text-left text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600"
                                    >
                                        <ClipboardList className="mb-4" size={30} />
                                        <h3 className="text-lg font-black">
                                            Create Task
                                        </h3>
                                        <p className="mt-2 text-sm text-white/80">
                                            Create task and analyze selected code.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAnalyze}
                                        disabled={loadingAnalysis}
                                        className="group rounded-[24px] bg-blue-500 p-5 text-left text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-1 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loadingAnalysis ? (
                                            <RefreshCw className="mb-4 animate-spin" size={30} />
                                        ) : (
                                            <Sparkles className="mb-4" size={30} />
                                        )}

                                        <h3 className="text-lg font-black">
                                            {loadingAnalysis ? "Analyzing..." : "Analyze Code"}
                                        </h3>
                                        <p className="mt-2 text-sm text-white/80">
                                            Run AI analysis on the uploaded ZIP.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(`/dashboard/student/projects/${project.id}/results`)}
                                        className="group rounded-[24px] bg-purple-500 p-5 text-left text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-1 hover:bg-purple-600"
                                    >
                                        <BarChart3 className="mb-4" size={30} />
                                        <h3 className="text-lg font-black">
                                            View Results
                                        </h3>
                                        <p className="mt-2 text-sm text-white/80">
                                            Check duplication and reuse statistics.
                                        </p>
                                    </button>
                                </div>
                            </section>

                            {/* ANALYSIS RESULTS */}
                            {analysis ? (
                                <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                                <BarChart3 size={28} />
                                            </div>

                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900">
                                                    Analysis Results
                                                </h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Latest AI analysis summary for this project.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAnalyze}
                                            disabled={loadingAnalysis}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <RefreshCw
                                                size={17}
                                                className={loadingAnalysis ? "animate-spin" : ""}
                                            />
                                            {loadingAnalysis ? "Analyzing..." : "Run Again"}
                                        </button>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-5">
                                        <div className="rounded-[24px] bg-green-50 p-5">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Files size={18} className="text-green-700" />
                                                <p className="text-sm font-bold text-green-700">
                                                    All Project Files
                                                </p>
                                            </div>
                                            <h3 className="mt-3 text-3xl font-black text-gray-900">
                                                {allProjectFiles}
                                            </h3>
                                            <p className="mt-2 text-xs font-semibold text-gray-500">
                                                Every file inside ZIP
                                            </p>
                                        </div>

                                        <div className="rounded-[24px] bg-emerald-50 p-5">
                                            <div className="mb-2 flex items-center gap-2">
                                                <FileCode size={18} className="text-emerald-700" />
                                                <p className="text-sm font-bold text-emerald-700">
                                                    Analyzed Code Files
                                                </p>
                                            </div>
                                            <h3 className="mt-3 text-3xl font-black text-gray-900">
                                                {analyzedCodeFiles}
                                            </h3>
                                            <p className="mt-2 text-xs font-semibold text-gray-500">
                                                Only real code files
                                            </p>
                                        </div>

                                        <div className="rounded-[24px] bg-blue-50 p-5">
                                            <p className="text-sm font-bold text-blue-700">
                                                Total Lines
                                            </p>
                                            <h3 className="mt-3 text-3xl font-black text-gray-900">
                                                {analysis.total_lines || 0}
                                            </h3>
                                        </div>

                                        <div className="rounded-[24px] bg-yellow-50 p-5">
                                            <p className="text-sm font-bold text-yellow-700">
                                                Duplicate Lines
                                            </p>
                                            <h3 className="mt-3 text-3xl font-black text-gray-900">
                                                {analysis.duplicate_lines || 0}
                                            </h3>
                                        </div>

                                        <div className="rounded-[24px] bg-red-50 p-5">
                                            <p className="text-sm font-bold text-red-700">
                                                Duplication %
                                            </p>
                                            <h3 className="mt-3 text-3xl font-black text-red-500">
                                                {analysis.duplicate_percentage || 0}%
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-[24px] border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="text-green-700" size={24} />
                                            <h3 className="text-lg font-black text-gray-900">
                                                Quick Summary
                                            </h3>
                                        </div>

                                        <p className="mt-3 text-sm leading-7 text-gray-600">
                                            Your ZIP contains{" "}
                                            <span className="font-bold text-gray-900">
                                                {allProjectFiles}
                                            </span>{" "}
                                            total project files. From these files, the system analyzed{" "}
                                            <span className="font-bold text-gray-900">
                                                {analyzedCodeFiles}
                                            </span>{" "}
                                            code files and counted{" "}
                                            <span className="font-bold text-gray-900">
                                                {analysis.total_lines || 0}
                                            </span>{" "}
                                            lines of code. The system found{" "}
                                            <span className="font-bold text-gray-900">
                                                {analysis.duplicate_lines || 0}
                                            </span>{" "}
                                            duplicate lines, with a duplication rate of{" "}
                                            <span className="font-bold text-red-500">
                                                {analysis.duplicate_percentage || 0}%
                                            </span>.
                                        </p>
                                    </div>
                                </section>
                            ) : (
                                <section className="rounded-[32px] border border-white bg-white/90 p-8 shadow-xl shadow-green-900/5 backdrop-blur">
                                    <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-10 text-center">
                                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <BarChart3 size={32} />
                                        </div>

                                        <h3 className="text-xl font-black text-gray-900">
                                            No analysis yet
                                        </h3>

                                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                                            Run code analysis to see all project files, analyzed code files, total lines, duplicate lines, and duplication percentage.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleAnalyze}
                                            disabled={loadingAnalysis}
                                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loadingAnalysis ? (
                                                <RefreshCw className="animate-spin" size={17} />
                                            ) : (
                                                <Sparkles size={17} />
                                            )}
                                            {loadingAnalysis ? "Analyzing..." : "Run First Analysis"}
                                        </button>
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}