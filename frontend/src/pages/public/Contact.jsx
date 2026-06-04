import Navbar from "../../components/Navbar";

export default function Contact() {
    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
            <Navbar />

            {/* BACKGROUND DECORATION */}
            <div className="pointer-events-none fixed left-0 top-24 h-96 w-96 rounded-full bg-green-200/50 blur-3xl"></div>
            <div className="pointer-events-none fixed right-0 top-40 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl"></div>
            <div className="pointer-events-none fixed bottom-0 left-1/2 h-80 w-80 rounded-full bg-green-100/80 blur-3xl"></div>

            <main className="relative z-10 px-6 pb-16 pt-32">
                <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-2 lg:items-stretch">

                    {/* LEFT SIDE */}
                    <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#062b1d] via-[#0d3b28] to-[#1f6b43] p-10 text-white shadow-2xl shadow-green-900/20">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-400/20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-emerald-300/10 blur-2xl"></div>
                        <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-white/10"></div>
                        <div className="absolute -bottom-16 right-32 h-44 w-44 rounded-full border border-white/10"></div>

                        <div className="relative z-10">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                                💬 Contact Support
                            </div>

                            <h1 className="text-4xl font-black leading-tight md:text-5xl">
                                Let’s talk about your <br />
                                <span className="text-green-300">
                                    AI Code Reuse Platform
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-8 text-green-50/80">
                                Have a question, need support, or want help using the platform?
                                Send us a message and our team will guide you as soon as possible.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400 text-2xl text-[#062b1d]">
                                        📧
                                    </div>
                                    <p className="text-sm font-bold text-green-100/70">
                                        Email
                                    </p>
                                    <h3 className="mt-1 text-lg font-black">
                                        support@aireuse.com
                                    </h3>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400 text-2xl text-[#062b1d]">
                                        ⚡
                                    </div>
                                    <p className="text-sm font-bold text-green-100/70">
                                        Response
                                    </p>
                                    <h3 className="mt-1 text-lg font-black">
                                        Within 24 Hours
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-8 rounded-3xl border border-white/10 bg-[#082719]/80 p-6">
                                <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-300">
                                    Platform Help
                                </p>
                                <p className="mt-3 text-sm leading-7 text-green-50/75">
                                    We can help with project uploads, AI analysis, code reuse
                                    results, dashboard usage, and account-related questions.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE FORM */}
                    <section className="rounded-[36px] border border-white bg-white/90 p-8 shadow-2xl shadow-green-900/10 backdrop-blur">
                        <div className="mb-8">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                                📨
                            </div>

                            <h2 className="text-3xl font-black text-gray-900">
                                Send a Message
                            </h2>

                            <p className="mt-2 text-sm leading-7 text-gray-500">
                                Fill the form below and we will get back to you soon.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter first name"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter last name"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Write your message here..."
                                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="w-full rounded-2xl bg-green-500 px-6 py-4 font-black text-white shadow-xl shadow-green-500/25 transition hover:-translate-y-1 hover:bg-green-600"
                            >
                                Send Message →
                            </button>
                        </form>
                    </section>
                </div>

                {/* BOTTOM INFO CARDS */}
                <div className="mx-auto mt-8 grid w-full max-w-[1200px] gap-6 md:grid-cols-3">
                    <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                            🛠️
                        </div>
                        <h3 className="text-lg font-black text-gray-900">
                            Technical Support
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Get help with login, dashboard, projects, and analysis issues.
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                            📊
                        </div>
                        <h3 className="text-lg font-black text-gray-900">
                            Analysis Help
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Ask questions about reuse detection, duplicate lines, and AI results.
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                            🚀
                        </div>
                        <h3 className="text-lg font-black text-gray-900">
                            Project Guidance
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Learn how to upload projects and use AI-powered suggestions.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}