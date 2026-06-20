import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

let authStatus: "booting" | "anonymous" | "authenticated" = "anonymous";
let sessionExpired = false;

vi.mock("../../features/auth/use-auth", () => ({
  useAuth: () => ({
    status: authStatus,
    sessionExpired
  })
}));

function LoginDestination() {
  const location = useLocation();
  const state = location.state as { sessionExpired?: boolean; from?: string } | null;

  return (
    <div>
      <p>Login destination</p>
      <p>Expired:{String(Boolean(state?.sessionExpired))}</p>
      <p>From:{state?.from}</p>
    </div>
  );
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/account?view=session"]}>
      <Routes>
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginDestination />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("redirects anonymous users to login", () => {
    authStatus = "anonymous";
    sessionExpired = false;
    renderProtectedRoute();

    expect(screen.getByText("Login destination")).toBeInTheDocument();
    expect(screen.getByText("Expired:false")).toBeInTheDocument();
    expect(screen.getByText("From:/account?view=session")).toBeInTheDocument();
  });

  it("passes session-expired state to login", () => {
    authStatus = "anonymous";
    sessionExpired = true;
    renderProtectedRoute();

    expect(screen.getByText("Expired:true")).toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    authStatus = "authenticated";
    sessionExpired = false;
    renderProtectedRoute();

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
