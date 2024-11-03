import { combineReducers } from "redux";
import appData from "./appDataReducer";
import authReducer from "./authReducer";
import companyReducer from "./companyReducer";
import employeeReducer from "./employeeReducer";

const reducers = combineReducers({
    auth: authReducer,
    company: companyReducer,
    employee: employeeReducer,
    appData: appData
})
export default reducers