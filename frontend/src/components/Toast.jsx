import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: {
            bg: "bg-[#0f2e1c]/90",
            border: "border-green-400/40",
            icon: <CheckCircle className="text-green-400" size={26} />,
            title: "Success",
            accent: "bg-green-400",
            glow: "shadow-[0_10px_40px_rgba(34,197,94,0.25)]",
        },
        error: {
            bg: "bg-[#2e0f0f]/90",
            border: "border-red-400/40",
            icon: <XCircle className="text-red-400" size={26} />,
            title: "Error",
            accent: "bg-red-400",
            glow: "shadow-[0_10px_40px_rgba(239,68,68,0.25)]",
        },
        info: {
            bg: "bg-[#0f1e2e]/90",
            border: "border-blue-400/40",
            icon: <Info className="text-blue-400" size={26} />,
            title: "Info",
            accent: "bg-blue-400",
            glow: "shadow-[0_10px_40px_rgba(59,130,246,0.25)]",
        },
    };

    const current = styles[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed bottom-6 left-6 z-50"
        >
            <div
                className={`
                    relative
                    w-[380px]
                    backdrop-blur-xl
                    ${current.bg}
                    border ${current.border}
                    ${current.glow}
                    rounded-2xl
                    p-4
                    flex items-start gap-3
                `}
            >
                {/* LEFT ACCENT LINE */}
                <div
                    className={`absolute left-0 top-0 h-full w-1 ${current.accent} rounded-l-2xl`}
                />

                {/* ICON */}
                <div className="mt-1">{current.icon}</div>

                {/* CONTENT */}
                <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">
                        {current.title}
                    </h4>
                    <p className="text-white/90 text-sm mt-1">
                        {message}
                    </p>
                </div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white/60 hover:text-white transition"
                >
                    <X size={18} />
                </button>
            </div>
        </motion.div>
    );
}