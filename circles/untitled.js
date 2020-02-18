

c=b.getContext('2d');
img = new Image();
img.src = 'sprites.png';
img.onload = function update() {
  requestAnimationFrame(update);

  // init
  if (!window.time) {
    frame = 0;
    time = 0;
    timeNextFrame = 0;
    vines = [{x:0,y:0,a:0,ai:0,l:96 * 60,p:[],w:8}];
  }

  // update
   currentTime = performance.now() / 1000; // First
  
  while(time < currentTime) {
    while(time < timeNextFrame) {
        time += 1/60;
    }
    frame++;
    timeNextFrame += 1 / 60;
    
    // update visuals
    vines = vines.filter(v => v.l--);
    vines.forEach(v => {
      dx = Math.cos(v.a) * v.w / 2;
      dy = Math.sin(v.a) * v.w / 2;
      v.x += dx;
      v.y += dy;
      v.a += v.ai / v.w / 2;
      v.p.push({x:v.x,y:v.y,dx:dx,dy:dy});
      v.p.splice(0, v.p.length - v.l / 4);
      v.p.splice(0, v.p.length - 60 * 5);
      if(frame % 30 == 0) {
        v.ai = Math.random()-.5;
      }
      if ((v.w == 8 && frame % 30 == 15 && time > 8) || (v.w < 8 && v.w > 1 && Math.random() < v.l / 4096)) {
        vines.push({x:v.x,y:v.y,a:v.a,ai:v.ai,w:v.w/2,p:[],l:Math.min(v.l, 0|v.w*(1+Math.random())*32)});
      } 

    })
  }


    // render visuals
    b.style.backgroundColor = 'hsl(210,50%,' + (masterAmplitude * 40) + '%)';
    H = b.height = 512;
    W = b.width = 0 | H * innerWidth / innerHeight;
    c.translate(W/2,H/2);
    c.shadowBlur = 24;
    vines.forEach(v => {
      if (v.w == 8) {
        c.rotate(v.a);
        c.drawImage(img,frame*4&112,0,16,24, -8, 0, -16, -24 * masterAmplitude);
        c.rotate(-v.a);
        c.translate(-v.x,-v.y);
      }
      c.shadowColor = 
      c.strokeStyle = 'hsl('+(v.a*60|0)+',100%,'+(60+v.w*5|0)+'%)';
      c.beginPath();
      l = v.p.length - 1;
      for(i=l;p=v.p[i]; i-=8) {
        e=i/l*8;
        c.moveTo(p.x,p.y);
        c.lineTo(p.x-e*p.dx,p.y-e*p.dy);
      }
      c.stroke();
    })
  }
