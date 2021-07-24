import { makeStyles, Theme } from "@material-ui/core/styles";

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

export default useStyles;
