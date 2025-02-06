import { combineReducers } from '@reduxjs/toolkit';

import dashboardSlice from './dashboard/dashboardSlice';

const rootReducer = combineReducers({
    dashboard: dashboardSlice
});

export default rootReducer;