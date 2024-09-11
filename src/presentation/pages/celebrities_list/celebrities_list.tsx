import { fetchCelebrities } from "../../../data/fetch_data";
import CollapseCard from "../collapse_card/collapse_card";
import { useEffect, useState } from "react";
import { CelebrityUserModel } from "../../../data/celebrity_user_model";
import styles from "./celebrities_list.module.scss";
import { getFullName } from "../collapse_card/helper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
function CelebritiesList() {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCeleb, setSelectedCeleb] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [celebritiesData, setCelebritiesData] = useState<CelebrityUserModel[]>(
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resp = await fetchCelebrities();
    setCelebritiesData(resp);
  };

  const updateData = ({
    data,
    index,
  }: {
    data: CelebrityUserModel;
    index: number;
  }) => {
    const local = [...celebritiesData];
    local[index] = data;
    setCelebritiesData(local);
  };

  const deleteData = (id: number) => {
    const local = [...celebritiesData];
    const locals = local.filter((celeb) => celeb.id !== id!);
    setCelebritiesData(locals);
    setSelectedCeleb(null);
  };

  return (
    <div className={styles.list}>
      <h1>List View</h1>
      <div className={styles.searchBar}>
        <SearchOutlinedIcon />
        <input
          placeholder="Search user"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          type="search"
        />
      </div>
      {/* List */}
      {celebritiesData?.map((celeb, index) => {
        if (
          getFullName(celeb)?.toLowerCase()?.includes(searchText.toLowerCase())
        ) {
          return (
            <div key={celeb?.id}>
              <CollapseCard
                data={celeb}
                isOpen={selectedCeleb ? selectedCeleb === celeb?.id : false}
                onEditClick={(edit) => setIsEditing(edit)}
                updateData={(data) => {
                  setIsEditing(false);
                  updateData({ data, index });
                }}
                deleteCelebrity={() => deleteData(celeb.id!)}
                onToggleClick={() => {
                  if (isEditing) return;
                  setSelectedCeleb((prev) => {
                    if (prev === celeb.id) return null;
                    return celeb.id!;
                  });
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export default CelebritiesList;
