// canvas related stuff
var canvas=document.getElementById("myCanvas");
var ctx=canvas.getContext("2d");
ctx.strokeStyle = '#f00';  // some color/style
ctx.lineWidth = 2;         // thickness
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
ctx.fillStyle = "#A0DCE5";
$myCanvas=$('#myCanvas');

//drag
var isDragging = false;
var startX;
var startY;

//array of image objects
var images=[];
var NUM_IMAGES=0;

var origin_image;
gridSize = 7;
origin_image_width = 500;
origin_image_height = 500;

// queue up 4 test images
function add() {
    for (var i = 0; i < gridSize * gridSize; i++) {
        var xpos = (origin_image_width / gridSize) * (i % gridSize);
        var ypos = (origin_image_height / gridSize) * Math.floor(i / gridSize);
        var patch_width = origin_image_width / gridSize;
        var patch_height = origin_image_height / gridSize;

        var real_width = 400;
        var real_height = 400;

        var sx = (real_width / gridSize) * (i % gridSize);
        var sy = (real_width / gridSize) * Math.floor(i / gridSize);
        var swidth = real_width / gridSize;
        var sheight = real_height / gridSize;

        addImage(sx, sy, swidth, sheight ,xpos,ypos,patch_width, patch_height, 'static/images/london-bridge.jpg');
    }
}
// addImage(0, 0, 0, 0 ,20,0.50,100, 100, 'static/images/london-bridge.jpg');
// addImage(0, 0, 0, 0, 240,20,100, 100, 'static/images/london-bridge.jpg');
// addImage(0, 0, 0, 0, 20,220,100, 100, 'static/images/london-bridge.jpg');
// addImage(0, 0, 0, 0, 240,220,100, 100, 'static/images/london-bridge.jpg');
add();
addOriginImage(500,0,500, 500, 'static/images/london-bridge.jpg');

// trigger all images to load
for(var i=0;i<images.length;i++){
  images[i].image.src=images[i].url;
}


//////////////////////////////
// functions
//////////////////////////////

// queue up another image
function addOriginImage(x,y,width, height, imgURL){
  var img=new Image();
  img.crossOrigin='anonymous';
  img.onload=origin_onload;
  origin_image = {image:img,x:x,y:y,width:width,height:height, isDragging:false,url:imgURL};
  origin_image.image.src=origin_image.url;
}

function origin_onload(){
  renderAll();
}

function addImage(sx, sy, swidth, sheight, x, y, width, height, imgURL){
  var img=new Image();
  img.crossOrigin='anonymous';
  img.onload=startInteraction;
  images.push({image:img,x:x,y:y,width:width,height:height, sx:sx, sy:sy, swidth:swidth, sheight:sheight,isDragging:false,url:imgURL});
  NUM_IMAGES++;
}

// called after each image fully loads
function startInteraction() {

  // return until all images are loaded
  if(--NUM_IMAGES>0){return;}

  // set all images width/height
  // for(var i=0;i<images.length;i++){
  //   var img=images[i];
  //   img.width=img.image.width*img.scale;
  //   img.height=img.image.height*img.scale;
  // }

  // render all images
  renderAll();

  // listen for mouse events
  $myCanvas.mousedown(onMouseDown);
  $myCanvas.mouseup(onMouseUp);
  $myCanvas.mouseout(onMouseUp);
  $myCanvas.mousemove(onMouseMove);

}

// flood fill canvas and
// redraw all images in their assigned positions
function renderAll() {
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.drawImage(origin_image.image, origin_image.x, origin_image.y, origin_image.width, origin_image.height)
  for(var i=0;i<images.length;i++){
    var r=images[i];
    ctx.drawImage(r.image,r.sx,r.sy,r.swidth,r.sheight,r.x,r.y,r.width,r.height);
    ctx.strokeRect(r.x,r.y,r.width,r.height);
  }

}

// handle mousedown events
function onMouseDown(e){

  // tell browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  //get current position
  var mx=parseInt(e.clientX-$myCanvas.offset().left);
  var my=parseInt(e.clientY-$myCanvas.offset().top);

  //test to see if mouse is in 1+ images
  isDragging = false;
  for(var i=0;i<images.length;i++){
    var r=images[i];
    if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height){
      //if true set r.isDragging=true
      r.isDragging=true;
      isDragging=true;
    }
  }
  //save mouse position
  startX=mx;
  startY=my;
}

// handle mouseup and mouseout events
function onMouseUp(e){
  //tell browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  // clear all the dragging flags
  isDragging = false;
  for(var i=0;i<images.length;i++){
    images[i].isDragging=false;
  }
}

// handle mousemove events
function onMouseMove(e){

  // do nothing if we're not dragging
  if(!isDragging){return;}

  //tell browser we're handling this mouse event
  e.preventDefault
  e.stopPropagation

  //get current mouseposition
  var mx = parseInt(e.clientX-$myCanvas.offset().left);
  var my = parseInt(e.clientY-$myCanvas.offset().top);

  //calculate how far the mouse has moved;
  var dx = mx - startX;
  var dy = my - startY;

  //move each image by how far the mouse moved
  for(var i=0;i<images.length;i++){
    var r=images[i];
    if(r.isDragging){
      r.x+=dx;
      r.y+=dy;
    }
  }

  //reset the mouse positions for next mouse move;
  startX = mx;
  startY = my;

  //re render the images
  renderAll();

}