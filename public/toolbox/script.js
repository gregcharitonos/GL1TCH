init = function(){
  self = null;
  anim = null;
  canvas = document.querySelector("#background");
  ctx = canvas.getContext("2d");

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
  
      resetCanvas = function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
    cancelAnimationFrame(anim);
      bits = [];
  for(var i=0; i<100; i++){
    var b = Math.round(Math.random());
    var x = Math.floor(Math.random()*canvas.width);
    var y = Math.floor(Math.random()*canvas.height);
    var o = Math.floor(Math.random()*100)/100;
    bits.push([b,x,y,o]);
  }
    render();
  }
  
  window.addEventListener("resize",resetCanvas,false);
  resetCanvas();
  
  showView = function(view){
    document.querySelector(".current").classList.remove("current");
    document.querySelector("#"+view).classList.add("current");
  }
  
  function renderExploits(e){
    
    for(var i in e){
      let b = document.createElement("button");
      b.innerHTML = e[i].name;
      document.querySelector("#exploitList").appendChild(b);
      let v = document.createElement("div");
      v.classList.add("view","exploit");
      v.innerHTML = e[i].html;
      document.querySelector("#main").appendChild(v);
      let a = document.createElement("a");
      a.href="javascript:void(0)";
      a.innerHTML = "back to menu";
      a.onclick = ()=>{window.scrollTo(0,0);showView('exploitList')};
      v.appendChild(a);
      v.id=e[i].id;
      b.addEventListener("click",()=>{showView(v.id)});
      let s = document.createElement("script");
      s.src = "/exploitjs/"+e[i].id+".js";
      document.head.appendChild(s);
    }
  }
  
  fetch("/exploits").then(d=>d.json()).then(renderExploits);
  fetch("/self").then(d=>d.json()).then((data)=>{
    self = data;
  });
  
    copy = function(name){
    var copyText = document.querySelector("#"+name);
    copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
    alert("copied");
  }
}
window.onload = init;