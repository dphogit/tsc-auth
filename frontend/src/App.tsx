import Container from "@material-ui/core/Container";
import { useCallback, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import AuthForm from "./components/AuthForm";
import Navigation from "./components/Navigation";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";

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
    <div className="application">
      <Helmet>
        <title>Authentication App</title>
        <meta
          name="description"
          content="Authentication application created with React"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Helmet>
      {userId && token && <Navigation logout={logoutHandler} />}
      <Container maxWidth="md">
        {userId && token ? (
          <Switch>
            <Route path="/edit" exact>
              <EditProfile userId={userId} token={token} />
            </Route>
            <Route path="/">
              <MyProfile userId={userId} token={token} />
            </Route>
          </Switch>
        ) : (
          <AuthForm
            setUserId={setUserId}
            setToken={setToken}
            setAutoLogout={setAutoLogout}
          />
        )}
      </Container>
    </div>
  );
};

export default App;
