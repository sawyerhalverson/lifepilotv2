import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-primary">
      <div className="alert alert-info mb-4" role="alert" style={{ fontSize: "36px", fontWeight: "bold", marginTop: "50px" }}>
        Welcome to LifePilot
      </div>
      <div className="w-50 bg-white rounded p-4" style={{ marginTop: "100px" }}>
        <Link to="/track" className="d-block mb-2">
          Go to Track Page
        </Link>
        <Link to="/insights" className="d-block">
          Go to Insights Page
        </Link>
      </div>
    </div>
  );
}

export default Home;
