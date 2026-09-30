import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroThree() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (prefersReducedMotion || isLowEnd || isMobile) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add canvas to DOM
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    // Lights
    const ambientLight = new THREE.AmbientLight(0x43449A, 0.4);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xFDC530, 1, 20); // Amber
    light1.position.set(3, 3, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x29ABE2, 0.6, 20); // Sky Cyan
    light2.position.set(-3, -2, 2);
    scene.add(light2);
    
    const light3 = new THREE.PointLight(0xE3242B, 0.8, 20); // Signal Red
    light3.position.set(0, 4, -2);
    scene.add(light3);

    // Objects
    // 1. Floating Book (Group of boxes)
    const bookGroup = new THREE.Group();
    const coverGeo = new THREE.BoxGeometry(1.6, 0.1, 1.2);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x43449A,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    const cover1 = new THREE.Mesh(coverGeo, coverMat);
    cover1.position.set(0.8, 0, 0);
    cover1.rotation.z = 0.1;
    
    const cover2 = new THREE.Mesh(coverGeo, coverMat);
    cover2.position.set(-0.8, 0, 0);
    cover2.rotation.z = -0.1;
    
    const pagesGeo = new THREE.BoxGeometry(1.5, 0.2, 1.1);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.9,
    });
    const pages1 = new THREE.Mesh(pagesGeo, pagesMat);
    pages1.position.set(0.8, 0.15, 0);
    pages1.rotation.z = 0.1;
    
    const pages2 = new THREE.Mesh(pagesGeo, pagesMat);
    pages2.position.set(-0.8, 0.15, 0);
    pages2.rotation.z = -0.1;
    
    bookGroup.add(cover1, cover2, pages1, pages2);
    bookGroup.position.set(1.5, -0.5, -1);
    scene.add(bookGroup);

    // 2. Floating spheres/shapes in brand colors
    const sphere1Geo = new THREE.SphereGeometry(0.3, 32, 32);
    const sphere1Mat = new THREE.MeshStandardMaterial({
      color: 0xFDC530, // Amber
      emissive: 0xFDC530,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const sphere1 = new THREE.Mesh(sphere1Geo, sphere1Mat);
    sphere1.position.set(-1.5, 1.5, -1);
    scene.add(sphere1);

    const sphere2Geo = new THREE.IcosahedronGeometry(0.4, 0);
    const sphere2Mat = new THREE.MeshStandardMaterial({
      color: 0x29ABE2, // Sky Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
    sphere2.position.set(-2, -1, 0);
    scene.add(sphere2);
    
    const sphere3Geo = new THREE.OctahedronGeometry(0.2, 0);
    const sphere3Mat = new THREE.MeshStandardMaterial({
      color: 0xE3242B, // Signal Red
      transparent: true,
      opacity: 0.8,
    });
    const sphere3 = new THREE.Mesh(sphere3Geo, sphere3Mat);
    sphere3.position.set(2, 2, -2);
    scene.add(sphere3);

    // 3. Particles
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    // Animation loop
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Animate book
      bookGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + 0.2;
      bookGroup.rotation.y = t * 0.1;
      bookGroup.position.y = -0.5 + Math.sin(t * 1.5) * 0.15;

      // Animate spheres
      sphere1.position.y = 1.5 + Math.sin(t * 1.2) * 0.2;
      sphere1.position.x = -1.5 + Math.cos(t * 0.8) * 0.1;
      
      sphere2.rotation.x = t * 0.3;
      sphere2.rotation.y = t * 0.4;
      sphere2.position.y = -1 + Math.sin(t * 0.9 + 1) * 0.2;
      
      sphere3.rotation.x = t * 0.5;
      sphere3.rotation.z = t * 0.2;
      sphere3.position.y = 2 + Math.sin(t * 1.7) * 0.3;

      // Animate particles
      particles.rotation.y = t * 0.03;
      particles.rotation.x = Math.sin(t * 0.05) * 0.1;

      // Parallax
      targetX = mouseX * 0.5;
      targetY = -mouseY * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return; // Ignore if hidden
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose geometries & materials
      coverGeo.dispose();
      coverMat.dispose();
      pagesGeo.dispose();
      pagesMat.dispose();
      sphere1Geo.dispose();
      sphere1Mat.dispose();
      sphere2Geo.dispose();
      sphere2Mat.dispose();
      sphere3Geo.dispose();
      sphere3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full hidden md:block" />;
}
