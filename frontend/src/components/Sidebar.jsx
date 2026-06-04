import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Users,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

export default function Sidebar({ role, collapsed, setCollapsed }) {
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", collapsed);
    }, [collapsed]);

    const links = [
        {
            name: "Dashboard",
            path: role === "ADMIN" ? "/dashboard/admin" : "/dashboard/student",
            icon: <LayoutDashboard size={21} />,
        },
        ...(role === "ADMIN"
            ? [
                {
                    name: "Projects",
                    path: "/dashboard/admin/projects",
                    icon: <FileText size={21} />,
                },
                {
                    name: "Users",
                    path: "/dashboard/admin/users",
                    icon: <Users size={21} />,
                },
                {
                    name: "Reports",
                    path: "/dashboard/admin/reports",
                    icon: <FileText size={21} />,
                },
            ]
            : [
                {
                    name: "My Projects",
                    path: "/dashboard/student/projects",
                    icon: <FileText size={21} />,
                },
            ]),
    ];

    return (
        <aside
            className={`
                fixed left-0 top-[82px] z-50
                h-[calc(100vh-82px)]
              ${collapsed ? "w-[110px]" : "w-[280px]"}
                overflow-visible
                border-r border-emerald-400/10
                bg-[#041b14]
                text-white
                shadow-[18px_0_45px_rgba(0,0,0,0.28)]
                transition-all duration-300 ease-in-out
            `}
        >
            {/* Hide overflow only inside content, not full aside */}
            <div className="relative h-full overflow-hidden">
                {/* Background glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-[90px]" />
                    <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-green-500/10 blur-[110px]" />
                    <div className="absolute bottom-0 left-0 h-52 w-full bg-gradient-to-t from-emerald-950/70 to-transparent" />
                </div>

                {/* Main inner wrapper */}
                <div className="relative flex h-full flex-col px-4 py-5">
                    {/* Header */}
                    <div
                        className={`
                            flex items-center
                            ${collapsed ? "justify-center" : "justify-between"}
                            rounded-2xl border border-white/10
                            bg-white/[0.04]
                            px-3 py-3
                            shadow-inner
                            backdrop-blur-xl
                        `}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-green-500 text-[#03140f] shadow-[0_0_22px_rgba(74,222,128,0.35)]">
                                <Sparkles size={22} />
                            </div>

                            {!collapsed && (
                                <div className="min-w-0">
                                    <h1 className="truncate text-[15px] font-extrabold tracking-wide text-white">
                                        AI Reuse
                                    </h1>
                                    <p className="truncate text-[11px] font-medium text-emerald-200/70">
                                        Code Reuse Platform
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-8 flex flex-col gap-3">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.name === "Dashboard"}
                                title={collapsed ? link.name : ""}
                                className={({ isActive }) =>
                                    `
                    group relative flex items-center
                    ${collapsed ? "justify-center px-0" : "justify-start gap-4 px-4"}
                    h-[54px]
                    rounded-2xl
                    text-sm font-semibold
                    transition-all duration-300
                    ${isActive
                                        ? "bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 text-[#03140f] shadow-[0_14px_30px_rgba(34,197,94,0.28)]"
                                        : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                                    }
                `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-30" />
                                        )}

                                        <span
                                            className={`
                            relative z-10 flex items-center justify-center
                            transition-all duration-300
                            ${isActive
                                                    ? "text-[#03140f]"
                                                    : "text-emerald-300 group-hover:scale-110 group-hover:text-emerald-200"
                                                }
                        `}
                                        >
                                            {link.icon}
                                        </span>

                                        {!collapsed && (
                                            <span className="relative z-10 truncate">
                                                {link.name}
                                            </span>
                                        )}

                                        {isActive && !collapsed && (
                                            <span className="absolute right-4 h-2 w-2 rounded-full bg-[#03140f]/70" />
                                        )}

                                        {collapsed && (
                                            <span
                                                className="
                                pointer-events-none absolute left-[72px]
                                z-[999] whitespace-nowrap rounded-xl
                                border border-white/10
                                bg-[#071f18]
                                px-3 py-2
                                text-xs font-semibold text-white
                                opacity-0 shadow-xl
                                transition-all duration-200
                                group-hover:left-[82px]
                                group-hover:opacity-100
                            "
                                            >
                                                {link.name}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    {/* Role card */}
                    <div
                        className={`
                            mt-5 rounded-2xl border border-white/10 bg-white/[0.04]
                            backdrop-blur-xl
                            ${collapsed ? "p-3" : "p-4"}
                        `}
                    >
                        <div
                            className={`
                                flex items-center
                                ${collapsed ? "justify-center" : "gap-3"}
                            `}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                                <ShieldCheck size={20} />
                            </div>

                            {!collapsed && (
                                <div className="min-w-0">
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                                        Current Role
                                    </p>
                                    <p className="truncate text-sm font-bold text-emerald-200">
                                        {role === "ADMIN" ? "Administrator" : "Student"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto">
                        {!collapsed ? (
                            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.07] p-4 text-center backdrop-blur-xl">
                                <p className="text-xs font-semibold text-emerald-200">
                                    ⚡ AI Code Reuse Platform
                                </p>
                                <p className="mt-1 text-[11px] text-white/45">
                                    Build smarter. Reuse better.
                                </p>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-300">
                                    ⚡
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Collapse button outside overflow-hidden area */}
            <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="
        absolute -right-5 top-1/2 z-[999]
        flex h-11 w-11 -translate-y-1/2 items-center justify-center
        rounded-full
        border border-emerald-300/30
        bg-gradient-to-br from-emerald-300 to-green-500
        text-[#041b14]
        shadow-[0_10px_30px_rgba(34,197,94,0.35)]
        transition-all duration-300
        hover:scale-110
        hover:shadow-[0_14px_40px_rgba(34,197,94,0.45)]
    "
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            </button>
        </aside>
    );
}