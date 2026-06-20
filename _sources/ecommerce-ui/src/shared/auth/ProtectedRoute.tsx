import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth";
import { PageLoader } from "../ui/PageLoader";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { status, sessionExpired } = useAuth();
  const location = useLocation();

  if (status === "booting") {
    return <PageLoader label="Sessiya yoxlanılır" />;
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
          sessionExpired
        }}
      />
    );
  }

  return children;
}
