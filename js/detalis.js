setupUI();
let searchParams = new URLSearchParams(window.location.search);
let getId = searchParams.get("postId");

//! id جلب بوست محدد حسب
const getPostinId = () => {
  toggleloder(true);

  axios.get(`${mainUrl}/posts/${getId}`).then((respons) => {
    toggleloder(false);

    let allData = respons.data.data;
    let comments = allData.comments;
    document.getElementById("usernameSpan").innerHTML = allData.author.username;

    let postTitle = "";
    if (allData.title != null) {
      postTitle = allData.title;
    }

    let commentsContent = "";

    for (const comment of comments) {
      commentsContent += `
        <div class="p-3" >
        <div>
          <img
            src="${comment.author.profile_image}"
            class="rounded-circle"
            style="width: 40px; height: 40px"
            alt=""
          />
          <b>@${comment.author.username}</b>
        </div>
        <div class="px-5">
        ${comment.body}
        </div>
      </div>
     
        `;
    }

    let content = `
    <div class="card shadow my-1 mycard">
    <div class="card-header">
      <img
        class="rounded-circle border border-2"
        src="${allData.author.profile_image}"
        alt="profile-img"
        style="width: 40px; height: 40px"
      />
      <b>@${allData.author.username}</b>
    </div>
    <div class="card-body">
      <img
        class="w-100"
        src="${allData.image}"
        alt="posts"
      />
      <h6 class="mt-2" style="color: gray">${allData.created_at}</h6>
      <h5>${postTitle}</h5>
      <p>
       ${allData.body}
      </p>
      <hr />
      <div>
        <i class="fa-solid fa-pen"></i>
        <span> (${comments.length}) Comments</span>
      </div>
    </div>
    <div id="comments">
            ${commentsContent}

    </div>
        <div class="d-flex mb-2" id="add-comment-div">
            <input
            id="comment-input"
            class="form-control"
            type="text"
            placeholder="Add Comment"
            aria-label="default input example"
            />
            <button class="btn btn-outline-primary" onclick="addComments()">Send</button>
        </div>
  </div>
    `;
    document.getElementById("showPost").innerHTML = content;
  });
};

getPostinId();

function addComments() {
  let commentInput = document.getElementById("comment-input").value;
  let url = `${mainUrl}/posts/${getId}/comments`;
  let token = localStorage.getItem("token");
  let params = {
    body: commentInput,
  };
  toggleloder(true);

  axios
    .post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      toggleloder(false);

      alertSuccess("Comment added", "success");
      getPostinId();
    })
    .catch((error) => {
      let errorMess = error.response.data.message;
      alertSuccess(errorMess, "danger");
    });
}
