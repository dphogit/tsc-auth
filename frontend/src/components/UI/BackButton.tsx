import { useHistory } from "react-router-dom";
import { makeStyles, Theme, Button } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme: Theme) => ({
  backBtn: {
    marginBottom: theme.spacing(1),
  },
}));

interface Props {
  backPath: string;
}

const BackButton = ({ backPath }: Props) => {
  const classes = useStyles();

  const history = useHistory();

  const backHandler = () => {
    history.push(backPath);
  };

  return (
    <Button
      color="primary"
      onClick={backHandler}
      startIcon={<ArrowBackIosIcon />}
      className={classes.backBtn}
    >
      Back
    </Button>
  );
};

export default BackButton;
