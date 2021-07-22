import { Typography, Card, CardHeader, CardContent } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PublicDetails, User } from "../../common/interfaces";
import useHttp from "../../hooks/useHttp";
import ProfileAvatar from "../Profile/ProfileAvatar";
import ProfileRow from "../Profile/ProfileRow";

interface Props {
  token: string;
}

const ViewUser = ({ token }: Props) => {
  const [publicUser, setPublicUser] = useState<PublicDetails | null>(null);

  const { id } = useParams<{ id: string }>();

  const { isLoading, errorMessage, sendRequest: fetchUser } = useHttp();

  useEffect(() => {
    const processUser = (data: { user: User }) => {
      const user = data.user;
      setPublicUser({
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

  let content;

  if (publicUser) {
    content = (
      <div>
        <Typography variant="h3" align="center" gutterBottom>
          My Profile
        </Typography>
        <Card>
          <CardHeader
            title={
              publicUser.name
                ? `${publicUser.name}'s Profile`
                : `${publicUser.email}'s Profile`
            }
          />
          <CardContent>
            <Typography align="center">{errorMessage}</Typography>
            {publicUser && (
              <>
                <ProfileRow
                  field="Photo"
                  value={
                    <ProfileAvatar
                      email={publicUser.email}
                      src={
                        publicUser.photoFilename
                          ? `http://localhost:8080/photo/${publicUser.photoFilename}`
                          : undefined
                      }
                      length="5rem"
                      name={publicUser.name}
                    />
                  }
                  borderTop
                  borderBottom
                />
                <ProfileRow field="Name" value={publicUser.name} borderBottom />
                <ProfileRow field="Bio" value={publicUser.bio} borderBottom />
                <ProfileRow
                  field="Phone"
                  value={publicUser.phone}
                  borderBottom
                />
                <ProfileRow field="Email" value={publicUser.email} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errorMessage) {
    content = <p>No user found!</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return <div>{content}</div>;
};

export default ViewUser;
