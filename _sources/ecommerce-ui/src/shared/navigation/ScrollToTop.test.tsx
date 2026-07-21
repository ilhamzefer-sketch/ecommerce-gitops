import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockClear();
    vi.stubGlobal("scrollTo", scrollTo);
  });

  it("resets scroll position after route changes", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <ScrollToTop />
        <Link to="/account">Open account</Link>
        <Routes>
          <Route path="/login" element={<p>Login</p>} />
          <Route path="/account" element={<p>Account</p>} />
        </Routes>
      </MemoryRouter>
    );

    scrollTo.mockClear();
    await userEvent.click(screen.getByRole("link", { name: "Open account" }));

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});
