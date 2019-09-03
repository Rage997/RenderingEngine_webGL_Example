var RenderingEngine = {}

RenderingEngine.programs = null;
RenderingEngine.textures = null;
RenderingEngine.skybox = null;
RenderingEngine.terrain = null;
RenderingEngine.earth = null
RenderingEngine.moon = null
RenderingEngine.daedalus = null
RenderingEngine.shadowmap = null;

RenderingEngine.eye = vec3.fromValues(-400, 100, -200);
RenderingEngine.center_idx = 0;
RenderingEngine.CameraNames = ["Scene center",  "Daedalus", "Earth"]
RenderingEngine.centers = [vec3.fromValues(-80,30,0), vec3.fromValues(-150, 0, -100), vec3.fromValues(200, 0, 20)];

RenderingEngine.amplitude = 1
RenderingEngine.up = vec3.fromValues(0,1,0);
RenderingEngine.Sun = vec3.fromValues(-200, 200, -400);
RenderingEngine.sunLook = vec3.fromValues(-80,30,0);
RenderingEngine.angle = 0;
RenderingEngine.frequency = 5;
RenderingEngine.timer = 0;
RenderingEngine.knotsEye = [
    0,
    6000,
    12000,
    18000,
    28000,
];
RenderingEngine.valuesEye = [
    vec3.fromValues(-300, 70, -300),
    vec3.fromValues(300, 70, -300),
    vec3.fromValues(300, 70, 300),
    vec3.fromValues(-300, 70, 300),
    vec3.fromValues(-300, 70, -300),
];

RenderingEngine.knotsSun = [
    0,
    5000,
    10000,
    15000,
    20000
];
RenderingEngine.valuesSun = [
    vec3.fromValues(1, 2, -4),
    vec3.fromValues(-1, 4, -4),
    vec3.fromValues(-2, 5, -2),
    vec3.fromValues(-1, 4, -4),
    vec3.fromValues(1, 2, -4),
];
RenderingEngine.valuessun = [
    vec3.fromValues(100, 200, -400),
    vec3.fromValues(-100, 300, -400),
    vec3.fromValues(-200, 400, -200),
    vec3.fromValues(-100, 300, -400),
    vec3.fromValues(100, 200, -400),
];

function NormalMatrix(V, M) {
  var VM = mat4.create();
  mat4.multiply(VM, V, M);
  var N = mat3.create();
  mat3.normalFromMat4(N, VM);
  return N;
}

RenderingEngine.DrawSkybox = function(gl, M, V, P) {
    //setup normal matrix
    let N = NormalMatrix(V, M);

    let program = this.programs[1];
    gl.useProgram(program.program);
    // set view and projection matrix
    gl.uniformMatrix4fv(program.uniforms["ModelMatrix"], false, M);
    gl.uniformMatrix4fv(program.uniforms["ViewMatrix"], false, V);
    gl.uniformMatrix3fv(program.uniforms["NormalMatrix"], false, N);
    gl.uniformMatrix4fv(program.uniforms["ProjectionMatrix"], false, P);
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    this.textures[0].Bind(gl);
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(program.uniforms["ImageSampler"], 0);
    // draw the skybox
    this.skybox.Draw(gl);
}
RenderingEngine.DrawBlinnPhong = function(gl, M, V, P, S, models, params) {
    //setup normal matrix
    let N = NormalMatrix(V, M);

    // checkboxes
    let ambient_light = document.getElementById('ambient_check');
    let ambient_value = 1;
    if(ambient_light.checked === false){
        ambient_value = 0;
    }
    let diffuse_light = document.getElementById('diffuse_check');
    let diffuse_value = 1;
    if(diffuse_light.checked === false){
        diffuse_value = 0;
    }
    let specular_light = document.getElementById('specular_check');
    let specular_value = 1;
    if(specular_light.checked === false){
        specular_value = 0;
    }

    let program = this.programs[0];
    gl.useProgram(program.program);
    // set view and projection matrix
    gl.uniformMatrix4fv(program.uniforms["ModelMatrix"], false, M);
    gl.uniformMatrix4fv(program.uniforms["ViewMatrix"], false, V);
    gl.uniformMatrix3fv(program.uniforms["NormalMatrix"], false, N);
    gl.uniformMatrix4fv(program.uniforms["ProjectionMatrix"], false, P);
    gl.uniformMatrix4fv(program.uniforms["ShadowMatrix"], false, S);
    // set light position
    gl.uniform3fv(program.uniforms["Sun"], this.Sun);
    gl.uniform1f(program.uniforms["ambient_light"], params[0] * ambient_value);
    // set color
    gl.activeTexture(gl.TEXTURE0);
    params[1].Bind(gl);
    gl.uniform1i(program.uniforms["ImageSampler"], 0);
    gl.activeTexture(gl.TEXTURE1);
    params[2].Bind(gl);
    gl.uniform1i(program.uniforms["NormalSampler"], 1);
    gl.activeTexture(gl.TEXTURE2);
    this.textures[0].Bind(gl);
    gl.uniform1i(program.uniforms["EnvironmentSampler"], 2);
    gl.uniform1i(program.uniforms["ShadowSampler"], 3);
    gl.uniform3fv(program.uniforms["specular_color"], params[3]);
    gl.uniform1f(program.uniforms["shininess"], params[4]);
    gl.uniform1f(program.uniforms["reflection_fraction"], params[5]);
    gl.uniform1f(program.uniforms["bias"], params[6]);
    // draw the car
    for (let i = 0; i < models.length; i++) {
        models[i].Draw(gl);
    }
}

