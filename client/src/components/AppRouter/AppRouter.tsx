// AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes, adminRoute } from "../../route";
import { useSelector } from "react-redux"; // Import useSelector
import { selectIsAuth, selectUser } from "../../redux/slices/userSlice"; // Import selectors
import promItems from "../../redux/slices/promItems";
import { ADMIN_ROUTE, USER_ROUTE, CART_ROUTE } from "../../utils/consts";
import { RootState } from "../../redux/store";
function AppRouter() {
  const isAuth = useSelector(selectIsAuth);

  const user = useSelector(selectUser);
  const promItems = useSelector((state: RootState) => state.promItems.items);
  const isAdmin =
    user &&
    user.userWithoutPassword &&
    user.userWithoutPassword.role === "ADMIN";
  //admin pass is  12345Admin , email is - admin@gmail.com

  return (
    <Routes>
      {isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path + "/*"} element={<Component />} />
        ))}

      {isAdmin &&
        adminRoute.map(({ path, Component }) => (
          <Route key={path} path={path + "/*"} element={<Component />} />
        ))}

      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path + "/*"} element={<Component />} />
      ))}

      {/* Redirect admin away from USER_ROUTE */}
      {isAdmin && (
        <>
          <Route path={USER_ROUTE} element={<Navigate to="/" />} />
          <Route path={CART_ROUTE} element={<Navigate to="/" />} />
        </>
      )}

      {/* Redirect non-admin users away from ADMIN_ROUTE */}
      {!isAdmin && <Route path={ADMIN_ROUTE} element={<Navigate to="/" />} />}

      {/* Redirect unmatched routes to home */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
