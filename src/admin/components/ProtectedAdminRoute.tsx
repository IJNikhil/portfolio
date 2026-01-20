import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../shared/services/authService";

export const ProtectedAdminRoute = () => {
    // Check for robust token existence via AuthService
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
