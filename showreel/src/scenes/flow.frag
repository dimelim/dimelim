#version 300 es
precision highp float;
uniform vec2 res;
uniform float time;
uniform float kick;
uniform float melt;
uniform vec4 blobs[6];
uniform sampler2D textTex;
uniform sampler2D prevTex;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0., a = .5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = m * p;
    a *= .5;
  }
  return s;
}

vec3 ramp(float x) {
  vec3 c[6] = vec3[6](
    vec3(.02, .02, .07),
    vec3(.07, .09, .5),
    vec3(.38, .25, 1.),
    vec3(1., .33, .6),
    vec3(1., .42, .24),
    vec3(.96, .93, .88)
  );
  x = clamp(x, 0., 1.) * 5.;
  int i = int(min(floor(x), 4.));
  return mix(c[i], c[i + 1], smoothstep(0., 1., x - float(i)));
}

float tri(float x) {
  return abs(fract(x) * 2. - 1.);
}

vec3 env(vec3 R, float f) {
  float y = R.y;
  vec3 ground = mix(vec3(.015, .015, .05), vec3(.12, .1, .42), smoothstep(-1., -.05, y));
  vec3 sky = mix(vec3(1., .5, .32), vec3(.3, .22, .95), smoothstep(.05, .85, y));
  vec3 c = mix(ground, sky, smoothstep(-.03, .03, y));
  c += smoothstep(.06, 0., abs(y - .03)) * .9;
  c += smoothstep(.55, .95, R.x * .6 + y) * .5;
  return mix(c, ramp(tri(f * .8 + R.x * .45)), .25);
}

void main() {
  vec2 uv = gl_FragCoord.xy / res;
  vec2 p = (gl_FragCoord.xy - .5 * res) / res.y;
  float t = time * .3;
  vec2 s = p * .9;
  vec2 q = vec2(fbm(s + vec2(0., t)), fbm(s + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(s + 3. * q + vec2(1.7, 9.2) + t * 1.4), fbm(s + 3. * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(s + (3.2 + kick * .8) * r);
  vec3 col = ramp(smoothstep(.3, 1.08, f * 1.1 + .45 * (r.x - .5)));
  col *= .75 + .4 * f;

  vec2 aspect = vec2(res.y / res.x, 1.);
  vec4 tx = texture(textTex, uv + (q - .5) * .014 * aspect);
  col = mix(col, tx.rgb, tx.a);

  float F = 0.;
  vec2 G = vec2(0.);
  for (int i = 0; i < 6; i++) {
    vec2 d = p - blobs[i].xy;
    float r2 = blobs[i].z * blobs[i].z;
    float dd = dot(d, d) + 1e-5;
    F += r2 / dd;
    G -= 2. * r2 * d / (dd * dd);
  }
  float w = fwidth(F);
  float inside = smoothstep(1. - w, 1. + w, F);
  if (inside > 0.) {
    vec2 slope = G / (F * F);
    vec3 n = normalize(vec3(-slope * .3, 1.));
    vec3 R = reflect(vec3(0., 0., -1.), n);
    vec3 e = env(R, f);
    float fres = pow(1. - n.z, 3.);
    vec3 chrome = e * (.75 + .5 * fres);
    chrome += pow(max(dot(R, normalize(vec3(-.5, .6, .6))), 0.), 80.) * 1.4;
    vec4 rt = texture(textTex, uv - n.xy * .07 * aspect);
    chrome = mix(chrome, rt.rgb * (.55 + .45 * e), rt.a * .85);
    col = mix(col, chrome, inside);
  }

  if (melt < 1.) {
    vec2 m = uv + (q - .5) * .5 * melt * aspect + vec2(0., melt * melt * .35 * (r.y - .2));
    vec3 prev = texture(prevTex, m).rgb;
    col = mix(prev, col, smoothstep(0., 1., clamp(melt * 2. - 1. + f, 0., 1.)));
  }
  outColor = vec4(col, 1.);
}
