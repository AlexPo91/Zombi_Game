let controller = {
  left: false,
  right: false,
  up: false,
  shot: false,
  isKey: function (e) {
    e = e || window.event;
    let pressed = e.type === "keydown" ? true : false;
    switch (e.keyCode) {
      case 37:
        controller.left = pressed;
        break;
      case 39:
        controller.right = pressed;
        break;
      case 38:
        controller.up = pressed;
        break;
      case 32:
        controller.shot = pressed;
        break;
      default:
        break;
    }
  },
  isTouch: function (e) {
    e = e || window.event;
    let pressed = e.type === "touchstart" ? true : false;
    if (e.target.classList.contains("btn-left")) {
      controller.left = pressed;
    }
    if (e.target.classList.contains("btn-right")) {
      controller.right = pressed;
    }
    if (e.target.classList.contains("btn-shot")) {
      controller.shot = pressed;
    }
    if (e.target.tagName === "CANVAS") {
      controller.up = pressed;
    }
  },
  isMouse: function (e) {
    e = e || window.event;
    let pressed = e.type === "mousedown" ? true : false;
    switch (e.button) {
      case 0:
        controller.up = pressed;
        break;
      case 2:
        controller.shot = pressed;
      default:
        break;
    }
  },
};
function addListener(){
  window.addEventListener("keydown", controller.isKey);
  window.addEventListener("keyup", controller.isKey);
  window.addEventListener("touchstart", controller.isTouch);
  window.addEventListener("touchend", controller.isTouch);
  canvas.addEventListener("mousedown", controller.isMouse);
  canvas.addEventListener("mouseup", controller.isMouse);
  canvas.addEventListener("contextmenu", function(e){
    e.preventDefault()
  });
}
function removeListeners(){
  window.removeEventListener("keydown", controller.isKey);
  window.removeEventListener("keyup", controller.isKey);
  window.removeEventListener("touchstart", controller.isTouch);
  window.removeEventListener("touchend", controller.isTouch);
  canvas.removeEventListener("mousedown", controller.isMouse);
  canvas.removeEventListener("mouseup", controller.isMouse);
}
