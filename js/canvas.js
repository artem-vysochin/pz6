function clear(argument) {
   // body...
}

function canvas(selector, options){
   const canvas = document.querySelector(selector);
   canvas.classList.add('canvas')
   canvas.setAttribute('width', `${options.width || 400}px`)
   canvas.setAttribute('height', `${options.height || 300}px`)


   // отримання контексту для малювання
   const context = canvas.getContext('2d')
  // отримуємо координати canvas відносно viewport
  const rect = canvas.getBoundingClientRect();

  let isPaint = false // чи активно малювання
  let points = [] //масив з точками

   // об’являємо функцію додавання точок в масив
   const addPoint = (x, y, dragging) => {
   // преобразуємо координати події кліка миші відносно canvas
   points.push({
    x: (x - rect.left),
    y: (y - rect.top),
    dragging: dragging
 })
}
const redraw = () => {
   //очищуємо  canvas
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);

   context.strokeStyle = options.strokeColor;
   context.lineJoin = "round";
   context.lineWidth = options.strokeWidth;
   let prevPoint = null;
   for (let point of points){
     context.beginPath();
     if (point.dragging && prevPoint){
       context.moveTo(prevPoint.x, prevPoint.y)
    } else {
       context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y)
    context.closePath()
    context.stroke();
    prevPoint = point;
 }
}

    // функції обробники подій миші
    const mouseDown = event => {
      isPaint = true
      addPoint(event.pageX, event.pageY);
      redraw();
   }

   const mouseMove = event => {
      if(isPaint){
        addPoint(event.pageX, event.pageY, true);
        redraw();
     }
  }

// додаємо обробку подій
canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup',() => {
   isPaint = false;
});
canvas.addEventListener('mouseleave',() => {
   isPaint = false;
});

// TOOLBAR
const toolBar = document.getElementById('toolbar')
// clear button
const clearBtn = document.createElement('button')

clearBtn.classList.add('btn')
clearBtn.textContent = 'Clear'

clearBtn.addEventListener('click', () => {
   // points.clearRect 
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
   points = [] 
})
toolBar.insertAdjacentElement('afterbegin', clearBtn)

const saveBtn = document.getElementById('save')

saveBtn.addEventListener('click', () => {
 const dataUrl = canvas.toDataURL("image/new.png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
 const newTab = window.open('about:blank','image from canvas');
 newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
})

const timeBtn = document.getElementById('time1')

timeBtn.addEventListener('click', () => {

   time = new Date() 
   context.font = "22px Veranda";
   context.fillText(time.toLocaleTimeString(), 0, 20);
})

var theInput = document.getElementById("color-picker"); 

theInput.addEventListener("input", () => {
   var theColor = theInput.value; 
   options.strokeColor = theColor
   console.log( options.strokeColor)   

});

var txt = document.getElementById("brush"); 

txt.addEventListener("input", () => {
   var theBrush = txt.value; 
   options.strokeWidth = theBrush
   console.log( options.st)   

});


var img1 = document.getElementById("img"); 

img1.addEventListener("input", () => {
  const img = new Image();
  img.src =img1.value;
  img.onload = () => {
   context.drawImage(img, 0, 0);
}  
}); 

const localStr = document.getElementById("cntx"); 

localStr.addEventListener("click", () => { 
  localStorage.setItem('points', JSON.stringify(points)); 
})

const restore = document.getElementById("restore"); 

  restore.addEventListener("click", () => { 
  points = JSON.parse( localStorage.getItem('points')); 
  redraw(); 
})

  

}



