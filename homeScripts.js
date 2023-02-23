
// localStorage.clear();


//====== infinite scroll ======//
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll",function(){
    let endOfPage = window.innerHeight + window.pageYOffset + 100 >= document.body.scrollHeight;
    if(endOfPage && currentPage <= lastPage){
      currentPage = currentPage + 1
      getPosts(false, currentPage)
    }
})
//======// infinite scroll //======//
setupUI();
let postsOf = document.getElementById("posts");

getPosts()
function getPosts(reload = true, page = 1) {
    toggleLoader(true)
    axios
        .get(`https://tarmeezacademy.com/api/v1/posts?limit=12&page=${page}`)
        .then(function (response) {
            toggleLoader(false)
            if (reload) postsOf.innerHTML = "";
            
            lastPage = response.data.meta.last_page
            let posts = response.data.data;
            let userId = localStorage.getItem("user")
            for (post of posts) {
                
                let editBtn = ""
                let deleteBtn = ""
                if(userId != null) {
                    userId = JSON.parse(localStorage.getItem("user")).id
                    if( userId == post.author.id){
                        deleteBtn = `<button class="btn btn-danger mx-2"style="float: right" id="edit-btn" onclick="deleteBtnClicked('${encodeURIComponent(JSON.stringify(post))}', false)" >delete</button>  `
                        editBtn = `<button class="btn btn-secondary "style="float: right" id="edit-btn" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" >edit</button>  `
                    }
                }
                let image = "";
                if (post.image) image = post.image;
                else post.image = "./profile-pics/image-not-available-icon-260nw-1036295239.png"
                
                let title = "";
                if (post.title) title = post.title;
                
                let profileImage = ""
                if (typeof(post.author.profile_image) == 'string') profileImage = `<img src=${post.author.profile_image} alt="" style="width: 40px; height: 40px;" class="rounded-circle">`
                else profileImage = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png" alt="" style="width: 40px; height: 40px;" class="rounded-circle">`
                     
                let tags = post.tags;
                let tagsCont = "";
                for (tag of tags) {
                    tagsCont += `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white">${tag}</button>      `;
                }
                let containt = `
              <div class="card shadow-lg my-3" >
                  <div class="card-header" >
                       ${profileImage}
                      <b  style="cursor: pointer;" onclick=(openProfile(${post.author.id}))>${post.author.username}</b>
                       ${deleteBtn}
                       ${editBtn}
                       </div>
                  <div class="card-header" style="cursor: pointer;" onclick="showPost(${post.id})" post-id="${post.id}" id="${post.id}">
                    
                      <img class="w-100" src="${image}" alt="">

                      <h6 style="color: grey" class="mt-1">
                          ${post.created_at}
                      </h6>
      
                      <h5>
                          ${title}
                      </h5>
      
                      <p>${post.body}</p>
      
                      <hr>
      
                      <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
                          </svg>
                          <span>
                              (${post.comments_count}) Comments
                                ${tagsCont}
                          </span>
                      </div>
                  </div>
              </div>
              <!--// post //-->         
      `;
                postsOf.innerHTML += containt;
            }
        });

}

