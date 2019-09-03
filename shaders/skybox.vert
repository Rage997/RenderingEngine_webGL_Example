var SKYBOX_VERT_SOURCE = `#version 300 es

// load in position, normal, and color
layout(location=0) in vec3 Position;
layout(location=1) in vec3 Normal;
layout(location=2) in vec2 UVs;

// set uniforms for model, view, projection, and normal matrix
uniform mat4 ModelMatrix;
uniform mat4 ViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 ProjectionMatrix;

// we want to pass vertex, normal and color information to fragment shader in camera (eye) space
out vec3 cube_map_coords;

// all shaders have a main function
void main() {
    // compute output in eye space
    vec4 vert = ModelMatrix * vec4(Position, 1);
    cube_map_coords = Position;
    // gl_Position is a special variable a vertex shader is responsible for setting
    gl_Position = ProjectionMatrix * mat4(mat3(ViewMatrix)) * vert;
}
`;
