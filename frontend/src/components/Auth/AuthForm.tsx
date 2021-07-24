import { useState, SyntheticEvent, SetStateAction, Dispatch } from "react";
import {
  LinearProgress,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import useStyles from "./styles";
import useHttp from "../../hooks/useHttp";
import { User } from "../../common/interfaces";

interface Details {
  email: string;
  password: string;
}

interface Props {
  setUserId: Dispatch<SetStateAction<number | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setAutoLogout: (ms: number) => void;
}

const AuthForm = ({ setUserId, setToken, setAutoLogout }: Props) => {
  const classes = useStyles();

  const history = useHistory();

  const [isRegister, setIsRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  let { sendRequest, errorMessage, setErrorMessage, isLoading } = useHttp();

  const toggleModeHandler = () => {
    setIsRegister((prevMode) => !prevMode);
    setErrorMessage("");
  };

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const details = {
      email: target.email.value,
      password: target.password.value,
    };

    if (isRegister) {
      await registerHandler(details);
    } else {
      await loginHandler(details);
    }
  };

  const registerHandler = async (details: Details) => {
    const processRegisterUser = (_data: { newUser: User }) => {
      setSuccessMessage("Registration Successful! Login with your details.");
      toggleModeHandler();
    };

    await sendRequest({
      url: "http://localhost:8080/api/v1/auth/register",
      options: {
        method: "POST",
        body: JSON.stringify(details),
        headers: {
          "Content-Type": "application/json",
        },
      },
      processData: processRegisterUser,
    });
  };

  const loginHandler = async (details: Details) => {
    const processLoginUser = (data: {
      userId: number;
      token: string;
      expiresInMs: number;
    }) => {
      const { userId, token, expiresInMs } = data;
      setToken(token);
      setUserId(userId);
      setAutoLogout(expiresInMs);

      const expiryDate = new Date(new Date().getTime() + expiresInMs);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      history.push(`/users/${userId}`);
    };

    await sendRequest({
      url: "http://localhost:8080/api/v1/auth/login",
      options: {
        method: "POST",
        body: JSON.stringify(details),
        headers: {
          "Content-Type": "application/json",
        },
      },
      processData: processLoginUser,
    });
  };

  const text = isRegister ? "Register" : "Login";

  return (
    <form onSubmit={submitHandler}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        className={classes.heading}
      >
        {text}
      </Typography>
      {errorMessage && (
        <Typography align="center" className={classes.failText}>
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography align="center" className={classes.successText}>
          {successMessage}
        </Typography>
      )}
      {isLoading && <LinearProgress />}
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoFocus
        autoComplete="email"
        error={errorMessage ? true : false}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        error={errorMessage ? true : false}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submitBtn}
        type="submit"
      >
        {text}
      </Button>
      <Button
        color="default"
        onClick={toggleModeHandler}
        fullWidth
        className={classes.changeBtn}
        type="button"
      >
        {isRegister
          ? "Already have an account? Login."
          : "Don't have an account? Register."}
      </Button>
    </form>
  );
};

export default AuthForm;
