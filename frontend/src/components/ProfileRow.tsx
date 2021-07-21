import { ReactNode } from "react";
import { makeStyles, Grid, Theme, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface Props {
  field: string;
  value?: string | null | ReactNode;
  borderTop?: boolean;
  borderBottom?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: Props) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderTop: props.borderTop
      ? `1px solid ${theme.palette.grey[400]}`
      : "none",
    borderBottom: props.borderBottom
      ? `1px solid ${theme.palette.grey[400]}`
      : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  field: {
    fontWeight: "bold",
  },
}));

const ProfileRow = (props: Props) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { field, value } = props;

  return (
    <Grid container direction="row" className={classes.root}>
      <Grid item xs={matches ? 3 : 5} className={classes.field}>
        {field}
      </Grid>
      <Grid item xs={matches ? 9 : 7}>
        {value}
      </Grid>
    </Grid>
  );
};

export default ProfileRow;
