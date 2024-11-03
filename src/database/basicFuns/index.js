import { child, get, push, ref, remove, set, update } from "firebase/database";
import store from "src/store/store";
import { database } from "../FIREBASE_CONFIG";
import { ACCOUNT } from "../references";

export const _GET_DATA = async (reference, isArray) => {

    return await get(child(ref(database), reference)).then((snapshot) => {
        if (snapshot.exists()) {

            if (isArray) {
                const DATA = [];
                snapshot.forEach((childSnapshot) => {
                    const gotData = childSnapshot.val();
                    const dataKey = childSnapshot.key;
                    // Add the key to the post data
                    gotData.id = dataKey;
                    DATA.push(gotData);
                });
                return DATA;
            }
            return snapshot.val();
        } else {
            console.log("No data available");
            return []
        }
    }).catch((error) => {
        console.log(error);
        return error
    });
}

export const _SET_DATA = async (reference, data) => {

    try {
        const arrayRef = ref(database, reference);
        const snapshot = await get(arrayRef);
        const array = snapshot.val() || [];

        array.push({ ...data, id: array.length });
        await set(arrayRef, array);

    } catch (error) {
        console.error('Error manipulating array:', error);
    }
}

export const _PUSH_DATA = async (reference, data) => {

    // Reference to the 'posts' list in your database
    const dataRef = ref(database, reference);

    // Push new data to the 'posts' list and store the key
    const newDataRef = push(dataRef);
    const postId = newDataRef.key;

    // Set the data, including the key, for the new post
    set(newDataRef, {
        ...data, id: postId
    });
}

export const _GET_ERROR = (error) => {
    if (error.code === "auth/email-already-in-use") {
        return {
            error: "auth/email-already-in-use",
            message: "The email address is already in use"
        };

    } else if (error.code === "auth/invalid-email") {
        return {
            error: "auth/invalid-email",
            message: "The email address is not valid."
        };

    } else if (error.code === "auth/operation-not-allowed") {
        return {
            code: "auth/operation-not-allowed",
            message: "Operation not allowed."
        };
    } else if (error.code === "auth/weak-password") {
        return {
            code: "auth/weak-password",
            message: "The password is too weak."
        };
    } else if (error.code === "auth/too-many-requests") {
        return {
            code: "auth/too-many-requests",
            message: "Too many attempts."
        };
    }
}

export const HANDLER = {
    getData: async (reference, isArray) => {
        const uid = store.getState().company.cmUID
        return get(child(ref(database), ACCOUNT + uid + reference)).then((snapshot) => {
            if (snapshot.exists()) {
                if (isArray) {
                    const DATA = [];
                    snapshot.forEach((childSnapshot) => {
                        const gotData = childSnapshot.val();
                        const dataKey = childSnapshot.key;
                        // Add the key to the post data
                        gotData.id = dataKey;
                        DATA.push(gotData);
                    });
                    return { success: true, message: 'Data fetched successfully', data: DATA };
                }
                return { success: true, message: 'Data fetched successfully', data: snapshot.val() };
            } else return { success: false, message: 'No data found', data: [] }
        }).catch((error) => {
            console.log(error);
            return error
        });
    },
    setData: async (reference, data) => {
        const uid = store.getState().company.cmUID
        await set(ref(database, ACCOUNT + uid + reference), data).then(() => {
            return { success: true, message: 'data stored' }
        }).catch(error => {
            return { error: error.code, message: error.message }
        })
    },
    addData: async (reference, data) => {
        try {
            const uid = store.getState().company.cmUID
            const arrayRef = ref(database, ACCOUNT + uid + reference);
            const snapshot = await get(arrayRef);
            const array = snapshot.val() || [];
            array.push({ ...data, id: array.length });
            await set(arrayRef, array);
        } catch (error) {
            console.error('Error manipulating array:', error);
            return { error: error.code, message: error.message }
        }
    },
    pushData: async (reference, data) => {
        const uid = store.getState().company.cmUID
        await set(push(ref(database, ACCOUNT + uid + reference)), data).then(() => {
            return { success: true, message: 'data stored' }
        }).catch(error => {
            return { success: false, error: error.code, message: error.message }
        })
    },
    updateData: async (reference, data) => {
        const uid = store.getState().company.cmUID
        update(ref(database, ACCOUNT + uid + reference), data).then(() => {
            return { success: true, message: 'Data updated' };
        }).catch((error) => {
            return { error: error.code, message: error.message }
        });
    },
    deleteData: async (reference, id) => {
        const uid = store.getState().company.cmUID
        remove(ref(ACCOUNT + uid + reference)).then(() => {
            return { success: true, message: 'Data removed' };
        }).catch((error) => {
            return { error: error.code, message: error.message }
        });

    }
}