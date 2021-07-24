import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import { PublicDetails, User } from "../../common/interfaces";
import useHttp from "../../hooks/useHttp";
import ProfileAvatar from "./ProfileAvatar";
import ProfileRow from "./ProfileRow";
import BackButton from "../UI/BackButton";

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

const ViewProfile = ({ token, userId }: Props) => {
  const [details, setDetails] = useState<PublicDetails | null>(null);

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const { isLoading, errorMessage, sendRequest: fetchUser } = useHttp();

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const processUser = (data: { user: User }) => {
      const user = data.user;
      setDetails({
        id: user.userId,
        email: user.email,
        name: user.profile && user.profile.name,
        bio: user.profile && user.profile.bio,
        phone: user.profile && user.profile.phone,
        photoFilename:
          user.profile && user.profile.photo && user.profile.photo.filename,
      });
    };

    fetchUser({
      url: `http://localhost:8080/api/v1/user/${id}`,
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      processData: processUser,
    });
  }, [fetchUser, token, id]);

  const editHandler = () => {
    history.push("/edit");
  };

  const isOwnProfile = details?.id === userId;

  let content;

  if (details) {
    const cardHeader = isOwnProfile ? (
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
    ) : (
      <CardHeader
        title={
          details.name
            ? `${details.name}'s Profile`
            : `${details.email}'s Profile`
        }
      />
    );

    content = (
      <div>
        {isOwnProfile && (
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            className={classes.heading}
          >
            My Profile
          </Typography>
        )}
        <Card className={classes.card}>
          {cardHeader}
          <CardContent className={classes.cardContent}>
            <Typography align="center" className={classes.failText}>
              {errorMessage}
            </Typography>
            {details && (
              <>
                <ProfileRow
                  field="Photo"
                  value={
                    <ProfileAvatar
                      email={details.email}
                      src={
                        details.photoFilename
                          ? `http://localhost:8080/photo/${details.photoFilename}`
                          : undefined
                      }
                      length="5rem"
                      name={details.name}
                    />
                  }
                  borderTop
                  borderBottom
                />
                <ProfileRow field="Name" value={details.name} borderBottom />
                <ProfileRow field="Bio" value={details.bio} borderBottom />
                <ProfileRow field="Phone" value={details.phone} borderBottom />
                <ProfileRow field="Email" value={details.email} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    content = <Typography variant="h2">Loading...</Typography>;
  }

  return (
    <div>
      {!isOwnProfile && <BackButton backPath="/users" />}
      {content}
    </div>
  );
};

export default ViewProfile;
