import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      // check if the indexedDB already contains the database jate
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // if the database doesn't exist, create jate then set the keypath to id and set it to autoincrement
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
      // let's initialise the database by saving a blank record in it.
      putDb(" ");
    },
  });

export const putDb = async (content) => {
  console.log("Post to the database");
  // open the database, start a readwrite transaction, obtain the object store then finally modify the content of the first entry
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  // let's try to save it on id 1 first, modifying the value of content
  let request = store.put({ id: 1, value: content });
  let result = await request;
  // if the put fails, add a new record instead
  if (!result) {
    request = store.add({ value: content });
    result = await request;
  }
  console.log("🚀 - data saved to the database", result);
};

export const getDb = async () => {
  console.log("GET from the database");
  // open the database, start a readonly transaction, obtain the object store then finally get the content of the first entry
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  // return the first entry of the result
  return await store.get(1)[0];
};

// initialise database
initdb();
