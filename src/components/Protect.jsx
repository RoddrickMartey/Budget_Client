import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/userSlice/userSlice";

function Protect() {
  const user = useSelector(selectCurrentUser);

  if (user === null) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render child routes if user is authenticated
}

export default Protect;
