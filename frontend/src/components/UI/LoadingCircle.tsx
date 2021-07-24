import { CircularProgress, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
}));

const LoadingCircle = () => {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <CircularProgress size="5rem" />
    </div>
  );
};

export default LoadingCircle;