RenderingEngine.DrawShadowmap = function(gl, Ms, models) {
    this.shadowmap.Bind(gl);
    gl.viewport(0, 0, this.shadowmap.size, this.shadowmap.size);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var Pd = mat4.create();
    var sdist = 120;
    mat4.ortho(Pd, -sdist, sdist, -sdist, sdist, 10, 1500);
    var Vd = mat4.create();
    mat4.lookAt(Vd, this.Sun, this.sunLook, this.up);

    var depthMVP = mat4.create();
    mat4.multiply(depthMVP, Pd, Vd);

    gl.useProgram(this.programs[2].program);
    gl.uniformMatrix4fv(this.programs[2].uniforms["ViewMatrix"], false, Vd);
    gl.uniformMatrix4fv(this.programs[2].uniforms["ProjectionMatrix"], false, Pd);
    for (let i = 0; i < Ms.length; i++) {
        gl.uniformMatrix4fv(this.programs[2].uniforms["ModelMatrix"], false, Ms[i]);
        for (let j = 0; j < models[i].length; j++) {
            var shadow_check = document.getElementById("shadow_check");

            if(shadow_check.checked == true){
            models[i][j].Draw(gl);
            }
        }
    }

    this.shadowmap.Unbind(gl);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.activeTexture(gl.TEXTURE3);
    this.shadowmap.depth.Bind(gl);
    return depthMVP;
}

