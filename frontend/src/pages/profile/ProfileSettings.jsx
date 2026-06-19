import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../api/api";

export default function ProfileSettings() {
    const [user, setUser] = useState(null);
    const [preview, setPreview] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [profileMessage, setProfileMessage] = useState({
        type: "",
        text: "",
    });

    const [passwordMessage, setPasswordMessage] = useState({
        type: "",
        text: "",
    });

    const [form, setForm] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        API.get("/auth/me/")
            .then((res) => {
                setUser(res.data);

                setForm({
                    username: res.data.username || "",
                    email: res.data.email || "",
                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                });

                setPreview(
                    res.data.image ||
                    `https://i.pravatar.cc/150?u=${res.data.email || "guest"}`
                );
            })
            .catch((err) => {
                console.log("PROFILE ERROR:", err);

                setProfileMessage({
                    type: "error",
                    text: "Unable to load profile information.",
                });
            });
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setProfileMessage({
                type: "error",
                text: "Please select a valid image file.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        setImageLoading(true);
        setProfileMessage({
            type: "",
            text: "",
        });

        try {
            const res = await API.patch("/auth/profile/image/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setPreview(res.data.image);

            if (res.data.user) {
                setUser(res.data.user);
            }

            window.dispatchEvent(new Event("profileImageUpdated"));

            setProfileMessage({
                type: "success",
                text: "Profile image uploaded successfully.",
            });
        } catch (err) {
            console.log("IMAGE UPLOAD ERROR:", err.response?.data || err);

            setProfileMessage({
                type: "error",
                text:
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Profile image upload failed.",
            });
        } finally {
            setImageLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setProfileMessage({
            type: "",
            text: "",
        });

        setPasswordMessage({
            type: "",
            text: "",
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        setProfileLoading(true);
        setProfileMessage({
            type: "",
            text: "",
        });

        try {
            const res = await API.patch("/auth/profile/update/", {
                username: form.username,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
            });

            setUser(res.data.user);

            setForm((prev) => ({
                ...prev,
                username: res.data.user.username || "",
                email: res.data.user.email || "",
                first_name: res.data.user.first_name || "",
                last_name: res.data.user.last_name || "",
            }));

            if (res.data.user?.image) {
                setPreview(res.data.user.image);
            }

            setProfileMessage({
                type: "success",
                text: "Profile updated successfully.",
            });
        } catch (err) {
            console.log("PROFILE UPDATE ERROR:", err.response?.data || err);

            setProfileMessage({
                type: "error",
                text:
                    err.response?.data?.error ||
                    err.response?.data?.username?.[0] ||
                    err.response?.data?.email?.[0] ||
                    "Profile update failed.",
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordLoading(true);
        setPasswordMessage({
            type: "",
            text: "",
        });

        if (!form.old_password || !form.new_password || !form.confirm_password) {
            setPasswordMessage({
                type: "error",
                text: "Please fill all password fields.",
            });
            setPasswordLoading(false);
            return;
        }

        if (form.new_password !== form.confirm_password) {
            setPasswordMessage({
                type: "error",
                text: "New password and confirm password do not match.",
            });
            setPasswordLoading(false);
            return;
        }

        try {
            await API.patch("/auth/password/change/", {
                old_password: form.old_password,
                new_password: form.new_password,
                confirm_password: form.confirm_password,
            });

            setForm((prev) => ({
                ...prev,
                old_password: "",
                new_password: "",
                confirm_password: "",
            }));

            setPasswordMessage({
                type: "success",
                text: "Password changed successfully.",
            });
        } catch (err) {
            console.log("PASSWORD CHANGE ERROR:", err.response?.data || err);

            setPasswordMessage({
                type: "error",
                text:
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Password change failed.",
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const messageClass = (type) => {
        if (type === "success") {
            return "border-green-200 bg-green-50 text-green-700";
        }

        if (type === "error") {
            return "border-red-200 bg-red-50 text-red-600";
        }

        return "hidden";
    };

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
            <Navbar />

            {/* Background decoration */}
            <div className="pointer-events-none fixed left-[-120px] top-24 h-96 w-96 rounded-full bg-green-200/50 blur-3xl"></div>
            <div className="pointer-events-none fixed right-[-140px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/60 blur-3xl"></div>

            <main className="relative z-10 px-6 pb-20 pt-32">
                <div className="mx-auto w-full max-w-[1200px]">

                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <Link
                                to="/dashboard/student"
                                className="mb-4 inline-flex text-sm font-bold text-green-600 hover:text-green-700"
                            >
                                ← Back to Dashboard
                            </Link>

                            <h1 className="text-4xl font-black text-gray-900">
                                Profile Settings
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Manage your account image, profile details, and password.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase text-green-700 shadow-lg shadow-green-900/5">
                            {user?.role || "student"}
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">

                        {/* Profile Card */}
                        <div className="rounded-[32px] bg-white p-8 text-center shadow-2xl shadow-green-900/5">
                            <div className="relative mx-auto h-36 w-36">
                                <img
                                    src={preview}
                                    alt="profile"
                                    className="h-36 w-36 rounded-[32px] object-cover shadow-xl ring-4 ring-green-100"
                                />

                                <label className="absolute -bottom-3 left-1/2 -translate-x-1/2 cursor-pointer rounded-2xl bg-green-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-green-500/25 transition hover:bg-green-600">
                                    {imageLoading ? "Uploading..." : "Change"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={imageLoading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <h2 className="mt-8 text-2xl font-black text-gray-900">
                                {user?.username || "User"}
                            </h2>

                            <p className="mt-1 truncate text-sm text-gray-500">
                                {user?.email || "No email"}
                            </p>

                            <div className="mt-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase text-green-700">
                                {user?.role || "student"}
                            </div>

                            <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#082719] to-[#1f6b43] p-5 text-left text-white">
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                                    Account Status
                                </p>
                                <h3 className="mt-2 text-xl font-black">
                                    Active Student
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-white/70">
                                    Your profile is connected with the AI Code Reuse dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Forms */}
                        <div className="space-y-8 lg:col-span-2">

                            {/* Account Information */}
                            <form
                                onSubmit={handleSaveProfile}
                                className="rounded-[32px] bg-white p-8 shadow-2xl shadow-green-900/5"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Account Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update your basic profile information.
                                    </p>
                                </div>

                                {profileMessage.text && (
                                    <div
                                        className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-bold ${messageClass(
                                            profileMessage.type
                                        )}`}
                                    >
                                        {profileMessage.text}
                                    </div>
                                )}

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            Username
                                        </label>
                                        <input
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="mt-7 rounded-2xl bg-green-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {profileLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>

                            {/* Password */}
                            <form
                                onSubmit={handleChangePassword}
                                className="rounded-[32px] bg-white p-8 shadow-2xl shadow-green-900/5"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Change Password
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update your account password securely.
                                    </p>
                                </div>

                                {passwordMessage.text && (
                                    <div
                                        className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-bold ${messageClass(
                                            passwordMessage.type
                                        )}`}
                                    >
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <div className="grid gap-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            Old Password
                                        </label>
                                        <input
                                            type="password"
                                            name="old_password"
                                            value={form.old_password}
                                            onChange={handleChange}
                                            placeholder="Enter old password"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                        />
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={form.new_password}
                                                onChange={handleChange}
                                                placeholder="New password"
                                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={form.confirm_password}
                                                onChange={handleChange}
                                                placeholder="Confirm password"
                                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-green-400 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="mt-7 rounded-2xl bg-[#082719] px-7 py-4 text-sm font-black text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#0d3b28] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}