var BLINNPHONG_VERT_SOURCE = `#version 300 es

// load in position, normal, and color
layout(location=0) in vec3 Position;
layout(location=1) in vec3 Normal;
layout(location=2) in vec2 UVs;
layout(location=3) in vec3 Tangent;
layout(location=4) in vec3 Bitangent;

// set uniforms for model, view, projection, and normal matrix
uniform mat4 ModelMatrix;
uniform mat4 ViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 ShadowMatrix;

// set sun direction as a vector in global coordinates
uniform vec3 Sun;

// we want to pass vertex, normal and color information to fragment shader in camera (eye) space
out vec4 vertex_eye;
out vec4 normal_eye;
out vec4 light_eye;
out vec3 tangent_eye;
out vec3 bitangent_eye;
out vec2 uvs;
out vec4 shadowCoord;

// all shaders have a main function
void main() {
    // compute output in eye space
    vec4 vert = ModelMatrix * vec4(Position, 1);
    vec4 vert_eye = ViewMatrix * vert;
    normal_eye = vec4(NormalMatrix * Normal, 0);
    light_eye = ViewMatrix*vec4(Sun, 0);
    vertex_eye = vec4(0, 0, 0, 1) - vert_eye;
    tangent_eye = NormalMatrix * Tangent;
    bitangent_eye = NormalMatrix * Bitangent;
    uvs = UVs;
    // shadows
    shadowCoord = ShadowMatrix * vert;
  	shadowCoord /= shadowCoord.w;
  	shadowCoord.xyz = shadowCoord.xyz*0.5 + 0.5;
    // gl_Position is a special variable a vertex shader is responsible for setting
    gl_Position = ProjectionMatrix * vert_eye;
}
`;
