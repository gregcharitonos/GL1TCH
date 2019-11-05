/*
  Greg Charitonos
  05/11/19 (remember remember)
  Built For: Science Communication Class, Block 1
*/

var express = require('express');
var fs = require('fs');
var app = express();
var cookieParser = require('cookie-parser');
var users = {};
var msgs = [];

User = function(u){
  this.username = u.username;
  this.password = u.password;
  this.points = 0;
  this.displayName = u.username;
  this.bio = "hello world! Send me points!: ";
  this.exploits = [];
  this.receivedPointsFrom = [];
  return this;
}

exploits = {
  "73c863782de141914d63aaff":{
    "name":"what's in a name",
    "file":"name.html",
    "id":"name"
  },
  "86881ec296d14bdde06c33aa":{
    "name":"cookie thief",
    "file":"cookie.html",
    "id":"cookie"
  },
  "ad2be8b3c7656df70d92878a":{
    "name":"pickpocket",
    "file":"pickpocket.html",
    "id":"pickpocket"
  },
  "ec511e64c3d6d14dfa973b23":{
    "name":"graffiti",
    "file":"graffiti.html",
    "id":"graffiti"
  },
  "f0570a94de8f68af4da6c397":{
    "name":"keylogger",
    "file":"keylogger.html",
    "id":"keylogger"
  },
  "25377345d9539a6375d54cb0":{
    "name":"w0rm",
    "file":"worm.html",
    "id":"worm"
  }
};

for(var i in exploits){
  var data = fs.readFileSync("exploits/"+exploits[i].file,'utf-8');
  exploits[i].html = data;
}


var port = 80;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
    return next();
});

app.use(cookieParser());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static('public'));

userIsAuth = function(cookies){
  if(!cookies){
    return false;
  }
  if(cookies["username"] in users){
    if(cookies["password"] == users[cookies["username"]].password){
      return true;
    }
  }
  return false;
}

app.get('/', (req, res) => {
  if(!req.cookies){
    res.sendFile(__dirname + "/html/login.html");
    return
  }
  if(userIsAuth(req.cookies)){
    res.sendFile(__dirname + '/html/chatapp.html');
    return;
  }
  res.sendFile(__dirname + '/html/login.html');
});

app.post("/createaccount",(req,res)=>{
  var uname = req.body.username;
    if(uname in users){
      res.send("alreadyexists");
      return false;
    }
  var user = new User(req.body);
  users[uname] = user;
  res.send("ok");
})

app.post("/signin",(req,res)=>{
  var uname = req.body.username;
  var pass = req.body.password;
  if(uname in users){
    if(users[uname].password == pass){
      res.cookie("username",uname,{maxAge:8.64e7});
      res.cookie("password",pass,{maxAge:8.64e7});
      res.send(users[uname]);
      return;
    } else {
      res.send("wrongpass");
      return
    }
  } else {
    res.send("notuser");
    return
  }
  res.send("error");
})

app.get("/bio",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.status(400);
    res.send("False");
    return;
  }
  var name = req.cookies.username;
  users[name].bio = req.query.bio;
  users[name].displayName = req.query.displayName;
  res.send("ok");
});

app.get("/users",(req,res)=>{
  var clean = [];
  for(var u in users){
    clean.push({
      username:users[u].username,
      displayName:users[u].displayName,
      bio:users[u].bio,
      points:users[u].points
    })
  }
  res.send(clean);
});

app.get("/msgs",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.status(400);
    res.send("False");
    return;
  }
  var p1 = req.cookies.username;
  var p2 = req.query.rec;
  var sample = msgs.filter((m)=>{
    return (m.from == p1 && m.to == p2) || (m.from == p2 && m.to == p1);
  });
  res.send(sample);
});

app.get("/sendmsg",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.status(400);
    res.send("False");
    return;
  }
  var m = {
    from:req.cookies.username,
    to:req.query.rec,
    msg:req.query.msg
  }
  msgs.push(m);
  res.send("ok");
});

app.get("/self",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.status(400);
    res.send("False");
    return;
  }
  res.send(users[req.cookies.username]);
});

app.get("/toolbox",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.redirect("/ad");
    return
  }
  if(req.query.exploit){
    if(req.query.exploit in exploits){
      var u = req.cookies.username;
      if(!(users[u].exploits.includes(req.query.exploit))){
        users[u].exploits.push(req.query.exploit);
        users[u].points += 1;
      }
    }
    res.redirect("/toolbox");
    return;
  }
  res.sendFile(__dirname + "/html/toolbox.html");
});

app.get("/exploits",(req,res)=>{
  if(!userIsAuth(req.cookies)){
    res.redirect("/");
    return
  }
  var user = users[req.cookies.username];
  var e = [];
  for(var i in user.exploits){
    e.push(exploits[user.exploits[i]]);
  }
  res.send(e);
});

app.get("/givepoints",(req,res)=>{
  if (!userIsAuth(req.cookies)) {
    res.status(400);
    res.send("False");
    return;
  }
  if(req.query.rec){
    if(req.query.rec == req.cookies.username){
      res.status(400);
      res.send("same user");
      return
    };
    var rec = users[req.query.rec];
    if(!rec.receivedPointsFrom.includes(req.cookies.username)){
      rec.receivedPointsFrom.push(req.cookies.username);
      rec.points += 1;
      users[req.cookies.username].points -= 1;
      res.send("True");
      return;
    }
    res.status(400);
    res.send("already sent this user");
    return;
  }
  res.status(400);
  res.send("error!");
})

app.get("/scores",(req,res)=>{
  res.sendFile(__dirname + "/html/scoreboard.html")
})
app.get("/ad",(req,res)=>{
  res.sendFile(__dirname + "/html/ad.html")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));