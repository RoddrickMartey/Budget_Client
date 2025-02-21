import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { app } from "../../../config/firebaseConfig";
import {
  loginStart,
  selectError,
  selectLoading,
  loginFailure,
  loginSuccess,
} from "../../../redux/slices/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../config/axiosConfig";
import { useNavigate } from "react-router";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);

      // Send user data to backend for authentication
      const response = await loginUser({
        email: user.email,
        name: user.displayName,
      });
      console.log(response);

      // Dispatch login success and store user in Redux
      dispatch(loginSuccess(response));
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err.message);
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle className="text-2xl" />
          <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </div>
    </section>
  );
}

export default LoginPage;
