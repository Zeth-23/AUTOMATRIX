"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

interface ModelViewer3DProps {
  modelPath?: string;
}

export default function ModelViewer3D({
  modelPath = "/3D-model/Caballero_Corona.glb",
}: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let autoRotateTimeout: NodeJS.Timeout;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 750;

    // Scene
    const scene = new THREE.Scene();

    // Camera — positioned close to give ~4x perceived scale with wide angle
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Controls — Full 360° omni-directional rotation without limits
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 1.15;
    controls.enableZoom = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 8.5;

    // Remove angle restrictions to allow rotating in ANY direction (up, down, sideways, 360)
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

    // Auto-rotation behavior: active by default, pauses when user touches/drags
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;

    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      setIsDragging(true);
      clearTimeout(autoRotateTimeout);
    });

    controls.addEventListener("end", () => {
      setIsDragging(false);
      clearTimeout(autoRotateTimeout);
      autoRotateTimeout = setTimeout(() => {
        controls.autoRotate = true;
      }, 2500);
    });

    // Surround 360° Lighting so the model looks stunning from all angles
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Front-top key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    // Front-left fill light
    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.8);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    // Back rim light (subtle lime tint matching brand aesthetic)
    const backLight = new THREE.DirectionalLight(0xd4f842, 2.0);
    backLight.position.set(0, 6, -6);
    scene.add(backLight);

    // Bottom fill light (illuminates underbelly when rotated upward)
    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
    bottomLight.position.set(0, -6, 2);
    scene.add(bottomLight);

    // Pivot group for model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Helper: Procedural fallback aesthetic sculpture if needed
    const createFallbackModel = () => {
      const fallbackGroup = new THREE.Group();

      const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.38, 128, 32, 2, 3);
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const knotMesh = new THREE.Mesh(knotGeo, chromeMat);
      fallbackGroup.add(knotMesh);

      const sphereGeo = new THREE.SphereGeometry(0.9, 48, 48);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x84cc16,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.85,
        opacity: 0.95,
        transparent: true,
        ior: 1.5,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, glassMat);
      fallbackGroup.add(sphereMesh);

      const ringGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.9,
        roughness: 0.2,
      });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2.8;
      fallbackGroup.add(ring1);

      return fallbackGroup;
    };

    // Load the 3D model with Meshopt and Draco decoders
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
          // Normalize scale and center
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          // Scale 4.2 / maxDim combined with closer camera gives ~4x larger rendered footprint
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

    // Dynamic ground shadow
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.28)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.08)");
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

    // Animation Loop using performance.now()
    const startTime = performance.now();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Subtle floating breathing effect
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

  return (
    <div className="relative w-full h-[580px] sm:h-[680px] md:h-[780px] lg:h-[880px] flex items-center justify-center">
      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 select-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-sm text-xs text-gray-600 font-medium shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-ping"></span>
            Loading 3D Model...
          </div>
        </div>
      )}

      {/* Floating 3D Interaction Hint Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-md text-xs font-medium text-gray-800 select-none">
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              isDragging ? "scale-125 text-black" : "animate-spin"
            }`}
            style={{ animationDuration: "6s" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>360° Free Rotation • Drag anywhere to rotate</span>
        </div>
      </div>
    </div>
  );
}
