import { deleteUser } from "firebase/auth";
import { child, get, push, ref, remove, set, update } from "firebase/database";
import store from "src/store/store";
import { database } from './FIREBASE_CONFIG';
import { ACCOUNT } from "./references";


export const DATABASE = {
    getData: async (reference, isArray = true) => {
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
        await set(ref(database, ACCOUNT + uid + reference),
            { ...data, timestamp: new Date().getTime() }).then(() => {
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
            array.push({ ...data, id: array.length, timestamp: new Date().getTime() });
            await set(arrayRef, array);
        } catch (error) {
            console.error('Error manipulating array:', error);
            return { error: error.code, message: error.message }
        }
    },

    pushData: async (reference, data) => {
        const uid = store.getState().company.cmUID
        return await set(push(ref(database, ACCOUNT + uid + reference)),
            { ...data, timestamp: new Date().getTime() })
            .then(() => {
                console.log('data added')
                return { success: true, message: 'data stored' }
            }).catch(error => {
                return { success: false, error: error.code, message: error.message }
            })
    },

    updateData: async (reference, data) => {
        const uid = store.getState().company.cmUID
        return await update(ref(database, ACCOUNT + uid + reference + data.id),
            { ...data, timestamp: new Date().getTime() }).then(() => {
                return { success: true, message: 'Data updated' };
            }).catch((error) => {
                return { success: false, error: error.code, message: error.message }
            });
    },

    deleteData: async (reference, id) => {
        const uid = store.getState().company.cmUID
        return await remove(ref(database, ACCOUNT + uid + reference + id)).then(() => {
            console.log('data removed')
            return { success: true, message: 'Data removed' };
        }).catch((error) => {
            return { success: false, error: error.code, message: error.message }
        });

    }
}

export const AUTH = {
    addUser: async () => {

    },
    deleteUser: async (id) => {
        return deleteUser(id).then(() => {
            return { success: true, message: 'User deleted successfully' };
        }).catch((error) => {
            return { success: false, error: error.code, message: error.message }
        });
    }
}