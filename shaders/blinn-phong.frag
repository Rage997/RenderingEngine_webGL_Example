var BLINNPHONG_FRAG_SOURCE = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision highp float;
precision highp sampler2DShadow;

in vec4 vertex_eye;
in vec4 normal_eye;
in vec4 light_eye;
in vec3 tangent_eye;
in vec3 bitangent_eye;
in vec2 uvs;
in vec4 shadowCoord;

uniform float ambient_light;
uniform vec3 specular_color;
uniform float shininess;
uniform float reflection_fraction;
uniform float bias;

uniform mat4 ViewMatrix;

const float gamma = 2.2;

uniform sampler2D ImageSampler;
uniform sampler2D NormalSampler;
uniform sampler2DShadow ShadowSampler;
uniform samplerCube EnvironmentSampler;

layout(location=0) out vec4 fColor;

void main() {
    //shadow visibility
    float visibility = texture(ShadowSampler, shadowCoord.xyz + vec3(0.0, 0.0, -bias));
    // normalize v ectors for light calculation
    vec4 V = normalize(vertex_eye);
   	vec4 L = normalize(light_eye);
   	vec4 N = normalize(normal_eye);
   	vec4 No = normalize(normal_eye);
   	vec3 T = normalize(tangent_eye);
   	vec3 B = normalize(bitangent_eye);
    // adjust normal using normal map
    mat3 TBNt = mat3(T, B, vec3(N));
    mat3 TBN = transpose(TBNt);
  	V = vec4(TBN * vec3(V), 0.0);
  	L = vec4(TBN * vec3(L), 0.0);
   	vec4 H = normalize(L + V);
	  N = normalize(vec4(vec3(texture(NormalSampler, uvs)*2.0 - 1.0), 0.0));
    vec3 R = -vec3(reflect(V, N));
    R = inverse(mat3(ViewMatrix))*TBNt*R;
    // get diffuse coefficient
    float NdotL = clamp(dot(N, L), 0.0, 1.0);
    float NdotH = clamp(dot(N, H), 0.0, 1.0);

    vec3 diffuse_color = pow(texture(ImageSampler, uvs).rgb, vec3(gamma));
    vec3 rColor = pow(texture(EnvironmentSampler, R.xyz).rgb, vec3(gamma));

    diffuse_color = (1.f-reflection_fraction)*diffuse_color + reflection_fraction*rColor;
    vec3 color = diffuse_color*ambient_light/2.0*dot(N, No) + visibility*(diffuse_color*(NdotL) + NdotL*specular_color*pow(NdotH, shininess));

    fColor = vec4(pow(color, vec3(1.0/gamma)), 1);
}
`;
