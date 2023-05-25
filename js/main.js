//! APi جلب البوستات من
// ! في كل مرة تتأكد انه يوجد مستخدم ام لا
setupUI();

//! لما نضغط على صورة او اسم الامستخدو
function userClick(id) {
  window.location = `profile.html?postId=${id}`;
}

let current = 1;
let lastPage = 1;

//*  تسخدم هذه العملية لعرض الصفحات بعد وصول المستخدم الى نهاية الصفحة = Pagination
//* على دفعات معددة respons  لحضار
window.addEventListener("scroll", function () {
  const endOfPage =
    this.window.innerHeight + window.pageYOffset >=
    this.document.body.scrollHeight;
  if (endOfPage && current < lastPage) {
    current = current + 1;
    getPost(false, current);
  }
});

const getPost = (relaod = true, page = 1) => {
  let posts = document.getElementById("posts");

  toggleloder(true);
  axios.get(`${mainUrl}/posts?limit=5&page=${page}`).then((respons) => {
    toggleloder(false);

    let allData = respons.data.data;

    lastPage = respons.data.meta.last_page;

    if (relaod) {
      posts.innerHTML = "";
    }
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
        )}')" id="edit-btn" class="btn btn-sm bg-danger mx-2 rounded-pill text-light" style="float: right;">delete</button>

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
                  <span onclick="userClick(${data.author.id})" style="cursor: pointer;">
                      <img
                      class="rounded-circle border border-2"
                      src="${data.author.profile_image}"
                      alt="profile-img"
                      style="width: 40px; height: 40px"
                    />
                    <b>@${data.author.username}</b>
                  </span>
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

      posts.innerHTML += content;
      let spans = document.querySelectorAll(".allSapns");

      for (let i = 0; i < spans.length; i++) {
        let SpanCpntent = `
      <button class="btn btn-sm bg-secondary rounded-pill text-light">${data.tags}</button>
      `;
        spans.innerHTML += SpanCpntent;
      }
    }
  });
};
getPost();

// ! في كل مرة تتأكد انه يوجد مستخدم ام لا
// setupUI();

//! لما نضغط على البوست

function postClicked(postId) {
  window.location = `postDetalis.html?postId=${postId}`;
}

function addbtn() {
  document.getElementById("submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("creat-input-body").value = "";
  document.getElementById("creat-input-name").value = "";
  document.getElementById("post-heding").innerHTML = "create A New Post";

  let postModal = new bootstrap.Modal(
    document.getElementById("add-posts-Model"),
    {}
  );
  postModal.toggle();
}
