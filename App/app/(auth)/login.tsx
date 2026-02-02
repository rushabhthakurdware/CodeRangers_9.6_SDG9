import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    navigateToRegister,
    type,
    loading, // You can use this to disable the button while logging in
  } = useLoginForm();

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onLogin={handleLogin}
      onNavigateToRegister={navigateToRegister}
    />
  );
}
