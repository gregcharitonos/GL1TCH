init = function(){
  self = null;
  if(document.cookie){
    self = document.cookie.split("username=")[1].split("; ")[0];
  }
  
  Me = {
    username:self,
    displayName:self
  }
  
  recipient = null;
  refreshTexts = null;
  refreshUsers = null;
  recipientDisplayName = null;
  bioform = document.querySelector("#bioform");
  bioform.addEventListener("submit",(e)=>{
    e.preventDefault();
  },false);
  
  uploadBio = function(){
    var name = bioform.querySelector("input[name=displayName]").value;
    var bio = bioform.querySelector("textarea[name=bio]").value;
    fetch("/bio?displayName="+name+"&bio="+bio).then((res)=>{
      if(res.ok){
        Me.displayName = name;
        Me.bio = bio;
        alert("saved!");
      }
    });
  }
  
  showView = function(view){
    document.querySelector(".current").classList.remove("current");
    document.querySelector("#"+view).classList.add("current");
    if(view != "texts" && refreshTexts){
      clearInterval(refreshTexts);
    }
    
    if(view == "myprofile"){
      fetch("/self").then(d=>d.json()).then((me)=>{
        bioform.querySelector("input[name=displayName]").value = me.displayName;
        bioform.querySelector("textarea[name=bio]").value = me.bio;
        document.querySelector("#points").innerHTML = me.points;
        Me = me;
      })
    }
    
    if(view == "users"){
      document.querySelector("#userList").innerHTML = "";
      getUsers();
      refreshUsers = setInterval(getUsers,3000);
    } else if(refreshUsers){
      clearInterval(refreshUsers);
    }
  }
  
  getUsers = function(){
    fetch("/users").then(d=>d.json()).then(updateUserList);
  }
  
  getMsgs = function(){
    fetch("/msgs?rec="+recipient).then(d => d.json()).then(renderTexts);
  }
  
  sendMsg = function(){
    var text = document.querySelector("input[name=msg]").value;
    text = encodeURIComponent(text);
    fetch("/sendmsg?rec="+recipient+"&msg="+text).then((res)=>{
      if(res.ok){
        document.querySelector("input[name=msg]").value = "";
      }
    })
  }
  
  var linkReg = /\(([^\(\)]+)\)\[([^\[\]\(\)]+)\]/g
  renderTexts = function(texts){
    //document.querySelector("#messages").innerHTML = "";
    var minIndex = document.querySelector("#messages").childElementCount;
    for(var i=minIndex; i < texts.length; i++){
      var m = document.createElement("span");
      var s = texts[i].msg;
      s = s.replace(linkReg,"<a href='$1' target='_blank'>$2</a>")
      m.innerHTML = s;
      m.setAttribute("data-name",texts[i].from);
      m.classList.add("msg");
      if(texts[i].from == self){
        m.classList.add("me");
      } else {
        m.setAttribute('data-displayName',recipientDisplayName);
      }
      document.querySelector("#messages").appendChild(m);
    } 
  }
  
  function openTexts(e){
    recipient = e.currentTarget.getAttribute("data-name");
    recipientDisplayName = e.currentTarget.getAttribute("data-displayName");
    refreshTexts = setInterval(getMsgs,1000);
    document.querySelector("#msgName").innerHTML = e.currentTarget.getAttribute("data-bio");
    document.querySelector("#messages").innerHTML = "";
    showView("texts");
  }
  
  function updateUserList(users){
   // document.querySelector("#userList").innerHTML = "";
    var minIndex = document.querySelector("#userList").childElementCount;
    for(var i=minIndex; i<users.length; i++){
      var s = document.createElement("span");
      s.setAttribute("data-name",users[i].username);
      s.setAttribute("data-bio",users[i].bio);
      s.setAttribute("data-displayName",users[i].displayName);
      s.addEventListener("click",openTexts,false);
      s.innerHTML = "<div class='name'>"+users[i].displayName+"</div>";
      document.querySelector("#userList").appendChild(s);
    }
  }
  
  givePoints = function(user){
    fetch("/givePoints?rec="+user).then((res)=>{
      if(res.ok){
        alert("point given");
      }
      return res.text();
    }).then((txt)=>{
      if(txt == "same user"){
        alert("can't give points to yourself");
      } else if(txt == "already sent this user"){
        alert(txt);
      }
    });
  }
  
  getUsers();
}
window.onload = init;