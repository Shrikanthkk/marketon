import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

/**
 * Lightweight WebGL shader background.
 * - Single fullscreen triangle, fragment-shader only (no geometry cost)
 * - Volumetric-feel lighting via cheap 4-octave fbm + radial god-rays
 * - Automatically adapts between Light mode (ivory) and Galaxy Dark mode (deep space dark).
 * - Mobile-safe: capped DPR, throttled FPS, pauses when offscreen/hidden,
 *   respects prefers-reduced-motion, falls back to CSS gradient on no-WebGL.
 */
export default function HeroShaderBackground({
  className = "",
  mouseRef,
}: {
  className?: string;
  mouseRef?: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isGalaxy } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: true,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return; // CSS fallback already rendered behind

    const vert = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    // Mobile-tuned: fewer fbm octaves, no god-ray loop unrolling
    const OCTAVES = isMobile ? 3 : 4;
    const RAY_STEPS = isMobile ? 6 : 10;

    const frag = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2  u_res;
      uniform vec2  u_mouse;   // 0..1, (-1,-1) when inactive
      uniform float u_mActive;
      uniform float u_dark;    // 1.0 in Galaxy mode, 0.0 in Light mode

      // hash & value noise
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0,0.0));
        float c = hash(i + vec2(0.0,1.0));
        float d = hash(i + vec2(1.0,1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < ${OCTAVES}; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = v_uv;
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        // light source: cursor when active, otherwise drifting
        vec2 lightUV = mix(
          vec2(0.5 + 0.18 * sin(u_time*0.18), 0.32 + 0.08 * cos(u_time*0.22)),
          u_mouse,
          u_mActive
        );
        vec2 light = (lightUV - 0.5) * vec2(u_res.x/u_res.y, 1.0);

        // base ivory gradient in Light mode, deep galaxy in Dark mode
        vec3 lightTop    = vec3(1.000, 0.965, 0.933); // #FFF6EE
        vec3 lightBottom = vec3(0.957, 0.957, 0.984); // #F4F4FB
        vec3 baseTop     = mix(lightTop, vec3(0.051, 0.078, 0.188), u_dark); // #0d1430 in dark
        vec3 baseBottom  = mix(lightBottom, vec3(0.012, 0.020, 0.059), u_dark); // #03050f in dark

        vec3 col = mix(baseTop, baseBottom, smoothstep(0.0, 1.0, uv.y));

        // volumetric fbm clouds, slow flow
        vec2 q = p * 1.4;
        q += vec2(u_time * 0.03, u_time * 0.015);
        float n = fbm(q + fbm(q * 1.8 + u_time * 0.04));

        // depth orbs (warm + cool) parallaxed by light
        float warm = exp(-3.2 * length(p - light * 0.6));
        float cool = exp(-4.0 * length(p - vec2(-0.4, 0.25) + light*0.1));
        vec3 warmCol = vec3(0.65, 0.25, 0.95);   // mk-purple
        vec3 coolCol = vec3(0.47, 0.59, 1.0);   // soft indigo

        float cloudIntensity = mix(0.55, 0.35, u_dark);
        col += warmCol * warm * cloudIntensity * (0.7 + 0.5 * n);
        col += coolCol * cool * (cloudIntensity * 0.6) * (0.6 + 0.6 * n);

        // cheap god-rays: radial march from light, sampling fbm density
        float ray = 0.0;
        vec2 dir = (p - light) / float(${RAY_STEPS});
        vec2 sp = p;
        float decay = 1.0;
        for (int i = 0; i < ${RAY_STEPS}; i++) {
          sp -= dir * 0.6;
          float d = fbm(sp * 2.2 + u_time * 0.05);
          ray += d * decay;
          decay *= 0.86;
        }
        ray /= float(${RAY_STEPS});
        col += warmCol * ray * mix(0.18, 0.12, u_dark);

        // depth fog: lift edges, sink corners
        float vign = smoothstep(1.15, 0.25, length(p));
        col = mix(col, baseBottom, (1.0 - vign) * 0.55);

        // subtle film grain for cinematic depth
        float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.025;
        col += g;

        // soft top/bottom atmospheric mask to avoid harsh edges
        float mask = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
        float alpha = mix(0.85 * mask + 0.15, 0.55 * mask + 0.1, u_dark);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("shader error", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("program link error", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMA = gl.getUniformLocation(prog, "u_mActive");
    const uDark = gl.getUniformLocation(prog, "u_dark");

    const dprCap = isMobile ? 1 : 1.5;

    let w = 0, h = 0;
    const resize = () => {
      const parent = canvas.parentElement!;
      const r = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = Math.max(1, Math.floor(r.width * dpr));
      h = Math.max(1, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = r.width + "px";
        canvas.style.height = r.height + "px";
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0.01 },
    );
    io.observe(canvas);
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const targetFps = reduced ? 0 : isMobile ? 30 : 60;
    const minDelta = targetFps > 0 ? 1000 / targetFps : Infinity;
    let last = 0;
    const start = performance.now();
    let raf = 0;

    let smx = 0.5, smy = 0.5, sma = 0;
    let currentDark = isGalaxy ? 1 : 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) { last = now; return; }
      if (now - last < minDelta) return;
      last = now;

      const targetDark = document.documentElement.classList.contains("dark") ? 1 : 0;
      currentDark += (targetDark - currentDark) * 0.1;

      const m = mouseRef?.current;
      const tx = m && m.active ? Math.min(1, Math.max(0, m.x / (canvas.clientWidth || 1))) : 0.5;
      const ty = m && m.active ? 1 - Math.min(1, Math.max(0, m.y / (canvas.clientHeight || 1))) : 0.5;
      const ta = m && m.active ? 1 : 0;
      smx += (tx - smx) * 0.08;
      smy += (ty - smy) * 0.08;
      sma += (ta - sma) * 0.05;

      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, smx, smy);
      gl.uniform1f(uMA, sma);
      gl.uniform1f(uDark, currentDark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform1f(uMA, 0);
      gl.uniform1f(uDark, isGalaxy ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [mouseRef, isGalaxy]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${className}`}
      aria-hidden
    >
      {/* CSS fallback for no-WebGL devices */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isGalaxy
            ? "radial-gradient(1200px 700px at 50% 20%, #0d1430 0%, #060814 55%, #03050f 100%)"
            : "radial-gradient(1200px 700px at 50% 20%, #FFF6EE 0%, transparent 60%), radial-gradient(900px 600px at 80% 80%, #EEF2FF 0%, transparent 65%), linear-gradient(180deg,#FBFAF7,#F4F4FB)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
