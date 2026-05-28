import { useState } from "react";

export function usePasswordToggle() {
  const [isVisible, setIsVisible] = useState(false);

  return {
    isVisible,
    inputType: (isVisible ? "text" : "password") as "text" | "password",
    toggleVisibility: () => setIsVisible((current) => !current),
  };
}
