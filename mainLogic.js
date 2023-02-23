
  function setupUI() {
    const loginDiv = document.getElementById("login-div");
    const logoutDiv = document.getElementById("logout-div");
    const navbarNav = document.getElementById("navbarNav");
    const createComment = document.getElementById("create-comment")
    const token = localStorage.getItem("token");
    // user logged in successfully
    if (token) {
      loginDiv.style.setProperty("display", "none", "important");
      logoutDiv.style.setProperty("display", "flex", "important");
      // createComment.style.display = "block"

      document.getElementById("username-logged").innerHTML = JSON.parse(localStorage.getItem("user")).username;
      document.getElementById("profile-im").src = JSON.parse(localStorage.getItem("user")).profile_image;
      
    }else {
      loginDiv.style.setProperty("display", "flex", "important");
      logoutDiv.style.setProperty("display", "none", "important");
      // createComment.style.display =  "none";

      // logoutDiv.style.visibility ="hidden"
    }
  }

  function loginBtnClicked() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const params = {
      "username": username,
      "password": password,
    };
    toggleLoader(true)
    axios
      .post("https://tarmeezacademy.com/api/v1/login", params)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // alert("user logged in successfully")
        showAlert("logged in successfully")
        setupUI();
        isUserLogin()
      }).catch((error) => {
        showAlert(error.response.data.error, "danger")
      }).finally(()=>{
        toggleLoader(false)
      })

  }

  function registerBtnClicked() {

    const name = document.getElementById("register-name").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const image = document.getElementById("register-image").files[0];

    let formData = new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    toggleLoader(true)
    axios
      .post("https://tarmeezacademy.com/api/v1/register", formData)
      .then((response) => {
        toggleLoader(false)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("register-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("New User Regisetered Successfully")
        setupUI();
      }).catch((error) =>{
         showAlert (error.response.data.message, "danger");
      })
     isUserLogin()
  }
  
  function logoutBtnClicked(){

    const username = JSON.parse(localStorage.getItem("user")).username;
    const password = JSON.parse(localStorage.getItem("user")).password;
    const params = {
     "username" : username,
     "password" : password
    } 
     const token = localStorage.getItem("token")
     const headers = {
       "authorization": `Bearer ${token}`
     }
     toggleLoader(true)
     axios.post("https://tarmeezacademy.com/api/v1/logout", params, {
       headers: headers
     })
     .then(response =>{
       toggleLoader(false)
       localStorage.removeItem("token")
       localStorage.removeItem("user")
       showAlert("logged out successfully")
       setupUI() 
      isUserLogin()

     }) 
   }
 
  function showAlert(message, type="success"){

    document.getElementById("success-alert").style.display = "block"
    document.getElementById("success-alert").innerHTML = ""
    const alertPlaceholder = document.getElementById("success-alert")
    const alert = (message, type) =>{
      const wrapper = document.createElement("div")
      wrapper.innerHTML = [   
        `<div class="alert alert-${type} alert-dismissible" role="alert">
          <div>${message}</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
      ].join("")
      alertPlaceholder.append(wrapper)
    }
    alert(message, type)
    setTimeout(() => {
      document.getElementById("success-alert").style.display = "none"
    }, 4000);
  }


function createNewPostClicked() {

  let isCreate = document.getElementById("post-id-input").value

  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const image = document.getElementById("post-image").files[0];
  const token = localStorage.getItem("token")
  
  let formData = new FormData();
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", image)

  const headers = {
      "Content-Type": "multipart/form-data",
      "authorization": `Bearer ${token}`
  }
  document.getElementById("close-btn-post-model").click()

  if (isCreate) {
      formData.append("_method", "put")
      toggleLoader(true)
      axios
          .post(`https://tarmeezacademy.com/api/v1/posts/${isCreate}`, formData, {
              headers: headers
          })
          .then((response) => {
              toggleLoader(false)
              showAlert("Post Has Been Updated")
              getPosts()
              document.getElementById("post-modal-title").innerHTML = "Creadt A New Post"
              document.getElementById("editOrCreate-btn").innerHTML = "Create"
          }).catch((error) => {
              console.log(error);
              showAlert(error.response.data.error_message, "danger")
          })
  }
  else {

      axios
          .post("https://tarmeezacademy.com/api/v1/posts", formData, {
              headers: headers
          })
          .then((response) => {
              showAlert("New Post Has Been Created")
              getPosts()
              document.getElementById("post-modal-title").innerHTML = "Creadt A New Post"
              document.getElementById("editOrCreate-btn").innerHTML = "Create"
          }).catch((error) => {
              showAlert(error.response.data.error_message, "danger")
          })

  }

}

function editBtnClicked(postObject) {

  let post = JSON.parse(decodeURIComponent(postObject))

  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("editOrCreate-btn").innerHTML = "Update"
  document.getElementById("post-title").value = post.title
  document.getElementById("post-body").value = post.body
  document.getElementById("post-image").files[0] = post.image
  // document.getElementById("post-image").value = post.image

  let postModal = new bootstrap.Modal(document.getElementById("creat-post-modal"))
  postModal.toggle()
}

function deleteBtnClicked(postObject, ok){
  
  const token = localStorage.getItem("token")
  let confirmMsg = confirm("Are you sure you want to delete the post ?")
  let post = JSON.parse(decodeURIComponent(postObject))

  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
 }
  if(confirmMsg){ 
    toggleLoader(true)
      axios
      .delete(`https://tarmeezacademy.com/api/v1/posts/${post.id}`, {
          headers: headers
      })
      .then((response) => {
          toggleLoader(false)
          showAlert(" Post Has Been Deleted Successfully")
          if(ok){
             window.location = `home.html`
             return
          }
          location.reload();

      }).catch((error) => {
          showAlert(error.message, "danger")
      })
  } 
}

function showPost(post_id) {
  console.log("showPost");
  window.location = `postDetails.html?post_id=${post_id}`
}


function isUserLogin(){
  
  let user = localStorage.getItem("user")
  if(user){
    user = JSON.parse(user).id
    let profileA = `<a class="nav-link" href="profile.html?userId=${user}">Profile</a>`
    document.getElementById("nav-profile").innerHTML = profileA
  }
  else document.getElementById("nav-profile").innerHTML = ""
}

function openProfile(userId){
  window.location = `profile.html?userId=${userId}`
}

function toggleLoader(show = true){
  if(show){
    document.getElementById("loader").style.visibility = "visible"
  }else{
    document.getElementById("loader").style.visibility = "hidden"
  }

}