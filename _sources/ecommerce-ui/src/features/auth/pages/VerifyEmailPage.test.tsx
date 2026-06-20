import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { verifyEmail } from "../auth-api";
import { VerifyEmailPage } from "./VerifyEmailPage";

vi.mock("../auth-api", () => ({
  verifyEmail: vi.fn()
}));

const verifyEmailMock = vi.mocked(verifyEmail);

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    verifyEmailMock.mockReset();
  });

  it("verifies the token and shows localized success", async () => {
    verifyEmailMock.mockResolvedValue({ message: "Email verified successfully." });

    render(
      <MemoryRouter initialEntries={["/verify-email?token=email-token"]}>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("E-poçt ünvanınız təsdiqləndi. İndi giriş edə bilərsiniz.")).toBeInTheDocument();
    expect(verifyEmailMock).toHaveBeenCalledWith("email-token");
  });

  it("shows an invalid-link state when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/verify-email"]}>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    expect(screen.getByText("E-poçt təsdiq tokeni tapılmadı.")).toBeInTheDocument();
  });
});
