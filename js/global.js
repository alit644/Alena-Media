let mainUrl = "https://tarmeezacademy.com/api/v1";

//! pop up زر التعديل اخراج
// TODO || modal هذا مشترك مع انشاء بوست جديد لانه يحتوي على نفس الخواص

function editBtnClicked(postObject) {
  //*  كامل object تسخدم لجلب
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("submit-btn").innerHTML = "UpDate";
  //! من انبوت مخفي بنائا على ذلك نحدد الاي دي المخصص للبوست id جلب
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("creat-input-body").value = post.body;
  document.getElementById("creat-input-name").value = post.title;
  document.getElementById("post-heding").innerHTML = "Edit A Post";

  //* قديم مع تعديل عليه modal لاظهار
  let postModal = new bootstrap.Modal(
    document.getElementById("add-posts-Model"),
    {}
  );
  postModal.toggle();
}
//TODO : bootsrab يوجد خطا لم يتعرف على
//! لما نضغط على زر الحذف
function dleteBtnClicked(postObject) {
  //*  كامل object تسخدم لجلب
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("del-post-id").value = post.id;
  //* قديم مع تعديل عليه modal لاظهار
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-posts-Model"),
    {}
  );

  postModal.toggle();
}

function confrimDelete() {
  let postid = document.getElementById("del-post-id").value;
  let url = `${mainUrl}/posts/${postid}`;

  let header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  toggleloder(true);

  axios
    .delete(url, {
      headers: header,
    })
    .then((response) => {
      toggleloder(false);

      let model = document.getElementById("delete-posts-Model");
      let modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      alertSuccess("The deletion was completed successfully", "success");
      getPost();
    })
    .catch((error) => {
      let errorMess = error.response.data.message;
      alertSuccess(errorMess, "danger");
    });
}

//! عملية انشاء بوست جدجد
const creatNewPost = () => {
  // جلب الاي دي الخاص بالبوست
  let postId = document.getElementById("post-id-input").value;
  //* + غير موجود postId اذا كان
  //* لا يساوي شئ معناها ان هنا انشاء مستخدم postId
  let isCreate = postId == null || postId == "";

  let title = document.querySelector("#creat-input-name").value;
  let body = document.querySelector("#creat-input-body").value;
  let image = document.querySelector("#creat-input-Imgae").files[0];

  let url = "";

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  let header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  };

  //! معناها هنا انشاء بوست true اذا كان يساوي
  if (isCreate == true) {
    url = `${mainUrl}/posts`;
  }
  //!  يعني يوجد بووست id هنا يوجد
  //! لانه تعديل put سوف تكون قيمة الارساال
  else {
    formData.append("_method", "put");
    url = `${mainUrl}/posts/${postId}`;
  }
  toggleloder(true);

  axios
    .post(url, formData, {
      headers: header,
    })
    .then((respons) => {
      toggleloder(false);

      alertSuccess("Post created successfully", "success");

      let model = document.getElementById("add-posts-Model");
      let modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      setupUI();
      getPost();
      ؤ;
    })
    .catch((error) => {
      let errorMess = error.response.data.message;
      alertSuccess(errorMess, "danger");
    });
};

//!  تقوم باخفاء الازرار بعد تسجيل الدحول

function setupUI() {
  let token = localStorage.getItem("token");

  let loginBtn = document.getElementById("login-div");
  let logoutDiv = document.getElementById("logout-div");
  let addBtn = document.getElementById("addBtn");
  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }

    loginBtn.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }
    loginBtn.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    let user = curentuserName();
    document.getElementById("userNameInDom").innerHTML = user.username;
    document.getElementById("imgInDom").src = user.profile_image;
  }
}

// !  عملية تسجيل الدخول

const loginBtnClicked = () => {
  let nameInput = document.querySelector("#input-name").value;
  let passInput = document.querySelector("#input-pass").value;

  let url = `${mainUrl}/login`;
  let params = {
    username: nameInput,
    password: passInput,
  };
  toggleloder(true);

  axios
    .post(url, params)
    .then((respons) => {
      toggleloder(false);

      localStorage.setItem("token", respons.data.token);
      localStorage.setItem("user", JSON.stringify(respons.data.user));

      let model = document.getElementById("loginModel");
      let modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      setupUI();
      alertSuccess("The login process was completed successfully", "success");
    })
    .catch((error) => {
      let errorMess = error.response.data.message;

      alertSuccess(errorMess, "danger");
    });
};

//* انشاء حساب جديد
const rgisterBtnClicked = () => {
  let name = document.getElementById("register-input-name").value;
  let userName = document.getElementById("register-input-username").value;
  let pass = document.getElementById("Register-input-pass").value;
  let imge = document.getElementById("register-input-Imgae").files[0];

  let url = `${mainUrl}/register`;

  let params = new FormData();
  params.append("name", name);
  params.append("username", userName);
  params.append("password", pass);
  params.append("image", imge);

  let header = {
    "Content-Type": "multipart/form-data",
  };
  toggleloder(true);

  axios
    .post(url, params, {
      headers: header,
    })
    .then((respons) => {
      toggleloder(false);

      localStorage.setItem("token", respons.data.token);
      localStorage.setItem("user", JSON.stringify(respons.data.user));

      let model = document.getElementById("RegisterModel");
      let modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();

      setupUI();
      alertSuccess("An account has been created successfully", "success");
    })
    .catch((error) => {
      let errorMess = error.response.data.message;
      alertSuccess(errorMess, "danger");
    });
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  alertSuccess("Signed out successfully", "danger");
};

//!  Alert نجاح عملية تسجيل الدخول
const alertSuccess = (customMess, type = "success") => {
  const alertPlaceholder = document.getElementById("alertSuccess");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(customMess, type);

  // setTimeout(() => {
  //   const alert = bootstrap.Alert.getOrCreateInstance("#alertSuccess");
  //   alert.close();
  // }, 2000);
};

//! وضع الصورة و الاسم المستخدم داخل صفحة
function curentuserName() {
  let user = null;
  let storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function proileClicked() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userId = user.id;
  window.location = `profile.html?postId=${userId}`;
}

// loder

function toggleloder(show = true) {
  if (show) {
    document.getElementById("loder").style.visibility = "visible";
  } else {
    document.getElementById("loder").style.visibility = "hidden";
  }
}
