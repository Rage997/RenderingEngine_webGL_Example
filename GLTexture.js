GLTexture = {};

function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

GLTexture.LoadImages = function(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;

  // Called each time an image finished loading.
  var onImageLoad = function() {
    imagesToLoad--;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      callback(images);
    }
  };

  for (let i = 0; i < imagesToLoad; i++) {
    var image = loadImage(urls[i], onImageLoad);
    images.push(image);
  }
}

GLTexture.CreateDepthTexture = function(gl, width, height) {
    // Create a texture.
    this.texture = gl.createTexture();
    this.Bind = function(gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    this.Unbind = function(gl) {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // setup texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    // https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    return this;
}

GLTexture.CreateTexture2D = function(gl, image, mipmap = false) {
    let ext = gl.getExtension("EXT_texture_filter_anisotropic");
    // Create a texture.
    this.texture = gl.createTexture();
    this.Bind = function(gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    this.Unbind = function(gl) {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // setup texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // Asynchronously load an image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    if (mipmap) {
        gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    return this;
}

GLTexture.CreateCubeMap = function(gl, images) {
    // Create a texture.
    this.texture = gl.createTexture();
    this.Bind = function(gl) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    }
    this.Unbind = function(gl) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    // set texture parameters
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // get all cubemap textures
    var textures = [
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];
    // load each texture file
    for (let i = 0; i < 6; i++) {
        // Fill the texture with a 1x1 pink pixel.
        gl.texImage2D(textures[i], 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, images[i]);
    }

    return this;
}
