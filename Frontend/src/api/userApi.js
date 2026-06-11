import API from "./authApi";

export const getMembers = (
  company = null
) => {
  if (company) {
    return API.get(
      `/members?company=${encodeURIComponent(
        company
      )}`
    );
  }

  return API.get("/members");
};
export const deactivateMember = (userId) => {
  return API.put(
    `/members/${userId}/deactivate`
  );
};
export const activateMember = (userId) => {
  return API.put(
    `/members/${userId}/activate`
  );
};