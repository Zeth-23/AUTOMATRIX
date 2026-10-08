"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

interface ModelViewer3DProps {
  modelPath?: string;
  lumen?: number;
  lightColor?: string;
  viewMode?: "pbr" | "wireframe";
  windActive?: boolean;
  coolActive?: boolean;
  denoiseActive?: boolean;
  resetTrigger?: number;
  autoRotate?: boolean;
}

export default function ModelViewer3D({
  modelPath = "/3D-model/Caballero_Corona.glb",
  lumen = 85,
  lightColor = "#f43f5e",
  viewMode = "pbr",
  windActive = false,
  coolActive = false,
  denoiseActive = false,
  resetTrigger = 0,
  autoRotate = true,
}: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // References to dynamic Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const backLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);

  // 1. Initial 3D Scene setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let autoRotateTimeout: NodeJS.Timeout;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const getCameraDistance = (w: number, h: number) => {
      const asp = w / h;
      if (asp < 1.0) return 4.9;
      if (asp < 1.35) return 4.3;
      return 3.8;
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, getCameraDistance(width, height));
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = (lumen / 100) * 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 1.15;
    controls.enableZoom = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 8.5;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = windActive ? 4.5 : 1.8;
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      clearTimeout(autoRotateTimeout);
    });

    controls.addEventListener("end", () => {
      clearTimeout(autoRotateTimeout);
      autoRotateTimeout = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = autoRotate;
        }
      }, 2500);
    });

    // Surround Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, (lumen / 100) * 1.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, (lumen / 100) * 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, (lumen / 100) * 1.8);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const backLight = new THREE.DirectionalLight(new THREE.Color(lightColor), 2.2);
    backLight.position.set(0, 6, -6);
    scene.add(backLight);
    backLightRef.current = backLight;

    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
    bottomLight.position.set(0, -6, 2);
    scene.add(bottomLight);

    // Model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Fallback procedural sculpture
    const createFallbackModel = () => {
      const fallbackGroup = new THREE.Group();
      const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.38, 128, 32, 2, 3);
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 1.0,
      });
      const knotMesh = new THREE.Mesh(knotGeo, chromeMat);
      fallbackGroup.add(knotMesh);

      const sphereGeo = new THREE.SphereGeometry(0.9, 48, 48);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xf97316,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.85,
        transparent: true,
        ior: 1.5,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, glassMat);
      fallbackGroup.add(sphereMesh);
      return fallbackGroup;
    };

    // Load model
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelPath,
      (gltf) => {
        let hasMeshes = false;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            hasMeshes = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        if (hasMeshes) {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 4.2 / (maxDim || 1);
          gltf.scene.scale.setScalar(scale);

          gltf.scene.position.x = -center.x * scale;
          gltf.scene.position.y = -center.y * scale;
          gltf.scene.position.z = -center.z * scale;

          modelGroup.add(gltf.scene);
        } else {
          modelGroup.add(createFallbackModel());
        }
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn("Could not load GLB model, using dynamic 3D sculpture:", err);
        modelGroup.add(createFallbackModel());
        setIsLoaded(true);
      }
    );

    // Ground shadow
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.22)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.06)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // Animation Loop
    const startTime = performance.now();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Floating breathing motion
      modelGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.position.z = getCameraDistance(newWidth, newHeight);
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(autoRotateTimeout);
      resizeObserver.disconnect();
      dracoLoader.dispose();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  // 2. React to Lumen & Lighting Adjustments
  useEffect(() => {
    if (!rendererRef.current) return;
    const factor = lumen / 100;
    rendererRef.current.toneMappingExposure = Math.max(0.4, factor * 1.35);

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = factor * 1.8;
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = factor * 2.5;
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = factor * 1.8;
      if (coolActive) {
        fillLightRef.current.color.set("#93c5fd"); // Cool ice blue tint
      } else {
        fillLightRef.current.color.set("#f1f5f9");
      }
    }
    if (backLightRef.current) {
      backLightRef.current.color.set(lightColor);
    }
  }, [lumen, lightColor, coolActive]);

  // 3. React to ViewMode (PBR vs Wireframe)
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const isWireframe = viewMode === "wireframe";

    modelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ("wireframe" in mat) {
              (mat as THREE.MeshStandardMaterial).wireframe = isWireframe;
            }
          });
        } else if (mesh.material && "wireframe" in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = isWireframe;
        }
      }
    });
  }, [viewMode, isLoaded]);

  // 4. React to Wind / AutoRotate speed
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = autoRotate;
    controlsRef.current.autoRotateSpeed = windActive ? 4.8 : 1.8;
  }, [autoRotate, windActive]);

  // 5. React to Reset Camera Trigger
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 0, 3.8);
      controlsRef.current.update();
    }
  }, [resetTrigger]);

  return (
    <div className="relative w-full h-[360px] xs:h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center overflow-visible select-none">
      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 select-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md text-xs text-gray-700 font-semibold shadow-sm border border-white/80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] animate-ping" />
            Cargando Modelo 3D GLB...
          </div>
        </div>
      )}
    </div>
  );
}
