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
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SaveIcon from "@material-ui/icons/Save";
import { useHistory } from "react-router-dom";

import { fetchUserDetails } from "../api/user";
import EditProfileRow from "./EditProfileRow";
import ProfileAvatar from "./ProfileAvatar";

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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  cardHeader: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingLeft: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
  failText: {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
    borderWidth: "1px",
  },
  padLeft: {
    paddingLeft: theme.spacing(3),
  },
}));

const EditProfile = ({ token, userId }: Props) => {
  const [userDetails, setUserDetails] = useState<PublicDetails | null>(null);
  const [failMessage, setFailMessage] = useState("");

  // Form state
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const history = useHistory();

  const classes = useStyles();

  useEffect(() => {
    const init = async () => {
      try {
        const json = await fetchUserDetails(userId, token);

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
        if (profile) {
          setName(profile.name ? profile.name : "");
          setBio(profile.bio ? profile.bio : "");
          setPhone(profile.phone ? profile.phone : "");
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [userId, token]);

  const backHandler = () => {
    history.push("/");
  };

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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // name, bio, phone, photoFile
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("phone", phone);
    if (photoFile) {
      formData.append("photo", photoFile);
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await response.json();

      if (json.status === "fail") {
        setFailMessage(json.data.reason);
        return;
      } else if (json.status === "error") {
        setFailMessage(json.data.message);
        throw new Error(json.data.message);
      }

      alert("Successfully Edited Profile!");
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        color="primary"
        onClick={backHandler}
        startIcon={<ArrowBackIosIcon />}
      >
        Back
      </Button>
      <Card className={classes.card}>
        <CardHeader
          title="Change Info"
          subheader="Changes will be reflected after save"
          className={classes.cardHeader}
        />
        <Typography align="center" className={classes.failText}>
          {failMessage}
        </Typography>
        {userDetails && (
          <CardContent>
            <form onSubmit={submitHandler}>
              <Grid container direction="row" alignItems="center">
                <Grid item className={classes.padLeft}>
                  <ProfileAvatar
                    src={
                      photoSrc
                        ? photoSrc
                        : `http://localhost:8080/photo/${userDetails.photoFilename}`
                    }
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
              />
              <EditProfileRow
                field="Bio"
                placeholder="Enter your new bio"
                value={bio}
                textarea={true}
                paddingTop
                onChange={changeHandler}
              />
              <EditProfileRow
                field="Phone"
                placeholder="Enter your new phone number"
                value={phone}
                paddingTop
                paddingBottom
                onChange={changeHandler}
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
