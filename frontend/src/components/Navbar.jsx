import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../api/api";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState("");
    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const token = localStorage.getItem("access");

    const role = user?.role?.toLowerCase();
    const isAdmin = role === "admin" || role === "administrator";
    const isStudent = !isAdmin;

    const dashboardPath = isAdmin ? "/dashboard/admin" : "/dashboard/student";

    const projectsPath = isAdmin
        ? "/dashboard/admin/projects"
        : "/dashboard/student/projects";

    const usersPath = "/dashboard/admin/users";
    const reportsPath = "/dashboard/admin/reports";

    // ✅ Pages that need white/light navbar
    const isLightNavbar =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password" ||
        location.pathname === "/contact" ||
        location.pathname === "/about" ||
        location.pathname === "/profile-settings" ||
        location.pathname.includes("/dashboard");

    // ✅ Fetch user
    useEffect(() => {
        if (token) {
            API.get("/auth/me/")
                .then((res) => {
                    setUser(res.data);

                    const imageKey = `profile_image_${res.data.id}`;
                    const savedImage = localStorage.getItem(imageKey);

                    setProfileImage(savedImage || "");
                })
                .catch(() => {
                    setUser(null);
                    setProfileImage("");
                });
        } else {
            setUser(null);
            setProfileImage("");
        }
    }, [token]);

    // ✅ Update navbar image immediately when profile image changes
    useEffect(() => {
        const updateProfileImage = () => {
            if (user?.id) {
                const imageKey = `profile_image_${user.id}`;
                const savedImage = localStorage.getItem(imageKey);

                setProfileImage(savedImage || "");
            }
        };

        window.addEventListener("profileImageUpdated", updateProfileImage);

        return () => {
            window.removeEventListener("profileImageUpdated", updateProfileImage);
        };
    }, [user?.id]);

    // ✅ Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Important fix:
    // Do NOT use localStorage.clear()
    // Because it deletes profile image also.
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
        setOpen(false);
        setMobileMenu(false);

        navigate("/login");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    const avatar =
        profileImage || `https://i.pravatar.cc/150?u=${user?.email || "guest"}`;

    const getDesktopLinkClass = (path) => {
        const active = location.pathname === path;

        if (isLightNavbar) {
            return `text-sm font-semibold transition ${active
                    ? "text-green-500"
                    : "text-gray-600 hover:text-green-500"
                }`;
        }

        return `text-sm font-semibold transition ${active
                ? "text-green-400"
                : scrolled
                    ? "text-white/80 hover:text-white"
                    : "text-white/80 hover:text-white"
            }`;
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav
                className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 backdrop-blur-xl ${isLightNavbar
                        ? "border-b border-gray-100 bg-white/90 shadow-sm"
                        : scrolled
                            ? "bg-[#071b13]/85 shadow-lg shadow-black/10"
                            : "bg-transparent"
                    }`}
            >
                <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className={`text-xl font-black transition ${isLightNavbar ? "text-gray-900" : "text-white"
                            }`}
                    >
                        AI Reuse 
                    </Link>

                    {/* DESKTOP LINKS */}
                    <div className="hidden items-center gap-10 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={getDesktopLinkClass(link.path)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="hidden items-center gap-4 md:flex">
                        {!token ? (
                            <>
                                <Link
                                    to="/login"
                                    className={`text-sm font-semibold transition ${isLightNavbar
                                            ? "text-gray-700 hover:text-green-500"
                                            : "text-white/80 hover:text-white"
                                        }`}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div ref={dropdownRef} className="relative">

                                {/* USER BUTTON */}
                                <button
                                    onClick={() => setOpen(!open)}
                                    className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${isLightNavbar
                                            ? "border border-gray-100 bg-gray-50 text-gray-900 shadow-sm hover:bg-white hover:shadow-md"
                                            : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    <img
                                        src={avatar}
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                                        alt="avatar"
                                    />

                                    <span className="max-w-[110px] truncate text-sm font-bold">
                                        {user?.username || "User"}
                                    </span>

                                    <span
                                        className={`text-xs transition duration-300 ${open ? "rotate-180" : ""
                                            }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {/* PREMIUM DROPDOWN */}
                                {open && (
                                    <div className="absolute right-0 mt-4 w-[330px] overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-2xl shadow-green-900/15">

                                        {/* HEADER */}
                                        <div className="relative overflow-hidden bg-gradient-to-br from-[#062b1d] via-[#0d3b28] to-[#1f6b43] px-5 pb-12 pt-5 text-white">
                                            <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-green-300/20 blur-2xl"></div>
                                            <div className="absolute bottom-[-50px] left-8 h-28 w-28 rounded-full bg-emerald-300/10 blur-2xl"></div>

                                            <div className="relative z-10 flex items-center gap-4">
                                                <img
                                                    src={avatar}
                                                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20"
                                                    alt="avatar"
                                                />

                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-black">
                                                        {user?.username || "User"}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm text-green-50/70">
                                                        {user?.email || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ROLE BADGE */}
                                        <div className="relative px-5">
                                            <div className="-mt-7 rounded-2xl border border-green-100 bg-white p-4 shadow-xl shadow-green-900/10">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                                            Current Role
                                                        </p>

                                                        <p className="mt-1 text-sm font-black uppercase text-gray-900">
                                                            {isAdmin ? "Administrator" : "Student"}
                                                        </p>
                                                    </div>

                                                    <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase text-green-700">
                                                        {isAdmin ? "Admin" : "Student"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MENU ITEMS */}
                                        <div className="p-4">

                                            {/* COMMON DASHBOARD LINK */}
                                            <Link
                                                to={dashboardPath}
                                                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                                    📊
                                                </span>

                                                <div>
                                                    <p>
                                                        {isAdmin
                                                            ? "Admin Dashboard"
                                                            : "Dashboard"}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        {isAdmin
                                                            ? "Go to admin panel"
                                                            : "Go to your workspace"}
                                                    </p>
                                                </div>
                                            </Link>

                                            {/* ADMIN LINKS */}
                                            {isAdmin && (
                                                <>
                                                    <Link
                                                        to={projectsPath}
                                                        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                            📁
                                                        </span>

                                                        <div>
                                                            <p>All Projects</p>
                                                            <p className="text-xs font-medium text-gray-400">
                                                                Manage all projects
                                                            </p>
                                                        </div>
                                                    </Link>

                                                    <Link
                                                        to={usersPath}
                                                        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                            👥
                                                        </span>

                                                        <div>
                                                            <p>Users</p>
                                                            <p className="text-xs font-medium text-gray-400">
                                                                Manage students
                                                            </p>
                                                        </div>
                                                    </Link>

                                                    <Link
                                                        to={reportsPath}
                                                        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                                            📄
                                                        </span>

                                                        <div>
                                                            <p>Reports</p>
                                                            <p className="text-xs font-medium text-gray-400">
                                                                View analytics
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </>
                                            )}

                                            {/* STUDENT LINKS */}
                                            {isStudent && (
                                                <Link
                                                    to={projectsPath}
                                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                        📁
                                                    </span>

                                                    <div>
                                                        <p>My Projects</p>
                                                        <p className="text-xs font-medium text-gray-400">
                                                            Manage your projects
                                                        </p>
                                                    </div>
                                                </Link>
                                            )}

                                            {/* COMMON PROFILE LINK */}
                                            <Link
                                                to="/profile-settings"
                                                className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                    ⚙️
                                                </span>

                                                <div>
                                                    <p>Profile Settings</p>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        Edit account details
                                                    </p>
                                                </div>
                                            </Link>

                                            <div className="my-3 h-px bg-gray-100"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
                                            >
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                                                    ⏻
                                                </span>

                                                <div>
                                                    <p>Logout</p>
                                                    <p className="text-xs font-medium text-red-300">
                                                        Sign out from account
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setMobileMenu(true)}
                        className={`text-3xl md:hidden ${isLightNavbar ? "text-gray-900" : "text-white"
                            }`}
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {mobileMenu && (
                <div className="fixed inset-0 z-[999] bg-[#071b13]/95 p-6 backdrop-blur-xl">

                    <div className="mb-10 flex items-center justify-between">
                        <Link
                            to="/"
                            onClick={() => setMobileMenu(false)}
                            className="text-xl font-black text-white"
                        >
                            AI Reuse 🚀
                        </Link>

                        <button
                            onClick={() => setMobileMenu(false)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-2xl text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenu(false)}
                                className={`block rounded-2xl px-5 py-4 text-lg font-bold transition ${location.pathname === link.path
                                        ? "bg-green-500 text-white"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-8">
                        {!token ? (
                            <div className="space-y-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenu(false)}
                                    className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white hover:bg-white/20"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenu(false)}
                                    className="block rounded-2xl bg-green-500 px-5 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                    <img
                                        src={avatar}
                                        className="h-12 w-12 rounded-full object-cover"
                                        alt="avatar"
                                    />

                                    <div className="min-w-0">
                                        <p className="truncate font-black text-white">
                                            {user?.username || "User"}
                                        </p>

                                        <p className="truncate text-sm text-white/60">
                                            {user?.email || "No email"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        to={dashboardPath}
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-2xl bg-green-500 px-5 py-4 text-lg font-bold text-white"
                                    >
                                        {isAdmin ? "Admin Dashboard" : "Dashboard"}
                                    </Link>

                                    {isAdmin ? (
                                        <>
                                            <Link
                                                to={projectsPath}
                                                onClick={() => setMobileMenu(false)}
                                                className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white"
                                            >
                                                All Projects
                                            </Link>

                                            <Link
                                                to={usersPath}
                                                onClick={() => setMobileMenu(false)}
                                                className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white"
                                            >
                                                Users
                                            </Link>

                                            <Link
                                                to={reportsPath}
                                                onClick={() => setMobileMenu(false)}
                                                className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white"
                                            >
                                                Reports
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to={projectsPath}
                                            onClick={() => setMobileMenu(false)}
                                            className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white"
                                        >
                                            My Projects
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile-settings"
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white"
                                    >
                                        Profile Settings
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full rounded-2xl bg-red-500/10 px-5 py-4 text-left text-lg font-bold text-red-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}