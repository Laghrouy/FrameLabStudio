/* ============================================
   FrameLab Studio — Three.js 3D Scene
   Premium floating composition with parallax
   ============================================ */

(function() {

  if (typeof THREE === 'undefined') return;

  // --- HERO VISUAL 3D SCENE (right column) ---
  function initHeroVisualScene() {
    const container = document.getElementById('scene-hero-visual');
    if (!container) return;

    // Ensure container has dimensions — wait a frame if needed
    function doInit() {
      var w = container.clientWidth || container.offsetWidth || container.parentElement && container.parentElement.clientWidth || 600;
      var h = container.clientHeight || container.offsetHeight || container.parentElement && container.parentElement.clientHeight || 480;
      if (w < 10) { requestAnimationFrame(doInit); return; }
      buildScene(w, h);
    }

    function buildScene(W, H) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xfff5ea, 0.35));

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 0.8);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x4e5f43, 1.8, 25);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc1a98d, 1.4, 20);
    rimLight.position.set(3, -3, 3);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xa0783c, 0.8, 18);
    topLight.position.set(0, 5, 2);
    scene.add(topLight);

    // --- Central group (all objects rotate together subtly) ---
    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    // --- Materials ---
    const glassSage = new THREE.MeshPhysicalMaterial({
      color: 0x4e5f43,
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.92,
      thickness: 0.8,
      transparent: true,
      opacity: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.5
    });

    const glassTan = new THREE.MeshPhysicalMaterial({
      color: 0xc1a98d,
      metalness: 0.08,
      roughness: 0.03,
      transmission: 0.88,
      thickness: 0.6,
      transparent: true,
      opacity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      ior: 1.45
    });

    const glassGold = new THREE.MeshPhysicalMaterial({
      color: 0xa0783c,
      metalness: 0.25,
      roughness: 0.08,
      transmission: 0.7,
      thickness: 0.4,
      transparent: true,
      opacity: 0.55,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    const solidCream = new THREE.MeshPhysicalMaterial({
      color: 0xfff5ea,
      metalness: 0.02,
      roughness: 0.3,
      transparent: true,
      opacity: 0.35,
      clearcoat: 0.6
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x4e5f43,
      transparent: true,
      opacity: 0.18
    });

    const edgeGold = new THREE.LineBasicMaterial({
      color: 0xa0783c,
      transparent: true,
      opacity: 0.22
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6b7a60,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });

    // --- Objects ---
    const objects = [];

    // 1. Central icosahedron — main glass hero piece
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const ico = new THREE.Mesh(icoGeo, glassSage);
    centerGroup.add(ico);
    objects.push({ mesh: ico, rotSpeed: { x: 0.002, y: 0.003 }, floatSpeed: 0.5, floatAmp: 0.15 });

    // Edge glow on icosahedron
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoLine = new THREE.LineSegments(icoEdges, edgeMat);
    ico.add(icoLine);

    // 2. Orbiting torus knot — glass tan
    const tkGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 100, 16, 2, 3);
    const tk = new THREE.Mesh(tkGeo, glassTan);
    tk.position.set(2.8, 1.2, -0.5);
    centerGroup.add(tk);
    objects.push({ mesh: tk, rotSpeed: { x: 0.005, y: 0.008 }, floatSpeed: 0.9, floatAmp: 0.25 });

    // 3. Dodecahedron — gold glass
    const dodGeo = new THREE.DodecahedronGeometry(0.65, 0);
    const dod = new THREE.Mesh(dodGeo, glassGold);
    dod.position.set(-2.5, -1.0, 0.5);
    centerGroup.add(dod);
    const dodEdges = new THREE.LineSegments(new THREE.EdgesGeometry(dodGeo), edgeGold);
    dod.add(dodEdges);
    objects.push({ mesh: dod, rotSpeed: { x: 0.006, y: 0.004 }, floatSpeed: 0.7, floatAmp: 0.3 });

    // 4. Large wireframe sphere — background depth
    const bgSphereGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const bgSphere = new THREE.Mesh(bgSphereGeo, wireMat);
    bgSphere.position.set(0, 0, -3);
    centerGroup.add(bgSphere);
    objects.push({ mesh: bgSphere, rotSpeed: { x: 0.0008, y: 0.001 }, floatSpeed: 0.2, floatAmp: 0.05 });

    // 5. Floating octahedron
    const octGeo = new THREE.OctahedronGeometry(0.5, 0);
    const oct = new THREE.Mesh(octGeo, solidCream);
    oct.position.set(1.8, -2.0, 1);
    centerGroup.add(oct);
    const octEdges = new THREE.LineSegments(new THREE.EdgesGeometry(octGeo), edgeMat.clone());
    oct.add(octEdges);
    objects.push({ mesh: oct, rotSpeed: { x: 0.007, y: 0.005 }, floatSpeed: 1.1, floatAmp: 0.35 });

    // 6. Thin orbiting rings
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x4e5f43, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    var ring1Geo = new THREE.TorusGeometry(2.2, 0.012, 8, 128);
    var ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI * 0.55;
    ring1.rotation.z = Math.PI * 0.1;
    centerGroup.add(ring1);
    objects.push({ mesh: ring1, rotSpeed: { x: 0, y: 0.002 }, floatSpeed: 0.15, floatAmp: 0 });

    var ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa0783c, transparent: true, opacity: 0.09, side: THREE.DoubleSide });
    var ring2Geo = new THREE.TorusGeometry(2.8, 0.01, 8, 128);
    var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.35;
    ring2.rotation.z = -Math.PI * 0.15;
    centerGroup.add(ring2);
    objects.push({ mesh: ring2, rotSpeed: { x: 0, y: -0.0015 }, floatSpeed: 0.1, floatAmp: 0 });

    // 7. Tetrahedron
    var tetraGeo = new THREE.TetrahedronGeometry(0.4, 0);
    var tetra = new THREE.Mesh(tetraGeo, glassSage.clone());
    tetra.material.opacity = 0.3;
    tetra.position.set(-1.5, 2.2, 0.8);
    centerGroup.add(tetra);
    var tetraEdges = new THREE.LineSegments(new THREE.EdgesGeometry(tetraGeo), edgeGold.clone());
    tetra.add(tetraEdges);
    objects.push({ mesh: tetra, rotSpeed: { x: 0.009, y: 0.006 }, floatSpeed: 1.3, floatAmp: 0.2 });

    // 8. Small floating cubes (edge-only)
    for (var i = 0; i < 6; i++) {
      var size = 0.2 + Math.random() * 0.25;
      var cGeo = new THREE.BoxGeometry(size, size, size);
      var cEdges = new THREE.EdgesGeometry(cGeo);
      var cLine = new THREE.LineSegments(cEdges, (i % 2 === 0 ? edgeMat : edgeGold).clone());
      cLine.material.opacity = 0.12 + Math.random() * 0.12;
      cLine.position.set(
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3
      );
      centerGroup.add(cLine);
      objects.push({ mesh: cLine, rotSpeed: { x: 0.003 + Math.random() * 0.006, y: 0.003 + Math.random() * 0.006 }, floatSpeed: 0.4 + Math.random() * 1.2, floatAmp: 0.1 + Math.random() * 0.25 });
    }

    // 9. Particle spheres
    var particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    for (var j = 0; j < 30; j++) {
      var pMat = new THREE.MeshPhysicalMaterial({
        color: j % 3 === 0 ? 0x4e5f43 : (j % 3 === 1 ? 0xc1a98d : 0xa0783c),
        metalness: 0.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
        emissive: j % 3 === 0 ? 0x4e5f43 : (j % 3 === 1 ? 0xc1a98d : 0xa0783c),
        emissiveIntensity: 0.15
      });
      var particle = new THREE.Mesh(particleGeo, pMat);
      particle.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      centerGroup.add(particle);
      objects.push({ mesh: particle, rotSpeed: { x: 0, y: 0 }, floatSpeed: 0.3 + Math.random() * 1.8, floatAmp: 0.05 + Math.random() * 0.2 });
    }

    // --- Store base positions ---
    objects.forEach(function(obj) {
      obj.basePos = obj.mesh.position.clone();
    });

    // --- Mouse tracking ---
    var mouseX = 0, mouseY = 0;
    var targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', function(e) {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // --- Animation ---
    var clock = new THREE.Clock();
    var isVisible = true;
    var animId = null;

    var visObserver = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animId) animate();
    }, { threshold: 0 });
    visObserver.observe(container);

    function animate() {
      if (!isVisible) { animId = null; return; }
      animId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Subtle group rotation based on mouse
      centerGroup.rotation.y = mouseX * 0.12;
      centerGroup.rotation.x = -mouseY * 0.08;

      // Animate each object
      objects.forEach(function(obj) {
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;

        if (obj.floatAmp > 0) {
          obj.mesh.position.y = obj.basePos.y + Math.sin(t * obj.floatSpeed) * obj.floatAmp;
          obj.mesh.position.x = obj.basePos.x + Math.sin(t * obj.floatSpeed * 0.6 + 1) * obj.floatAmp * 0.4;
        }
      });

      // Camera breathing
      camera.position.x = mouseX * 0.25;
      camera.position.y = -mouseY * 0.15 + Math.sin(t * 0.3) * 0.08;
      camera.lookAt(0, 0, 0);

      // Lights breathing
      fillLight.intensity = 1.8 + Math.sin(t * 0.5) * 0.3;
      rimLight.intensity = 1.4 + Math.sin(t * 0.7 + 1) * 0.25;

      renderer.render(scene, camera);
    }
    animate();

    // --- Resize ---
    function onResize() {
      var nw = container.clientWidth || container.offsetWidth || 600;
      var nh = container.clientHeight || container.offsetHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
    window.addEventListener('resize', onResize);
    } // end buildScene

    doInit();
  }

  // --- HERO 3D BACKGROUND (fullscreen behind hero) ---
  function initHeroBgScene() {
    var container = document.getElementById('scene-hero');
    if (!container) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x4e5f43, 0.3));
    var bgLight = new THREE.PointLight(0xc1a98d, 0.8, 20);
    bgLight.position.set(3, 3, 4);
    scene.add(bgLight);

    // Subtle wireframe sphere
    var bgGeo = new THREE.IcosahedronGeometry(2.5, 1);
    var bgMesh = new THREE.Mesh(bgGeo, new THREE.MeshBasicMaterial({ color: 0x4e5f43, wireframe: true, transparent: true, opacity: 0.04 }));
    scene.add(bgMesh);

    // Small particles
    var pGeo = new THREE.SphereGeometry(0.03, 6, 6);
    var particles = [];
    for (var i = 0; i < 15; i++) {
      var p = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4e5f43 : 0xc1a98d,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.2
      }));
      p.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*5, (Math.random()-0.5)*4);
      scene.add(p);
      particles.push({ mesh: p, basePos: p.position.clone(), speed: 0.3 + Math.random() * 1, amp: 0.05 + Math.random() * 0.15 });
    }

    var clock = new THREE.Clock();
    var visible = true;
    var aId = null;

    var obs = new IntersectionObserver(function(entries) {
      visible = entries[0].isIntersecting;
      if (visible && !aId) anim();
    }, { threshold: 0 });
    obs.observe(container);

    function anim() {
      if (!visible) { aId = null; return; }
      aId = requestAnimationFrame(anim);
      var t = clock.getElapsedTime();
      bgMesh.rotation.x = t * 0.1;
      bgMesh.rotation.y = t * 0.15;
      particles.forEach(function(p) {
        p.mesh.position.y = p.basePos.y + Math.sin(t * p.speed) * p.amp;
      });
      renderer.render(scene, camera);
    }
    anim();

    window.addEventListener('resize', function() {
      if (container.clientWidth < 10) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // --- SECTION 3D FLOATING ELEMENTS ---
  function initFloatingElements() {
    var containers = document.querySelectorAll('.scene-float');
    containers.forEach(function(container) {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.z = 4;

      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      scene.add(new THREE.PointLight(0x4e5f43, 1, 15)).position.set(2, 2, 3);
      scene.add(new THREE.AmbientLight(0xc1a98d, 0.3));

      var geo = new THREE.IcosahedronGeometry(1, 1);
      var mat = new THREE.MeshPhysicalMaterial({
        color: 0x4e5f43, metalness: 0.1, roughness: 0.1,
        transmission: 0.85, thickness: 0.5, transparent: true, opacity: 0.3, clearcoat: 1
      });
      var mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      var edges = new THREE.EdgesGeometry(geo);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6b7a60, transparent: true, opacity: 0.2 }));
      scene.add(line);

      var clock = new THREE.Clock();
      var isVis = true;
      var fId = null;

      var fObs = new IntersectionObserver(function(ent) {
        isVis = ent[0].isIntersecting;
        if (isVis && !fId) floatAnim();
      }, { threshold: 0 });
      fObs.observe(container);

      function floatAnim() {
        if (!isVis) { fId = null; return; }
        fId = requestAnimationFrame(floatAnim);
        var t = clock.getElapsedTime();
        mesh.rotation.x = t * 0.3;
        mesh.rotation.y = t * 0.5;
        line.rotation.x = t * 0.3;
        line.rotation.y = t * 0.5;
        mesh.position.y = Math.sin(t * 0.8) * 0.15;
        renderer.render(scene, camera);
      }
      floatAnim();

      window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    });
  }

  // --- Init ---
  function init() {
    initHeroVisualScene();
    initHeroBgScene();
    initFloatingElements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
