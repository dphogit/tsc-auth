import Avatar from "@material-ui/core/Avatar";

interface Props {
  src?: string;
  email: string;
  length: string;
  name?: string | null;
}

const ProfileAvatar = ({ src, email, length, name }: Props) => {
  const capitalLetterOfName = name && name.slice(0, 1).toUpperCase();

  return (
    <Avatar
      src={src}
      alt={`${email} profile pic`}
      style={{
        width: length,
        height: length,
        border: "1px solid grey",
      }}
    >
      {capitalLetterOfName}
    </Avatar>
  );
};

export default ProfileAvatar;
