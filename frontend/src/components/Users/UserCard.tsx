import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import { PublicDetails } from "../../common/interfaces";
import ProfileAvatar from "../Profile/ProfileAvatar";

interface Props {
  details: PublicDetails;
}

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    marginBottom: theme.spacing(1),
  },
}));

const UserCard = ({ details }: Props) => {
  const classes = useStyles();

  const { email, name, photoFilename, id } = details;

  const history = useHistory();

  return (
    <Card>
      <CardContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item className={classes.item}>
            <ProfileAvatar
              src={
                photoFilename
                  ? `http://localhost:8080/photo/${photoFilename}`
                  : undefined
              }
              email={email}
              length="7.5rem"
              name={name}
            />
          </Grid>
          <Grid item className={classes.item}>
            <Typography variant="caption">{email}</Typography>
          </Grid>
          <Grid item className={classes.item}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              endIcon={<VisibilityIcon />}
              onClick={() => {
                history.push(`/users/${id}`);
              }}
            >
              View
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCard;
