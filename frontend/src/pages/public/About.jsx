import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function About() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#f3fbf6] text-gray-900">
            <Navbar />

            {/* Soft background shapes */}
            <div className="fixed left-[-120px] top-20 h-[360px] w-[360px] rounded-full bg-green-300/30 blur-3xl"></div>
            <div className="fixed right-[-140px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-300/30 blur-3xl"></div>
            <div className="fixed bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-lime-200/40 blur-3xl"></div>

            <main className="relative z-10 px-6 pb-20 pt-32">
                <div className="mx-auto w-full max-w-[1400px]">

                    {/* HERO */}
                    <section className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-bold text-green-700 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                AI Code Reuse Platform
                            </div>

                            <h1 className="max-w-3xl text-5xl font-black leading-tight text-[#101828] md:text-7xl">
                                About our <br />
                                <span className="text-green-500">
                                    AI Reuse System
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-600">
                                This platform helps students and developers analyze code,
                                detect duplicated logic, find reusable parts, and improve
                                software quality using AI-powered suggestions.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    to="/register"
                                    className="rounded-2xl bg-green-500 px-7 py-4 font-black text-white shadow-xl shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    to="/login"
                                    className="rounded-2xl border border-gray-200 bg-white px-7 py-4 font-black text-gray-800 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:text-green-600"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT VISUAL */}
                        <div className="relative">
                            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-[32px] bg-green-400/20"></div>
                            <div className="absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-emerald-400/20"></div>

                            <div className="relative rounded-[40px] bg-white p-6 shadow-2xl shadow-green-900/10">
                                <div className="rounded-[32px] bg-gradient-to-br from-[#082719] via-[#123f2b] to-[#2f8b52] p-8 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-200">
                                                Smart Analysis
                                            </p>
                                            <h2 className="mt-3 text-3xl font-black">
                                                Code Reuse Engine
                                            </h2>
                                        </div>

                                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-400 text-3xl shadow-lg shadow-green-400/30">
                                            🧠
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                            <div className="mb-3 flex justify-between text-sm font-bold">
                                                <span>Duplicate Logic</span>
                                                <span className="text-green-200">78%</span>
                                            </div>
                                            <div className="h-3 rounded-full bg-white/15">
                                                <div className="h-3 w-[78%] rounded-full bg-green-400"></div>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                            <div className="mb-3 flex justify-between text-sm font-bold">
                                                <span>Reusable Components</span>
                                                <span className="text-green-200">64%</span>
                                            </div>
                                            <div className="h-3 rounded-full bg-white/15">
                                                <div className="h-3 w-[64%] rounded-full bg-emerald-300"></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="rounded-3xl bg-white/10 p-5">
                                                <p className="text-4xl font-black">AI</p>
                                                <p className="mt-1 text-sm text-green-50/70">
                                                    Suggestions
                                                </p>
                                            </div>

                                            <div className="rounded-3xl bg-white/10 p-5">
                                                <p className="text-4xl font-black">FYP</p>
                                                <p className="mt-1 text-sm text-green-50/70">
                                                    Ready
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SIMPLE ABOUT CARD */}
                    <section className="mt-16 rounded-[40px] bg-white p-8 shadow-2xl shadow-green-900/5 md:p-10">
                        <div className="grid gap-10 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-green-500">
                                    What we do
                                </p>
                                <h2 className="text-4xl font-black leading-tight text-gray-900">
                                    We make code analysis simple.
                                </h2>
                            </div>

                            <div className="space-y-6 lg:col-span-2">
                                <p className="text-lg leading-9 text-gray-600">
                                    The system allows users to upload project code, create analysis
                                    tasks, review duplicated code, compare results, and receive
                                    improved code suggestions from AI.
                                </p>

                                <p className="text-lg leading-9 text-gray-600">
                                    It is designed especially for final year projects where students
                                    need a professional platform with authentication, dashboards,
                                    experiments, analysis results, and role-based access.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FEATURES */}
                    <section className="mt-8 grid gap-6 md:grid-cols-3">
                        <div className="rounded-[32px] bg-white p-7 shadow-xl shadow-green-900/5 transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-3xl">
                                📁
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">
                                Project Upload
                            </h3>
                            <p className="mt-3 leading-7 text-gray-500">
                                Students can create projects and upload source code for analysis.
                            </p>
                        </div>

                        <div className="rounded-[32px] bg-white p-7 shadow-xl shadow-green-900/5 transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
                                🔍
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">
                                Reuse Detection
                            </h3>
                            <p className="mt-3 leading-7 text-gray-500">
                                The system finds repeated code patterns and reusable logic.
                            </p>
                        </div>

                        <div className="rounded-[32px] bg-white p-7 shadow-xl shadow-green-900/5 transition hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-3xl">
                                🤖
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">
                                AI Improvement
                            </h3>
                            <p className="mt-3 leading-7 text-gray-500">
                                AI gives cleaner and more reusable code suggestions.
                            </p>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mt-8 rounded-[40px] bg-[#0b2a1d] p-8 text-white shadow-2xl shadow-green-900/20 md:p-10">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-black">
                                    Start your first AI code analysis
                                </h2>
                                <p className="mt-3 max-w-2xl leading-7 text-white/70">
                                    Create an account, upload your project, and review AI-powered
                                    reuse suggestions.
                                </p>
                            </div>

                            <Link
                                to="/register"
                                className="inline-flex justify-center rounded-2xl bg-green-400 px-7 py-4 font-black text-[#082719] shadow-lg shadow-green-400/25 transition hover:-translate-y-1 hover:bg-green-300"
                            >
                                Create Account →
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}