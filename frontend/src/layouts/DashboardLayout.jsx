import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return localStorage.getItem("sidebar-collapsed") === "true";
    });

    const navigate = useNavigate();

    useEffect(() => {
        API.get("/auth/me/")
            .then((res) => setUser(res.data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                role={user?.role}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Main Content */}
            <div
                className={`
                    min-h-screen
                    transition-all duration-300 ease-in-out
                    ${sidebarCollapsed ? "ml-[88px]" : "ml-[280px]"}
                `}
            >
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="min-h-screen bg-gray-100 p-6 pt-24">
                    {children}
                </main>
            </div>
        </div>
    );
}