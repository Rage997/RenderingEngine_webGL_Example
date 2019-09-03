var SKYBOX_FRAG_SOURCE = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision highp float;

in vec3 cube_map_coords;

uniform samplerCube ImageSampler;

layout(location=0) out vec4 fColor;

void main() {
    fColor = texture(ImageSampler, normalize(cube_map_coords));
}
`;