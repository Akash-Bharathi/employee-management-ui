import * as userApi from "../api/userApi";

export const fetchMembers = async (
  company = null
) => {
  try {
    const response =
      await userApi.getMembers(company);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        "Failed to fetch members",
    };
  }
};
export const deactivateUser = async (
    userId
) => {
    try {
        const response =
            await userApi.deactivateMember(
                userId
            );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.detail ||
                "Failed to deactivate user",
        };
    }
};
export const activateUser = async (
  userId
) => {
  try {
    const response =
      await userApi.activateMember(
        userId
      );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        "Failed to activate user",
    };
  }
};