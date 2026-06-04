import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    ArrowLeft,
    Brain,
    ClipboardCheck,
    Sparkles,
    Copy,
    Check,
    Code2,
    GitCompare,
    Bot,
    UserRound,
    Loader2,
    RefreshCcw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Wand2,
    FileCode,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function TaskDetail() {
    const { id, taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [description, setDescription] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [fixedCode, setFixedCode] = useState("");

    const [loadingTask, setLoadingTask] = useState(true);
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingFix, setLoadingFix] = useState(false);

    const [typedAiText, setTypedAiText] = useState("");
    const [typingDone, setTypingDone] = useState(true);

    const [copiedOriginal, setCopiedOriginal] = useState(false);
    const [copiedFixed, setCopiedFixed] = useState(false);
    const [copiedAi, setCopiedAi] = useState(false);

    const [popup, setPopup] = useState(null);

    const showPopup = (message, type = "success") => {
        setPopup({ message, type });

        setTimeout(() => {
            setPopup(null);
        }, 3000);
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoadingTask(true);

                const res = await API.get(`/projects/${id}/tasks/${taskId}/`);

                setTask(res.data);
                setDescription(res.data.description || "");
                setCodeSnippet(res.data.code_snippet || "");

                if (res.data.ai_response) {
                    setTypedAiText(res.data.ai_response);
                    setTypingDone(true);
                }
            } catch (err) {
                console.log("FETCH TASK ERROR:", err.response?.data);
                showPopup("Failed to load task details", "error");
            } finally {
                setLoadingTask(false);
            }
        };

        fetchTask();
    }, [id, taskId]);

    useEffect(() => {
        if (!task?.ai_response) return;

        setTypedAiText("");
        setTypingDone(false);

        let index = 0;
        const text = task.ai_response;

        const interval = setInterval(() => {
            setTypedAiText(text.slice(0, index + 1));
            index++;

            if (index >= text.length) {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 8);

        return () => clearInterval(interval);
    }, [task?.ai_response]);

    const handleAnalyzeTask = async () => {
        if (!codeSnippet.trim()) {
            showPopup("Please paste code before running AI analysis", "warning");
            return;
        }

        setLoadingAI(true);

        try {
            const res = await API.post(`/projects/${id}/tasks/${taskId}/analyze/`, {
                description,
                code_snippet: codeSnippet,
            });

            setTask(res.data);
            showPopup("AI analysis completed successfully", "success");
        } catch (err) {
            console.log("AI ERROR:", err.response?.data);
            showPopup("AI analysis failed. Please try again", "error");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleFixCode = async () => {
        if (!codeSnippet.trim()) {
            showPopup("Please paste code before fixing it", "warning");
            return;
        }

        setLoadingFix(true);

        try {
            const res = await API.post(`/projects/${id}/tasks/${taskId}/fix/`);
            setFixedCode(res.data.fixed_code || "");
            showPopup("Improved code generated successfully", "success");
        } catch (err) {
            console.log("FIX CODE ERROR:", err.response?.data);
            showPopup("Fix code failed. Please try again", "error");
        } finally {
            setLoadingFix(false);
        }
    };

    const copyText = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text || "");

            if (type === "original") {
                setCopiedOriginal(true);
                setTimeout(() => setCopiedOriginal(false), 1500);
            }

            if (type === "fixed") {
                setCopiedFixed(true);
                setTimeout(() => setCopiedFixed(false), 1500);
            }

            if (type === "ai") {
                setCopiedAi(true);
                setTimeout(() => setCopiedAi(false), 1500);
            }

            showPopup("Copied to clipboard", "success");
        } catch {
            showPopup("Copy failed", "error");
        }
    };

    const highlightDuplicates = (code) => {
        const lines = code.split("\n");
        const seen = new Set();

        return lines.map((line, index) => {
            const trimmed = line.trim();
            const isDuplicate = trimmed && seen.has(trimmed);

            if (trimmed) {
                seen.add(trimmed);
            }

            return (
                <div
                    key={index}
                    className={`flex gap-4 rounded-md px-3 py-[4px] ${isDuplicate
                            ? "bg-red-500/15 text-red-300"
                            : "text-slate-200 hover:bg-white/5"
                        }`}
                >
                    <span className="w-8 select-none text-right text-slate-500">
                        {index + 1}
                    </span>
                    <span className="whitespace-pre-wrap">{line || " "}</span>
                </div>
            );
        });
    };

    const extractCodeFromMarkdown = (text) => {
        if (!text) return "";

        const codeBlockMatch = text.match(/```(?:\w+)?\n([\s\S]*?)```/);

        if (codeBlockMatch) {
            return codeBlockMatch[1].trim();
        }

        return text.trim();
    };

    const fixedOnlyCode = useMemo(() => {
        return extractCodeFromMarkdown(fixedCode);
    }, [fixedCode]);

    const diffRows = useMemo(() => {
        const originalLines = codeSnippet.split("\n");
        const improvedLines = fixedOnlyCode.split("\n");

        const maxLength = Math.max(originalLines.length, improvedLines.length);

        return Array.from({ length: maxLength }).map((_, index) => {
            const before = originalLines[index] || "";
            const after = improvedLines[index] || "";

            return {
                line: index + 1,
                before,
                after,
                changed: before.trim() !== after.trim(),
                added: !before && !!after,
                removed: !!before && !after,
            };
        });
    }, [codeSnippet, fixedOnlyCode]);

    const duplicateCount = useMemo(() => {
        const lines = codeSnippet
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const seen = new Set();
        let count = 0;

        lines.forEach((line) => {
            if (seen.has(line)) {
                count++;
            } else {
                seen.add(line);
            }
        });

        return count;
    }, [codeSnippet]);

    const lineCount = useMemo(() => {
        if (!codeSnippet.trim()) return 0;
        return codeSnippet.split("\n").length;
    }, [codeSnippet]);

    const getPopupIcon = () => {
        if (popup?.type === "success") return <CheckCircle2 size={46} />;
        if (popup?.type === "warning") return <AlertTriangle size={46} />;
        return <XCircle size={46} />;
    };

    const getPopupColor = () => {
        if (popup?.type === "success") return "bg-green-100 text-green-600";
        if (popup?.type === "warning") return "bg-yellow-100 text-yellow-600";
        return "bg-red-100 text-red-600";
    };

    const getPopupTitle = () => {
        if (popup?.type === "success") return "Success!";
        if (popup?.type === "warning") return "Attention!";
        return "Failed!";
    };

    if (loadingTask) {
        return (
            <DashboardLayout>
                <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">
                    <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl"></div>
                    <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl"></div>

                    <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
                        <div className="rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl shadow-green-900/5 backdrop-blur">
                            <Loader2 className="mx-auto mb-4 animate-spin text-green-600" size={36} />
                            <p className="text-lg font-black text-gray-900">
                                Loading task workspace...
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Please wait while we prepare your task.
                            </p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!task) {
        return (
            <DashboardLayout>
                <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">
                    <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center">
                        <div className="w-full max-w-xl rounded-[34px] border border-white bg-white/90 p-10 text-center shadow-2xl shadow-green-900/5 backdrop-blur">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                                <XCircle size={42} />
                            </div>

                            <h2 className="text-3xl font-black text-gray-900">
                                Task not found
                            </h2>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                                This task could not be loaded. Please go back and select a valid task.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600"
                            >
                                <ArrowLeft size={17} />
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* CENTER POPUP */}
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
                                className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${getPopupColor()}`}
                            >
                                {getPopupIcon()}
                            </div>

                            <h2 className="text-3xl font-black text-gray-900">
                                {getPopupTitle()}
                            </h2>

                            <p className="mt-3 text-base font-semibold leading-7 text-gray-600">
                                {popup.message}
                            </p>

                            <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className={
                                        popup.type === "success"
                                            ? "h-full bg-green-500"
                                            : popup.type === "warning"
                                                ? "h-full bg-yellow-500"
                                                : "h-full bg-red-500"
                                    }
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                        <ClipboardCheck size={34} />
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-black text-gray-900">
                                            {task.name}
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                            Analyze focused code, detect repeated logic, review AI feedback,
                                            and generate an improved version.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:flex">
                                <div className="rounded-2xl bg-green-50 px-5 py-4">
                                    <p className="text-xs font-bold uppercase text-green-700">
                                        Lines
                                    </p>
                                    <p className="mt-1 text-2xl font-black text-gray-900">
                                        {lineCount}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-red-50 px-5 py-4">
                                    <p className="text-xs font-bold uppercase text-red-700">
                                        Repeats
                                    </p>
                                    <p className="mt-1 text-2xl font-black text-gray-900">
                                        {duplicateCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* QUICK INFO CARDS */}
                    <section className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <Code2 size={25} />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">
                                Code Input
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {codeSnippet.trim() ? "Ready" : "Empty"}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Paste code and run AI analysis.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <Bot size={25} />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">
                                AI Feedback
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {task.ai_response ? "Ready" : "Pending"}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Chat-style analysis output.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                <Wand2 size={25} />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">
                                Improved Code
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {fixedCode ? "Generated" : "Not Yet"}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                AI-generated cleaner version.
                            </p>
                        </div>
                    </section>

                    {/* CODE INPUT + ANALYSIS VIEW */}
                    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                        {/* CODE INPUT */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur"
                        >
                            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <FileCode size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            Code Snippet
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Paste the code you want AI to analyze.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => copyText(codeSnippet, "original")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    {copiedOriginal ? <Check size={17} /> : <Copy size={17} />}
                                    {copiedOriginal ? "Copied" : "Copy"}
                                </button>
                            </div>

                            <textarea
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                                placeholder="Paste your code here..."
                                className="h-[330px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 font-mono text-sm font-semibold text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                            />

                            <div className="mt-5">
                                <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-gray-700">
                                    Task Description
                                </h3>

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Example: Analyze duplicate login validation logic..."
                                    className="min-h-[110px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleAnalyzeTask}
                                    disabled={loadingAI}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 font-black text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loadingAI ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Brain size={20} />
                                    )}
                                    {loadingAI ? "Analyzing..." : "Run AI Analysis"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleFixCode}
                                    disabled={loadingFix}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 font-black text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loadingFix ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={20} />
                                    )}
                                    {loadingFix ? "Fixing..." : "Fix My Code"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFixedCode("");
                                        setTypedAiText("");
                                        setTask({ ...task, ai_response: "" });
                                        showPopup("Output cleared", "success");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 font-black text-gray-700 transition hover:bg-gray-200"
                                >
                                    <RefreshCcw size={18} />
                                    Clear Output
                                </button>
                            </div>
                        </motion.div>

                        {/* CODE ANALYSIS VIEW */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur"
                        >
                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <Activity size={28} />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Code Analysis View
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Repeated lines are highlighted automatically.
                                    </p>
                                </div>
                            </div>

                            <div className="h-[525px] overflow-auto rounded-[24px] border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-100">
                                {codeSnippet.trim() ? (
                                    highlightDuplicates(codeSnippet)
                                ) : (
                                    <div className="flex h-full items-center justify-center text-center">
                                        <div>
                                            <Code2 className="mx-auto mb-4 text-slate-600" size={42} />
                                            <p className="font-semibold text-slate-400">
                                                Paste code to see highlighted analysis.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <span className="h-3 w-3 rounded-full border border-red-300 bg-red-200" />
                                Red highlight = repeated line detected
                            </div>
                        </motion.div>
                    </section>

                    {/* AI ASSISTANT + IMPROVED CODE */}
                    <section className="grid gap-6 xl:grid-cols-2">
                        {/* AI ASSISTANT */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur"
                        >
                            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <Bot size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            AI Assistant
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            ChatGPT-style feedback for this task.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => copyText(task.ai_response || "", "ai")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    {copiedAi ? <Check size={17} /> : <Copy size={17} />}
                                    {copiedAi ? "Copied" : "Copy"}
                                </button>
                            </div>

                            <div className="min-h-[430px] max-h-[540px] overflow-auto rounded-[24px] border border-green-100 bg-gradient-to-br from-green-50 to-white p-5">
                                <div className="mb-4 flex justify-end">
                                    <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-green-500 p-4 text-white shadow-lg shadow-green-500/20">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white/80">
                                            <UserRound size={14} />
                                            You
                                        </div>

                                        <p className="text-sm leading-6">
                                            {description ||
                                                "Please analyze this code for reuse opportunities."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-5 shadow-sm">
                                        <div className="mb-3 flex items-center gap-2 text-xs font-black text-green-700">
                                            <Bot size={15} />
                                            AI Assistant
                                            {!typingDone && (
                                                <span className="ml-2 inline-flex gap-1">
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-500" />
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-500 delay-150" />
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-500 delay-300" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="prose prose-sm max-w-none leading-7 text-slate-700">
                                            {typedAiText ? (
                                                <ReactMarkdown>{typedAiText}</ReactMarkdown>
                                            ) : (
                                                <p className="text-slate-400">
                                                    No AI response yet. Click “Run AI Analysis”.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* IMPROVED CODE */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.11 }}
                            className="rounded-[32px] border border-slate-800 bg-slate-950 p-7 text-white shadow-2xl shadow-black/10"
                        >
                            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                                        <Sparkles size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black">
                                            Improved Code
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            AI-generated cleaner version of your code.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => copyText(fixedOnlyCode || fixedCode, "fixed")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                                >
                                    {copiedFixed ? <Check size={17} /> : <Copy size={17} />}
                                    {copiedFixed ? "Copied" : "Copy"}
                                </button>
                            </div>

                            <div className="h-[460px] overflow-auto rounded-[24px] border border-slate-800 bg-black p-5">
                                <div className="mb-5 flex gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                                    <span className="h-3 w-3 rounded-full bg-green-500" />
                                </div>

                                <div className="prose prose-sm prose-invert max-w-none font-mono leading-7 text-green-400">
                                    {fixedCode ? (
                                        <ReactMarkdown>{fixedCode}</ReactMarkdown>
                                    ) : (
                                        <div className="flex h-[330px] items-center justify-center text-center">
                                            <div>
                                                <Sparkles className="mx-auto mb-4 text-slate-600" size={42} />
                                                <p className="font-semibold text-slate-500">
                                                    Click “Fix My Code” to generate an improved version.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* DIFF VIEW */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur"
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                <GitCompare size={28} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-gray-900">
                                    Before / After Diff View
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Compare your original code with the AI-improved version.
                                </p>
                            </div>
                        </div>

                        {!fixedCode ? (
                            <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-10 text-center">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <GitCompare size={32} />
                                </div>

                                <h3 className="text-xl font-black text-gray-900">
                                    No diff available yet
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                                    Generate improved code first to see the before and after comparison.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-3 font-black text-slate-700">
                                        Original Code
                                    </h3>

                                    <div className="max-h-[440px] overflow-auto rounded-2xl bg-slate-100 p-4 font-mono text-sm">
                                        {diffRows.map((row) => (
                                            <div
                                                key={`before-${row.line}`}
                                                className={`flex gap-3 rounded-md px-3 py-[4px] ${row.changed
                                                        ? "bg-red-100 text-red-700"
                                                        : "text-slate-700"
                                                    }`}
                                            >
                                                <span className="w-8 select-none text-right text-slate-400">
                                                    {row.line}
                                                </span>
                                                <span className="whitespace-pre-wrap">
                                                    {row.before || " "}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 font-black text-slate-700">
                                        Improved Code
                                    </h3>

                                    <div className="max-h-[440px] overflow-auto rounded-2xl bg-slate-950 p-4 font-mono text-sm text-green-400">
                                        {diffRows.map((row) => (
                                            <div
                                                key={`after-${row.line}`}
                                                className={`flex gap-3 rounded-md px-3 py-[4px] ${row.changed
                                                        ? "bg-emerald-900/60 text-emerald-300"
                                                        : "text-slate-300"
                                                    }`}
                                            >
                                                <span className="w-8 select-none text-right text-slate-500">
                                                    {row.line}
                                                </span>
                                                <span className="whitespace-pre-wrap">
                                                    {row.after || " "}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.section>
                </div>
            </div>
        </DashboardLayout>
    );
}