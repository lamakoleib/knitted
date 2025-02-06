import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/login-form";
import { login } from "@/lib/auth-actions";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/auth-actions", () => ({
  login: jest.fn(),
  signInWithGoogle: jest.fn(),
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

describe("LoginForm", () => {
  it("renders all static elements in the login form", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: /login to your account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    const forgotPasswordLink = screen.getByText(/forgot your password\?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute("href", "#");

    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });

  it("calls login with valid input data on form submission", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Login" });

    await userEvent.type(emailInput, "iron.man@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    const expectedFormData = new FormData();
    expectedFormData.append("email", "iron.man@example.com");
    expectedFormData.append("password", "password123");

    expect(login).toHaveBeenCalledWith(expectedFormData);
  });
  
});
