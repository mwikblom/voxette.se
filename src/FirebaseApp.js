import { initializeApp } from 'firebase/app';
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
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import config from './config.json';
import constants from './common/Constants';
import DateTimeHelper from './common/DateTimeHelper';

var firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
};

var firebaseApp = initializeApp(firebaseConfig);
firebaseApp.customSettings = config.customSettings;

function createFilePointer(fullPath, file, done) {
  const dbPath = voxette.getValidDatabasePathItem(fullPath);
  const fileType = file.type.endsWith('pdf')
    ? constants.notes
    : file.type.startsWith('audio')
    ? constants.audioFiles
    : file.type.startsWith('image')
    ? constants.images
    : constants.other;

  const data = {
    fileType,
    fullPath: fullPath,
    name: file.name,
    nameLowerCase: file.name.toLowerCase(),
    size: file.size,
    type: file.type,
    isCurrent: true,
    tags: [],
    categories: [],
  };

  set(ref(getDatabase(), 'files/' + dbPath), data).then(() => done(data));
}

// some Utils
const voxette = {
  getValidDatabasePathItem: (name) => {
    const invalidChars = /[.#$[\]/]/gi;
    return name.replace(invalidChars, '_');
  },

  fetchFiles: (
    filterName,
    filterType,
    filterIsCurrent,
    filterTag,
    filterCategory,
    done
  ) => {
    onValue(
      query(
        ref(getDatabase(), 'files'),
        startAt(filterName),
        orderByChild('nameLowerCase')
      ),
      (snapshot) => {
        const value = snapshot.val();
        const files = value ? Object.values(value) : [];

        const filteredFiles = files
          .filter((file) => {
            const { nameLowerCase, tags, categories } = file;
            let isMatch = true;
            if (filterName) {
              isMatch =
                isMatch && nameLowerCase.startsWith(filterName.toLowerCase());
            }
            if (filterType) {
              isMatch = isMatch && file.fileType === filterType;
            }
            if (filterIsCurrent) {
              isMatch = isMatch && file.isCurrent;
            }
            if (filterCategory) {
              isMatch =
                isMatch && categories && categories.includes(filterCategory);
            }
            if (filterTag) {
              isMatch = isMatch && tags && tags.includes(filterTag);
            }
            return isMatch;
          })
          .sort((a, b) => {
            return a.nameLowerCase === b.nameLowerCase
              ? 0
              : a.nameLowerCase < b.nameLowerCase
              ? -1
              : 1;
          });

        done(filteredFiles);
      }
    );
  },

  // loopAllFileRefs: () => {
  //     var filesRef = firebase
  //         .database()
  //         .ref('files')
  //         // .orderByChild('fullPath')
  //         // .startAt('1583228601633')
  //         .once('value')
  //         .then((snapshot) => {
  //             const value = snapshot.val();
  //             const files = value ? Object.values(value) : [];
  //             for (let i = 0; i < files.length; i++) {
  //                 const file = files[i];
  //                 const isCurrent = file.tags.some(x => x === constants.current || x === constants.currentAudioFiles);
  //                 const fileType = file.tags.find(x => x !== constants.current && x !== constants.currentAudioFiles);
  //                 console.log(file, fileType, isCurrent);
  //                 voxette.saveFileData(file.fullPath.replace('.', '_'), file.name, fileType, isCurrent, [], [], () => {});
  //             }
  //         });
  // },

  fetchFileData: (fullPath, done) => {
    if (fullPath) {
      const dbPath = voxette.getValidDatabasePathItem(fullPath);
      get(ref(getDatabase(), 'files/' + dbPath), 'value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          done(data);
        } else {
          done();
        }
      });
    } else {
      throw new Error('No full path available for file');
    }
  },

  saveFileData: (
    fullPath,
    name,
    fileType,
    isCurrent,
    tags,
    categories,
    done
  ) => {
    if (fullPath) {
      const dbPath = voxette.getValidDatabasePathItem(fullPath);
      var updates = {};
      updates['/files/' + dbPath + '/name'] = name;
      updates['/files/' + dbPath + '/nameLowerCase'] = name.toLowerCase();
      updates['/files/' + dbPath + '/fileType'] = fileType;
      updates['/files/' + dbPath + '/isCurrent'] = isCurrent;
      updates['/files/' + dbPath + '/tags'] = tags || [];
      updates['/files/' + dbPath + '/categories'] = categories || [];

      update(ref(getDatabase()), updates).then(() => done());
    } else {
      throw new Error('No full path available for file');
    }
  },

  uploadFile: (fullPath, file, done) => {
    uploadBytes(storageRef(getStorage(), fullPath), file).then(() => {
      createFilePointer(fullPath, file, done);
    });
  },

  deleteFile: (fullPath, done) => {
    deleteObject(storageRef(getStorage(), fullPath))
      .then(() => {
        voxette.deleteFileReference(fullPath, done);
      })
      .catch((reason) => {
        console.error(reason);
        voxette.deleteFileReference(fullPath, done);
      });
  },

  deleteFileReference: (fullPath, done) => {
    const dbPath = voxette.getValidDatabasePathItem(fullPath);
    // Remove the file reference in the db
    remove(ref(getDatabase(), 'files/' + dbPath)).then(() => done());
  },

  // loopThroughFiles: () => {

  //     var filesRef = firebase
  //         .database()
  //         .ref('files')
  //         .once('value')
  //         .then((snapshot) => {
  //             const value = snapshot.val();
  //             const fileIds = Object.keys(value);
  //             const files = value ? Object.values(value) : [];

  //             for (let i = 0; i < fileIds.length; i++) {
  //                 const fileId = fileIds[i];
  //                 const file = value[fileId];
  //                 console.log(firebase
  //                     .storage()
  //                     .ref()
  //                     .child(fileId));
  //                 // firebase
  //                 //     .storage()
  //                 //     .ref()
  //                 //     .child(fileId)
  //                 //     .listAll()
  //                 //     .then((res) => {
  //                 //         console.log(res);
  //                 //     });
  //             }

  //         });
  // },

  getDownloadUrl: (fullPath, done) => {
    getDownloadURL(storageRef(getStorage(), fullPath)).then((url) => {
      done(url);
    });
  },

  fetchUserData: (email, done) => {
    if (email) {
      const memberId = voxette.getValidDatabasePathItem(email);
      get(ref(getDatabase(), 'members/' + memberId)).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          done(data.userData);
        } else {
          done();
        }
      });
    } else {
      throw new Error('No email available for user');
    }
  },

  fetchMembers: (filterName, filterTag, filterPart, done) => {
    onValue(
      query(
        ref(getDatabase(), 'members'),
        startAt(filterName),
        orderByChild('userData/firstName')
      ),
      (snapshot) => {
        const value = snapshot.val();
        const members = value ? Object.values(value) : [];

        const filteredMembers = members
          .filter((member) => {
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
              return (
                firstName.startsWith(filterName) &&
                tags &&
                tags.includes(filterTag)
              );
            }
            if (filterName && filterPart) {
              return (
                firstName.startsWith(filterName) &&
                part &&
                part.startsWith(filterPart)
              );
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
          .sort((a, b) => {
            return a.userData.firstName === b.userData.firstName
              ? 0
              : a.userData.firstName < b.userData.firstName
              ? -1
              : 1;
          });

        if (filteredMembers) {
          done(filteredMembers);
        }
      }
    );
  },

  addMember: (email, initialPassword, done) => {
    if (email) {
      const memberId = voxette.getValidDatabasePathItem(email);

      voxette.saveUserData(
        memberId,
        {
          email: email,
        },
        () => {
          if (initialPassword) {
            createUserWithEmailAndPassword(
              getAuth(),
              email,
              initialPassword
            ).then((userCredential) => {
              done();
            });
          } else {
            done();
          }
        }
      );
    } else {
      throw new Error('No email available for user');
    }
  },

  saveUserData: (memberId, userData, done) => {
    if (memberId && userData) {
      userData.memberId = memberId;

      set(ref(getDatabase(), 'members/' + memberId), {
        userData: userData,
      }).then(done);
    } else {
      throw new Error('No email available for user');
    }
  },

  fetchEventData: (eventId, done) => {
    if (eventId) {
      get(ref(getDatabase(), 'events/' + eventId)).then((snapshot) => {
        const eventData = snapshot.val() && snapshot.val().eventData;
        if (eventData) {
          // prefere the data in our database
          done(eventData);
        } else {
          done();
        }
      });
    } else {
      throw new Error('No eventId recieved');
    }
  },

  fetchUpcomingEvents: (fromDate, toDate, done) => {
    onValue(
      query(
        ref(getDatabase(), 'events'),
        orderByChild('eventData/startDate'),
        startAt(fromDate ? DateTimeHelper.getFormattedDate(fromDate) : null),
        endAt(toDate ? DateTimeHelper.getFormattedDate(toDate) : '9') // "9" gets all (i.e. year 9xxx)
      ),
      (snapshot) => {
        const events = [];

        snapshot.forEach((child) => {
          events.push(child.val());
        });

        if (events) {
          // prefere the data in our database
          done(events);
        } else {
          done();
        }
      }
    );
  },

  fetchAllEvents: (done) => {
    onValue(ref(getDatabase(), 'events'), (snapshot) => {
      const events = snapshot.val();
      if (events) {
        // prefere the data in our database
        done(events);
      } else {
        done();
      }
    });
  },

  addEventData: (eventData, done) => {
    if (eventData) {
      push(ref(getDatabase(), 'events'), { eventData: eventData }).then(
        (newEvent) => {
          done(newEvent.key);
        }
      );
    } else {
      throw new Error('No eventData to add recieved');
    }
  },

  updateEventData: (eventId, eventData, done) => {
    if (eventId && eventData) {
      eventData.eventId = eventId;

      set(
        ref(getDatabase(), 'events/' + eventId + '/eventData'),
        eventData
      ).then(() => {
        done(eventId);
      });
    } else {
      throw new Error('No id or data for event');
    }
  },

  removeEvent: (eventId, done) => {
    if (eventId) {
      remove(ref(getDatabase(), 'events/' + eventId)).then(() => {
        done();
      });
    }
  },

  addEventAttendance: (eventId, memberId, attendance, done) => {
    if (eventId && memberId && attendance) {
      update(
        ref(getDatabase(), 'events/' + eventId + '/attendance/' + memberId),
        attendance
      ).then(() => {
        done(eventId);
      });
    } else {
      throw new Error('No id or data for event');
    }
  },
};

firebaseApp.voxette = voxette;

export default firebaseApp;
