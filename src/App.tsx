import { ToastProvider } from "./contexts/ToastContext";
import AppRoute from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || ""}
    >
      <ToastProvider>
        <AppRoute />
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
