"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Keep page scroll smooth
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.minPolarAngle = Math.PI / 3;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xbbf7d0, 1.5); // Lime tint accent light
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0xa855f7, 2.5, 10); // Purple accent rim light
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Pivot group for model & animations
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Helper: Build procedural fallback aesthetic model if GLB has no mesh
    const createFallbackModel = () => {
      const fallbackGroup = new THREE.Group();

      // Metallic chrome ribbon sculpture (inspired by SAPFORCE reference)
      const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32, 2, 3);
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,
      });
      const knotMesh = new THREE.Mesh(knotGeo, chromeMat);
      fallbackGroup.add(knotMesh);

      // Translucent lime glass core
      const sphereGeo = new THREE.SphereGeometry(0.85, 48, 48);
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

      // Thin orbit halo rings
      const ringGeo = new THREE.TorusGeometry(2.1, 0.025, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.9,
        roughness: 0.2,
      });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2.8;
      ring1.rotation.y = Math.PI / 6;
      fallbackGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.x = -Math.PI / 3.2;
      ring2.rotation.z = Math.PI / 4;
      fallbackGroup.add(ring2);

      return fallbackGroup;
    };

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        let hasMeshes = false;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            hasMeshes = true;
          }
        });

        if (hasMeshes) {
          // Normalize scale and center
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.8 / (maxDim || 1);
          gltf.scene.scale.setScalar(scale);

          gltf.scene.position.x = -center.x * scale;
          gltf.scene.position.y = -center.y * scale;
          gltf.scene.position.z = -center.z * scale;

          modelGroup.add(gltf.scene);
        } else {
          // Empty GLTF container, use dynamic procedural sculpture
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

    // Subtle floor shadow
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.22)");
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
    shadowMesh.position.y = -1.75;
    scene.add(shadowMesh);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Floating bobbing effect
      modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Update controls
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
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] md:h-[560px] lg:h-[620px] flex items-center justify-center">
      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 backdrop-blur-sm text-xs text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping"></span>
            Loading 3D Model...
          </div>
        </div>
      )}

      {/* Floating 3D Interaction Hint Badge */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/5 shadow-sm text-[11px] font-medium text-gray-700 select-none">
          <svg
            className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
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
          <span>Rotate &amp; Interact 3D</span>
        </div>
      </div>
    </div>
  );
}
