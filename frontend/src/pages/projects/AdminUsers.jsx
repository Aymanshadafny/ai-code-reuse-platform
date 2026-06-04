import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Toast from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Trash2,
    Mail,
    Folder,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
    AlertCircle,
    Activity,
    X,
    Loader2,
    UserX,
    UserCheck,
} from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        user: null,
    });

    const [deleting, setDeleting] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (type, message) => {
        setToast({
            show: true,
            type,
            message,
        });
    };

    const closeToast = () => {
        setToast({
            show: false,
            type: "success",
            message: "",
        });
    };

    const fetchUsers = async () => {
        try {
            const res = await API.get("/projects/admin/users/");
            setUsers(res.data);
        } catch (err) {
            console.log("ERROR:", err);
            showToast("error", "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (user) => {
        setDeleteModal({
            open: true,
            user,
        });
    };

    const closeDeleteModal = () => {
        if (deleting) return;

        setDeleteModal({
            open: false,
            user: null,
        });
    };

    const confirmDeleteUser = async () => {
        if (!deleteModal.user) return;

        try {
            setDeleting(true);

            await API.delete(`/users/${deleteModal.user.id}/delete/`);

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== deleteModal.user.id)
            );

            showToast(
                "success",
                `${deleteModal.user.username || "User"} deleted successfully.`
            );

            setDeleteModal({
                open: false,
                user: null,
            });
        } catch (err) {
            console.log(err);
            showToast("error", "Delete user failed.");
        } finally {
            setDeleting(false);
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            setStatusLoadingId(user.id);

            const res = await API.patch(
                `/projects/users/${user.id}/toggle-status/`
            );

            setUsers((prevUsers) =>
                prevUsers.map((item) =>
                    item.id === user.id
                        ? {
                            ...item,
                            is_active: res.data.is_active,
                        }
                        : item
                )
            );

            showToast(
                "success",
                res.data.is_active
                    ? `${user.username || "User"} enabled successfully.`
                    : `${user.username || "User"} disabled successfully.`
            );
        } catch (err) {
            console.log(err);
            showToast("error", "Failed to update user status.");
        } finally {
            setStatusLoadingId(null);
        }
    };

    const filteredUsers = useMemo(() => {
        const text = searchTerm.toLowerCase();

        return users.filter((user) => {
            const username = user.username?.toLowerCase() || "";
            const email = user.email?.toLowerCase() || "";

            return username.includes(text) || email.includes(text);
        });
    }, [users, searchTerm]);

    const totalProjects = useMemo(() => {
        return users.reduce((total, user) => {
            return total + Number(user.projects_count || 0);
        }, 0);
    }, [users]);

    const activeUsers = useMemo(() => {
        return users.filter((user) => user.is_active !== false).length;
    }, [users]);

    const disabledUsers = useMemo(() => {
        return users.filter((user) => user.is_active === false).length;
    }, [users]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#f6f8f7] px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
                {/* TOAST */}
                <AnimatePresence>
                    {toast.show && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={closeToast}
                        />
                    )}
                </AnimatePresence>

                {/* DELETE CONFIRMATION MODAL */}
                <DeleteUserModal
                    open={deleteModal.open}
                    user={deleteModal.user}
                    deleting={deleting}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDeleteUser}
                />

                {/* HERO HEADER */}
                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#061a12] via-[#0b3b2a] to-[#157347] p-6 text-white shadow-2xl sm:p-8 lg:p-10"
                >
                    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
                    <div className="absolute right-10 top-10 hidden h-24 w-24 rounded-full border border-white/20 lg:block" />
                    <div className="absolute right-28 top-28 hidden h-10 w-10 rounded-full border border-white/20 lg:block" />

                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-md">
                                <Sparkles size={16} />
                                Admin User Management
                            </div>

                            <h1 className="flex items-center gap-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                <Users className="hidden sm:block" size={42} />
                                Users Management
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                                Monitor registered users, review project activity,
                                disable accounts, and manage platform users from one
                                clean admin workspace.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg">
                                    <ShieldCheck size={18} />
                                    Admin Access
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/85 backdrop-blur-md">
                                    <Activity size={18} />
                                    Live User Records
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-[1.7rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-white/60">
                                        Total Users
                                    </p>

                                    <h2 className="mt-2 text-4xl font-black">
                                        {users.length}
                                    </h2>

                                    <p className="mt-2 text-sm text-white/60">
                                        Registered accounts in your platform
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/15 p-4">
                                    <UserRound size={34} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <p className="text-xs text-white/50">
                                        Active
                                    </p>
                                    <h3 className="mt-1 text-2xl font-black">
                                        {activeUsers}
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-white/10 p-4">
                                    <p className="text-xs text-white/50">
                                        Disabled
                                    </p>
                                    <h3 className="mt-1 text-2xl font-black">
                                        {disabledUsers}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* SUMMARY CARDS */}
                {!loading && (
                    <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
                        <SummaryCard
                            icon={<Users size={24} />}
                            title="Total Users"
                            value={users.length}
                            text="All registered users"
                        />

                        <SummaryCard
                            icon={<UserCheck size={24} />}
                            title="Active Users"
                            value={activeUsers}
                            text="Users allowed to login"
                        />

                        <SummaryCard
                            icon={<UserX size={24} />}
                            title="Disabled Users"
                            value={disabledUsers}
                            text="Users blocked from login"
                        />

                        <SummaryCard
                            icon={<Folder size={24} />}
                            title="Total Projects"
                            value={totalProjects}
                            text="Projects created by users"
                        />
                    </section>
                )}

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
                                User Records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Showing {filteredUsers.length} of {users.length} users
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
                                placeholder="Search by username or email..."
                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* CONTENT */}
                {loading ? (
                    <LoadingGrid />
                ) : filteredUsers.length === 0 ? (
                    <EmptyState searchTerm={searchTerm} />
                ) : (
                    <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredUsers.map((user, index) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                index={index}
                                onDelete={openDeleteModal}
                                onToggleStatus={toggleUserStatus}
                                statusLoadingId={statusLoadingId}
                            />
                        ))}
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}

