import { hasErrors, isEmail, mapDetailsToErrors, minLength, required } from "./validation";

describe("validation helpers", () => {
  it("validates required values", () => {
    expect(required("")).toBe("Bu xana mütləq doldurulmalıdır.");
    expect(required("mizan")).toBeUndefined();
  });

  it("validates email shape", () => {
    expect(isEmail("user@mizan.az")).toBe(true);
    expect(isEmail("user-at-mizan")).toBe(false);
  });

  it("validates minimum length and error collections", () => {
    expect(minLength("1234567", 8, "Qısa şifrə")).toBe("Qısa şifrə");
    expect(hasErrors({ email: undefined, password: "Qısa şifrə" })).toBe(true);
    expect(hasErrors({ email: undefined })).toBe(false);
  });

  it("maps backend details to known form fields", () => {
    expect(mapDetailsToErrors({ email: "Email should be valid", token: "Token is required" }, ["email"])).toEqual({
      email: "Email should be valid"
    });
  });
});
