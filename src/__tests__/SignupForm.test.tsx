import { render, screen } from "@testing-library/react";
import SignupForm from "@/components/signup-form";
import { signup } from "@/lib/auth-actions";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/auth-actions", () => ({
  signup: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

jest.mock("next/form", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <form {...props}>{children}</form>
  ),
}));

describe("SignupForm", () => {
  it("renders all static elements in the signup form", () => {
    render(<SignupForm />);

    expect(
      screen.getByRole("heading", { name: /create a new account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("calls signup with valid input data on form submission", async () => {
    render(<SignupForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: "Signup" });

    await userEvent.type(firstNameInput, "Iron");
    await userEvent.type(lastNameInput, "Man");
    await userEvent.type(emailInput, "iron.man@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    await userEvent.click(submitButton);

    const expectedFormData = new FormData();
    expectedFormData.append("first-name", "Iron");
    expectedFormData.append("last-name", "Man");
    expectedFormData.append("email", "iron.man@example.com");
    expectedFormData.append("password", "password123");
    expectedFormData.append("confirm-password", "password123");

    expect(signup).toHaveBeenCalledWith(expectedFormData);
  });
   
});
