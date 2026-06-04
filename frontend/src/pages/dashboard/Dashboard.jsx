import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const res = await API.get("/auth/me/");

                if (res.data.role === "ADMIN") {
                    navigate("/dashboard/admin");
                } else {
                    navigate("/dashboard/student");
                }

            } catch {
                navigate("/login");
            }
        };

        checkRole();
    }, []);

    return <p>Loading dashboard...</p>;
}