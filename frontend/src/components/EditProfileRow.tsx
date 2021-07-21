import { Grid, TextField, makeStyles, Theme } from "@material-ui/core";
import { ChangeEvent } from "react";

interface Props {
  field: string;
  textarea?: boolean;
  placeholder: string;
  value?: string | null;
  paddingTop?: boolean;
  paddingBottom?: boolean;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    paddingTop: (props: Props) => (props.paddingTop ? theme.spacing(3) : 0),
    paddingBottom: (props: Props) =>
      props.paddingBottom ? theme.spacing(3) : 0,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(3),
    },
  },
  field: {
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  },
  textGrid: {
    width: "60%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  text: {
    width: "100%",
  },
}));

const EditProfileRow = (props: Props) => {
  const classes = useStyles(props);

  const { field, textarea, placeholder, value, onChange } = props;

  return (
    <Grid
      container
      className={classes.row}
      direction="column"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid item className={classes.field}>
        {field}
      </Grid>
      <Grid item className={classes.textGrid}>
        <TextField
          className={classes.text}
          variant="outlined"
          multiline={textarea}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e, field)}
        />
      </Grid>
    </Grid>
  );
};

export default EditProfileRow;
