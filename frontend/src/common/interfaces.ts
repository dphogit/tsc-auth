interface BaseModel {
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseModel {
  userId: number;
  email: string;
  password: string;
  profile: Profile | null;
}

export interface Profile extends BaseModel {
  profileId: number;
  name: string | null;
  bio: string | null;
  phone: string | null;
  photo: Photo | null;
}

export interface Photo extends BaseModel {
  photoId: number;
  filename: string;
}

export interface PublicDetails {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  phone: string | null;
  photoFilename: string | null;
}
