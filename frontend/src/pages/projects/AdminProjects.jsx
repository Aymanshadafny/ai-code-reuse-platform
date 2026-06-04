import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2,
    Folder,
    Download,
    Search,
    User,
    CalendarDays,
    Archive,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    X,
    CheckCircle2,
    Loader2,
} from "lucide-react";

/* ✅ Django backend URL */
const BACKEND_URL = "http://127.0.0.1:8000";

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        project: null,
    });

    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        type: "success",
        message: "",
    });

    const showToast = (type, message) => {
        setToast({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setToast({
                show: false,
                type: "success",
                message: "",
            });
        }, 2600);
    };

    /* ✅ Convert Django media path to full URL */
    const getFileUrl = (filePath) => {
        if (!filePath) return null;

        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            return filePath;
        }

        if (filePath.startsWith("/")) {
            return `${BACKEND_URL}${filePath}`;
        }

        return `${BACKEND_URL}/${filePath}`;
    };

    /* ✅ Download ZIP */
    const handleDownload = (project) => {
        const fileUrl = getFileUrl(project.file);

        console.log("Project file value:", project.file);
        console.log("Final download URL:", fileUrl);

        if (!fileUrl) {
            showToast("error", "No ZIP file found for this project.");
            return;
        }

        const link = document.createElement("a");
        link.href = fileUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = project.name ? `${project.name}.zip` : "project.zip";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Fetch ALL projects
    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects/");
            console.log("PROJECTS DATA:", res.data);
            setProjects(res.data);
        } catch (err) {
            console.log("ERROR:", err.response?.data);
            showToast("error", "Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openDeleteModal = (project) => {
        setDeleteModal({
            open: true,
            project,
        });
    };

    const closeDeleteModal = () => {
        if (deleting) return;

        setDeleteModal({
            open: false,
            project: null,
        });
    };

    // Delete Project
    const confirmDeleteProject = async () => {
        if (!deleteModal.project) return;

        try {
            setDeleting(true);

            await API.delete(`/projects/${deleteModal.project.id}/delete/`);

            setProjects((prevProjects) =>
                prevProjects.filter(
                    (project) => project.id !== deleteModal.project.id
                )
            );

            showToast(
                "success",
                `${deleteModal.project.name || "Project"} deleted successfully.`
            );

            setDeleteModal({
                open: false,
                project: null,
            });
        } catch (err) {
            console.log(err);
            showToast("error", "Delete project failed.");
        } finally {
            setDeleting(false);
        }
    };

    const filteredProjects = useMemo(() => {
        const text = searchTerm.toLowerCase();

        return projects.filter((project) => {
            const name = project.name?.toLowerCase() || "";
            const owner = project.user?.toLowerCase() || "";

            return name.includes(text) || owner.includes(text);
        });
    }, [projects, searchTerm]);

    return (
        <div className="min-h-screen bg-[#f6f8f7]">
            {/* TOAST */}
            <Toast toast={toast} />

            {/* DELETE MODAL */}
            <DeleteProjectModal
                open={deleteModal.open}
                project={deleteModal.project}
                deleting={deleting}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteProject}
            />

            {/* Sidebar */}
            <Sidebar
                role="ADMIN"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Content */}
            <div
                className={`
                    min-h-screen transition-all duration-300
                    ${collapsed ? "lg:ml-[110px]" : "lg:ml-[280px]"}
                `}
            >
                <Navbar />

                <main className="px-4 pb-10 pt-[105px] sm:px-6 lg:px-10">
                    {/* HERO HEADER */}
                    <motion.section
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#061a12] via-[#0b3b2a] to-[#157347] p-6 text-white shadow-2xl sm:p-8 lg:p-10"
                    >
                        {/* Background Glow */}
                        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
                        <div className="absolute right-10 top-10 hidden h-24 w-24 rounded-full border border-white/20 lg:block" />
                        <div className="absolute right-28 top-28 hidden h-10 w-10 rounded-full border border-white/20 lg:block" />

                        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-md">
                                    <Sparkles size={16} />
                                    Admin Project Management
                                </div>

                                <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                    All Projects
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                                    Manage, monitor, download, and remove uploaded user
                                    projects from one clean admin workspace.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                    <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg">
                                        <ShieldCheck size={18} />
                                        Admin Access
                                    </div>

                                    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/85 backdrop-blur-md">
                                        <Archive size={18} />
                                        {projects.length} Total Projects
                                    </div>
                                </div>
                            </div>

                            {/* Right Summary Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="rounded-[1.7rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-white/60">
                                            Project Library
                                        </p>

                                        <h2 className="mt-2 text-4xl font-black">
                                            {projects.length}
                                        </h2>

                                        <p className="mt-2 text-sm text-white/60">
                                            Uploaded projects in the system
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-white/15 p-4">
                                        <Folder size={34} />
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                                    <p className="text-sm leading-6 text-white/70">
                                        You can download project ZIP files or remove
                                        outdated/incorrect submissions directly from this
                                        page.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* TOOLBAR */}
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-8 rounded-[1.7rem] border border-white bg-white/85 p-4 shadow-xl shadow-slate-200/70 backdrop-blur-xl sm:p-5"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">
                                    Project Records
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Showing {filteredProjects.length} of{" "}
                                    {projects.length} projects
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-md">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by project name or owner..."
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* CONTENT */}
                    {loading ? (
                        <LoadingGrid />
                    ) : filteredProjects.length === 0 ? (
                        <EmptyState searchTerm={searchTerm} />
                    ) : (
                        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    onDelete={openDeleteModal}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

/* ===============================
   PROJECT CARD
================================ */
function ProjectCard({ project, index, onDelete, onDownload }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative overflow-hidden rounded-[1.7rem] border border-white bg-white p-6 shadow-xl shadow-slate-200/70 transition-all duration-300 hover:shadow-2xl"
        >
            {/* Glow */}
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />

            <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Folder size={26} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-black text-slate-900">
                                {project.name || "Untitled Project"}
                            </h3>

                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                Project ZIP
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Active
                    </span>
                </div>

                <div className="mt-6 space-y-3">
                    <InfoRow
                        icon={<CalendarDays size={17} />}
                        label="Created"
                        value={
                            project.created_at
                                ? new Date(project.created_at).toLocaleString()
                                : "Not available"
                        }
                    />

                    <InfoRow
                        icon={<User size={17} />}
                        label="Owner"
                        value={project.user || "Unknown"}
                    />
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => onDownload(project)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                        <Download size={16} />
                        Download ZIP
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(project)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

/* ===============================
   CUSTOM DELETE PROJECT MODAL
================================ */
function DeleteProjectModal({ open, project, deleting, onClose, onConfirm }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", duration: 0.45 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl"
                    >
                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                                    <Trash2 size={28} />
                                </div>

                                <button
                                    onClick={onClose}
                                    disabled={deleting}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <h2 className="mt-6 text-2xl font-black text-slate-900">
                                Delete this project?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                You are about to delete{" "}
                                <span className="font-bold text-slate-900">
                                    {project?.name || "this project"}
                                </span>
                                . This action cannot be undone.
                            </p>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Project Owner
                                    </p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                                        {project?.user || "Unknown"}
                                    </p>
                                </div>

                                {project?.created_at && (
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            Created At
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {new Date(
                                                project.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={onClose}
                                    disabled={deleting}
                                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={onConfirm}
                                    disabled={deleting}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Delete Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ===============================
   TOAST MESSAGE
================================ */
function Toast({ toast }) {
    return (
        <AnimatePresence>
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="fixed right-4 top-4 z-[10000] w-[calc(100%-2rem)] max-w-sm"
                >
                    <div
                        className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${toast.type === "success"
                            ? "border-emerald-100"
                            : "border-rose-100"
                            }`}
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toast.type === "success"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                                }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle2 size={22} />
                            ) : (
                                <AlertCircle size={22} />
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-slate-900">
                                {toast.type === "success" ? "Success" : "Error"}
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                {toast.message}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ===============================
   INFO ROW
================================ */
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="truncate text-sm font-semibold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* ===============================
   LOADING GRID
================================ */
function LoadingGrid() {
    return (
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                    key={item}
                    className="h-64 animate-pulse rounded-[1.7rem] bg-white shadow-xl shadow-slate-200/70"
                />
            ))}
        </section>
    );
}

/* ===============================
   EMPTY STATE
================================ */
function EmptyState({ searchTerm }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/70"
        >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
                <AlertCircle size={32} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-900">
                No projects found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {searchTerm
                    ? "No project matches your search. Try another project name or owner."
                    : "There are no uploaded projects in the system yet."}
            </p>
        </motion.div>
    );
}