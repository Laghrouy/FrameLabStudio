/* ============================================
   FrameLab Studio — Three.js 3D Scene
   Floating objects, glassmorphism, parallax
   ============================================ */

(function() {

  // --- Check if Three.js loaded ---
  if (typeof THREE === 'undefined') return;

  const scenes = [];

  // --- HERO 3D SCENE ---
  function initHeroScene() {
    const container = document.getElementById('scene-hero');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x4e5f43, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4e5f43, 1.5, 20);
    pointLight1.position.set(3, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xc1a98d, 1.2, 20);
    pointLight2.position.set(-4, -2, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x6b7a60, 0.8, 15);
    pointLight3.position.set(0, 4, 2);
    scene.add(pointLight3);

    // --- Materials ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4e5f43,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.35,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });

    const solidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc1a98d,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6,
      clearcoat: 0.5
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4e5f43,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x6b7a60,
      transparent: true,
      opacity: 0.3
    });

    // --- Objects ---
    const objects = [];

    // Main sphere — glassmorphism
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const sphere = new THREE.Mesh(sphereGeo, glassMaterial);
    sphere.position.set(1.5, 0.3, 0);
    scene.add(sphere);
    objects.push({ mesh: sphere, basePos: sphere.position.clone(), rotSpeed: { x: 0.003, y: 0.005 }, floatSpeed: 0.8, floatAmp: 0.3, depth: 1 });

    // Wireframe torus
    const torusGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 48);
    const torus = new THREE.Mesh(torusGeo, wireframeMaterial);
    torus.position.set(-2, 1.5, -1);
    torus.rotation.x = Math.PI * 0.3;
    scene.add(torus);
    objects.push({ mesh: torus, basePos: torus.position.clone(), rotSpeed: { x: 0.008, y: 0.004 }, floatSpeed: 1.2, floatAmp: 0.25, depth: 0.6 });

    // Octahedron
    const octGeo = new THREE.OctahedronGeometry(0.6, 0);
    const oct = new THREE.Mesh(octGeo, solidMaterial.clone());
    oct.material.color.set(0x6b7a60);
    oct.material.opacity = 0.4;
    oct.position.set(3, -1.5, -0.5);
    scene.add(oct);
    objects.push({ mesh: oct, basePos: oct.position.clone(), rotSpeed: { x: 0.006, y: 0.008 }, floatSpeed: 0.6, floatAmp: 0.4, depth: 0.8 });

    // Edge cube
    const cubeGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
    const cubeLine = new THREE.LineSegments(cubeEdges, edgeMaterial);
    cubeLine.position.set(-1, -1.2, 0.5);
    scene.add(cubeLine);
    objects.push({ mesh: cubeLine, basePos: cubeLine.position.clone(), rotSpeed: { x: 0.004, y: 0.006 }, floatSpeed: 1.0, floatAmp: 0.2, depth: 0.5 });

    // Small floating spheres (particles)
    const smallSphereGeo = new THREE.SphereGeometry(0.08, 12, 12);
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x4e5f43 : 0xc1a98d,
        metalness: 0.5,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.3,
        emissive: i % 2 === 0 ? 0x4e5f43 : 0xc1a98d,
        emissiveIntensity: 0.2
      });
      const s = new THREE.Mesh(smallSphereGeo, mat);
      s.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      scene.add(s);
      objects.push({
        mesh: s,
        basePos: s.position.clone(),
        rotSpeed: { x: 0, y: 0 },
        floatSpeed: 0.5 + Math.random() * 1.5,
        floatAmp: 0.1 + Math.random() * 0.3,
        depth: 0.2 + Math.random() * 0.5
      });
    }

    // Ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 64);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0x4e5f43,
      transparent: true,
      opacity: 0.12
    }));
    ring.position.set(1, 0, -1);
    ring.rotation.x = Math.PI * 0.5;
    scene.add(ring);
    objects.push({ mesh: ring, basePos: ring.position.clone(), rotSpeed: { x: 0.001, y: 0.003 }, floatSpeed: 0.3, floatAmp: 0.1, depth: 0.3 });

    // --- Mouse tracking ---
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // --- Animation ---
    const clock = new THREE.Clock();
    let heroVisible = true;
    let animId = null;

    // Pause when off-screen
    const visObserver = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !animId) animate();
    }, { threshold: 0 });
    visObserver.observe(container);

    function animate() {
      if (!heroVisible) { animId = null; return; }
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      objects.forEach(obj => {
        // Rotation
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;

        // Float
        obj.mesh.position.y = obj.basePos.y + Math.sin(t * obj.floatSpeed) * obj.floatAmp;
        obj.mesh.position.x = obj.basePos.x + Math.sin(t * obj.floatSpeed * 0.7) * obj.floatAmp * 0.3;

        // Mouse parallax
        obj.mesh.position.x += mouseX * obj.depth * 0.4;
        obj.mesh.position.y += -mouseY * obj.depth * 0.3;
      });

      // Camera subtle movement
      camera.position.x = mouseX * 0.15;
      camera.position.y = -mouseY * 0.1;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    // --- Resize ---
    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    scenes.push({ scene, camera, renderer, container, onResize });
  }

  // --- SECTION 3D FLOATING ELEMENTS ---
  function initFloatingElements() {
    const containers = document.querySelectorAll('.scene-float');
    containers.forEach(container => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.z = 4;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const light = new THREE.PointLight(0x4e5f43, 1, 15);
      light.position.set(2, 2, 3);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xc1a98d, 0.3));

      const geo = new THREE.IcosahedronGeometry(1, 1);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x4e5f43,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
        clearcoat: 1
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6b7a60, transparent: true, opacity: 0.2 }));
      scene.add(line);

      const clock = new THREE.Clock();
      let isVisible = true;
      let floatAnimId = null;

      const floatObserver = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !floatAnimId) animateFloat();
      }, { threshold: 0 });
      floatObserver.observe(container);

      function animateFloat() {
        if (!isVisible) { floatAnimId = null; return; }
        floatAnimId = requestAnimationFrame(animateFloat);
        const t = clock.getElapsedTime();
        mesh.rotation.x = t * 0.3;
        mesh.rotation.y = t * 0.5;
        line.rotation.x = t * 0.3;
        line.rotation.y = t * 0.5;
        mesh.position.y = Math.sin(t * 0.8) * 0.15;
        renderer.render(scene, camera);
      }
      animateFloat();

      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    });
  }

  // --- Init on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroScene();
      initFloatingElements();
    });
  } else {
    initHeroScene();
    initFloatingElements();
  }

})();
