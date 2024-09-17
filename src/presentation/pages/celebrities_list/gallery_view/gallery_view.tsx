import { useEffect, useRef, useState } from "react";
import { CelebrityUserModel } from "../../../../data/celebrity_user_model";
import { getFullName } from "../../collapse_card/helper";
import styles from "./gallery_view.module.scss";
import { fetchCelebrities, IPagination } from "../../../../data/fetch_data";

function GalleryView() {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [celebritiesData, setCelebritiesData] = useState<CelebrityUserModel[]>(
    []
  );
  const [pagination, setPagination] = useState<IPagination>({
    offset: 0,
    limit: 4,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const targetDiv = galleryRef.current;
      if (targetDiv) {
        const windowHeight = window.innerHeight;
        const divBottom = targetDiv!.getBoundingClientRect().bottom; //

        if (windowHeight >= divBottom) {
          const newOffset =
            (pagination?.offset ?? 0) + (pagination?.limit ?? 0);
          fetchData(newOffset);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pagination.offset]);

  const fetchData = async (offset?: number) => {
    const resp = await fetchCelebrities({
      pagination: {
        limit: pagination?.limit ?? 5,
        offset: offset ?? pagination?.offset ?? 0,
      },
    });
    setCelebritiesData((prev) => [...prev, ...resp.data]);
    setPagination({ ...resp.pagination });
  };
  return (
    <div className={styles.galleryView}>
      <h3>Gallery View</h3>
      <div ref={galleryRef} className={styles.cards}>
        {celebritiesData?.map((celeb) => {
          return (
            <div className={styles.user}>
              <img
                src={celeb.picture}
                alt="user profile image"
                loading="lazy"
              />
              <div className={styles.details}>
                <h5>{getFullName(celeb)}</h5>
                <p>{celeb?.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GalleryView;
