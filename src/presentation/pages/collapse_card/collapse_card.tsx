import { CelebrityUserModel } from "../../../data/celebrity_user_model";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getAge, getFullName, IError, validateData } from "./helper";
import { useEffect, useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import styles from "./collapse_card.module.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

function CollapseCard({
  data,
  isOpen = false,
  onToggleClick,
  updateData,
  closeCard,
  deleteCelebrity,
}: {
  data: CelebrityUserModel;
  isOpen?: boolean;
  updateData: (data: CelebrityUserModel) => void;
  deleteCelebrity: () => void;
  onToggleClick: () => void;
  closeCard: () => void;
}) {
  const [celebrity, setCelebrity] = useState<CelebrityUserModel>(data);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState<IError | null>(null);

  useEffect(() => {
    const result = validateData(celebrity);
    if (result.hasError) {
      setErrors(result?.errors);
    } else {
      setErrors(null);
    }
  }, [celebrity]);

  const updateCelebrityDetails = ({
    name,
    value,
  }: {
    name: keyof CelebrityUserModel;
    value: string | number;
  }) => {
    const local: CelebrityUserModel = { ...celebrity };
    local[name] = value as any;
    setCelebrity(local);
  };

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.split(" ");
    setCelebrity((prev) => {
      return {
        ...prev,
        first: name[0],
        last: name[1],
      };
    });
  };

  const isButtonDisable = () => {
    let disable = true;
    if (celebrity.first !== data.first) {
      disable = false;
    }
    if (celebrity.last !== data.last) {
      disable = false;
    }
    if (celebrity.dob !== data.dob) {
      disable = false;
    }
    if (celebrity.gender !== data.gender) {
      disable = false;
    }
    if (celebrity.country !== data.country) {
      disable = false;
    }
    if (celebrity.description !== data.description) {
      disable = false;
    }
    return disable || !!errors;
  };

  return (
    <>
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <DialogContent>
          <DialogContentText>Are you sure you want to delete</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsDeleteModalOpen(false);
              deleteCelebrity();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {isOpen && isEdit ? (
        // Edit View
        <div className={styles.collapseCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.details}>
              <img src={celebrity?.picture} alt="profile icon" />
              <input
                className={styles.name}
                value={getFullName(celebrity)}
                onChange={(e) => {
                  updateName(e);
                }}
              />
              {errors?.name && (
                <p className={styles.errorText}>{errors.name} </p>
              )}
            </div>
            <div
              className={styles.toggleBtn}
              onClick={() => {
                onToggleClick();
                setIsEdit(false);
              }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            <div className={styles.details}>
              <div className={styles.age}>
                <p>DOB</p>
                <input
                  type="date"
                  value={celebrity?.dob}
                  onChange={(e) =>
                    updateCelebrityDetails({
                      name: "dob",
                      value: e.target.value,
                    })
                  }
                />
                {errors?.dob && (
                  <p className={styles.errorText}>{errors.dob} </p>
                )}
              </div>
              <div className={styles.gender}>
                <p>Gender</p>
                <select
                  defaultValue={celebrity.gender}
                  onChange={(e) =>
                    updateCelebrityDetails({
                      name: "gender",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                  <option value="ratherNotSay">Rather not say</option>
                  <option value="other">Other</option>
                </select>
                {errors?.gender && (
                  <p className={styles.errorText}>{errors.gender} </p>
                )}
              </div>
              <div className={styles.country}>
                <p>Country</p>
                <input
                  type="text"
                  value={celebrity?.country}
                  onChange={(e) =>
                    updateCelebrityDetails({
                      name: "country",
                      value: e.target.value,
                    })
                  }
                />
                {errors?.country && (
                  <p className={styles.errorText}>{errors.country} </p>
                )}
              </div>
            </div>
            <div className={styles.description}>
              <p>Description</p>
              <textarea
                value={celebrity?.description}
                onChange={(e) =>
                  updateCelebrityDetails({
                    name: "description",
                    value: e.target.value,
                  })
                }
              />
              {errors?.description && (
                <p className={styles.errorText}>{errors.description} </p>
              )}
            </div>

            <div className={styles.ctaBtns}>
              <button
                onClick={() => {
                  setCelebrity(data);
                  closeCard();
                }}
              >
                <CancelOutlinedIcon color="error" />
              </button>
              <button
                className={isButtonDisable() ? styles.disabled : ""}
                onClick={() => {
                  if (errors) return;
                  updateData(celebrity);
                  closeCard();
                }}
              >
                <CheckCircleOutlineOutlinedIcon color="success" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Read only view
        <div className={styles.collapseCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.details}>
              <img src={celebrity?.picture} alt="profile icon" />
              <div className={styles.name}>{getFullName(celebrity)}</div>
            </div>
            <div
              className={styles.toggleBtn}
              onClick={() => {
                onToggleClick();
                setIsEdit(false);
              }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </div>

          {/* Body */}
          {isOpen && (
            <div className={styles.body}>
              <div className={styles.details}>
                <div className={styles.age}>
                  <p>Age</p>
                  <h4>{getAge(celebrity.dob!)} years</h4>
                </div>
                <div className={styles.gender}>
                  <p>Gender</p>
                  <h4>{celebrity?.gender}</h4>
                </div>
                <div className={styles.country}>
                  <p>Country</p>
                  <h4>{celebrity?.country}</h4>
                </div>
              </div>
              <div className={styles.description}>
                <p>Description</p>
                <h4>{celebrity?.description}</h4>
              </div>

              <div className={styles.ctaBtns}>
                {getAge(celebrity.dob!) > 18 && (
                  <button onClick={() => setIsEdit(true)}>
                    <EditOutlinedIcon color="info" />
                  </button>
                )}
                <button onClick={() => setIsDeleteModalOpen(true)}>
                  <DeleteOutlinedIcon color="error" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CollapseCard;
