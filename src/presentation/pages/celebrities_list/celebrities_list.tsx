import { fetchCelebrities, IPagination } from "../../../data/fetch_data";
import CollapseCard from "../collapse_card/collapse_card";
import { useEffect, useState } from "react";
import { CelebrityUserModel } from "../../../data/celebrity_user_model";
import styles from "./celebrities_list.module.scss";
import { getFullName } from "../collapse_card/helper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import GalleryView from "./gallery_view/gallery_view";
import PaginationComponent from "../../components/pagination_component/pagination_component";

enum ViewType {
  List = "List View",
  Gallery = "Gallery View",
}

function CelebritiesList() {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCeleb, setSelectedCeleb] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [viewType, setViewType] = useState(ViewType.Gallery);
  const [celebritiesData, setCelebritiesData] = useState<{
    data: CelebrityUserModel[];
    pagination?: IPagination;
  }>({ data: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (data?: IPagination) => {
    const resp = await fetchCelebrities({
      pagination: data ?? {
        limit: 3,
        offset: 0,
      },
    });
    setCelebritiesData({ ...resp });
  };

  const updateData = ({
    data,
    index,
  }: {
    data: CelebrityUserModel;
    index: number;
  }) => {
    const local = { ...celebritiesData };
    local.data[index] = data;
    setCelebritiesData(local);
  };

  const deleteData = (id: number) => {
    const local = { ...celebritiesData };
    const locals = local?.data?.filter((celeb) => celeb.id !== id!);
    setCelebritiesData((prev) => ({
      ...prev,
      data: [...locals],
    }));
    setSelectedCeleb(null);
  };

  const updateFilters = (name: string) => {
    // if already present
    if (filterList.includes(name)) return;

    // adding new celeb
    const local = [...filterList];
    local.push(name);
    setFilterList(local);
  };

  const removeCeleb = (index: number) => {
    const localFilters = [...filterList];
    const updatedList = localFilters.filter((l, idx) => idx !== index);
    setFilterList(updatedList);
  };

  return (
    <div className={styles.viewContainer}>
      <h1>The Celebrities</h1>
      <div className={styles.header}>
        {Object.keys(ViewType).map((key) => {
          const k = key as keyof typeof ViewType;
          return (
            <div
              onClick={() => {
                setViewType(ViewType[k]);
              }}
              className={styles.chip}
            >
              {ViewType[k]}
            </div>
          );
        })}
      </div>
      {viewType === ViewType.List ? (
        <div className={styles.list}>
          <h3>List View</h3>
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
          {/* Filters */}
          <div className={styles.filtersContainer}>
            <div className={styles.filters}>
              <div
                onClick={() => {
                  setDropdownVisible((prev) => !prev);
                }}
              >
                <TuneIcon />
              </div>
              {filterList.length === 0 ? (
                <p>Filters</p>
              ) : (
                filterList.map((li, index) => {
                  return (
                    <span
                      className={styles.filterElement}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCeleb(index);
                      }}
                    >
                      {li}
                    </span>
                  );
                })
              )}
            </div>
            {dropdownVisible && (
              <div className={styles.options}>
                {celebritiesData?.data?.map((celeb) => {
                  const name = getFullName(celeb);
                  return (
                    <div
                      className={styles.option}
                      onClick={() => updateFilters(getFullName(celeb) ?? "")}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* List */}
          {celebritiesData?.data?.map((celeb, index) => {
            if (
              getFullName(celeb)
                ?.toLowerCase()
                ?.includes(searchText.toLowerCase())
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
          <PaginationComponent
            pagination={celebritiesData?.pagination}
            onPageChange={(paginationData) => fetchData(paginationData)}
          />
        </div>
      ) : (
        <GalleryView />
      )}
    </div>
  );
}

export default CelebritiesList;
