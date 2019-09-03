GLModels = {}

function objects2vaos(gl, objects) {
    var vaos = new Array();
    for (let i = 0; i < objects.length; i++) {
        var parsed = readobj(objects[i]);
        vaos.push(new GLVertexArray.Create(gl, parsed[0], parsed[1], parsed[2], parsed[3], parsed[4], parsed[5]));
    }
    return vaos;
}

GLModels.LoadOBJs = function(gl, objects) {
  return objects2vaos(gl, objects);
}

GLModels.CreateCube = function(gl) {
    // create cube verticers make each face individually, it is needed for flat shading
    var vertices = [
         1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
    		 1, 1, 1,  1,-1, 1,  1,-1,-1,  1, 1,-1,
    		 1, 1, 1,  1, 1,-1, -1, 1,-1, -1, 1, 1,
    		-1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
    		-1,-1,-1,  1,-1,-1,  1,-1, 1, -1,-1, 1,
    		 1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1
    ];
    // create cube normals
    var normals = [
         0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
         1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
         0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
         0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1
    ];
    // create cube uvs
    var uvs = [
        1,1, 0,1, 0,0, 1,0,//back
        0,1, 0,0, 1,0, 1,1,//side
        1,0, 0,0, 0,1, 1,1,//top
        1,1, 0,1, 0,0, 1,0,//side2
        1,1, 0,1, 0,0, 1,0,//?
        0,0, 1,0, 1,1, 0,1//front
    ];
    // create cube tangents
    var tangents = [
         1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
         0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
         1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
         0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ];
    // create cube bitangents
    var bitangents = [
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
         0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
         0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0
    ];
    // create cube triangles
    var triangles = [
        0,1,2, 2,3,0,
        4,5,6, 6,7,4,
        8,9,10, 10,11,8,
        12,13,14, 14,15,12,
        16,17,18, 18,19,16,
        20,21,22, 22,23,20
    ];

    return new GLVertexArray.Create(gl, vertices, normals, uvs, tangents, bitangents, triangles);
}

GLModels.CreateTerrain = function(gl) {
    // create quad verticers make each face individually, it is needed for flat shading
    var vertices = [
         -1,0,-1, 1,0,-1, 1,0,1, -1,0,1
    ];
    // create quad normals
    var normals = [
         0,1,0, 0,1,0, 0,1,0, 0,1,0
    ];
    // create quad uvs
    var uvs = [
        0,0, 20,0, 20,20, 0,20
    ];
    // create quad tangents
    var tangents = [
         1,0,0, 1,0,0, 1,0,0, 1,0,0
    ];
    // create quad bitangents
    var bitangents = [
         0,0,1, 0,0,1, 0,0,1, 0,0,1
    ];
    // create quad triangles
    var triangles = [
        2,1,0, 0,3,2
    ];

    return new GLVertexArray.Create(gl, vertices, normals, uvs, tangents, bitangents, triangles);
}
