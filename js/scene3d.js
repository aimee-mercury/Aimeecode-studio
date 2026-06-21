/**
 * Aimeecode Studio - Three.js Hero Scene
 * Interactive 3D particle field with floating geometry
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  let scene, camera, renderer, particles, coreMesh, ringMesh;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let animationId;
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 800 : 2000;

  function getHeroSize() {
    const section = canvas.closest('.hero-section');
    return {
      width: section ? section.clientWidth : window.innerWidth,
      height: section ? section.clientHeight : window.innerHeight
    };
  }

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

    const { width, height } = getHeroSize();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0f, 1);

    createParticles();
    createCoreGeometry();
    createRings();
    addLights();

    window.addEventListener('resize', onResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
  }

  function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xfbbf24),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function createCoreGeometry() {
    const geometry = new THREE.IcosahedronGeometry(3, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.3
    });
    coreMesh = new THREE.Mesh(geometry, material);
    scene.add(coreMesh);

    const innerGeo = new THREE.OctahedronGeometry(1.5, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.4,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.5
    });
    coreMesh.add(new THREE.Mesh(innerGeo, innerMat));
  }

  function createRings() {
    const ringGeo = new THREE.TorusGeometry(8, 0.02, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4
    });
    ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    const ring2 = ringMesh.clone();
    ring2.material = ringMat.clone();
    ring2.material.color.setHex(0x8b5cf6);
    ring2.rotation.x = -Math.PI / 4;
    ring2.scale.set(1.3, 1.3, 1.3);
    scene.add(ring2);
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const goldLight = new THREE.PointLight(0xfbbf24, 1, 100);
    goldLight.position.set(10, 10, 10);
    scene.add(goldLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
    purpleLight.position.set(-10, -10, 5);
    scene.add(purpleLight);
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    const { width, height } = getHeroSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (particles) {
      particles.rotation.y = time * 0.02 + mouseX * 0.3;
      particles.rotation.x = mouseY * 0.15;

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.01) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    if (coreMesh) {
      coreMesh.rotation.x = time * 0.3 + mouseY * 0.5;
      coreMesh.rotation.y = time * 0.4 + mouseX * 0.5;
    }

    if (ringMesh) {
      ringMesh.rotation.z = time * 0.2;
    }

    camera.position.x = mouseX * 3;
    camera.position.y = -mouseY * 2;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.heroScene3D = {
    destroy() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    }
  };
})();
