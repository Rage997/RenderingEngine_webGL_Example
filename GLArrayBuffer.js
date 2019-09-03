var GLVertexArray = {}

GLVertexArray.BindBufferDataf = function(gl, attrib, data, elements) {
    // enable attribute for vao
    gl.enableVertexAttribArray(attrib);

    // create vbo to store our data
    var vbo = gl.createBuffer();
    // bind vbo for array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // add data to vbo
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    // set pointer to vbo
	gl.vertexAttribPointer(attrib, elements, gl.FLOAT, false, 0, 0);
    // unbind vbo
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

GLVertexArray.BindElement = function(gl, data) {
    // create vbo to store our data
    var element = gl.createBuffer();
    // bind for vbo element array buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, element);
    // add data to vbo
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), gl.STATIC_DRAW);
    // unbind vbo
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // return vbo
    return element;
}

GLVertexArray.Create = function(gl, vertices, normals, uvs, tangents, bitangents, tris) {
    // create vao and store id
    this.vao = gl.createVertexArray();
    // bind vao
    gl.bindVertexArray(this.vao);
    // add vertices to vao
    if (vertices != null) {
        GLVertexArray.BindBufferDataf(gl, 0, vertices, 3)
        // also store number of vertices for later
        this.vertices = vertices.length / 3;
    }
    // add normals to vao
    if (normals != null) {
        GLVertexArray.BindBufferDataf(gl, 1, normals, 3)
    }
    // add uvs to vao
    if (uvs != null) {
        GLVertexArray.BindBufferDataf(gl, 2, uvs, 2)
    }
    // add tangents to vao
    if (tangents != null) {
        GLVertexArray.BindBufferDataf(gl, 3, tangents, 3)
    }
    // add bitangents to vao
    if (bitangents != null) {
        GLVertexArray.BindBufferDataf(gl, 4, bitangents, 3)
    }
    // add triangles to vao
    if (tris != null) {
        // we should also store the buffer index for drawing
        this.element = GLVertexArray.BindElement(gl, tris);
        // also store number of triangles for later
        this.indices = tris.length;
    }
    // unbind vao
    gl.bindVertexArray(null);
    // add drawing function to our object
    this.Draw = function(gl) {
        // bind vao
        gl.bindVertexArray(this.vao);
        // bind for vbo element array buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.element);
        // draw triangles
        gl.drawElements(gl.TRIANGLES, this.indices, gl.UNSIGNED_INT, 0);
        // unbind vbo
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        // unbind vao
        gl.bindVertexArray(null);
    }

    return this;
}
