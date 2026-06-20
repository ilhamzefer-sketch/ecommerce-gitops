import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { forgotPassword } from "../auth-api";
import { ForgotPasswordPage } from "./ForgotPasswordPage";

vi.mock("../auth-api", () => ({
  forgotPassword: vi.fn()
}));

const forgotPasswordMock = vi.mocked(forgotPassword);

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    forgotPasswordMock.mockReset();
  });

  it("shows a generic safe success message", async () => {
    forgotPasswordMock.mockResolvedValue({ message: "If your email is registered, you will receive a reset link." });

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText("E-poçt"), "user@mizan.az");
    await userEvent.click(screen.getByRole("button", { name: /təlimatı göndər/i }));

    expect(await screen.findByText("Əgər bu e-poçt sistemdə varsa, şifrə bərpa keçidi göndərildi.")).toBeInTheDocument();
    expect(forgotPasswordMock).toHaveBeenCalledWith({ email: "user@mizan.az" });
  });
});
