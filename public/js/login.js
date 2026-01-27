/* eslint-disable */

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/auth/login",
      data: {
        email,
        password,
      },
    });
    console.log(res);
    console.log("--------", res.data);
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/auth/logout",
    });
    console.log("-----------", res);
    if(res.data.status= "success") location.reload(true);
    showAlert("success", "logged out successfully :D");
  } catch (error) {
    console.log();
    showAlert("error", "Error logging out! try again!");
  }
};
