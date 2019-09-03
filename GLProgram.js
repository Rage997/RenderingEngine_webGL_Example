var GLProgram = {}

GLProgram.compileShader = function(gl, type, source) {
    // create a WebGL shader
    var shader = gl.createShader(type);
    // add source code to the shader
    gl.shaderSource(shader, source);
    // compile the shader
    gl.compileShader(shader);
    // check if compilation was successful and return the shader
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    // if compilationn failed print compiler output into console
    console.log(type == gl.VERTEX_SHADER ? "Vertex shader error:" : "Fragment shader error:");
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

GLProgram.linkProgram = function(gl, vertexShader, fragmentShader) {
    // create a WebGL program
    var program = gl.createProgram();
    // attach vertex & fragment shader
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // link the program
    gl.linkProgram(program);
    // check if linking was successful and return the program
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    // if linking failed print the error into console
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

GLProgram.Create = function(gl, vertexShaderSource, fragmentShaderSource) {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = GLProgram.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = GLProgram.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // Link the two shaders into a program and return
    this.program = GLProgram.linkProgram(gl, vertexShader, fragmentShader);
    // add a variable to store program uniforms
    this.uniforms = {};
    // function to associated uniforms with WebGL locations
    this.GetUniforms = function(gl, nameList) {
        for (var i = 0; i < nameList.length; i++) {        
            // create a map of uniform name <-> location
            this.uniforms[nameList[i]] = gl.getUniformLocation(this.program, nameList[i]);
        }
    }

    return this;
}