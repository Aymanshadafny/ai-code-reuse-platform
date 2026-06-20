import { useState, useEffect } from "react";
import API from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Toast from "../../components/Toast";

export default function Login() {
    const [form, setForm] = useState({
        login: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token && !toast) {
            navigate("/dashboard/student");
        }
    }, [navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login/", {
                username: form.login,
                password: form.password,
            });

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            setToast({
                message: "Login successful 🚀",
                type: "success",
            });

            setTimeout(() => {
                if (res.data.role === "admin") {
                    navigate("/dashboard/admin");
                } else {
                    navigate("/dashboard/student");
                }
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
            className="relative min-h-screen overflow-hidden"
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

            {/* Extra ambient glows */}
            <div className="pointer-events-none absolute left-8 top-24 h-[320px] w-[320px] rounded-full bg-[#22C55E]/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-[320px] w-[320px] rounded-full bg-[#86EFAC]/10 blur-[120px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ADE80]/5 blur-[140px]" />

            <div className="flex min-h-screen items-center justify-center px-4 pb-12 pt-28 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-[1280px]"
                >
                    <div className="grid min-h-[720px] overflow-hidden rounded-[36px] border border-white/80 bg-white/95 shadow-[0_30px_80px_rgba(0,0,0,0.10)] backdrop-blur-sm lg:grid-cols-2">
                        {/* LEFT SIDE */}
                        <div className="flex items-center px-6 py-12 sm:px-10 md:px-14 md:py-16">
                            <div className="w-full max-w-[430px]">
                                {/* Mini brand */}
                                <div className="mb-12 flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-md bg-gradient-to-br from-[#16A34A] to-[#4ADE80]" />
                                    <span className="font-semibold tracking-tight text-[#111827]">
                                        AI Code Reuse Platform
                                    </span>
                                </div>

                                {/* Heading */}
                                <motion.div
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.12, duration: 0.6 }}
                                >
                                    <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#111827] sm:text-5xl">
                                        Hello,
                                        <br />
                                        Welcome Back
                                    </h1>

                                    <p className="mt-5 max-w-md text-base leading-8 text-[#6B7280]">
                                        Sign in with your registered email or username to
                                        continue your AI experiments, review analytics,
                                        compare results, and explore smarter code reuse
                                        insights.
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
                                            placeholder="Email or Username"
                                            required
                                            value={form.login}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    login: e.target.value,
                                                })
                                            }
                                            className="h-14 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9CA3AF] focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={form.password}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="h-14 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9CA3AF] focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                        />
                                    </div>

                                    {/* Options row */}
                                    <div className="flex items-center justify-between gap-4 pt-1">
                                        <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-[#6B7280]">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() =>
                                                    setRememberMe(!rememberMe)
                                                }
                                                className="h-4 w-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#22C55E]"
                                            />
                                            Remember me
                                        </label>

                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-[#6B7280] transition hover:text-[#16A34A]"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {/* Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-3 inline-flex h-14 min-w-[150px] items-center justify-center rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] px-8 font-semibold text-[#071712] shadow-[0_12px_30px_rgba(34,197,94,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(34,197,94,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>
                                </motion.form>

                                {/* Signup */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.34, duration: 0.6 }}
                                    className="mt-20 text-sm text-[#6B7280]"
                                >
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        to="/register"
                                        className="font-semibold text-[#16A34A] transition hover:text-[#15803D]"
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
                            className="hidden items-center justify-center p-6 md:p-8 lg:flex"
                        >
                            <div className="relative h-full min-h-[640px] w-full overflow-hidden rounded-[30px] bg-gradient-to-br from-[#1B4332] via-[#14532D] to-[#22C55E]">
                                {/* Glow overlays */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />

                                {/* Clouds */}
                                <div className="absolute -left-8 -top-6 h-24 w-48 rounded-full bg-white" />
                                <div className="absolute left-20 top-6 h-16 w-28 rounded-full bg-white" />
                                <div className="absolute right-20 top-14 h-14 w-24 rounded-full bg-white" />
                                <div className="absolute right-0 top-0 h-28 w-40 rounded-full bg-white" />
                                <div className="absolute bottom-0 left-0 h-20 w-40 rounded-full bg-white" />
                                <div className="absolute bottom-10 right-8 h-16 w-36 rounded-full bg-white" />

                                {/* Check bubble */}
                                <div className="absolute left-16 top-28 rounded-[28px] bg-white px-7 py-5 shadow-[0_16px_30px_rgba(0,0,0,0.18)] after:absolute after:bottom-[-10px] after:left-10 after:h-5 after:w-5 after:rotate-45 after:bg-white">
                                    <span className="text-5xl font-bold text-[#22C55E]">
                                        ✓
                                    </span>
                                </div>

                                {/* Lock */}
                                <div className="absolute right-10 top-[47%] -translate-y-1/2">
                                    <div className="relative">
                                        <div className="mx-auto h-24 w-24 rounded-t-full border-[10px] border-b-0 border-white" />
                                        <div className="-mt-3 flex h-40 w-36 items-center justify-center rounded-[18px] bg-white shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                                            <div className="relative h-10 w-10 rounded-full bg-[#22C55E]">
                                                <div className="absolute left-1/2 top-full h-8 w-3 -translate-x-1/2 rounded-full bg-[#22C55E]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[8deg]">
                                    <div className="h-[470px] w-[260px] rounded-[38px] bg-[#071712] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                                        <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D]">
                                            <div className="absolute left-1/2 top-3 h-2 w-16 -translate-x-1/2 rounded-full bg-[#0B1D17]/50" />

                                            <div className="absolute right-5 top-5 flex flex-col gap-1.5">
                                                <span className="h-[2px] w-4 rounded-full bg-white/80" />
                                                <span className="h-[2px] w-4 rounded-full bg-white/80" />
                                                <span className="h-[2px] w-4 rounded-full bg-white/80" />
                                            </div>

                                            {/* Fingerprint area */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative flex items-center justify-center">
                                                    <div className="absolute h-44 w-44 rounded-[30px] border-4 border-white/15" />
                                                    <div className="absolute h-36 w-36 rounded-[28px] border-4 border-white/20" />
                                                    <div className="absolute h-28 w-28 rounded-[24px] border-4 border-white/25" />

                                                    <svg
                                                        width="110"
                                                        height="110"
                                                        viewBox="0 0 110 110"
                                                        fill="none"
                                                        className="relative z-10"
                                                    >
                                                        <path
                                                            d="M55 18C39 18 27 30 27 46V63"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 28C44 28 36 36 36 47V66"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 39C49 39 45 43 45 49V72"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 18C71 18 83 30 83 46V63"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 28C66 28 74 36 74 47V66"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 39C61 39 65 43 65 49V72"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M55 48V82"
                                                            stroke="white"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-16 left-1/2 h-2 w-36 -translate-x-1/2 rounded-full bg-white/50" />

                                            <p className="absolute bottom-10 left-1/2 w-[190px] -translate-x-1/2 text-center text-[11px] leading-4 text-white/80">
                                                Secure access for your AI experiments and code reuse insights
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating dots */}
                                <div className="absolute bottom-24 left-20 h-3 w-3 rounded-full bg-white/80" />
                                <div className="absolute bottom-36 left-28 h-2 w-2 rounded-full bg-white/70" />
                                <div className="absolute right-36 top-40 h-2.5 w-2.5 rounded-full bg-white/80" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}