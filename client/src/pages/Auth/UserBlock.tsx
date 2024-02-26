import React from "react";
import { Link } from "react-router-dom";

interface UserBlockProps {
  user: { name: string };
  handleLogout: () => void;
}

function UserBlock({ user, handleLogout }: UserBlockProps) {
  return (
    <div className="userLeftSide">
      <ul>
        <p>
          Welcome, <span className="spanUserName">{user.name}</span>{" "}
        </p>
        <Link to={"/user"} style={{ textDecoration: "none", color: "inherit" }}>
          <li>My Account homepage</li>
        </Link>
        <Link
          to={"/orders"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <li>Your orders</li>
        </Link>

        <button className="btn-user" onClick={handleLogout}>
          Logout
        </button>
      </ul>
    </div>
  );
}

export default UserBlock;
