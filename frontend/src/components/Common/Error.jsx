import React from "react";

const Error = ({ error }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Something went wrong.</h1>
      <p>
        Error <code> {error}</code>
      </p>
    </div>
  );
};

export default Error;
