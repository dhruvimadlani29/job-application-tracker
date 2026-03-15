// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({
        id: currentUser.userId,
        email: attributes.email || "",
        name:
          attributes.name ||
          attributes.given_name ||
          attributes.email?.split("@")[0] ||
          "User",
      });
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  async function logout() {
    try {
      await signOut();
      setUser(null);
      // Clear notification state
      localStorage.removeItem("dismissedNotifications");
      localStorage.removeItem("readNotifications");
      localStorage.removeItem("notificationResetDate");
      // Force redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      // Force redirect even if signOut fails
      window.location.href = "/login";
    }
  }

  return { user, loading, logout, checkUser };
}
