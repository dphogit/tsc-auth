import { makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "../api/user";

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
  failText: {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
    borderWidth: "1px",
  },
}));

const MyProfile = (props: Props) => {
  const classes = useStyles();

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

  return (
    <div>
      <Typography variant="h3">My Profile</Typography>
      <Card>
        <CardHeader
          action={<Button variant="outlined">Edit Profile</Button>}
          title="Profile"
          subheader="This information is visible to other people"
        />
        <CardContent>
          <Typography align="center" className={classes.failText}>
            {failMessage && failMessage}
          </Typography>
          <p>Name: {userDetails?.name}</p>
          <p>Bio: {userDetails?.bio}</p>
          <p>Phone: {userDetails?.phone}</p>
          <p>Email: {userDetails?.email}</p>
          <p>Filename: {userDetails?.photoFilename}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
