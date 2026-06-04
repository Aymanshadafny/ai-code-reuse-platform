import { useState, useEffect } from "react";
import API from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Toast from "../../components/Toast";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");

        // 🚫 only redirect if NOT coming from login action
        if (token && !toast) {
            navigate("/dashboard");
        }
    }, [navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login/", form);

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            // ✅ show toast
            setToast({
                message: "Login successful 🚀",
                type: "success",
            });

            // ⏳ wait before redirect
            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (err) {
            if (err.response?.data?.detail) {
                setToast({
                    message: err.response.data.detail,
                    type: "error",
                });
            } else {
                setToast({
                    message: "Login failed ❌",
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen overflow-hidden relative"
            style={{
                background: `
                    radial-gradient(circle at top left, rgba(74,222,128,0.16), transparent 22%),
                    radial-gradient(circle at bottom right, rgba(34,197,94,0.18), transparent 24%),
                    radial-gradient(circle at center, rgba(134,239,172,0.10), transparent 30%),
                    linear-gradient(180deg, #EAF8EE 0%, #E4F5E8 45%, #DCEFE1 100%)
                `,
            }}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <Navbar />

            {/* extra ambient glows */}
            <div className="pointer-events-none absolute top-24 left-8 w-[320px] h-[320px] bg-[#22C55E]/10 blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute bottom-10 right-10 w-[320px] h-[320px] bg-[#86EFAC]/10 blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4ADE80]/5 blur-[140px] rounded-full" />

            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-[1280px]"
                >
                    <div className="grid lg:grid-cols-2 bg-white/95 backdrop-blur-sm rounded-[36px] shadow-[0_30px_80px_rgba(0,0,0,0.10)] overflow-hidden border border-white/80 min-h-[720px]">
                        {/* LEFT SIDE */}
                        <div className="flex items-center px-6 sm:px-10 md:px-14 py-12 md:py-16">
                            <div className="w-full max-w-[430px]">
                                {/* Mini brand */}
                                <div className="flex items-center gap-2 mb-12">
                                    <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-[#16A34A] to-[#4ADE80]" />
                                    <span className="text-[#111827] font-semibold tracking-tight">
                                        AI Code Reuse Platform
                                    </span>
                                </div>

                                {/* Heading */}
                                <motion.div
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.12, duration: 0.6 }}
                                >
                                    <h1 className="text-4xl sm:text-5xl font-bold text-[#111827] leading-[1.08] tracking-tight">
                                        Hello,
                                        <br />
                                        Welcome Back
                                    </h1>

                                    <p className="mt-5 text-[#6B7280] text-base leading-8 max-w-md">
                                        Sign in to continue your AI experiments, review
                                        analytics, compare results, and explore smarter
                                        code reuse insights.
                                    </p>
                                </motion.div>

                                {/* Form */}
                                <motion.form
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.22, duration: 0.6 }}
                                    className="mt-10 space-y-4"
                                >
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            value={form.username}
                                            onChange={(e) =>
                                                setForm({ ...form, username: e.target.value })
                                            }
                                            className="w-full h-14 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={form.password}
                                            onChange={(e) =>
                                                setForm({ ...form, password: e.target.value })
                                            }
                                            className="w-full h-14 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                        />
                                    </div>

                                    {/* options row */}
                                    <div className="flex items-center justify-between gap-4 pt-1">
                                        <label className="inline-flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                                className="h-4 w-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#22C55E]"
                                            />
                                            Remember me
                                        </label>

                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-[#6B7280] hover:text-[#16A34A] transition"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {/* button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-3 inline-flex h-14 min-w-[150px] items-center justify-center rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] px-8 text-[#071712] font-semibold shadow-[0_12px_30px_rgba(34,197,94,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(34,197,94,0.30)] disabled:opacity-60"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>
                                </motion.form>

                                {/* signup */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.34, duration: 0.6 }}
                                    className="mt-20 text-sm text-[#6B7280]"
                                >
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        to="/register"
                                        className="font-semibold text-[#16A34A] hover:text-[#15803D] transition"
                                    >
                                        Sign Up
                                    </Link>
                                </motion.p>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="hidden lg:flex items-center justify-center p-6 md:p-8"
                        >
                            <div className="relative w-full h-full min-h-[640px] rounded-[30px] overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#14532D] to-[#22C55E]">
                                {/* glow overlays */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />

                                {/* clouds */}
                                <div className="absolute -top-6 -left-8 w-48 h-24 bg-white rounded-full" />
                                <div className="absolute top-6 left-20 w-28 h-16 bg-white rounded-full" />
                                <div className="absolute top-14 right-20 w-24 h-14 bg-white rounded-full" />
                                <div className="absolute top-0 right-0 w-40 h-28 bg-white rounded-full" />
                                <div className="absolute bottom-0 left-0 w-40 h-20 bg-white rounded-full" />
                                <div className="absolute bottom-10 right-8 w-36 h-16 bg-white rounded-full" />

                                {/* check bubble */}
                                <div className="absolute top-28 left-16 bg-white rounded-[28px] shadow-[0_16px_30px_rgba(0,0,0,0.18)] px-7 py-5 after:absolute after:left-10 after:bottom-[-10px] after:w-5 after:h-5 after:bg-white after:rotate-45">
                                    <span className="text-5xl text-[#22C55E] font-bold">✓</span>
                                </div>

                                {/* lock */}
                                <div className="absolute right-10 top-[47%] -translate-y-1/2">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-[10px] border-white rounded-t-full border-b-0 mx-auto" />
                                        <div className="w-36 h-40 bg-white rounded-[18px] shadow-[0_16px_30px_rgba(0,0,0,0.18)] flex items-center justify-center -mt-3">
                                            <div className="w-10 h-10 rounded-full bg-[#22C55E] relative">
                                                <div className="absolute left-1/2 top-full -translate-x-1/2 w-3 h-8 bg-[#22C55E] rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* phone */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[8deg]">
                                    <div className="w-[260px] h-[470px] rounded-[38px] bg-[#071712] shadow-[0_30px_60px_rgba(0,0,0,0.35)] p-3">
                                        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D]">
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#0B1D17]/50 rounded-full" />
                                            <div className="absolute top-5 right-5 flex flex-col gap-1.5">
                                                <span className="w-4 h-[2px] bg-white/80 rounded-full" />
                                                <span className="w-4 h-[2px] bg-white/80 rounded-full" />
                                                <span className="w-4 h-[2px] bg-white/80 rounded-full" />
                                            </div>

                                            {/* fingerprint area */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative flex items-center justify-center">
                                                    <div className="absolute w-44 h-44 border-4 border-white/15 rounded-[30px]" />
                                                    <div className="absolute w-36 h-36 border-4 border-white/20 rounded-[28px]" />
                                                    <div className="absolute w-28 h-28 border-4 border-white/25 rounded-[24px]" />

                                                    <svg
                                                        width="110"
                                                        height="110"
                                                        viewBox="0 0 110 110"
                                                        fill="none"
                                                        className="relative z-10"
                                                    >
                                                        <path d="M55 18C39 18 27 30 27 46V63" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 28C44 28 36 36 36 47V66" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 39C49 39 45 43 45 49V72" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 18C71 18 83 30 83 46V63" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 28C66 28 74 36 74 47V66" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 39C61 39 65 43 65 49V72" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M55 48V82" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-36 h-2 bg-white/50 rounded-full" />
                                            <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] text-white/80 text-center w-[190px] leading-4">
                                                Secure access for your AI experiments and code reuse insights
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* floating small dots */}
                                <div className="absolute left-20 bottom-24 w-3 h-3 rounded-full bg-white/80" />
                                <div className="absolute left-28 bottom-36 w-2 h-2 rounded-full bg-white/70" />
                                <div className="absolute right-36 top-40 w-2.5 h-2.5 rounded-full bg-white/80" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}