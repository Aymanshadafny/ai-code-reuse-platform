import { useState } from "react";
import API from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Toast from "../../components/Toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/send-otp/", {
                email,
            });

            setToast({
                message: res.data.message || "OTP sent to your email ✅",
                type: "success",
            });

            setTimeout(() => {
                navigate("/reset-password", {
                    state: { email },
                });
            }, 1200);
        } catch (err) {
            setToast({
                message:
                    err.response?.data?.email?.[0] ||
                    err.response?.data?.error ||
                    "Failed to send OTP ❌",
                type: "error",
            });
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

            <div className="pointer-events-none absolute top-24 left-8 w-[320px] h-[320px] bg-[#22C55E]/10 blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute bottom-10 right-10 w-[320px] h-[320px] bg-[#86EFAC]/10 blur-[120px] rounded-full" />

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
                                <div className="flex items-center gap-2 mb-12">
                                    <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-[#16A34A] to-[#4ADE80]" />
                                    <span className="text-[#111827] font-semibold tracking-tight">
                                        AI Code Reuse Platform
                                    </span>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.12, duration: 0.6 }}
                                >
                                    <h1 className="text-4xl sm:text-5xl font-bold text-[#111827] leading-[1.08] tracking-tight">
                                        Forgot
                                        <br />
                                        Password?
                                    </h1>

                                    <p className="mt-5 text-[#6B7280] text-base leading-8 max-w-md">
                                        Enter your account email address. We will send you
                                        a 6 digit OTP to reset your password securely.
                                    </p>
                                </motion.div>

                                <motion.form
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.22, duration: 0.6 }}
                                    className="mt-10 space-y-4"
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-3 inline-flex h-14 min-w-[170px] items-center justify-center rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] px-8 text-[#071712] font-semibold shadow-[0_12px_30px_rgba(34,197,94,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(34,197,94,0.30)] disabled:opacity-60"
                                    >
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                </motion.form>

                                <p className="mt-20 text-sm text-[#6B7280]">
                                    Remember your password?{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-[#16A34A] hover:text-[#15803D] transition"
                                    >
                                        Back to Login
                                    </Link>
                                </p>
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
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />

                                <div className="absolute -top-6 -left-8 w-48 h-24 bg-white rounded-full" />
                                <div className="absolute top-6 left-20 w-28 h-16 bg-white rounded-full" />
                                <div className="absolute top-14 right-20 w-24 h-14 bg-white rounded-full" />
                                <div className="absolute top-0 right-0 w-40 h-28 bg-white rounded-full" />

                                <div className="absolute top-28 left-16 bg-white rounded-[28px] shadow-[0_16px_30px_rgba(0,0,0,0.18)] px-7 py-5 after:absolute after:left-10 after:bottom-[-10px] after:w-5 after:h-5 after:bg-white after:rotate-45">
                                    <span className="text-4xl text-[#22C55E] font-bold">OTP</span>
                                </div>

                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[8deg]">
                                    <div className="w-[260px] h-[470px] rounded-[38px] bg-[#071712] shadow-[0_30px_60px_rgba(0,0,0,0.35)] p-3">
                                        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D]">
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#0B1D17]/50 rounded-full" />

                                            <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                                                <div className="w-24 h-24 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-8">
                                                    <span className="text-white text-4xl font-bold">✉</span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    {["", "", "", "", "", ""].map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-12 h-12 rounded-xl bg-white/90 shadow flex items-center justify-center text-[#14532D] font-bold"
                                                        >
                                                            •
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="mt-8 text-white/85 text-sm text-center leading-6">
                                                    A secure 6 digit code will be sent to your email.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}