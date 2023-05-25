setupUI();

//! استخراج الاي دري من الرابط الصفحة
let searchParams = new URLSearchParams(window.location.search);
let getpostId = searchParams.get("postId");

// ! عرض معلومات المستخدم

function showUserInfor() {
  toggleloder(true);

  axios.get(`${mainUrl}/users/${getpostId}`).then((respons) => {
    toggleloder(false);

    let userData = respons.data.data;
    document.getElementById("user-main-email").innerHTML = userData.email;
    document.getElementById("user-main-name").innerHTML = userData.name;
    document.getElementById("user-main-username").innerHTML = userData.username;
    document.getElementById("name-post").innerHTML = userData.username;
    document.getElementById("heade-image").src = userData.profile_image;
    document.getElementById("post-count").innerHTML = userData.posts_count;
    document.getElementById("post-comments").innerHTML =
      userData.comments_count;
  });
}

//! جلب بوستات المستخدم

const getUserPost = () => {
  toggleloder(true);
  axios.get(`${mainUrl}/users/${getpostId}/posts`).then((respons) => {
    toggleloder(false);

    let allData = respons.data.data;

    for (const data of allData) {
      let user = curentuserName();
      //* localStrorge اذا كان يوجد مستخدم داخل
      //*  البوست id == السمتخدم id و
      let isMyPost = user != null && data.author.id == user.id;
      let showEditBtn = "";
      //* اذا كان يساوي سوف نعرض كبسة التعديل
      if (isMyPost == true) {
        showEditBtn = `
            <button onclick="dleteBtnClicked('${encodeURIComponent(
              JSON.stringify(data)
            )}')" id="delete-btn" class="btn btn-sm bg-danger mx-2 rounded-pill text-light" style="float: right;">delete</button>
        
            <button onclick="editBtnClicked('${encodeURIComponent(
              JSON.stringify(data)
            )}')" id="edit-btn" class="btn btn-sm bg-secondary rounded-pill text-light" style="float: right;">edit</button>`;
      }

      let postTitle = "";
      if (data.title != null) {
        postTitle = data.title;
      }

      let content = `
      <div class="card shadow my-3 mycard">
                <div class="card-header">
                  <img
                    class="rounded-circle border border-2"
                    src="${data.author.profile_image}"
                    alt="profile-img"
                    style="width: 40px; height: 40px"
                  />
                  <b>@${data.author.username}</b>
  
                        ${showEditBtn}
                </div>
                <div class="card-body" onclick="postClicked(${data.id})" style="cursor: pointer;">
                  <img
                    class="w-100"
                    src="${data.image}"
                    alt="posts"
                  />
                  <h6 class="mt-2" style="color: gray">${data.created_at}</h6>
                  <h5>${postTitle}</h5>
                  <p>
                    ${data.body}
                  </p>
                  <hr />
                  <div>
                    <i class="fa-solid fa-pen"></i>
                    <span class = "allSapns"> (${data.comments_count}) Comments
                    </span>
                  </div>
                </div>
              </div>
      `;

      document.getElementById("post-user").innerHTML += content;
    }
  });
};

showUserInfor();
getUserPost();
