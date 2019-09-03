var SHADOWMAP_FRAG_SOURCE = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision highp float;


layout(location=0) out vec4 fColor;

void main() {
    fColor = vec4(gl_FragCoord.z);
}
`;