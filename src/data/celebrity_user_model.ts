export interface CelebrityUserModel {
  id?: number;
  first?: string;
  last?: string;
  dob?: string;
  gender?: string;
  email?: string;
  picture?: string;
  country?: string;
  description?: string;
}

export const getCelebrityUserModelFromJson = (
  json: any
): CelebrityUserModel => {
  return {
    ...json,
  };
};
