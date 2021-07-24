import { useCallback, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AuthForm from "./components/Auth/AuthForm";
import EditProfile from "./components/Profile/EditProfile";
import Users from "./components/Users/Users";
import Layout from "./components/UI/Layout";
import Navigation from "./components/UI/Navigation/Navigation";
import Profile from "./components/Profile/Profile";

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
    <div className="app">
      {userId && token && <Navigation logout={logoutHandler} userId={userId} />}
      <Layout>
        {userId && token ? (
          <Switch>
            <Route path="/edit" exact>
              <EditProfile userId={userId} token={token} />
            </Route>
            <Route path="/users" exact>
              <Users token={token} userId={userId} />
            </Route>
            <Route path="/users/:id" exact>
              <Profile token={token} userId={userId} />
            </Route>
            <Route path="/">
              <Redirect to={`/users/${userId}`} />
            </Route>
          </Switch>
        ) : (
          <AuthForm
            setUserId={setUserId}
            setToken={setToken}
            setAutoLogout={setAutoLogout}
          />
        )}
      </Layout>
    </div>
  );
};

export default App;
