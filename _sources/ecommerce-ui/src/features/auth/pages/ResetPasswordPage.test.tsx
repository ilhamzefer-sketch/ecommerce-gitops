import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { resetPassword } from "../auth-api";
import { ResetPasswordPage } from "./ResetPasswordPage";

vi.mock("../auth-api", () => ({
  resetPassword: vi.fn()
}));

const resetPasswordMock = vi.mocked(resetPassword);

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    resetPasswordMock.mockReset();
  });

  it("shows an invalid-link state when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Şifrə yeniləmə tokeni tapılmadı.")).toBeInTheDocument();
  });

  it("submits the query token and new password", async () => {
    resetPasswordMock.mockResolvedValue({ message: "Password reset successfully." });

    render(
      <MemoryRouter initialEntries={["/reset-password?token=reset-token"]}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText("Yeni şifrə"), "password123");
    await userEvent.type(screen.getByLabelText("Yeni şifrə təkrarı"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /şifrəni yenilə/i }));

    expect(await screen.findByText("Şifrəniz yeniləndi. İndi giriş edə bilərsiniz.")).toBeInTheDocument();
    expect(resetPasswordMock).toHaveBeenCalledWith({ token: "reset-token", newPassword: "password123" });
  });
});
