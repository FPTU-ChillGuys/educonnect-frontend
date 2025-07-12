import { FC } from "react";
import AppRoute from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App: FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || ""}>
      <AppRoute />
    </GoogleOAuthProvider>
  );
};

export default App;
