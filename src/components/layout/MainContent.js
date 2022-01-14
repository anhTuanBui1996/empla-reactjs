import React from "react";

function MainContent({ children }) {
  return (
    <div
      className="main-content"
      style={{
        height: "100vh;",
        overflow: "auto;",
      }}
    >
      {children}
    </div>
  );
}

export default MainContent;
