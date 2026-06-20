import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";

const loginMock = vi.fn();

vi.mock("../use-auth", () => ({
  useAuth: () => ({
    login: loginMock
  })
}));

describe("LoginPage", () => {
  beforeEach(() => {
    loginMock.mockReset();
  });

  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Hesabınıza daxil olun" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email və ya istifadəçi adı")).toBeInTheDocument();
    expect(screen.getByLabelText("Şifrə")).toBeInTheDocument();
  });

  it("shows validation messages before submit", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /daxil ol/i }));

    expect(screen.getByText("Email və ya istifadəçi adını daxil edin.")).toBeInTheDocument();
    expect(screen.getByText("Şifrəni daxil edin.")).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("redirects admins to the admin page when there is no intended route", async () => {
    loginMock.mockResolvedValue({ username: "admin", roles: [{ authority: "ROLE_ADMIN" }] });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<div>Admin destination</div>} />
          <Route path="/account" element={<div>Account destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText("Email və ya istifadəçi adı"), "admin@mizan.az");
    await userEvent.type(screen.getByLabelText("Şifrə"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /daxil ol/i }));

    expect(await screen.findByText("Admin destination")).toBeInTheDocument();
  });

  it("returns users to the intended route after login", async () => {
    loginMock.mockResolvedValue({ username: "user", roles: [{ authority: "ROLE_USER" }] });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: "/account?view=session" } }]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<div>Account destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText("Email və ya istifadəçi adı"), "user@mizan.az");
    await userEvent.type(screen.getByLabelText("Şifrə"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /daxil ol/i }));

    expect(await screen.findByText("Account destination")).toBeInTheDocument();
  });
});
