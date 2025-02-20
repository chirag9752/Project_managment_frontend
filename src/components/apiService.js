import apiClient from "./apiClient";

export const executeFeature = async (featureData) => {
  const response = await apiClient.post("/users/execute_feature", featureData);
  return response;
}

export const checkUserFeature = async (userId) => {
  const response = await apiClient.post("/users/checkinguserfeature", { userid: userId });
  return response.data.allowed_features;
};
  
  // Project-related APIs
export const fetchProjectDetails = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}`);
  return response.data;
};
  
  // Timesheet-related APIs
export const fetchSingleTimesheet = async (timesheetData) => {
  const response = await apiClient.post("/timesheets/fetchsingletimesheet", timesheetData);
  return response.data;
};

export const signUpUser = async(formdata) => {
  const response = await apiClient.post('/signup', formdata);
  return response;
}

export const fetchUsers = async() => {
  const response = await apiClient.get('/users');
  return response;
}

export const currentUserDetail = async(currentUserId) => {
  const response = await apiClient.get(`/users/details/${currentUserId}`);
  return response;
}

export const logoutUsers = async() => {
  const response = await apiClient.delete('/logout');
  return response;
}


// export const saveProfile = async(currentUserId, formData) => {
//   console.log(currentUserId);
//   console.log(formData);
//   // const response = await apiClient.post(`/users/update/profile/${currentUserId}`, formdata);
//   // console.log(response);
//   // return response;
// }