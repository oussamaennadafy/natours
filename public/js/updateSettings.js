/* eslint-disable */

// type is either password or data
const updateSettings = async (data, type) => {
  const url =
    type === "password"
      ? "http://localhost:8000/api/v1/auth/updatePassword"
      : "http://localhost:8000/api/v1/users/updateMe";
  try {
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", `${type} updated successfully`);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
