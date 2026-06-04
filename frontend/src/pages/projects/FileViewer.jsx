import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ArrowLeft, FileCode, Copy } from "lucide-react";
import { motion } from "framer-motion";

// 🔥 SYNTAX HIGHLIGHTER
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function FileViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const query = new URLSearchParams(useLocation().search);
    const fileName = query.get("name");

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);

                const res = await API.get(
                    `/projects/${id}/file/?file=${fileName}`
                );

                setContent(res.data.content);
            } catch (err) {
                console.log("ERROR:", err.response?.data);
                setContent("❌ Failed to load file");
            } finally {
                setLoading(false);
            }
        };

        if (fileName) {
            fetchFile();
        }
    }, [id, fileName]);

    // 🔥 COPY
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert("Copied to clipboard ✅");
    };

    // 🔥 AUTO LANGUAGE DETECT
    const getLanguage = () => {
        if (!fileName) return "javascript";

        if (fileName.endsWith(".py")) return "python";
        if (fileName.endsWith(".js")) return "javascript";
        if (fileName.endsWith(".jsx")) return "jsx";
        if (fileName.endsWith(".ts")) return "typescript";
        if (fileName.endsWith(".tsx")) return "tsx";
        if (fileName.endsWith(".html")) return "html";
        if (fileName.endsWith(".css")) return "css";

        return "javascript";
    };

    return (
        <DashboardLayout>

            {/* 🔥 CENTER CONTAINER */}
            <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-6">

                {/* 🔙 BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* 🔥 HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl p-6 mb-8 bg-gradient-to-br from-[#062419] via-[#0b3b2a] to-[#0f5f3f] text-white shadow-xl"
                >
                    <h1 className="text-2xl font-black flex items-center gap-3">
                        <FileCode size={24} />
                        {fileName}
                    </h1>
                    <p className="text-white/70 text-sm mt-1">
                        File Viewer • Code Preview
                    </p>
                </motion.div>

                {/* 🔥 CODE EDITOR */}
                <div className="bg-[#0d1117] rounded-2xl shadow-lg overflow-hidden">

                    {/* 🔧 TOP BAR */}
                    <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-gray-700">
                        <span className="text-gray-400 text-sm">
                            {fileName}
                        </span>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                        >
                            <Copy size={14} />
                            Copy
                        </button>
                    </div>

                    {/* 🔥 LOADING */}
                    {loading ? (
                        <p className="text-center text-gray-400 p-10">
                            Loading file...
                        </p>
                    ) : (
                        <div className="text-sm">

                            <SyntaxHighlighter
                                language={getLanguage()}
                                style={vscDarkPlus}
                                showLineNumbers={true}
                                wrapLines={true}
                                customStyle={{
                                    margin: 0,
                                    padding: "20px",
                                    background: "#0d1117",
                                    fontSize: "13px",
                                }}
                            >
                                {content || "// No content found"}
                            </SyntaxHighlighter>

                        </div>
                    )}
                </div>

            </div>

        </DashboardLayout>
    );
}