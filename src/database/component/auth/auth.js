import { ref, set, update } from "firebase/database";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { database, auth } from "src/database/FIREBASE_CONFIG";
import { _GET_DATA, _GET_ERROR, HANDLER } from "src/database/basicFuns";
import { USER, ACCOUNT, COMPANY, EMPLOYEE } from "../../references";


export const REGISTER_USER = async (data) => {
    return await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;

            // store company data to user/uid(employee)
            set(ref(database, USER + user?.uid), {
                cmUID: data.cmUID,
                emEmail: data.email ?? '',
                emID: data.emID,
                timestamp: user.metadata.createdAt ?? '',
                emUID: user.uid ?? '',
                isCompany: false
            });

            // store company data to account/uid(company)/company/
            update(ref(database, ACCOUNT + data.cmUID + EMPLOYEE + data.emID), {
                isAccess: true,
                emUID: user.uid
            });


            return { uid: user.uid, success: 'Success', message: 'User added' }
        })
        .catch((error) => {
            return _GET_ERROR(error)
        });
}

export const INITSIGNIN = async (user) => {

    const data = await _GET_DATA(USER + user?.uid)
        .catch((error) => { return { message: error.message } })

    const dataRef = await _GET_DATA(ACCOUNT + data?.cmUID)
        .catch((error) => { return { message: error.message } })

    const returnData = {
        auth: user,
        company: dataRef?.company,
    }
    if (!data?.isCompany) {
        const employeeData = await _GET_DATA(ACCOUNT + data?.cmUID + EMPLOYEE + data?.emID)
            .catch((error) => { return { message: error.message } })
        return {
            "success": true,
            "message": "Data retrieved successfully",
            "data": { ...returnData, employee: employeeData }
        }
    } else return {
        "success": true,
        "message": "Data retrieved successfully",
        "data": { ...returnData, employee: {} }
    }


}

export const InitAuthView = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user

            INITSIGNIN(user)
        } else {
            const isSignedOut = localStorage.getItem('isSignedOut');
            if (!isSignedOut) {
                localStorage.setItem('isSignedOut', 'true');
                InitAuth.sign_out()
                window.location.href = '/login';
            } else {
                localStorage.removeItem('isSignedOut');
            }
        }
    })
}

export const authValidation = (user) => {

    if (!user.emailVerified) {
        sendEmailVerification(user)
            .then(() => {
                console.log('Verification email sent');
            })
            .catch((error) => {
                console.error('Error sending verification email:', error);
            });
    }
}

export const InitAuth = {
    sign_out: async () => {
        return await signOut(auth).then(() => {

            localStorage.removeItem('persist:root');
        }).catch((error) => {
            return { success: false, code: error.code, message: error.message }
        });
    },
    sign_in: async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password).then((data) => {
            if (data) {

                authValidation(data.user)
                return {
                    success: true,
                    message: 'Retrieved data',
                    data: data.user
                }
            }
        }).catch((error) => {
            return { success: false, code: error.code, message: error.message }
        });
    },
    register_company: async (data) => {
        return await createUserWithEmailAndPassword(auth, data.cmEmail, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                let DATA = { cmUID: user.uid ?? '', isCompany: true }

                // store company data to account/uid(company)/company
                HANDLER.setData(COMPANY, { ...DATA, ...data })

                // store company data to user/uid(company)
                // set(ref(database, USER + user?.uid), DATA);
                HANDLER.setData(COMPANY, DATA)

                return { success: 'Success', message: 'Company added' }
            })
            .catch((error) => {
                return _GET_ERROR(error)
            });
    },
    current_user: () => {
        const currentUser = auth.currentUser;
        if (currentUser) {

            return currentUser.uid
        } else {
            console.log('No user is signed in');
            return false
        }

    },
    send_forget_password_link: async (email) => {
        return await sendPasswordResetEmail(auth, email)
            .then(() => {
                return { success: 'Success', message: 'Password reset email sent!' }
            })
            .catch((error) => {
                console.log(error)
                // ..
            });
    }
}