var fragSource1;
var fragSource2;
var vertSource1;
var vertSource2;

function getShaders() {
  return new Promise(function(resolve, reject){

    // barrier for catching async loading of shaders :)
    var barrier = {
      limit: 4,
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
    sendShaderGet("1.frag").then(function(value) {
      fragSource1 = value;
      barrier.hit();
    });
    sendShaderGet("2.frag").then(function(value) {
      fragSource2 = value;
      barrier.hit();
    });
    sendShaderGet("1.vert").then(function(value) {
      vertSource1 = value;
      barrier.hit();
    });
    sendShaderGet("2.vert").then(function(value) {
      vertSource2 = value;
      barrier.hit();
    });
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

var getShader = function(shaderSource, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	console.log("JS:Shader compile failed");
	console.log(gl.getShaderInfoLog(shader));
	return null;
  }
  return shader;
}
