import Container from "@material-ui/core/Container";
import { useCallback, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import AuthForm from "./components/AuthForm";
import Navigation from "./components/Navigation";
import MyProfile from "./components/MyProfile";

const App = () => {
  const [userId, setUserId] = useState<number>();
  const [token, setToken] = useState<string>();

  const logoutHandler = () => {
    setUserId(undefined);
    setToken(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  const setAutoLogout = useCallback((ms) => {
    setTimeout(() => {
      logoutHandler();
    }, ms);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const userId = localStorage.getItem("userId");

    if (!token || !expiryDate || !userId) return;

    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const remainingMs = new Date(expiryDate).getTime() - new Date().getTime();

    setAutoLogout(remainingMs);
    setUserId(+userId);
    setToken(token);
  }, [setAutoLogout]);

  return (
    <Container maxWidth="md">
      <Switch>
        {userId && token ? (
          <>
            <Navigation logout={logoutHandler} />
            <Route path="/">
              <MyProfile userId={userId} token={token} />
            </Route>
          </>
        ) : (
          <Route path="/">
            <AuthForm
              setUserId={setUserId}
              setToken={setToken}
              setAutoLogout={setAutoLogout}
            />
          </Route>
        )}
      </Switch>
    </Container>
  );
};

export default App;
