import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
    FolderPlus,
    UploadCloud,
    Sparkles,
    Code2,
    GitBranch,
    BrainCircuit,
    FileSearch,
    ArrowRight,
    Layers3,
    ShieldCheck,
} from "lucide-react";

export default function StudentProjects() {
    const [projectName, setProjectName] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [file, setFile] = useState(null);
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
    };

    const processCards = [
        {
            title: "Upload Codebase",
            desc: "Start by creating a project and uploading your existing source code for AI analysis.",
            icon: <UploadCloud size={22} />,
        },
        {
            title: "Analyze Reuse",
            desc: "The platform studies your files, structure, and repeated code patterns to find reuse opportunities.",
            icon: <FileSearch size={22} />,
        },
        {
            title: "AI Suggestions",
            desc: "Receive intelligent recommendations for reusable components, functions, and cleaner architecture.",
            icon: <BrainCircuit size={22} />,
        },
    ];

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects/");
            setProjects(res.data);
        } catch (err) {
            console.log("FETCH PROJECTS ERROR:", err.response?.data);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleUpload = async () => {
        if (!projectName || !file) {
            alert("Please add project name and file");
            return;
        }

        const formData = new FormData();
        formData.append("name", projectName);
        formData.append("file", file);

        try {
            const res = await API.post("/projects/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Project uploaded 🚀");

            setProjects((prev) => [res.data, ...prev]);

            setProjectName("");
            setFile(null);

        } catch (err) {
            console.log(err.response?.data);
            alert("Upload failed ❌");
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f8f6] text-slate-900">
            {/* Sidebar */}
            <Sidebar
                role="STUDENT"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Content */}
            <div
                className={`
                    min-h-screen transition-all duration-300
                    ${collapsed ? "ml-[110px]" : "ml-[280px]"}
                `}
            >
                <Navbar />

                <main className="relative mt-[82px] overflow-hidden px-6 py-8 lg:px-10">
                    {/* Background Decoration */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-28 right-10 h-80 w-80 rounded-full bg-emerald-300/30 blur-[100px]" />
                        <div className="absolute top-72 -left-24 h-96 w-96 rounded-full bg-green-400/20 blur-[120px]" />
                        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-teal-300/20 blur-[110px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl">
                        {/* ================= HERO HEADER ================= */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.55 }}
                            className="
                                relative overflow-hidden rounded-[34px]
                                border border-white/70
                                bg-gradient-to-br from-[#062419] via-[#0b3b2a] to-[#0f5f3f]
                                p-7 text-white shadow-[0_30px_80px_rgba(4,27,20,0.25)]
                                lg:p-10
                            "
                        >
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-300/25 blur-[70px]" />
                                <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black/25 to-transparent" />
                                <div className="absolute right-8 top-8 hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-emerald-100 backdrop-blur-xl lg:block">
                                    AI Code Reuse Platform
                                </div>
                            </div>

                            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                                <div>
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur-xl">
                                        <Sparkles size={16} />
                                        Student Workspace
                                    </div>

                                    <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight lg:text-6xl">
                                        Build smarter projects with{" "}
                                        <span className="bg-gradient-to-r from-emerald-200 to-green-400 bg-clip-text text-transparent">
                                            AI Code Reuse
                                        </span>
                                    </h1>

                                    <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50/75 lg:text-lg">
                                        Create your project, upload your source code, and let the system
                                        help you discover reusable logic, repeated patterns, and better
                                        ways to organize your software. This workspace is designed to make
                                        your final year project look professional, modern, and research-focused.
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <a
                                            href="#create-project"
                                            className="
                                                inline-flex items-center gap-2 rounded-2xl
                                                bg-gradient-to-r from-emerald-300 to-green-500
                                                px-5 py-3 text-sm font-extrabold text-[#041b14]
                                                shadow-[0_18px_40px_rgba(34,197,94,0.35)]
                                                transition hover:scale-[1.03]
                                            "
                                        >
                                            Create Project
                                            <ArrowRight size={17} />
                                        </a>

                                        <button
                                            className="
                                                inline-flex items-center gap-2 rounded-2xl
                                                border border-white/15 bg-white/10 px-5 py-3
                                                text-sm font-bold text-white backdrop-blur-xl
                                                transition hover:bg-white/15
                                            "
                                        >
                                            <Code2 size={17} />
                                            How It Works
                                        </button>
                                    </div>
                                </div>

                                {/* Hero Glass Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.15 }}
                                    className="
                                        rounded-[28px] border border-white/15
                                        bg-white/10 p-5 backdrop-blur-2xl
                                        shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                                    "
                                >
                                    <div className="rounded-[24px] bg-[#041b14]/80 p-5">
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
                                                    Project Insight
                                                </p>
                                                <h3 className="mt-1 text-xl font-black">
                                                    Reuse Intelligence
                                                </h3>
                                            </div>

                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#041b14]">
                                                <BrainCircuit size={24} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-white">
                                                        Code Duplication
                                                    </span>
                                                    <span className="text-xs font-bold text-emerald-300">
                                                        Scan Ready
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-300 to-green-500" />
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-white">
                                                        Reusable Components
                                                    </span>
                                                    <span className="text-xs font-bold text-emerald-300">
                                                        AI Assisted
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-green-300 to-emerald-500" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-1">
                                                <div className="rounded-2xl bg-emerald-300/10 p-4">
                                                    <GitBranch className="mb-3 text-emerald-300" size={22} />
                                                    <p className="text-2xl font-black">0</p>
                                                    <p className="text-xs text-emerald-100/60">
                                                        Active Projects
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-emerald-300/10 p-4">
                                                    <Layers3 className="mb-3 text-emerald-300" size={22} />
                                                    <p className="text-2xl font-black">AI</p>
                                                    <p className="text-xs text-emerald-100/60">
                                                        Reuse Engine
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* ================= PROCESS CARDS ================= */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
                        >
                            {processCards.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                                    className="
                                        group rounded-[26px] border border-white/80
                                        bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]
                                        backdrop-blur-xl transition
                                        hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]
                                    "
                                >
                                    <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 text-emerald-700 transition group-hover:scale-110">
                                        {item.icon}
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-slate-500">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.section>

                        {/* ================= MAIN GRID ================= */}
                        <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.4fr]">
                            {/* ================= CREATE PROJECT ================= */}
                            <motion.div
                                id="create-project"
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.55, delay: 0.2 }}
                                className="
                                    rounded-[30px] border border-white/80
                                    bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]
                                    backdrop-blur-xl
                                "
                            >
                                <div className="mb-6 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-[#041b14] shadow-[0_16px_35px_rgba(34,197,94,0.25)]">
                                            <FolderPlus size={26} />
                                        </div>

                                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                            Create New Project
                                        </h2>

                                        <p className="mt-2 text-sm leading-7 text-slate-500">
                                            Give your project a clear name. Later you can upload files,
                                            analyze code duplication, and generate AI-based reuse suggestions.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Project Name */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Project Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Example: React E-Commerce Platform"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="
                w-full rounded-2xl border border-slate-200
                bg-slate-50 px-4 py-4 text-sm font-semibold
                text-slate-800 outline-none transition
                placeholder:text-slate-400
                focus:border-emerald-400 focus:bg-white
                focus:ring-4 focus:ring-emerald-100
            "
                                        />
                                    </div>

                                    {/* 🔥 FILE INPUT (NEW) */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Upload Code (.zip)
                                        </label>

                                        <input
                                            type="file"
                                            accept=".zip"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="
                w-full rounded-2xl border border-slate-200
                bg-white px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-300
            "
                                        />
                                    </div>

                                    {/* 🔥 BUTTON (UPDATED) */}
                                    <button
                                        onClick={handleUpload}
                                        className="
            group flex w-full items-center justify-center gap-2
            rounded-2xl bg-gradient-to-r from-[#063d2b] via-emerald-600 to-green-500
            px-5 py-4 text-sm font-black text-white
            shadow-[0_20px_45px_rgba(34,197,94,0.28)]
            transition hover:scale-[1.02]
            hover:shadow-[0_25px_55px_rgba(34,197,94,0.35)]
        "
                                    >
                                        <UploadCloud size={19} />
                                        Upload Project
                                        <ArrowRight
                                            size={17}
                                            className="transition group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>

                                <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                                    <div className="flex gap-3">
                                        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                                        <div>
                                            <h4 className="text-sm font-black text-emerald-900">
                                                Smart project analysis
                                            </h4>
                                            <p className="mt-1 text-xs leading-6 text-emerald-800/70">
                                                Your uploaded code will be used to study reusable logic,
                                                repeated code blocks, and possible improvements in structure.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ================= PROJECT LIST ================= */}
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.55, delay: 0.28 }}
                                className="
                                    rounded-[30px] border border-white/80
                                    bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]
                                    backdrop-blur-xl
                                "
                            >
                                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                    <div>
                                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                            <Sparkles size={14} />
                                            Project Library
                                        </div>

                                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                            Your AI Reuse Projects
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                                            All your uploaded projects will appear here. You will be able
                                            to open each project, review AI findings, compare code reuse
                                            opportunities, and improve your software design.
                                        </p>
                                    </div>

                                    <button
                                        className="
                                            inline-flex items-center justify-center gap-2 rounded-2xl
                                            border border-slate-200 bg-white px-4 py-3
                                            text-sm font-black text-slate-700 shadow-sm
                                            transition hover:border-emerald-200 hover:bg-emerald-50
                                        "
                                    >
                                        <FileSearch size={17} />
                                        View Reports
                                    </button>
                                </div>

                                {projects.length === 0 ? (
                                    <div
                                        className="
            relative overflow-hidden rounded-[26px]
            border border-dashed border-emerald-300/70
            bg-gradient-to-br from-emerald-50 via-white to-green-50
            px-6 py-16 text-center
        "
                                    >
                                        <div className="relative mx-auto flex max-w-md flex-col items-center">
                                            <div
                                                className="
                    mb-5 flex h-20 w-20 items-center justify-center rounded-[26px]
                    bg-gradient-to-br from-[#063d2b] to-emerald-500
                    text-white shadow-[0_20px_50px_rgba(34,197,94,0.30)]
                "
                                            >
                                                <Code2 size={34} />
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-950">
                                                No projects yet
                                            </h3>

                                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                                Create your first AI code reuse project to begin analyzing your software.
                                            </p>

                                            <a
                                                href="#create-project"
                                                className="
                    mt-6 inline-flex items-center gap-2 rounded-2xl
                    bg-[#041b14] px-5 py-3 text-sm font-black text-white
                    shadow-[0_18px_45px_rgba(4,27,20,0.25)]
                    transition hover:scale-[1.03]
                "
                                            >
                                                Start First Project
                                                <ArrowRight size={17} />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {projects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="
                    rounded-2xl border border-emerald-100
                    bg-white p-5 shadow-sm transition hover:shadow-md
                "
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-950">
                                                            {project.name}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Uploaded: {new Date(project.created_at).toLocaleString()}
                                                        </p>

                                                        <p className="mt-1 text-xs text-emerald-700">
                                                            {project.file}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate(`/dashboard/student/projects/${project.id}`)}
                                                        className="
        rounded-xl bg-[#041b14] px-4 py-2
        text-sm font-bold text-white
        transition hover:scale-[1.03]
    "
                                                    >
                                                        Open
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Later: map projects here */}
                            </motion.div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}