import styles from "./pagination_component.module.scss";
import { IPagination } from "../../../data/fetch_data";

function PaginationComponent({
  pagination,
  onPageChange,
}: {
  pagination?: IPagination;
  onPageChange: (data: IPagination) => void;
}) {
  const getPageNumber =
    (pagination?.offset ?? 0) / (pagination?.limit ?? 1) + 1;

  const gotoPrevPage = () => {
    if (pagination?.offset === 0) return;
    const data = {
      ...pagination,
      offset: (pagination?.offset ?? 0) - (pagination?.limit ?? 0),
    };
    onPageChange(data);
  };

  const gotoNextPage = () => {
    const nextOffset = (pagination?.offset ?? 0) + (pagination?.limit ?? 0);
    if (nextOffset >= (pagination?.total ?? 0)) return;

    const data = {
      ...pagination,
      offset: nextOffset,
    };
    onPageChange(data);
  };

  return (
    <div className={styles.paginationContainer}>
      <p onClick={gotoPrevPage}>{"<"}</p>
      <h6>{getPageNumber}</h6>
      <p onClick={gotoNextPage}>{">"}</p>
    </div>
  );
}

export default PaginationComponent;
