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
    paddingLeft: theme.spacing(3),
  },
  textGrid: {
    width: "60%",
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
      <Grid item>{field}</Grid>
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
