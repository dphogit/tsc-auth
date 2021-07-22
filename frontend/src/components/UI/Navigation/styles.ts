import { makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      marginBottom: theme.spacing(8),
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(2),
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.subtitle2,
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    menuLink: {
      textDecoration: "none",
      color: theme.palette.common.black,
    },
  })
);

export default useStyles;
