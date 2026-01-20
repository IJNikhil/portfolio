import React from "react";
import { Outlet } from "react-router-dom";
import AdminShell from "../components/AdminShell";

export default function AdminLayout() {
    return (
        <AdminShell>
            <Outlet />
        </AdminShell>
    );
}
