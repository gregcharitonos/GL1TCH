init = function(){
  document.querySelector("#s").addEventListener("submit",e=>{
    e.preventDefault();
  },false);
  
  signIn = function(){
    fetch("/signin",{
        method:"POST",
        headers: {
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify({
          username:document.querySelector("input[name=username]").value,
          password:document.querySelector("input[name=password]").value
        })
      }).then((res)=>{
        if(res.ok){
          res.text().then(handleSignIn);
        } else {
          alert("something went wrong...")
        }
      });
    document.querySelector("input[name=password]").value = "";
  }
  
  handleSignIn = function(res){
    if(res == "notuser"){
      alert("user does not exist, please sign up");
    } else if(res == "wrongpass"){
      alert("password is incorrect");
    } else if(res != "error") {
      window.location.replace("/");
    }
  }
  
  signUp = function(){
    fetch("/createaccount",{
        method:"POST",
        headers: {
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify({
          username:document.querySelector("input[name=username]").value,
          password:document.querySelector("input[name=password]").value
        })
      }).then((res)=>{
        if(res.ok){
          res.text().then(handleSignup);
        } else {
          alert("something went wrong...");
        }
      });
    document.querySelector("input[name=password]").value = "";
  }
  
  handleSignup = function(res){
    if(res == "alreadyexists"){
      alert("username already exists, please pick another");
    } else if(res == "ok"){
      alert("account created. please sign in to continue");
    }
  }

}
window.onload = init;