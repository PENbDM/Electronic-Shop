import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../redux/slices/userSlice";
import "./index.scss";
import { RootState } from "../../redux/store";
import UserBlock from "./UserBlock";
function PersonalInfo() {
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
    </div>
  );
}

export default PersonalInfo;
