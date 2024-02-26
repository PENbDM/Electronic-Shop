import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../redux/slices/userSlice";
import "./index.scss";
import { RootState } from "../../redux/store";
import UserBlock from "./UserBlock";
import bro1 from "../../img/bro_orders.png";
import bro2 from "../../img/bro2_details.png";
import { Link } from "react-router-dom";

function User() {
  //dima for you - test@gmail.com, 12345User .

  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.user.user.userWithoutPassword
  );

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <div className="userWrapper">
      <UserBlock user={user} handleLogout={handleLogout} />
      <div className="UserHomePage">
        <div className="accHomepage">
          <h3>My Account homepage</h3>
          <p>Here you can view and check past orders.</p>
        </div>
        <div className="blockOfTwoBro">
          <Link
            to={"/orders"}
            className="blockFirstBro"
            style={{
              backgroundColor: "#cae7e6",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="textofBro">
              <p className="textOFBROtitle">Your orders</p>
              <p>View your orders</p>
            </div>
            <img
              src={bro1}
              alt="bro1"
              width={190}
              height={133}
              className="fullWidthImage"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default User;
