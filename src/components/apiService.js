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
