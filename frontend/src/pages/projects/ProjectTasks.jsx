import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    PlusCircle,
    ClipboardList,
    ArrowRight,
    Calendar,
    Sparkles,
    ListChecks,
    CheckCircle2,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

export default function ProjectTasks() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch tasks
    const fetchTasks = async () => {
        setRefreshing(true);

        try {
            const res = await API.get(`/projects/${id}/tasks/`);
            setTasks(res.data);
        } catch (err) {
            console.log("TASK FETCH ERROR:", err.response?.data || err.message);
            alert("Failed to refresh tasks ❌");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [id]);

    // Create task
    const handleCreateTask = async () => {
        if (!taskName.trim()) {
            alert("Enter task name");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post(`/projects/${id}/tasks/`, {
                name: taskName,
            });

            setTasks((prev) => [res.data, ...prev]);
            setTaskName("");
        } catch (err) {
            console.log("FULL ERROR:", err);
            console.log("DATA:", err.response?.data);

            alert(err.response?.data?.name || "Failed to create task ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8">

                {/* SOFT BACKGROUND */}
                <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl"></div>
                <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl"></div>
                <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 rounded-full bg-green-100/70 blur-3xl"></div>

                <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-7">

                    {/* SMALL PAGE HEADER */}
                    <section className="rounded-[30px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/dashboard/student/projects/${id}`)}
                                    className="mb-4 inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    <ArrowLeft size={17} />
                                    Back to Project
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <ClipboardList size={32} />
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-black text-gray-900">
                                            Project Tasks
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                            Create focused tasks, open each task, paste code, and run AI analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:flex">
                                <div className="rounded-2xl bg-green-50 px-5 py-4">
                                    <p className="text-xs font-bold uppercase text-green-700">
                                        Total Tasks
                                    </p>
                                    <p className="mt-1 text-2xl font-black text-gray-900">
                                        {tasks.length}
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
                    </section>

                    {/* CREATE TASK CARD */}
                    <section className="rounded-[30px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <PlusCircle size={28} />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Create New Task
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Example: Analyze Auth Module, Login Validation, or Controller Code.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700">
                                Project ID: {id}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:flex-row">
                            <input
                                id="task-name-input"
                                type="text"
                                placeholder="Enter task name e.g. Analyze Auth Module"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateTask();
                                    }
                                }}
                                className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                            />

                            <button
                                type="button"
                                onClick={handleCreateTask}
                                disabled={loading}
                                className="rounded-2xl bg-green-500 px-8 py-4 font-bold text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </section>

                    {/* QUICK INFO CARDS */}
                    <section className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <ListChecks size={25} />
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                Tasks Created
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {tasks.length}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Current project task list.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <Sparkles size={25} />
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                AI Analysis
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                Ready
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Open task to analyze code.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                <CheckCircle2 size={25} />
                            </div>

                            <p className="text-sm font-semibold text-gray-500">
                                Workspace
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                Active
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Manage project tasks here.
                            </p>
                        </div>
                    </section>

                    {/* TASKS LIST */}
                    <section className="rounded-[32px] border border-white bg-white/90 p-7 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <ClipboardList size={28} />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Your Tasks
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Open a task to analyze source code and view AI suggestions.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={fetchTasks}
                                disabled={refreshing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={17}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-10 text-center">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <ClipboardList size={32} />
                                </div>

                                <h3 className="text-xl font-black text-gray-900">
                                    No tasks yet
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                                    Create your first task above. Example: Analyze Auth Module,
                                    Detect Duplicate Login Logic, or Improve Controller Code.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => document.getElementById("task-name-input")?.focus()}
                                    className="mt-6 rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600"
                                >
                                    Create First Task
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="group rounded-[28px] border border-gray-100 bg-white p-6 shadow-lg shadow-green-900/5 transition hover:-translate-y-2 hover:shadow-2xl"
                                    >
                                        <div className="mb-5 flex items-start justify-between gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <ListChecks size={25} />
                                            </div>

                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                                Task #{task.id}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-gray-900">
                                            {task.name}
                                        </h3>

                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={16} />
                                            <span>
                                                Created:{" "}
                                                {new Date(task.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/dashboard/student/projects/${id}/tasks/${task.id}`)
                                            }
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:bg-indigo-600"
                                        >
                                            Open Task
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}