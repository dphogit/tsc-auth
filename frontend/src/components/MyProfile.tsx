import { useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";

import { fetchUserDetails } from "../api/user";
import ProfileAvatar from "./ProfileAvatar";
import ProfileRow from "./ProfileRow";

interface PublicDetails {
  email: string;
  name: string | null;
  bio: string | null;
  phone: string | null;
  photoFilename: string | null;
}

interface Props {
  token: string;
  userId: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(3),
    },
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  heading: {
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.spacing(5),
    },
  },
  failText: {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
    borderWidth: "1px",
  },
}));

const MyProfile = (props: Props) => {
  const classes = useStyles();

  const history = useHistory();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const [userDetails, setUserDetails] = useState<PublicDetails | null>(null);
  const [failMessage, setFailMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const json = await fetchUserDetails(props.userId, props.token);

        if (json.status === "fail") {
          setFailMessage(json.data.reason);
          return;
        } else if (json.status === "error") {
          setFailMessage(json.data.message);
          throw new Error(json.data.message);
        }

        const user = json.data.user;
        const profile = user.profile;

        const details: PublicDetails = {
          email: user.email,
          name: profile && profile.name,
          bio: profile && profile.bio,
          phone: profile && profile.phone,
          photoFilename: profile && profile.photo && profile.photo.filename,
        };
        setUserDetails(details);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [props]);

  const editHandler = () => {
    history.push("/edit");
  };

  return (
    <div>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className={classes.heading}
      >
        My Profile
      </Typography>
      <Card className={classes.card}>
        <CardHeader
          action={
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={editHandler}
            >
              Edit
            </Button>
          }
          title="Profile"
          subheader="This information is visible to other people"
          subheaderTypographyProps={{
            variant: matches ? "caption" : "subtitle1",
            style: {
              marginTop: "8px",
            },
          }}
        />
        <CardContent className={classes.cardContent}>
          <Typography align="center" className={classes.failText}>
            {failMessage}
          </Typography>
          {userDetails && (
            <>
              <ProfileRow
                field="Photo"
                value={
                  <ProfileAvatar
                    email={userDetails.email}
                    src={
                      userDetails.photoFilename
                        ? `http://localhost:8080/photo/${userDetails.photoFilename}`
                        : undefined
                    }
                    length="5rem"
                    name={userDetails.name}
                  />
                }
                borderTop
                borderBottom
              />
              <ProfileRow field="Name" value={userDetails.name} borderBottom />
              <ProfileRow field="Bio" value={userDetails.bio} borderBottom />
              <ProfileRow
                field="Phone"
                value={userDetails.phone}
                borderBottom
              />
              <ProfileRow field="Email" value={userDetails.email} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
