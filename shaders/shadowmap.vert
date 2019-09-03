var SHADOWMAP_VERT_SOURCE = `#version 300 es

// load in position, normal, and color
layout(location=0) in vec3 Position;


// set uniforms for model, view, projection, and normal matrix
uniform mat4 ModelMatrix;
uniform mat4 ViewMatrix;
uniform mat4 ProjectionMatrix;

// all shaders have a main function
void main() {
	gl_Position = ProjectionMatrix * ViewMatrix * ModelMatrix * vec4(Position, 1.0);
}
`;