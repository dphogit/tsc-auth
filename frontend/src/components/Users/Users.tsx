import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  makeStyles,
  Theme,
} from "@material-ui/core";

import useHttp from "../../hooks/useHttp";
import { PublicDetails, User } from "../../common/interfaces";
import UserCard from "./UserCard";

interface Props {
  token: string;
  userId: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  userGrid: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
  },
}));

const Users = ({ token, userId }: Props) => {
  const [users, setUsers] = useState<PublicDetails[]>([]);

  const classes = useStyles();

  const { isLoading, errorMessage, sendRequest: fetchUsers } = useHttp();

  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    const processUsers = (data: { users: User[] }) => {
      const publicUsers: PublicDetails[] = data.users.map((user) => {
        return {
          id: user.userId,
          email: user.email,
          name: user.profile && user.profile?.name,
          bio: user.profile && user.profile?.bio,
          phone: user.profile && user.profile?.phone,
          photoFilename:
            user.profile && user.profile.photo && user.profile?.photo?.filename,
        };
      });
      setUsers(publicUsers);
    };

    fetchUsers({
      url: "http://localhost:8080/api/v1/user",
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      processData: processUsers,
    });
  }, [fetchUsers, token]);

  let usersList = <h2>No users found. Start adding some!</h2>;

  if (users.length > 0) {
    usersList = (
      <Grid container spacing={match ? 3 : 6} className={classes.userGrid}>
        {users
          .filter((currentUser) => currentUser.id !== userId)
          .map((user) => (
            <Grid key={user.email} item xs={match ? 6 : 3}>
              <UserCard details={user} />
            </Grid>
          ))}
      </Grid>
    );
  }

  let content = usersList;

  if (errorMessage) {
    alert(errorMessage);
    content = <p>Something went wrong!</p>;
  }

  if (isLoading) {
    content = <p>Loading Tasks...</p>;
  }

  return (
    <>
      <Typography variant={match ? "h4" : "h2"} align="center">
        Other Users
      </Typography>
      <div>{content}</div>
    </>
  );
};

export default Users;
