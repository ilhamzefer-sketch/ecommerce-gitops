import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth";
import { PageLoader } from "../ui/PageLoader";
import { Notice } from "../ui/Notice";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { status, roles, sessionExpired } = useAuth();
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

  if (!roles.includes("ROLE_ADMIN")) {
    return (
      <main className="page-shell page-shell--narrow">
        <Notice
          tone="danger"
          title="Giriş məhdudlaşdırılıb"
          message="Bu səhifəyə giriş icazəniz yoxdur."
        />
      </main>
    );
  }

  return children;
}
