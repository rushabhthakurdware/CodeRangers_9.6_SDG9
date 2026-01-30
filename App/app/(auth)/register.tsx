import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterScreen() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isAdmin,
    toggleAdmin,
    handleRegister,
    navigateToLogin,
    loading,
  } = useRegisterForm();

  return (
    <RegisterForm
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isAdmin={isAdmin}
      toggleAdmin={toggleAdmin}
      onRegister={handleRegister}
      onNavigateToLogin={navigateToLogin}
    />
  );
}
