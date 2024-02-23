import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-4">
        <div className="mb-3">
          <Link to="/track" className="d-block mb-2">
            Go to Track Page
          </Link>
          <Link to="/insights" className="d-block">
            Go to Insights Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
