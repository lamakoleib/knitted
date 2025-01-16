import React from "react";
import "./login.css";

const LoginPage = () => {
	return (
		<div className="login-container">
			<div className="login-card">
				<h1 className="login-title">Knitted</h1>
				<form>
					<div className="form-group">
						<label htmlFor="email" className="form-label">
							Phone number, email, or username
						</label>
						<input
							type="text"
							id="email"
							placeholder="Enter your email or username"
							className="form-input"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							id="password"
							placeholder="Enter your password"
							className="form-input"
						/>
					</div>
					<button type="submit" className="login-button">
						Log In
					</button>
					<div className="forgot-password">
						<a href="#">Forgot Password?</a>
					</div>
				</form>
				<div className="divider">
					<div className="divider-line"></div>
					<span className="divider-text">OR</span>
					<div className="divider-line"></div>
				</div>
				<p className="signup-text">
					Don’t have an account?{" "}
					<a href="/signup" className="text-pink-500">
						Sign Up
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
