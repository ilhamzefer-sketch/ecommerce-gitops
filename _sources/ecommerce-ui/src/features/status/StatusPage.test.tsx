import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAuthStatus } from "../auth/auth-api";
import { StatusPage } from "./StatusPage";

vi.mock("../auth/auth-api", () => ({
  getAuthStatus: vi.fn()
}));

const getAuthStatusMock = vi.mocked(getAuthStatus);

describe("StatusPage", () => {
  beforeEach(() => {
    getAuthStatusMock.mockReset();
  });

  it("shows the gateway-backed auth status response", async () => {
    getAuthStatusMock.mockResolvedValue("Auth service is up");

    render(
      <MemoryRouter>
        <StatusPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("“Auth service is up”")).toBeInTheDocument();
    expect(screen.getByText("/api/auth/status")).toBeInTheDocument();
  });
});
