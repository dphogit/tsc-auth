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
import Paginator from "../UI/Paginator";
import LoadingCircle from "../UI/LoadingCircle";

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
  paginator: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
}));

const Users = ({ token, userId }: Props) => {
  const [users, setUsers] = useState<PublicDetails[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const classes = useStyles();

  const { isLoading, errorMessage, sendRequest: fetchUsers } = useHttp();

  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    const processUsers = (data: {
      users: User[];
      hasNext: boolean;
      hasPrev: boolean;
    }) => {
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
      setHasNext(data.hasNext);
      setHasPrev(data.hasPrev);
    };

    fetchUsers({
      url: `http://localhost:8080/api/v1/user?page=${page}`,
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      processData: processUsers,
    });
  }, [fetchUsers, token, page]);

  const prevPageHandler = () => {
    setPage((page) => page - 1);
  };

  const nextPageHandler = () => {
    setPage((page) => page + 1);
  };

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

  let content = (
    <div>
      {usersList}
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        className={classes.paginator}
      >
        <Paginator
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={prevPageHandler}
          onNext={nextPageHandler}
        />
      </Grid>
    </div>
  );

  if (errorMessage) {
    content = <p>Something went wrong!</p>;
  }

  if (isLoading) {
    content = <LoadingCircle />;
  }

  return (
    <>
      <Typography variant={match ? "h4" : "h2"} align="center">
        {isLoading ? "Loading Users" : "Other Users"}
      </Typography>
      <div>{content}</div>
    </>
  );
};

export default Users;
