//test
init = function(){
  initialPage = document.querySelector("#initial");
  initBack = document.querySelector("#initBack");
  anim = null;
  deg = 0;
  render = function(){
    anim = requestAnimationFrame(render);
    ctx.clearRect(0,0,initBack.width,initBack.height);
    ctx.beginPath();
    ctx.font = "16px monospace";
    for(var i in bits){
      //var o = (bits[i][3] + (1 + Math.sin(Date.now()/500))/2) % 1;
      var o = bits[i][3]*1.5;
      bits[i][2] += o;
      if(bits[i][2] > initBack.height){
        bits[i][2] = -5;
        bits[i][1] = Math.floor(Math.random()*initBack.width);
      }
      o = o * (1 - Math.abs(bits[i][2] - initBack.height/2)/(initBack.height/2))**0.5;
      ctx.fillStyle = `hsla(${((256+deg)%360)}, 77%, 38%, ${o})`;
      ctx.fillText(bits[i][0],bits[i][1],bits[i][2]);
    }
  }
  logo = document.querySelector("#logo");
  window.addEventListener("deviceorientation",(e)=>{
    deg = e.beta;
  });
  
    resetCanvas = function(){
  initBack.width = window.innerWidth;
  initBack.height = window.innerHeight;
  ctx = initBack.getContext("2d");
    cancelAnimationFrame(anim);
      bits = [];
  for(var i=0; i<100; i++){
    var b = Math.round(Math.random());
    var x = Math.floor(Math.random()*initBack.width);
    var y = Math.floor(Math.random()*initBack.height);
    var o = Math.floor(Math.random()*100)/100;
    bits.push([b,x,y,o]);
  }
    render();
  }
  
  window.addEventListener("resize",resetCanvas,false);
  resetCanvas();
}

window.onload = init;