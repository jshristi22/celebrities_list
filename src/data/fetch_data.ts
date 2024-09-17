import { getFullName } from "../presentation/pages/collapse_card/helper";
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
  searchText,
}: {
  pagination: IPagination;
  searchText?: string;
}): Promise<{ data: CelebrityUserModel[]; pagination?: IPagination }> => {
  const response: CelebrityUserModel[] = await new Promise((resolve) => {
    return resolve(data.celebrities);
  });

  let list = response.map((res, index) => {
    const model = getCelebrityUserModelFromJson(res);
    model.picture = `https://i.pravatar.cc/50${index}`;
    return model;
  });

  if (searchText && searchText !== "") {
    list = list.filter((ele) =>
      getFullName(ele)?.toLowerCase()?.includes(searchText.toLowerCase())
    );
  }

  return {
    data: list.slice(
      pagination?.offset,
      (pagination?.offset ?? 0) + (pagination?.limit ?? 0)
    ),
    pagination: { ...pagination, total: list.length },
  };
};
