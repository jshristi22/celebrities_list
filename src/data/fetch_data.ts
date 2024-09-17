import data from "./celebrities.json";
import {
  CelebrityUserModel,
  getCelebrityUserModelFromJson,
} from "./celebrity_user_model";

export interface IPagination {
  offset?: number;
  limit?: number;
  total?: number;
}

export const fetchCelebrities = async ({
  pagination,
}: {
  pagination: IPagination;
}): Promise<{ data: CelebrityUserModel[]; pagination?: IPagination }> => {
  const response: any = await new Promise((resolve) => {
    return resolve(data.celebrities);
  });
  const list = response.map((res: any) => getCelebrityUserModelFromJson(res));

  return {
    data: list.slice(
      pagination?.offset,
      (pagination?.offset ?? 0) + (pagination?.limit ?? 0)
    ),
    pagination: { ...pagination, total: list.length },
  };
};
