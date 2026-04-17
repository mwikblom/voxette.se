import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  query,
  orderByChild,
  startAt,
  endAt,
  update,
  onValue,
  push,
  get,
  remove,
} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import config from "../config.json";
import Constants from "../constants";
import DateTimeHelper from "./DateTimeHelper";
import type DocumentFile from "../models/DocumentFile";
import { type DisplayNameOrUserData } from "@/models/User";

var firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
};

var firebaseApp = initializeApp(firebaseConfig);

function createFilePointer(fullPath: string, file: Blob, done: (data: unknown) => void) {
  const dbPath = FirebaseApi.getValidDatabasePathItem(fullPath);
  const fileType = file.type.endsWith("pdf")
    ? Constants.NOTES
    : file.type.startsWith("audio")
      ? Constants.AUDIO
      : file.type.startsWith("image")
        ? Constants.IMAGES
        : Constants.OTHER;

  const name = "name" in file ? (file.name as string) : "";

  const data: DocumentFile = {
    fileType,
    fullPath: fullPath,
    name: name,
    nameLowerCase: name.toLowerCase(),
    size: file.size,
    type: file.type,
    isCurrent: true,
    tags: [],
    categories: [],
  };

  set(ref(getDatabase(), "files/" + dbPath), data).then(() => done(data));
}

