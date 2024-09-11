import data from "./celebrities.json";
import {
  CelebrityUserModel,
  getCelebrityUserModelFromJson,
} from "./celebrity_user_model";

export const fetchCelebrities = async (): Promise<CelebrityUserModel[]> => {
  const response: any = await new Promise((resolve) => {
    return resolve(data.celebrities);
  });
  return response.map((res: any) => getCelebrityUserModelFromJson(res));
};
