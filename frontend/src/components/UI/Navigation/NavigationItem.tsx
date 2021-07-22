import { Button, makeStyles, Theme } from "@material-ui/core";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
    color: theme.palette.common.white,
  },
}));

interface Props {
  path: string;
  text: string;
  onClick?: () => void;
}

const NavigationItem = ({ path, text, onClick }: Props) => {
  const classes = useStyles();

  return (
    <Button onClick={onClick} className={classes.item}>
      <NavLink to={path} className={classes.link}>
        {text}
      </NavLink>
    </Button>
  );
};

export default NavigationItem;
