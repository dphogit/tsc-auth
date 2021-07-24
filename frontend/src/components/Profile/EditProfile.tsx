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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";

import EditProfileRow from "./EditProfileRow";
import ProfileAvatar from "./ProfileAvatar";
import useHttp from "../../hooks/useHttp";
import { PublicDetails, User } from "../../common/interfaces";
import LoadingCircle from "../UI/LoadingCircle";
import DialogOk from "../UI/Dialog/DialogOk";
import DialogConfirm from "../UI/Dialog/DialogConfirm";

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
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [fileIsInvalid, setFileIsInvalid] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

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
      setFileIsInvalid(true);
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

    const processEdit = (_data: { user: User }) => {
      setIsSuccessful(true);
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

  const dialogCloseHandler = () => {
    if (isSuccessful) {
      setIsSuccessful(false);
      history.push(`/users/${userId}`);
    }
  };

  const fileDialogCloseHandler = () => {
    setFileIsInvalid(false);
  };

  if (isLoading) {
    return (
      <div>
        <Card className={classes.card}>
          <Typography variant="h4" align="center">
            Loading...
          </Typography>
          <LoadingCircle />
        </Card>
      </div>
    );
  }

  const photoSrcAlternative =
    userDetails && userDetails.photoFilename
      ? `http://localhost:8080/photo/${userDetails.photoFilename}`
      : undefined;

  return (
    <div>
      <Button
        color="primary"
        onClick={() => setIsCancelling(true)}
        startIcon={<ArrowBackIosIcon />}
        className={classes.backBtn}
      >
        Back
      </Button>
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
      <DialogOk
        open={isSuccessful}
        onClose={dialogCloseHandler}
        contextText="Your profile has been updated! You can now view your changes."
      />
      <DialogOk
        open={fileIsInvalid}
        onClose={fileDialogCloseHandler}
        contextText="Invalid file type! Make sure your file is PNG, JPG or JPEG."
      />
      <DialogConfirm
        open={isCancelling}
        onCancel={() => setIsCancelling(false)}
        onConfirm={() => history.push(`/users/${userId}`)}
        confirmText="Discard"
        contextText="Going back will remove all unsaved changes to your profile."
        confirmBtnColor="secondary"
        title="Discard changes?"
      />
    </div>
  );
};

export default EditProfile;
