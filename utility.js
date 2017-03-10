var fragSource1;
var fragSource2;
var vertSource1;
var vertSource2;

function getShaders() {
  return new Promise(function(resolve, reject){

    // barrier for catching async loading of shaders :)
    var barrier = {
      limit: 2,
      current: 0,
      hit: function() {
        this.current += 1;
        if (this.current >= this.limit) {
          this.breach();
        }
      },
      breach: function() {
        resolve();
      },
      init: function() {
        return this;
      }
    }.init();

    // fetch shaders

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "shaders/shader1.frag");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        fragSource1 = this.responseText;
        barrier.hit();
      }
    };
    xhr.send();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "shaders/shader2.frag");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        fragSource2 = this.responseText;
        barrier.hit();
      }
    };
    xhr.send();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "shaders/shader1.vert");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        vertSource1 = this.responseText;
        barrier.hit();
      }
    };
    xhr.send();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "shaders/shader2.vert");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        vertSource2 = this.responseText;
        barrier.hit();
      }
    };
    xhr.send();

    sendShaderGet("shader1.frag").then(barrier.hit);
    sendShaderGet("shader2.frag").then(barrier.hit);
    sendShaderGet("shader1.vert").then(barrier.hit);
    sendShaderGet("shader2.vert").then(barrier.hit);
  });
}

function sendShaderGet( shaderName ){
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "shaders/" + shaderName);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(this.responseText);
      }
    };
    xhr.send();
  });
}
