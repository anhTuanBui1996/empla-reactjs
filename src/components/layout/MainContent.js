import React from "react";

function MainContent({ children }) {
  return (
    <div
      className="main-content"
      style={{
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}

export default MainContent;
