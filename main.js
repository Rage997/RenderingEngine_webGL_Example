"use strict";

function InitGL(canvasID) {
    // get canvas by ID
    var canvas = document.getElementById(canvasID);
    // get webgl context
    canvas.width = window.innerWidth / 1.3
    canvas.height = window.innerHeight / 1.3
    var gl = canvas.getContext("webgl2");
   
    // set webgl viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // set webgl depth test to less or equal
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // set backface culling to true
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // check if everything went ok
    if (gl) {
        return gl;
    }
    console.log("WebGL context failed to initialize");
}

function main(images) {
    // init WebGL
    var gl = InitGL("window");
    
    // load textures
    RenderingEngine.textures = [
        new GLTexture.CreateCubeMap(gl, [
            images[0],
            images[1],
            images[2],
            images[3],
            images[4],
            images[5]
        ]),
        new GLTexture.CreateTexture2D(gl, images[6], true),
        new GLTexture.CreateTexture2D(gl, images[7]),
        new GLTexture.CreateTexture2D(gl, images[8]),
        new GLTexture.CreateTexture2D(gl, images[9]),
        new GLTexture.CreateTexture2D(gl, images[10]),
        new GLTexture.CreateTexture2D(gl, images[11])


        
    ];
    // create our programs
    var skybox_program = new GLProgram.Create(gl, SKYBOX_VERT_SOURCE, SKYBOX_FRAG_SOURCE);
    // get uniforms for model, view, and projection matrix
    skybox_program.GetUniforms(gl, [
        "ModelMatrix",
        "ViewMatrix",
        "NormalMatrix",
        "ProjectionMatrix",
        "ImageSampler",
    ]);
    var blinnphong_program = new GLProgram.Create(gl, BLINNPHONG_VERT_SOURCE, BLINNPHONG_FRAG_SOURCE);
    // get uniforms for model, view, and projection matrix
    blinnphong_program.GetUniforms(gl, [
        "ModelMatrix",
        "ViewMatrix",
        "NormalMatrix",
        "ProjectionMatrix",
        "ImageSampler",
        "specular_color",
        "NormalSampler",
        "shininess",
        "Sun",
        "ambient_light",
        "reflection_fraction",
        "EnvironmentSampler",
        "ShadowSampler",
        "ShadowMatrix",
        "bias"
    ]);
    var shadowmap_program = new GLProgram.Create(gl, SHADOWMAP_VERT_SOURCE, SHADOWMAP_FRAG_SOURCE);
    // get uniforms for model, view, and projection matrix
    shadowmap_program.GetUniforms(gl, [
        "ModelMatrix",
        "ViewMatrix",
        "ProjectionMatrix"
    ]);
    // create shadowmap fbo
    RenderingEngine.shadowmap = new GLFrameBuffer.Create(gl, 512);
    // create skybox
    RenderingEngine.skybox = GLModels.CreateCube(gl);
    // create terrain
    RenderingEngine.terrain = GLModels.CreateTerrain(gl);
    // create 3 textured cubes
    // RenderingEngine.cube = GLModels.CreateCube(gl);
    // let rotations = [
    //   0.785398163,
    //   0,
    //   1.04719755
    // ];
    // let scales = [
    //   vec3.fromValues(15, 15, 15),
    //   vec3.fromValues(15, 15, 15),
    //   vec3.fromValues(15, 15, 15)
    // ];
    // let translations = [
    //   vec3.fromValues(-60,15,0),
    //   vec3.fromValues(-100,15,10),
    //   vec3.fromValues(-80,45,0)
    // ];
    // for (let i = 0; i < rotations.length; i++) {
    //   RenderingEngine.Mcs[i] = mat4.create();
    //   let S = mat4.create();
    //   mat4.fromScaling(S, scales[i]);
    //   let R = mat4.create();
    //   mat4.fromRotation(R, rotations[i], vec3.fromValues(0, 1, 0))
    //   let T = mat4.create();
    //   mat4.fromTranslation(T, translations[i]);
    //   mat4.multiply(RenderingEngine.Mcs[i], S, R);
    //   mat4.multiply(RenderingEngine.Mcs[i], T, RenderingEngine.Mcs[i]);
    // }
    // create sphere
    // RenderingEngine.planet = GLModels.LoadOBJs(gl, [SPHERE]);

    RenderingEngine.earth = GLModels.LoadOBJs(gl, [EARTH]);
    RenderingEngine.moon = GLModels.LoadOBJs(gl, [MOON]);
    RenderingEngine.iss = GLModels.LoadOBJs(gl, [ISS]);
    RenderingEngine.daedalus = GLModels.LoadOBJs(gl, [DAEDALUS]);
    RenderingEngine.sun = GLModels.LoadOBJs(gl, [SUN]);
    // setup renderer with webgl programs, and vaos
    RenderingEngine.programs = [
        blinnphong_program,
        skybox_program,
        shadowmap_program
    ];
    // start the rendering loop
    RenderingEngine.Render(gl, Date.now());
}

GLTexture.LoadImages([
    "textures/px.png",
    "textures/nx.png",
    "textures/py.png",
    "textures/ny.png",
    "textures/pz.png",
    "textures/nz.png",
   
    "textures/earth_bake_final.png",
    "textures/earth_normals.png",
    "textures/metal.jpg",
    "textures/normals_daedalus.png",
    "textures/moon_bake.jpg",
    "textures/sun_bake.png"
    
        ], main);
