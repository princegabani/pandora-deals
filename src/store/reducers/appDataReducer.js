import { SET_APP_DATA } from '../actions/userActions';

const initialState = {
    appMode: ''
}

const appData = (state = initialState, action) => {
    switch (action.type) {
        case SET_APP_DATA:
            return {
                ...action.payload,
            };
        default:
            return state;
    }
};

export default appData;