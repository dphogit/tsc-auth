import Container from "@material-ui/core/Container";
import { useState } from "react";
import { Switch, Route } from "react-router-dom";

import AuthForm from "./components/AuthForm";
import Navigation from "./components/Navigation";
import MyProfile from "./components/MyProfile";

const App = () => {
  const [userId, setUserId] = useState<number>();
  const [token, setToken] = useState<string>();

  return (
    <Container maxWidth="md">
      <Switch>
        {userId && token ? (
          <>
            <Navigation />
            <Route path="/">
              <MyProfile userId={userId} token={token} />
            </Route>
          </>
        ) : (
          <Route path="/">
            <AuthForm setUserId={setUserId} setToken={setToken} />
          </Route>
        )}
      </Switch>
    </Container>
  );
};

export default App;
