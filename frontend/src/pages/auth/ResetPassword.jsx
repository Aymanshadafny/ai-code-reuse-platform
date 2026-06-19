import { useMemo, useRef, useState } from "react";
import API from "../../api/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../components/Toast";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email] = useState(
        location.state?.email || sessionStorage.getItem("reset_email") || ""
    );

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpVerified, setOtpVerified] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        new_password: "",
        confirm_password: "",
    });

    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const otpRefs = useRef([]);

    const otpValue = useMemo(() => otp.join(""), [otp]);

    const showToast = (message, type = "error") => {
        setToast({ message, type });
    };

    const getErrorMessage = (err, fallback) => {
        return (
            err.response?.data?.error ||
            err.response?.data?.detail ||
            err.response?.data?.non_field_errors?.[0] ||
            err.response?.data?.email?.[0] ||
            fallback
        );
    };

    const handleOtpChange = (index, value) => {
        const onlyNumber = value.replace(/\D/g, "");

        if (!onlyNumber) {
            const updated = [...otp];
            updated[index] = "";
            setOtp(updated);
            return;
        }

        const digit = onlyNumber.slice(-1);
        const updated = [...otp];
        updated[index] = digit;
        setOtp(updated);

        if (index < 5 && digit) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const updated = [...otp];
                updated[index] = "";
                setOtp(updated);
            } else if (index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        e.preventDefault();

        const updated = ["", "", "", "", "", ""];
        pasted.split("").forEach((char, i) => {
            if (i < 6) updated[i] = char;
        });

        setOtp(updated);

        const nextIndex = Math.min(pasted.length, 5);
        otpRefs.current[nextIndex]?.focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            showToast("Please request OTP again");

            setTimeout(() => {
                navigate("/forgot-password");
            }, 1000);

            return;
        }

        if (otpValue.length !== 6) {
            showToast("Please enter the full 6 digit OTP");
            return;
        }

        setVerifyLoading(true);

        try {
            const res = await API.post("/auth/verify-otp/", {
                email,
                otp: otpValue,
            });

            setOtpVerified(true);
            showToast(res.data.message || "OTP verified successfully ✅", "success");
        } catch (err) {
            showToast(getErrorMessage(err, "OTP verification failed ❌"));
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!passwordForm.new_password || !passwordForm.confirm_password) {
            showToast("Please fill all password fields");
            return;
        }

        if (passwordForm.new_password.length < 8) {
            showToast("Password must be at least 8 characters");
            return;
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            showToast("Passwords do not match");
            return;
        }

        setResetLoading(true);

        try {
            const res = await API.post("/auth/reset-password-otp/", {
                email,
                otp: otpValue,
                new_password: passwordForm.new_password,
                confirm_password: passwordForm.confirm_password,
            });

            showToast(
                res.data.message || "Password reset successful ✅",
                "success"
            );

            setTimeout(() => {
                sessionStorage.removeItem("reset_email");
                navigate("/login");
            }, 1300);
        } catch (err) {
            showToast(getErrorMessage(err, "Password reset failed ❌"));
        } finally {
            setResetLoading(false);
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
                            <div className="w-full max-w-[460px]">
                                <div className="flex items-center gap-2 mb-10">
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
                                        {otpVerified ? (
                                            <>
                                                Create
                                                <br />
                                                New Password
                                            </>
                                        ) : (
                                            <>
                                                Verify
                                                <br />
                                                OTP Code
                                            </>
                                        )}
                                    </h1>

                                    <p className="mt-5 text-[#6B7280] text-base leading-8 max-w-md">
                                        {otpVerified
                                            ? "Your OTP has been verified successfully. Now create a strong new password for your account."
                                            : "Enter the 6 digit code sent to your email. Once verified, you will be able to set a new password."}
                                    </p>
                                </motion.div>

                                {/* NO EMAIL FIELD - ONLY INFO CARD */}
                                <div className="mt-8 rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4] px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] text-white font-bold">
                                            ✉
                                        </span>

                                        <div>
                                            <p className="text-sm font-bold text-[#14532D]">
                                                OTP sent to your email
                                            </p>
                                            <p className="text-sm text-[#15803D]/80">
                                                Please check your inbox and enter the 6 digit code.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!otpVerified ? (
                                        <motion.form
                                            key="verify-step"
                                            onSubmit={handleVerifyOtp}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -16 }}
                                            transition={{ duration: 0.35 }}
                                            className="mt-8"
                                        >
                                            <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                                                <div className="flex items-center justify-between gap-3 mb-5">
                                                    <div>
                                                        <h3 className="text-[#111827] font-bold text-lg">
                                                            Enter Verification Code
                                                        </h3>
                                                        <p className="text-sm text-[#6B7280] mt-1">
                                                            Type the 6 digit OTP from your email
                                                        </p>
                                                    </div>

                                                    <div className="hidden sm:inline-flex items-center justify-center rounded-2xl bg-[#F0FDF4] px-4 py-2 text-sm font-semibold text-[#16A34A]">
                                                        6 Digit OTP
                                                    </div>
                                                </div>

                                                <div
                                                    className="grid grid-cols-6 gap-2 sm:gap-3"
                                                    onPaste={handleOtpPaste}
                                                >
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            ref={(el) => (otpRefs.current[index] = el)}
                                                            type="text"
                                                            inputMode="numeric"
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={(e) =>
                                                                handleOtpChange(index, e.target.value)
                                                            }
                                                            onKeyDown={(e) =>
                                                                handleOtpKeyDown(index, e)
                                                            }
                                                            className="h-14 sm:h-16 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] text-center text-xl sm:text-2xl font-bold text-[#111827] outline-none transition-all duration-300 focus:border-[#22C55E] focus:bg-white focus:ring-4 focus:ring-[#22C55E]/10"
                                                        />
                                                    ))}
                                                </div>

                                                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <p className="text-sm text-[#6B7280]">
                                                        Didn&apos;t receive OTP?{" "}
                                                        <Link
                                                            to="/forgot-password"
                                                            className="font-semibold text-[#16A34A] hover:text-[#15803D] transition"
                                                        >
                                                            Send again
                                                        </Link>
                                                    </p>

                                                    <button
                                                        type="submit"
                                                        disabled={verifyLoading}
                                                        className="inline-flex h-14 min-w-[170px] items-center justify-center rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] px-8 text-[#071712] font-semibold shadow-[0_12px_30px_rgba(34,197,94,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(34,197,94,0.30)] disabled:opacity-60"
                                                    >
                                                        {verifyLoading ? "Verifying..." : "Verify OTP"}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="reset-step"
                                            onSubmit={handleResetPassword}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -16 }}
                                            transition={{ duration: 0.35 }}
                                            className="mt-8 space-y-4"
                                        >
                                            <div className="flex items-center gap-3 rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4] px-4 py-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E] text-white text-lg font-bold">
                                                    ✓
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#14532D]">
                                                        OTP Verified Successfully
                                                    </p>
                                                    <p className="text-sm text-[#15803D]/80">
                                                        You can now create a new password
                                                    </p>
                                                </div>
                                            </div>

                                            <input
                                                type="password"
                                                name="new_password"
                                                placeholder="New Password"
                                                value={passwordForm.new_password}
                                                onChange={(e) =>
                                                    setPasswordForm({
                                                        ...passwordForm,
                                                        new_password: e.target.value,
                                                    })
                                                }
                                                className="w-full h-14 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                            />

                                            <input
                                                type="password"
                                                name="confirm_password"
                                                placeholder="Confirm Password"
                                                value={passwordForm.confirm_password}
                                                onChange={(e) =>
                                                    setPasswordForm({
                                                        ...passwordForm,
                                                        confirm_password: e.target.value,
                                                    })
                                                }
                                                className="w-full h-14 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10"
                                            />

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setOtpVerified(false)}
                                                    className="inline-flex h-14 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 text-[#374151] font-semibold transition hover:border-[#22C55E] hover:text-[#16A34A]"
                                                >
                                                    Back to OTP
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={resetLoading}
                                                    className="inline-flex h-14 min-w-[190px] items-center justify-center rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] px-8 text-[#071712] font-semibold shadow-[0_12px_30px_rgba(34,197,94,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(34,197,94,0.30)] disabled:opacity-60"
                                                >
                                                    {resetLoading ? "Resetting..." : "Reset Password"}
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                <p className="mt-12 text-sm text-[#6B7280]">
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
                                <div className="absolute bottom-0 left-0 w-40 h-20 bg-white rounded-full" />
                                <div className="absolute bottom-10 right-8 w-36 h-16 bg-white rounded-full" />

                                <div className="absolute top-16 left-14 rounded-[24px] bg-white px-6 py-4 shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                                    <p className="text-[#16A34A] text-3xl font-black tracking-wide">
                                        OTP
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#6B7280]">
                                        Secure verification
                                    </p>
                                </div>

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

                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[8deg]">
                                    <div className="w-[270px] h-[490px] rounded-[38px] bg-[#071712] shadow-[0_30px_60px_rgba(0,0,0,0.35)] p-3">
                                        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D]">
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#0B1D17]/50 rounded-full" />

                                            <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                                                <div className="w-28 h-28 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-8">
                                                    <span className="text-white text-5xl font-bold">
                                                        {otpVerified ? "✓" : "✉"}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3 mb-8">
                                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                                        <div
                                                            key={item}
                                                            className="w-12 h-12 rounded-xl bg-white/85 shadow flex items-center justify-center text-[#14532D] font-bold text-lg"
                                                        >
                                                            {otpVerified ? "•" : item}
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="text-white text-2xl font-bold text-center">
                                                    {otpVerified ? "Password Ready" : "Verify Your OTP"}
                                                </p>

                                                <p className="mt-4 text-white/85 text-sm text-center leading-6 max-w-[210px]">
                                                    {otpVerified
                                                        ? "Verification complete. Create your new password securely."
                                                        : "Enter the secure 6 digit code sent to your email address."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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