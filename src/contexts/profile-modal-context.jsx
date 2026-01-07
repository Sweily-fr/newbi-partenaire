"use client";

import { createContext, useContext, useState } from "react";

const ProfileModalContext = createContext();

export function ProfileModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProfileModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ProfileModalContext.Provider>
  );
}

export function useProfileModal() {
  const context = useContext(ProfileModalContext);
  if (!context) {
    throw new Error("useProfileModal must be used within ProfileModalProvider");
  }
  return context;
}
