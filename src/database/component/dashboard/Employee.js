import { _GET_DATA, _PUSH_DATA } from 'src/database/basicFuns';
import { ACCOUNT, EMPLOYEE } from 'src/database/references';
import store from 'src/store/store';
import { REGISTER_USER } from '../auth/auth';

// export const redux = store.getState()

export const GET_EMPLOYEE_DATA = async () => {
    const redux = store.getState()

    const data = await _GET_DATA(ACCOUNT + redux?.company?.cmUID + EMPLOYEE, true)
    return data
}

export const ADD_EMPLOYEE = async (data) => {
    const redux = store.getState()
    await _PUSH_DATA(ACCOUNT + redux.company.cmUID + EMPLOYEE, data)
}

export const ACCESS_EMPLOYEE = async (data) => {
    const company = store.getState().company
    let firstWord = company.cmName.split(" ")[0]

    await REGISTER_USER(
        {
            email: data.email,
            password: firstWord + '@123',
            cmUID: company.cmUID,
            emID: data.id,
        })
}