const FirebaseApi = {
  getValidDatabasePathItem: (name: string) => {
    const invalidChars = /[.#$[\]/]/gi;
    return name.replace(invalidChars, "_");
  },

  fetchFiles: (
    filterName?: string,
    filterType?: string,
    filterIsCurrent?: boolean,
    filterTag?: string,
    filterCategory?: string,
    done?: (files: DocumentFile[]) => void,
  ) => {
    onValue(query(ref(getDatabase(), "files"), startAt(filterName), orderByChild("nameLowerCase")), (snapshot) => {
      const value = snapshot.val();
      const files = value ? (Object.values(value) as DocumentFile[]) : [];

      const filteredFiles =
        files
          .filter((file) => {
            const { nameLowerCase, tags, categories } = file;
            let isMatch = true;
            if (filterName) {
              isMatch = isMatch && nameLowerCase.startsWith(filterName.toLowerCase());
            }
            if (filterType) {
              isMatch = isMatch && file.fileType === filterType;
            }
            if (filterIsCurrent) {
              isMatch = isMatch && file.isCurrent;
            }
            if (filterCategory) {
              isMatch = isMatch && categories && categories.includes(filterCategory);
            }
            if (filterTag) {
              isMatch = isMatch && tags && tags.includes(filterTag);
            }
            return isMatch;
          })
          .sort((a, b) => {
            return a.nameLowerCase === b.nameLowerCase ? 0 : a.nameLowerCase < b.nameLowerCase ? -1 : 1;
          }) ?? [];

      done?.(filteredFiles);
    });
  },

  fetchFileData: (fullPath?: string, done?: (data?: unknown) => void) => {
    if (!fullPath) {
      throw new Error("No full path available for file");
    }

    const dbPath = FirebaseApi.getValidDatabasePathItem(fullPath);
    get(ref(getDatabase(), "files/" + dbPath)).then((snapshot) => {
      const data = snapshot.val();
      done?.(data);
    });
  },

  saveFileData: (
    fullPath: string,
    name: string,
    fileType?: string,
    isCurrent?: boolean,
    tags?: string[],
    categories?: string[],
    done?: () => void,
  ) => {
    if (!fullPath) {
      throw new Error("No full path available for file");
    }

    const dbPath = FirebaseApi.getValidDatabasePathItem(fullPath);
    const updates: any = {};
    updates[`/files/${dbPath}/name`] = name;
    updates[`/files/${dbPath}/nameLowerCase`] = name.toLowerCase();
    updates[`/files/${dbPath}/fileType`] = fileType;
    updates[`/files/${dbPath}/isCurrent`] = isCurrent;
    updates[`/files/${dbPath}/tags`] = tags || [];
    updates[`/files/${dbPath}/categories`] = categories ?? [];

    update(ref(getDatabase()), updates).then(() => done?.());
  },

  uploadFile: (fullPath: string, file: Blob, done: (data: unknown) => void) => {
    uploadBytes(storageRef(getStorage(), fullPath), file).then(() => {
      createFilePointer(fullPath, file, done);
    });
  },

  deleteFile: (fullPath: string, done: () => void) => {
    deleteObject(storageRef(getStorage(), fullPath))
      .then(() => {
        FirebaseApi.deleteFileReference(fullPath, done);
      })
      .catch((reason) => {
        console.error(reason);
        FirebaseApi.deleteFileReference(fullPath, done);
      });
  },

  deleteFileReference: (fullPath: string, done: () => void) => {
    const dbPath = FirebaseApi.getValidDatabasePathItem(fullPath);
    // Remove the file reference in the db
    remove(ref(getDatabase(), "files/" + dbPath)).then(() => done());
  },

  getDownloadUrl: (fullPath: string, done: (url: string) => void) => {
    getDownloadURL(storageRef(getStorage(), fullPath)).then((url) => {
      done(url);
    });
  },

  fetchUserData: (email: string, done: (user?: DisplayNameOrUserData) => void) => {
    if (!email) {
      throw new Error("No email available for user");
    }

    const memberId = FirebaseApi.getValidDatabasePathItem(email);
    get(ref(getDatabase(), "members/" + memberId)).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        done(data.userData);
      } else {
        done();
      }
    });
  },

  fetchMembers: (filterName?: string, filterTag?: string, filterPart?: string, done?: (members?: unknown) => void) => {
    onValue(query(ref(getDatabase(), "members"), orderByChild("userData/firstName")), (snapshot) => {
      const value = snapshot.val();
      const members = value ? (Object.values(value) as any) : [];

      const filteredMembers = members
        .filter((member: any) => {
          const { firstName, tags, part } = member.userData;

          if (filterName && filterTag && filterPart) {
            return (
              firstName.startsWith(filterName) &&
              tags &&
              tags.includes(filterTag) &&
              part &&
              part.startsWith(filterPart)
            );
          }
          if (filterName && filterTag) {
            return firstName.startsWith(filterName) && tags && tags.includes(filterTag);
          }
          if (filterName && filterPart) {
            return firstName.startsWith(filterName) && part && part.startsWith(filterPart);
          }
          if (filterName) {
            return firstName.startsWith(filterName);
          }
          if (filterTag) {
            return tags && tags.includes(filterTag);
          }
          if (filterPart) {
            return part && part.startsWith(filterPart);
          }
          return true;
        })
        .sort((a: any, b: any) => {
          return a.userData.firstName === b.userData.firstName
            ? 0
            : a.userData.firstName < b.userData.firstName
              ? -1
              : 1;
        });

      if (filteredMembers) {
        done?.(filteredMembers);
      }
    });
  },

  addMember: (email: string, initialPassword: string, done: () => void) => {
    if (!email) {
      throw new Error("No email available for user");
    }

    const memberId = FirebaseApi.getValidDatabasePathItem(email);

    FirebaseApi.saveUserData(
      memberId,
      {
        email: email,
      },
      () => {
        if (initialPassword) {
          createUserWithEmailAndPassword(getAuth(), email, initialPassword).then((userCredential) => {
            done();
          });
        } else {
          done();
        }
      },
    );
  },

  saveUserData: (memberId: string, userData: any, done?: () => void) => {
    if (memberId && userData) {
      userData.memberId = memberId;

      set(ref(getDatabase(), "members/" + memberId), {
        userData: userData,
      }).then(done);
    } else {
      throw new Error(`No memberId: ${memberId} or userData: ${!!userData} available for user`);
    }
  },

  fetchEventData: (eventId: string, done: (data?: unknown) => void) => {
    if (eventId) {
      get(ref(getDatabase(), "events/" + eventId)).then((snapshot) => {
        const eventData = snapshot.val() && snapshot.val().eventData;
        if (eventData) {
          // prefere the data in our database
          done(eventData);
        } else {
          done();
        }
      });
    } else {
      throw new Error("No eventId recieved");
    }
  },

  fetchUpcomingEvents: (isInternal: boolean, fromDate: Date, toDate: Date, done: (events?: unknown[]) => void) => {
    onValue(
      query(
        ref(getDatabase(), "events"),
        orderByChild("eventData/startDate"),
        startAt(fromDate ? DateTimeHelper.getFormattedDate(fromDate) : null),
        endAt(toDate ? DateTimeHelper.getFormattedDate(toDate) : "9"), // "9" gets all (i.e. year 9xxx)
      ),
      (snapshot) => {
        const events: any[] = [];

        snapshot.forEach((child) => {
          const event = child.val();
          if (isInternal || event.eventData.isPublic) {
            events.push(event);
          }
        });

        if (events) {
          // prefere the data in our database
          done(events);
        } else {
          done();
        }
      },
    );
  },

  fetchAllEvents: (done: (events?: unknown[]) => void) => {
    onValue(ref(getDatabase(), "events"), (snapshot) => {
      const events = snapshot.val();
      if (events) {
        // prefere the data in our database
        done(events);
      } else {
        done();
      }
    });
  },

  addEventData: (eventData: any, done: (key: string | null) => void) => {
    if (eventData) {
      push(ref(getDatabase(), "events"), { eventData: eventData }).then((newEvent) => {
        done(newEvent.key);
      });
    } else {
      throw new Error("No eventData to add recieved");
    }
  },

  updateEventData: (eventId: string, eventData: any, done: (eventId: string) => void) => {
    if (eventId && eventData) {
      eventData.eventId = eventId;

      set(ref(getDatabase(), "events/" + eventId + "/eventData"), eventData).then(() => {
        done(eventId);
      });
    } else {
      throw new Error("No id or data for event");
    }
  },

  removeEvent: (eventId: string, done?: () => void) => {
    if (eventId) {
      remove(ref(getDatabase(), "events/" + eventId)).then(() => {
        done?.();
      });
    }
  },

  addEventAttendance: (eventId: string, memberId: string, attendance: any, done: (eventId: string) => void) => {
    if (eventId && memberId && attendance) {
      update(ref(getDatabase(), "events/" + eventId + "/attendance/" + memberId), attendance).then(() => {
        done(eventId);
      });
    } else {
      throw new Error("No id or data for event");
    }
  },
};

export default FirebaseApi;
