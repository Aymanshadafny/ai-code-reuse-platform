import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const token = localStorage.getItem("access");

    // ✅ Pages that need white/light navbar
    const isLightNavbar =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/contact" ||
        location.pathname === "/about" ||
        location.pathname.includes("/dashboard");

    // ✅ Fetch user
    useEffect(() => {
        if (token) {
            API.get("/auth/me/")
                .then((res) => setUser(res.data))
                .catch(() => setUser(null));
        } else {
            setUser(null);
        }
    }, [token]);

    // ✅ Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
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

    const avatar = `https://i.pravatar.cc/150?u=${user?.email || "guest"}`;

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
                        className={`text-xl font-black transition ${isLightNavbar
                                ? "text-gray-900"
                                : "text-white"
                            }`}
                    >
                        AI Reuse 🚀
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
                            <div className="relative">

                                {/* USER BUTTON */}
                                <button
                                    onClick={() => setOpen(!open)}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-2 transition ${isLightNavbar
                                            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    <img
                                        src={avatar}
                                        className="h-8 w-8 rounded-full object-cover"
                                        alt="avatar"
                                    />

                                    <span className="text-sm font-semibold">
                                        {user?.username || "User"}
                                    </span>

                                    <span className="text-xs">
                                        {open ? "▲" : "▼"}
                                    </span>
                                </button>

                                {/* DROPDOWN */}
                                {open && (
                                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-900 shadow-2xl shadow-black/10">
                                        <div className="border-b border-gray-100 p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={avatar}
                                                    className="h-11 w-11 rounded-full object-cover"
                                                    alt="avatar"
                                                />

                                                <div className="min-w-0">
                                                    <p className="truncate font-black">
                                                        {user?.username || "User"}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {user?.email || "No email"}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold capitalize text-green-700">
                                                {user?.role || "student"}
                                            </span>
                                        </div>

                                        <Link
                                            to="/dashboard/student"
                                            className="block px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-green-600"
                                            onClick={() => setOpen(false)}
                                        >
                                            Dashboard
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
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
                                        to="/dashboard/student"
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-2xl bg-green-500 px-5 py-4 text-lg font-bold text-white"
                                    >
                                        Dashboard
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