/* ===============================
   USER CARD
================================ */
function UserCard({
    user,
    index,
    onDelete,
    onToggleStatus,
    statusLoadingId,
}) {
    const firstLetter = user.username
        ? user.username.charAt(0).toUpperCase()
        : "U";

    const isActive = user.is_active !== false;
    const isStatusLoading = statusLoadingId === user.id;

    // ✅ Admin/superuser safety
    const isAdminUser =
        user.is_superuser === true ||
        user.is_staff === true ||
        user.role === "admin" ||
        user.role === "ADMIN" ||
        user.username === "admin";

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative overflow-hidden rounded-[1.7rem] border border-white bg-white p-6 shadow-xl shadow-slate-200/70 transition-all duration-300 hover:shadow-2xl"
        >
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />

            <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg ${isActive
                                ? "bg-gradient-to-br from-emerald-600 to-green-400 shadow-emerald-600/20"
                                : "bg-gradient-to-br from-slate-500 to-slate-400 shadow-slate-500/20"
                                }`}
                        >
                            {firstLetter}
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-black text-slate-900">
                                {user.username || "Unknown User"}
                            </h3>

                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                Platform User
                            </p>
                        </div>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                            }`}
                    >
                        {isActive ? "Active" : "Disabled"}
                    </span>
                </div>

                <div className="mt-6 space-y-3">
                    <InfoRow
                        icon={<Mail size={17} />}
                        label="Email"
                        value={user.email || "No email"}
                    />

                    <InfoRow
                        icon={<Folder size={17} />}
                        label="Projects"
                        value={`${user.projects_count || 0} Projects`}
                    />
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        disabled={isStatusLoading || isAdminUser}
                        title={isAdminUser ? "Admin account cannot be disabled" : ""}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${isAdminUser
                            ? "bg-slate-100 text-slate-400"
                            : isActive
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                            }`}
                    >
                        {isStatusLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Updating...
                            </>
                        ) : isAdminUser ? (
                            <>
                                <ShieldCheck size={16} />
                                Admin
                            </>
                        ) : isActive ? (
                            <>
                                <UserX size={16} />
                                Disable
                            </>
                        ) : (
                            <>
                                <UserCheck size={16} />
                                Enable
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
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
   CUSTOM DELETE MODAL
================================ */
function DeleteUserModal({ open, user, deleting, onClose, onConfirm }) {
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
                                Delete this user?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                You are about to delete{" "}
                                <span className="font-bold text-slate-900">
                                    {user?.username || "this user"}
                                </span>
                                . This action cannot be undone.
                            </p>

                            {user?.email && (
                                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        User Email
                                    </p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                                        {user.email}
                                    </p>
                                </div>
                            )}

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
                                            Delete User
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
   SUMMARY CARD
================================ */
function SummaryCard({ icon, title, value, text }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            className="rounded-[1.7rem] border border-white bg-white p-6 shadow-xl shadow-slate-200/70"
        >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                {icon}
            </div>

            <p className="text-sm font-bold text-slate-500">{title}</p>

            <h3 className="mt-2 text-3xl font-black text-slate-900">
                {value}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {text}
            </p>
        </motion.div>
    );
}

/* ===============================
   LOADING GRID
================================ */
function LoadingGrid() {
    return (
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                No users found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {searchTerm
                    ? "No user matches your search. Try another username or email."
                    : "There are no users registered in the platform yet."}
            </p>
        </motion.div>
    );
}