var c = $('.c')[0],
    ctx = c.getContext("2d"),
    cw = 0,
    ch = 0,
    hue = 180,
    img = new Image(),
    img2 = new Image(),
    nCubes = 0,
    cubes = [],
    Cube = function(index, _x, _y, _s){ //console.log(_x,_y)
      this.img = img;
      this.img2 = img2;
      this.scale = _s;
      this.x = _x;
      this.y = _y;
      this.z = this.img2_opacity = 0;
      this.draw = function(){
        ctx.translate(this.x, this.y + this.z);
        ctx.drawImage(this.img, -100 / 2 * this.scale, -200 / 2 * this.scale, 100 * this.scale, 200 * this.scale);
        ctx.globalAlpha = this.img2_opacity;
        ctx.drawImage(this.img2, -100 / 2 * this.scale, -200 / 2 * this.scale, 100 * this.scale, 200 * this.scale);
        ctx.globalAlpha = 1;
        ctx.translate(-this.x, -(this.y + this.z));
      }
      this.draw();
    };

img.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAADIBAMAAADsElnyAAAAJFBMVEVHcEw+Pj5aWloQEBAZGRleXl6AgIDAwMBwcHCampq7u7tzc3M0sGdFAAAABXRSTlMAp/UwQ5FLsO8AAADxSURBVHgB7c9HcQRhDITRn8NgMABDWAjO6ewMYLgsWef8akelk1Pr/upTj023mkZxiK3dqSsODnpmdXBwUBlEaRCYckdtEKVBYModmKbQKDrGHZpaaPyqZxQaRc8oNPVyTaehUVRGURhFYerlmu2D5k3jqimO1+MCU4h5XFzc9sQjaXTO1vMTobMkXgmdBfFKNnTY8UroLIp3YkfxldBhB4QOAkIHAaHDDggdBIQOX0HoICB0EBA6CAgdlkPoICB0+ApCBwGhw1cQOggIBgHh5pCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQH0XuAS5hV4q0a3iHAAAAAElFTkSuQmCC';

img2.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAADIBAMAAADsElnyAAAAJFBMVEVHcEylpaXv7+/Gxsa+vr7m5uahoaE/Pz9/f3+Ojo5lZWWCgoKkaSxxAAAABnRSTlMA9TCcskPTdr2ZAAAA40lEQVR4Ae3POW0EQQBE0UZhBEawWBaAzz0QDIVhYgxmZ3X6pFZpIl/18xf8sep8GinFwzMmi8sFk8TlctFkockiGz80WWiyyMYPTRbZKLLxIxtFMIoVwCCSUQSTRDaeZ3POAKPIRpGNIhvPs3m8HOw0Pg+K+8fYo0FsY48GMUkyiEmSQUySDGKSZBCTJIOYZG0QkIVBQDQKydogIBqFRKOQaBSQYBAQDAKCQQSCUUg0CAhmLSAYhUSDgCwMIpFpFJnsW0lJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUnJjyJfg4PNmR1hT+AAAAAASUVORK5CYII=';
img.onload = window.onresize = setGrid;

function setGrid(){ //console.log('set grid')
  
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  cw = Math.ceil(c.width/100+1);
  ch = Math.floor(c.height/25+10);

  cubes = [];
  
  for (var i=_y=0; _y<ch; _y++) {
    for (var _x=0; _x<cw; _x++) { //console.log(_y%2==0)
      if (_y%2==0) cubes.push( new Cube(i, -25+_x*100, -75+_y*25, 0.9) );
      else cubes.push( new Cube(i, 25+_x*100, -75+_y*25, 0.9) );
      i++;
    }
  }

  nCubes = cubes.length; //console.log(nCubes)
}

var staggerAnim;
function anim() {
  staggerAnim = gsap.timeline({ onComplete: anim })
                    .add(staggerFrom(gsap.utils.random(0,nCubes,1)))
};

function staggerFrom(from) {
  return gsap.timeline()
    .to(cubes, {
      duration: 1,
      z: 125,      
      ease: 'back.in(3)',
      stagger: {
        yoyo: true,
        amount: 2.5,
        grid: [ch, cw],
        overwrite: 'auto',
        from: from,        
        onComplete: function() { // Like reverse: 1 but make sure to reach a z of 0
          gsap.to(this.targets(), {
            duration: 1,
            z: 0,
            ease: 'back.out(3)'
          });
        }
      }
    }, 0)
    .to(cubes, {
      duration: 0.6,
      img2_opacity:1,
      stagger: {
        yoyo: true,
        amount: 2.5,
        grid: [ch, cw],
        overwrite: 'auto',
        from: from,        
        onComplete: function() {
          gsap.to(this.targets(), {
            duration: 0.6,
            img2_opacity: 0
          });
        }
      }
    }, 0)
}
gsap.delayedCall(0.2, anim);

$('.c').on('click', function(e) {
  staggerAnim.eventCallback('onComplete', null);

  // An approximation that works okay
  var gridX = Math.floor((e.layerX - (e.layerX / c.width * 2 - 1) * 20 - e.layerX / c.width * 75) / c.width * cw);
  var gridY = Math.floor((e.layerY - (e.layerY / c.height * 2 - 1) * 75 + 40) / c.height * ch);
  var i = cw * gridY + gridX;

  staggerFrom(i); //console.log(gridX, gridY, i);
});



gsap.ticker.add(()=>{ //update on each tick
  
  ctx.clearRect(0,0,c.width,c.height);

  ctx.globalCompositeOperation='source-over';
  for (var i=0; i<nCubes; i++) cubes[i].draw();

  hue-=0.5;
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle = 'hsl('+hue+', 75%, 25%)';
  ctx.fillRect(0, 0, c.width, c.height);

});