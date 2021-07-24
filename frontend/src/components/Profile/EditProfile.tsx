import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Button,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useHistory } from "react-router-dom";

import EditProfileRow from "./EditProfileRow";
import ProfileAvatar from "./ProfileAvatar";
import BackButton from "../UI/BackButton";
import useHttp from "../../hooks/useHttp";
import { PublicDetails, User } from "../../common/interfaces";

interface Props {
  token: string;
  userId: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  backBtn: {
    marginBottom: theme.spacing(1),
  },
  card: {
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  cardHeader: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(6),
    },
  },
  failText: {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
    borderWidth: "1px",
  },
  padLeft: {
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(3),
    },
  },
}));

const EditProfile = ({ token, userId }: Props) => {
  const [userDetails, setUserDetails] = useState<PublicDetails | null>(null);

  // Form state
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const history = useHistory();

  const { sendRequest, errorMessage, isLoading } = useHttp();

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const processUser = (data: { user: User }) => {
      const user = data.user;
      const profile = user.profile;

      const details: PublicDetails = {
        id: user.userId,
        email: user.email,
        name: profile && profile.name,
        bio: profile && profile.bio,
        phone: profile && profile.phone,
        photoFilename: profile && profile.photo && profile.photo.filename,
      };

      setUserDetails(details);
      if (profile) {
        setName(profile.name ? profile.name : "");
        setBio(profile.bio ? profile.bio : "");
        setPhone(profile.phone ? profile.phone : "");
      }
    };

    sendRequest({
      url: `http://localhost:8080/api/v1/user/${userId}`,
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      processData: processUser,
    });
  }, [userId, token, sendRequest]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.currentTarget.value;
    switch (field) {
      case "Name":
        setName(value);
        break;
      case "Bio":
        setBio(value);
        break;
      case "Phone":
        setPhone(value);
        break;
    }
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];

    const type = file.type;
    if (type === "image/jpg" || type === "image/jpeg" || type === "image/png") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (ev) => {
        setPhotoSrc(reader.result as string);
        setPhotoFile(file);
      };
    } else {
      alert("Invalid file type!");
    }
  };

  const revertPhotoHandler = () => {
    setPhotoSrc("");
    setPhotoFile(undefined);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("phone", phone);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const processEdit = (data: { user: User }) => {
      const userId = data.user.userId;
      alert(`User with id ${userId} successfully edited profile.`);
      history.push(`/users/${userId}`);
    };

    sendRequest({
      url: `http://localhost:8080/api/v1/user/${userId}`,
      options: {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      },
      processData: processEdit,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const photoSrcAlternative =
    userDetails && userDetails.photoFilename
      ? `http://localhost:8080/photo/${userDetails.photoFilename}`
      : undefined;

  return (
    <div>
      <BackButton backPath={`/users/${userId}`} />
      <Card className={classes.card}>
        <CardHeader
          title="Change Info"
          subheader="Changes will be reflected after save"
          className={classes.cardHeader}
          subheaderTypographyProps={{
            variant: matches ? "caption" : "subtitle1",
            style: {
              marginTop: "8px",
            },
          }}
        />
        <Typography align="center" className={classes.failText}>
          {errorMessage}
        </Typography>
        {userDetails && (
          <CardContent>
            <form onSubmit={submitHandler}>
              <Grid container direction="row" alignItems="center">
                <Grid item className={classes.padLeft}>
                  <ProfileAvatar
                    src={photoSrc ? photoSrc : photoSrcAlternative}
                    email={userDetails.email}
                    name={userDetails.name}
                    length="5rem"
                  />
                </Grid>

                <Grid item>
                  <Button component="label">
                    Change Photo
                    <input type="file" hidden onChange={fileChangeHandler} />
                  </Button>
                </Grid>
                <Grid item>
                  {photoSrc && (
                    <Button color="secondary" onClick={revertPhotoHandler}>
                      Remove Photo Change
                    </Button>
                  )}
                </Grid>
              </Grid>

              <EditProfileRow
                field="Name"
                placeholder="Enter your new name"
                value={name}
                paddingTop
                onChange={changeHandler}
                errMsg={errorMessage}
              />
              <EditProfileRow
                field="Bio"
                placeholder="Enter your new bio"
                value={bio}
                textarea={true}
                paddingTop
                onChange={changeHandler}
                errMsg={errorMessage}
              />
              <EditProfileRow
                field="Phone"
                placeholder="Enter your new phone number"
                value={phone}
                paddingTop
                paddingBottom
                onChange={changeHandler}
                errMsg={errorMessage}
              />
              <div className={classes.padLeft}>
                <Button
                  color="primary"
                  variant="contained"
                  endIcon={<SaveIcon />}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EditProfile;
