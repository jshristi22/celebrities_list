/**
 * Return present age using given dob
 * @param dob
 * @returns
 */

import { CelebrityUserModel } from "../../../data/celebrity_user_model";

export const getAge = (dob: string) => {
  const data = dob?.split("-");
  const year = data[0];
  const currentDate = new Date();
  return currentDate.getFullYear() - parseInt(year);
};

export const getFullName = (user: CelebrityUserModel) => {
  if (user?.last === "" || user?.last) {
    return user?.first + " " + user?.last;
  }
  return user?.first;
};

export interface IError {
  name?: string;
  dob?: string;
  gender?: string;
  country?: string;
  description?: string;
}

export const validateData = (user: CelebrityUserModel) => {
  let hasError = false;
  const errors: IError = {};

  if (!user?.first?.length) {
    errors.name = "Please enter name";
    hasError = true;
  }

  if (!user?.dob?.length) {
    errors.dob = "Please enter dob";
    hasError = true;
  }

  if (!user?.gender?.length) {
    hasError = true;
    errors.gender = "Please enter gender";
  }
  
  if (!user?.country?.length || /\d/.test(user.country)) {
    errors.country = "Please enter a valid country";
    hasError = true;
  }
  if (!user?.description?.length) {
    errors.description = "Please enter description";
    hasError = true;
  }

  return { hasError, errors };
};
