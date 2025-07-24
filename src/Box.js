import { useState } from "react";

export function Box({ children }) {
  const [isOpen, setIsOpen] =
    useState(true);

  function toggleBotton() {
    setIsOpen((open) => !open);
  }
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={toggleBotton}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
