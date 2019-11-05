init = function(){
  scoreList = document.querySelector("#scoreList");
  canvas = document.querySelector("#background");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
    bits = [];
  makeBit = function(){
    var b = Math.round(Math.random());
    var x = Math.floor(Math.random()*canvas.width);
    var y = Math.floor(Math.random()*canvas.height);
    var o = Math.floor(Math.random()*100)/100;
    bits.push([b,x,y,o]);
  }
  
  for(var i=0; i<100; i++){
    var b = Math.round(Math.random());
    var x = Math.floor(Math.random()*canvas.width);
    var y = Math.floor(Math.random()*canvas.height);
    var o = Math.floor(Math.random()*100)/100;
   // o = Math.max(o,0.1);
    bits.push([b,x,y,o]);
  }

  render = function(){
    anim = requestAnimationFrame(render);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    var t = Date.now();
    for(var i in bits){
      var o = bits[i][3];
      ctx.font = (16*o)+"px monospace";
      bits[i][2] -= o**2;
      if(bits[i][2] < 0){
        bits[i][2] = canvas.height+5;
        bits[i][1] = Math.floor(Math.random()*canvas.width);
      }
      ctx.fillStyle = `hsla(256, 77%, 38%, ${o})`;
      ctx.fillText(bits[i][0],bits[i][1],bits[i][2]);
    }
  }
  render();
  
  function updateScores(){
    fetch("/users").then(res=>res.json()).then(users=>{
      scoreList.innerHTML = "";
      users.sort((a)=>{
        a.points > b.point? -1 : 1;
      });
      for(var i=0; i<users.length; i++){
        var u = document.createElement("li");
        u.innerText = users[i].username + " - " + users[i].points;
        scoreList.appendChild(u);
      }
    })
  }
  
  refreshScores = setInterval(updateScores,2000);
  updateScores();
  
}
window.onload = init;