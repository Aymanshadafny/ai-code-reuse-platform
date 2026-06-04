import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/api";

export default function StudentDashboard() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getArrayData = (response) => {
        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (Array.isArray(response.data.results)) {
            return response.data.results;
        }

        return [];
    };

    const getNumber = (object, keys, defaultValue = 0) => {
        if (!object) return defaultValue;

        for (const key of keys) {
            const value = object[key];

            if (value !== undefined && value !== null && value !== "") {
                const numberValue = Number(value);

                if (!Number.isNaN(numberValue)) {
                    return numberValue;
                }
            }
        }

        // Check nested analysis/result objects also
        const nestedObjects = [
            object.analysis,
            object.analysis_result,
            object.latest_analysis,
            object.result,
        ];

        for (const nested of nestedObjects) {
            if (!nested) continue;

            for (const key of keys) {
                const value = nested[key];

                if (value !== undefined && value !== null && value !== "") {
                    const numberValue = Number(value);

                    if (!Number.isNaN(numberValue)) {
                        return numberValue;
                    }
                }
            }
        }

        return defaultValue;
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // 1. Load projects list
            const projectsResponse = await API.get("/projects/");
            const projectsData = getArrayData(projectsResponse);

            // 2. Load every project detail also
            // This makes dashboard use the same data as project detail page
            const detailedProjects = await Promise.all(
                projectsData.map(async (project) => {
                    try {
                        const detailResponse = await API.get(`/projects/${project.id}/`);

                        return {
                            ...project,
                            ...detailResponse.data,
                        };
                    } catch (detailError) {
                        console.log("Project detail API not found:", detailError);
                        return project;
                    }
                })
            );

            setProjects(detailedProjects);

            // 3. Optional tasks API
            try {
                const tasksResponse = await API.get("/tasks/");
                setTasks(getArrayData(tasksResponse));
            } catch (taskError) {
                console.log("Global tasks API not found:", taskError);
                setTasks([]);
            }

            // 4. Optional analysis results API
            try {
                const resultsResponse = await API.get("/analysis-results/");
                setResults(getArrayData(resultsResponse));
            } catch (resultError) {
                console.log("Global analysis results API not found:", resultError);
                setResults([]);
            }
        } catch (err) {
            console.error("Dashboard API error:", err);
            setError(
                "Could not load dashboard data. Please check your backend API route /api/projects/."
            );
        } finally {
            setLoading(false);
        }
    };

    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => {
                const dateA = new Date(a.created_at || a.created || a.date_created || 0);
                const dateB = new Date(b.created_at || b.created || b.date_created || 0);
                return dateB - dateA;
            })
            .slice(0, 3);
    }, [projects]);

    const latestProject = recentProjects.length > 0 ? recentProjects[0] : null;

    const analyzedProjects = useMemo(() => {
        return projects.filter((project) => {
            const totalFiles = getNumber(project, [
                "total_files",
                "files_count",
                "file_count",
                "totalFiles",
            ]);

            const totalLines = getNumber(project, [
                "total_lines",
                "lines_count",
                "line_count",
                "totalLines",
            ]);

            const duplicateLines = getNumber(project, [
                "duplicate_lines",
                "duplicated_lines",
                "duplicateLines",
            ]);

            const duplicationPercentage = getNumber(project, [
                "duplication_percentage",
                "duplication_percent",
                "duplication",
                "duplicate_percentage",
            ]);

            return (
                totalFiles > 0 ||
                totalLines > 0 ||
                duplicateLines > 0 ||
                duplicationPercentage > 0
            );
        });
    }, [projects]);

    const totalProjects = projects.length;

    const totalExperiments =
        tasks.length + results.length > 0
            ? tasks.length + results.length
            : analyzedProjects.length;

    const totalFiles = projects.reduce((sum, project) => {
        return (
            sum +
            getNumber(project, [
                "total_files",
                "files_count",
                "file_count",
                "totalFiles",
            ])
        );
    }, 0);

    const totalLines = projects.reduce((sum, project) => {
        return (
            sum +
            getNumber(project, [
                "total_lines",
                "lines_count",
                "line_count",
                "totalLines",
            ])
        );
    }, 0);

    const duplicateLines = projects.reduce((sum, project) => {
        return (
            sum +
            getNumber(project, [
                "duplicate_lines",
                "duplicated_lines",
                "duplicateLines",
            ])
        );
    }, 0);

    const duplicatePercent =
        totalLines > 0 ? Math.round((duplicateLines / totalLines) * 100) : 0;

    const reusablePercent =
        totalLines > 0 ? Math.max(0, Math.min(100, 100 - duplicatePercent)) : 0;

    const successRate =
        totalProjects > 0
            ? Math.round((analyzedProjects.length / totalProjects) * 100)
            : 0;

    const aiSuggestionsApplied =
        results.length > 0
            ? Math.min(100, Math.round((results.length / Math.max(totalExperiments, 1)) * 100))
            : analyzedProjects.length > 0
                ? successRate
                : 0;

    const goToProjects = () => {
        navigate("/dashboard/student/projects");
    };

    const goToCreateProject = () => {
        navigate("/dashboard/student/projects");
    };

    const goToAnalyzeCode = () => {
        if (latestProject) {
            navigate(`/dashboard/student/projects/${latestProject.id}`);
        } else {
            navigate("/dashboard/student/projects");
        }
    };

    const goToResults = () => {
        if (latestProject) {
            navigate(`/dashboard/student/projects/${latestProject.id}`);
        } else {
            navigate("/dashboard/student/projects");
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "No date";

        return new Date(dateValue).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <DashboardLayout>
            {/* PAGE BACKGROUND */}
            <div className="min-h-screen bg-gradient-to-br from-[#eefbf3] via-[#f8fffb] to-[#e8f8ef] px-6 py-8">
                <div className="mx-auto w-full max-w-[1400px] space-y-8">

                    {/* HERO SECTION */}
                    <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#062b1d] via-[#0d3b28] to-[#1f6b43] p-10 text-white shadow-2xl shadow-green-900/20">
                        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-green-400/20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-1/2 h-56 w-56 rounded-full bg-emerald-300/10 blur-2xl"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(134,239,172,0.25),transparent_35%)]"></div>

                        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                                    🎓 Student Workspace
                                </div>

                                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                                    Welcome back to your <br />
                                    <span className="text-green-300">
                                        AI Code Reuse Dashboard
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-xl text-base leading-8 text-green-50/80">
                                    Track your projects, create experiments, analyze duplicated code,
                                    and review AI-powered reuse suggestions in one clean workspace.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={goToCreateProject}
                                        className="rounded-2xl bg-green-400 px-6 py-3 font-bold text-[#062b1d] shadow-lg shadow-green-500/30 transition hover:-translate-y-1 hover:bg-green-300"
                                    >
                                        Create Project →
                                    </button>

                                    <button
                                        type="button"
                                        onClick={goToProjects}
                                        className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
                                    >
                                        View Projects
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT CARD */}
                            <div className="w-full max-w-sm rounded-[30px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                                <div className="rounded-[26px] bg-[#082719] p-6 shadow-xl">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-300">
                                                Project Insight
                                            </p>
                                            <h3 className="mt-2 text-xl font-extrabold">
                                                Reuse Intelligence
                                            </h3>
                                        </div>

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400 text-2xl">
                                            🧠
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl bg-white/10 p-4">
                                            <div className="mb-2 flex justify-between text-sm font-bold">
                                                <span>Code Duplication</span>
                                                <span className="text-green-300">
                                                    {duplicatePercent > 0 ? `${duplicatePercent}%` : "Ready"}
                                                </span>
                                            </div>

                                            <div className="h-2 rounded-full bg-white/15">
                                                <div
                                                    className="h-2 rounded-full bg-green-400"
                                                    style={{
                                                        width: duplicatePercent > 0 ? `${duplicatePercent}%` : "10%",
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-white/10 p-4">
                                            <div className="mb-2 flex justify-between text-sm font-bold">
                                                <span>Reusable Components</span>
                                                <span className="text-green-300">
                                                    {reusablePercent > 0 ? `${reusablePercent}%` : "Pending"}
                                                </span>
                                            </div>

                                            <div className="h-2 rounded-full bg-white/15">
                                                <div
                                                    className="h-2 rounded-full bg-emerald-300"
                                                    style={{
                                                        width: reusablePercent > 0 ? `${reusablePercent}%` : "10%",
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl bg-green-400/10 p-4">
                                            <p className="text-3xl font-black">
                                                {loading ? "..." : totalProjects}
                                            </p>
                                            <p className="text-xs text-green-100/70">
                                                Active Projects
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-green-400/10 p-4">
                                            <p className="text-3xl font-black">
                                                {loading ? "..." : totalExperiments}
                                            </p>
                                            <p className="text-xs text-green-100/70">
                                                Experiments
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
                            {error}
                        </div>
                    )}

                    {/* STATS CARDS */}
                    <section className="grid gap-6 md:grid-cols-3">
                        <div className="group rounded-[30px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                                📁
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                Total Projects
                            </p>

                            <h2 className="mt-2 text-4xl font-black text-gray-900">
                                {loading ? "..." : totalProjects}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Create and manage uploaded source code projects.
                            </p>
                        </div>

                        <div className="group rounded-[30px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                                🧪
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                Experiments
                            </p>

                            <h2 className="mt-2 text-4xl font-black text-gray-900">
                                {loading ? "..." : totalExperiments}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Run AI analysis tasks and compare experiment results.
                            </p>
                        </div>

                        <div className="group rounded-[30px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                                📊
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                Success Rate
                            </p>

                            <h2 className="mt-2 text-4xl font-black text-gray-900">
                                {loading ? "..." : `${successRate}%`}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Projects with completed code analysis.
                            </p>
                        </div>
                    </section>

                    {/* MAIN CONTENT */}
                    <section className="grid gap-6 lg:grid-cols-3">

                        {/* RECENT PROJECTS */}
                        <div className="rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        🚀 Recent Projects
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your latest uploaded projects.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={goToProjects}
                                    className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    View All
                                </button>
                            </div>

                            {loading ? (
                                <div className="rounded-3xl border border-green-100 bg-green-50 p-8 text-center font-bold text-gray-600">
                                    Loading dashboard data...
                                </div>
                            ) : recentProjects.length > 0 ? (
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <button
                                            type="button"
                                            key={project.id}
                                            onClick={() =>
                                                navigate(`/dashboard/student/projects/${project.id}`)
                                            }
                                            className="w-full rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900">
                                                        📁 {project.title || project.name || "Untitled Project"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Created: {formatDate(project.created_at || project.created || project.date_created)}
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                                                    Open →
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                                        ✨
                                    </div>

                                    <h3 className="text-lg font-black text-gray-900">
                                        No projects yet
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                        Start by creating your first project and running an AI analysis.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={goToCreateProject}
                                        className="mt-6 rounded-2xl bg-green-500 px-6 py-3 font-bold text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600"
                                    >
                                        Start First Project
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                            <h2 className="text-2xl font-black text-gray-900">
                                ⚡ Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Start working faster.
                            </p>

                            <div className="mt-6 space-y-4">
                                <button
                                    type="button"
                                    onClick={goToCreateProject}
                                    className="w-full rounded-2xl bg-green-500 px-5 py-4 text-left font-bold text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600"
                                >
                                    + Create New Project
                                </button>

                                <button
                                    type="button"
                                    onClick={goToAnalyzeCode}
                                    className="w-full rounded-2xl bg-blue-500 px-5 py-4 text-left font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-1 hover:bg-blue-600"
                                >
                                    🔍 Analyze Code
                                </button>

                                <button
                                    type="button"
                                    onClick={goToResults}
                                    className="w-full rounded-2xl bg-purple-500 px-5 py-4 text-left font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-1 hover:bg-purple-600"
                                >
                                    📈 View Results
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* BOTTOM SECTION */}
                    <section className="grid gap-6 lg:grid-cols-2">

                        {/* REUSE SUMMARY */}
                        <div className="rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                                    🧩
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Reuse Summary
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Overview of reusable logic and repeated code.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex justify-between text-sm font-bold text-gray-700">
                                        <span>Reusable Components</span>
                                        <span>{loading ? "..." : `${reusablePercent}%`}</span>
                                    </div>

                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-green-500"
                                            style={{
                                                width: `${reusablePercent}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex justify-between text-sm font-bold text-gray-700">
                                        <span>Duplicate Logic</span>
                                        <span>{loading ? "..." : `${duplicatePercent}%`}</span>
                                    </div>

                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-blue-500"
                                            style={{
                                                width: `${duplicatePercent}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex justify-between text-sm font-bold text-gray-700">
                                        <span>AI Suggestions Applied</span>
                                        <span>{loading ? "..." : `${aiSuggestionsApplied}%`}</span>
                                    </div>

                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-purple-500"
                                            style={{
                                                width: `${aiSuggestionsApplied}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <div className="rounded-2xl bg-green-50 p-4 text-center">
                                    <p className="text-xl font-black text-gray-900">
                                        {loading ? "..." : totalFiles}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-500">
                                        Files
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-blue-50 p-4 text-center">
                                    <p className="text-xl font-black text-gray-900">
                                        {loading ? "..." : totalLines}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-500">
                                        Lines
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-purple-50 p-4 text-center">
                                    <p className="text-xl font-black text-gray-900">
                                        {loading ? "..." : duplicateLines}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-500">
                                        Duplicate
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RECOMMENDED STEPS */}
                        <div className="rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                                    🛠️
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Recommended Steps
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Complete these actions to begin your workflow.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={goToCreateProject}
                                    className="flex w-full items-center gap-4 rounded-2xl bg-green-50 p-4 text-left transition hover:-translate-y-1 hover:bg-green-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 font-black text-white">
                                        1
                                    </div>

                                    <div>
                                        <h3 className="font-black text-gray-900">
                                            Create a project
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Upload your source code ZIP file.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={goToAnalyzeCode}
                                    className="flex w-full items-center gap-4 rounded-2xl bg-blue-50 p-4 text-left transition hover:-translate-y-1 hover:bg-blue-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-black text-white">
                                        2
                                    </div>

                                    <div>
                                        <h3 className="font-black text-gray-900">
                                            Run AI analysis
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Detect duplicated logic and reusable patterns.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={goToResults}
                                    className="flex w-full items-center gap-4 rounded-2xl bg-purple-50 p-4 text-left transition hover:-translate-y-1 hover:bg-purple-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 font-black text-white">
                                        3
                                    </div>

                                    <div>
                                        <h3 className="font-black text-gray-900">
                                            Review results
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Check AI suggestions and improved code.
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}