import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ApiError } from "../../../shared/api/api-error";
import { register } from "../auth-api";
import { RegisterPage } from "./RegisterPage";

vi.mock("../auth-api", () => ({
  register: vi.fn()
}));

const registerMock = vi.mocked(register);

async function fillRegisterForm() {
  await userEvent.type(screen.getByLabelText("İstifadəçi adı"), "mizanuser");
  await userEvent.type(screen.getByLabelText("E-poçt"), "user@mizan.az");
  await userEvent.type(screen.getByLabelText("Şifrə"), "password123");
  await userEvent.type(screen.getByLabelText("Şifrə təkrarı"), "password123");
}

describe("RegisterPage", () => {
  beforeEach(() => {
    registerMock.mockReset();
  });

  it("shows a localized success state without auto-login", async () => {
    registerMock.mockResolvedValue({ message: "User registered successfully." });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await fillRegisterForm();
    await userEvent.click(screen.getByRole("button", { name: /qeydiyyatdan keç/i }));

    expect(await screen.findByText("Qeydiyyat tamamlandı. E-poçtunuzu yoxlayın və sonra giriş edin.")).toBeInTheDocument();
    expect(registerMock).toHaveBeenCalledWith({
      username: "mizanuser",
      email: "user@mizan.az",
      password: "password123",
      firstName: undefined,
      lastName: undefined
    });
  });

  it("maps backend validation details to fields", async () => {
    registerMock.mockRejectedValue(new ApiError("Input validation failed", 400, { email: "Email should be valid" }));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await fillRegisterForm();
    await userEvent.click(screen.getByRole("button", { name: /qeydiyyatdan keç/i }));

    expect(await screen.findByText("Email should be valid")).toBeInTheDocument();
  });
});
