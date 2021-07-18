import { useState, SyntheticEvent, SetStateAction, Dispatch } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { login, register, Details } from "../api/auth";

const useStyles = makeStyles((theme: Theme) => ({
  submitBtn: {
    marginTop: theme.spacing(2),
  },
  changeBtn: {
    "&:hover": {
      backgroundColor: "white",
      textDecoration: "underline",
    },
    marginTop: theme.spacing(2),
  },
  heading: {
    marginTop: theme.spacing(2),
    fontWeight: "normal",
  },
  successText: {
    backgroundColor: theme.palette.success.light,
    borderColor: theme.palette.success.dark,
    borderWidth: "1px",
  },
  failText: {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
    borderWidth: "1px",
  },
}));

interface Props {
  setUserId: Dispatch<SetStateAction<number | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setAutoLogout: (ms: number) => void;
}

const AuthForm = (props: Props) => {
  const classes = useStyles();

  const [isRegister, setIsRegister] = useState(true);
  const [failMessage, setFailMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleModeHandler = () => {
    setIsRegister((prevMode) => !prevMode);
    setFailMessage("");
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
      registerHandler(details);
    } else {
      loginHandler(details);
    }
  };

  const registerHandler = async (details: Details) => {
    try {
      const json = await register(details);

      if (json.status === "fail") {
        setFailMessage(json.data.reason);
        return;
      } else if (json.status === "error") {
        setFailMessage(json.data.message);
        throw new Error(json.data.message);
      }

      toggleModeHandler();
      setSuccessMessage("Registration Successful! Login with your details.");
    } catch (error) {
      console.log(error);
    }
  };

  const loginHandler = async (details: Details) => {
    try {
      const json = await login(details);
      const { userId, token, expiresInMs, reason, message } = json.data;

      if (json.status === "fail") {
        setFailMessage(reason);
        return;
      } else if (json.status === "error") {
        setFailMessage(message);
        throw new Error(message);
      }

      props.setToken(token);
      localStorage.setItem("token", token);

      props.setUserId(userId);
      localStorage.setItem("userId", userId.toString());

      const expiryDate = new Date(new Date().getTime() + expiresInMs);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      props.setAutoLogout(expiresInMs);
    } catch (error) {
      console.log(error);
    }
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
      {failMessage && (
        <Typography align="center" className={classes.failText}>
          {failMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography align="center" className={classes.successText}>
          {successMessage}
        </Typography>
      )}
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
        error={failMessage ? true : false}
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
        error={failMessage ? true : false}
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
