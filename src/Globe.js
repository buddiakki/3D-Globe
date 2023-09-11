import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import earthTexture1 from "./images/globeimg.jpg";
import raindropTexture from "./images/rain_PNG13468.png"; // Provide a raindrop texture

const Globe = () => {
  const containerRef = useRef();
  const hoverRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a globe
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTexture1);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create a raining effect
    const rainGeometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      vertices.push(x, y, z);
    }

    rainGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const rainMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      map: textureLoader.load(raindropTexture),
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Set camera position
    camera.position.z = 3;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate the raindrops only when hovered
      if (hoverRef.current) {
        const positions = rainGeometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
          // Update the position of raindrops
          positions[i + 1] -= 0.1; // Adjust the speed of falling raindrops
          if (positions[i + 1] < -10) {
            positions[i + 1] = 10; // Reset raindrop position if it falls out of view
          }
        }

        rainGeometry.attributes.position.needsUpdate = true;
      }

      if (hoverRef.current) {
        globe.rotation.y += 0.005; // Rotate the globe
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseEnter = () => {
      hoverRef.current = true;
    };

    const handleMouseLeave = () => {
      hoverRef.current = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeChild(renderer.domElement);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
};

export default Globe;
