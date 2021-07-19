import { ReactNode } from "react";
import { makeStyles, Grid, Theme } from "@material-ui/core";

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
  }),
}));

const ProfileRow = (props: Props) => {
  const classes = useStyles(props);

  const { field, value } = props;

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={3}>
        {field}
      </Grid>
      <Grid item xs={9}>
        {value}
      </Grid>
    </Grid>
  );
};

export default ProfileRow;