RenderingEngine.Render = function(gl, previous) {
    // get ellapsed time in miliseconds
    var current = Date.now();
    var millis = current - previous;
    this.timer += millis;
    // animete camera and sun
    // this.eye = InterpolateVectorsCubic(this.knotsEye, this.valuesEye, this.timer, true);
    this.Sun = InterpolateVectorsCubic(this.knotsSun, this.valuessun, this.timer, true);
    // this.sun = InterpolateVectorsCubic(this.knotsSun, this.valuessun, this.timer, true);
    // create projection matrix
    var P = mat4.create();
    mat4.perspective(P, 40*0.0174532925, 1280/720, 0.1, 1000);
    // create view matrix
    var V = mat4.create();
    let camera_rotation = document.getElementById("camera_rotation");
    let camera_y = document.getElementById("camera_y");
    let camera_distance = document.getElementById("camera_distance");
    
    let change_btn = document.getElementById("change_btn")
    change_btn.onclick = ()=>{
        this.center_idx += 1
        if( this.center_idx >= this.centers.length){
            this.center_idx = 0}
        change_btn.innerHTML = RenderingEngine.CameraNames[this.center_idx] 
        }
        
    let radius_camera = camera_distance.value * 5 ;
    this.eye = vec3.fromValues(radius_camera*Math.sin(camera_rotation.value/10), 5*(camera_y.value) ,radius_camera*Math.cos(camera_rotation.value/10));
    // this.center = 5*(camera_y.value)/100,radius*Math.cos(camera_rotation.value);
    // this.up = vec3.fromValues(0,0.5,0), vec3.fromValues(0,1,0);
    
    mat4.lookAt(V, this.eye, this.centers[this.center_idx], this.up);
    // create skybox model matrix
    var S = mat4.create();
    var scaling = vec3.fromValues(500,400,500);
    mat4.fromScaling(S, scaling);
    var T = mat4.create();
    var translation = vec3.fromValues(0,0,0);
    mat4.fromTranslation(T, translation);
    mat4.multiply(S, T, S);
    


    // Earth model matrix
    let M_planet = mat4.create();
    var S_planet = mat4.create()
    var R_planet = mat4.create()
    var T_planet = mat4.create()
    // var T_planet_back = mat4.create()

    mat4.fromScaling(S_planet, vec3.fromValues(5, 5, 5));
    mat4.fromTranslation(T_planet, vec3.fromValues(200, 0, 20))
    mat4.fromRotation(R_planet, -5.4, vec3.fromValues(0,1,0))
    mat4.multiply(M_planet, M_planet, T_planet);    
    mat4.multiply(M_planet, M_planet,R_planet);
    mat4.multiply(M_planet, M_planet,S_planet);

    // Moon model matrix
    let M_moon = mat4.create();
    var S_moon = mat4.create()
    var R_moon = mat4.create()
    var T_moon = mat4.create()
    // var T_moon_back = mat4.create()

    this.amplitude += 0.01
    mat4.fromScaling(S_moon, vec3.fromValues(5, 5, 5));
    let radius_moon = 70
    mat4.fromTranslation(T_moon, vec3.fromValues(-radius_moon, 0,0))
    mat4.fromRotation(R_moon, this.amplitude, vec3.fromValues(0,1,0.3))
    // mat4.fromTranslation(T_moon_back, vec3.fromValues(radius_moon, 0, 0))

    mat4.multiply(M_moon, M_moon, T_planet);
    mat4.multiply(M_moon, M_moon, R_moon);
    mat4.multiply(M_moon,M_moon, T_moon);
    mat4.multiply(M_moon, M_moon,S_moon);


    // Daedalus model matrix
    let M_daedalus = mat4.create();
    var S_daedalus = mat4.create()
    var R_daedalus = mat4.create()
    var T_daedalus = mat4.create()
    // var T_daedalus_back = mat4.create()

    mat4.fromScaling(S_daedalus, vec3.fromValues(4, 4, 4));
    mat4.fromTranslation(T_daedalus, vec3.fromValues(-10, 0, -50))
    mat4.fromRotation(R_daedalus, 90, vec3.fromValues(0,1,0))

    // mat4.fromTranslation(T_daedalus_back, vec3.fromValues(0, 0, 0))

    mat4.multiply(M_daedalus, M_daedalus, T_daedalus);
    mat4.multiply(M_daedalus, M_daedalus,S_daedalus);
    mat4.multiply(M_daedalus, M_daedalus, R_daedalus);

    let M_sun = mat4.create()
    let T_sun = mat4.create()
    let S_sun = mat4.create()
    let R_sun = mat4.create()

    mat4.fromTranslation(T_sun, vec3.fromValues(-10, 5, -10))
    mat4.fromScaling(S_sun, vec3.fromValues(20, 20, 20));

    mat4.multiply(M_sun, M_sun, S_sun);
    mat4.multiply(M_sun, M_sun, T_sun);

    var depthMVP = this.DrawShadowmap(gl, [M_planet, M_moon, M_daedalus], [
        this.earth, this.moon, this.daedalus
    ]);

    // clear color to background
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // render skybox
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this.DrawSkybox(gl, S, V, P);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // Draw PLANET
    this.DrawBlinnPhong(gl, M_planet, V, P, depthMVP, this.earth,
        [
            1,
            this.textures[1],
            this.textures[2],
            vec3.fromValues(1, 1, 1),
            50,
            0,
            1
        ]
        )
    this.DrawBlinnPhong(gl, M_sun, V, P, depthMVP, this.sun,
        [
            0.4,
            this.textures[6],
            this.textures[2],
            vec3.fromValues(1, 1, 1),
            50,
            0,
            1
        ]
        )

    // Draw MOON
    this.DrawBlinnPhong(gl, M_moon, V, P,depthMVP, this.moon,
        [
            0.7,
            this.textures[5],
            this.textures[2],
            vec3.fromValues(1, 1, 1),
            50,
            0,
            1
        ]
        )

    this.DrawBlinnPhong(gl, M_daedalus, V, P,depthMVP , this.daedalus,
        [
            0.4,
            this.textures[3],
            this.textures[4],
            vec3.fromValues(1, 1, 1),
            50,
            0.2,
            1
        ]
    )    

    // repeat the rendering after a delay
    var _this = this;
    window.requestAnimationFrame(function() {_this.Render(gl, current);});
}
