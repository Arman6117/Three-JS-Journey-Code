    import * as THREE from 'three'
    
    // ==================== GAME CONFIG ====================
    const config = {
      baseSpeed: 0.15,
      maxSpeed: 0.5,
      speedIncrease: 0.001,
      laneWidth: 4,
      numLanes: 5,
      obstacleSpawnRate: 80,
      collectibleSpawnRate: 120,
  };
  
  // ==================== GAME STATE ====================
  const gameState = {
      isPlaying: false,
      isGameOver: false,
      score: 0,
      lives: 3,
      speed: config.baseSpeed,
      currentLane: 2, // center
      frameCount: 0,
      isPaused: false,
  };
  
  // ==================== SCENE SETUP ====================
  const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
  };
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a); // deep space blue
  scene.fog = new THREE.Fog(0x0a0a1a, 10, 100);
  
  // ==================== ROAD ====================
  const roadGeometry = new THREE.PlaneGeometry(config.laneWidth * config.numLanes, 200, 100, 200);
  const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x140033, // deep purple
      emissive: 0x100020,
      roughness: 0.8,
      metalness: 0.3,
  });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.y = -1;
  road.receiveShadow = true;
  scene.add(road);
  
  // Add wave effect to road
  const roadPos = roadGeometry.attributes.position;
  for (let i = 0; i < roadPos.count; i++) {
      const x = roadPos.getX(i);
      const y = roadPos.getY(i);
      const z = Math.sin(x * 0.2) * 0.3 + Math.sin(y * 0.1) * 0.2;
      roadPos.setZ(i, z);
  }
  roadPos.needsUpdate = true;
  roadGeometry.computeVertexNormals();
  
  // ==================== GRID LINES ====================
  const gridGroup = new THREE.Group();
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  
  // Lane dividers
  for (let i = -2; i <= 2; i++) {
      const lineGeometry = new THREE.PlaneGeometry(0.1, 200);
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(i * config.laneWidth, -0.95, 0);
      gridGroup.add(line);
  }
  
  // Horizontal lines
  for (let i = 0; i < 20; i++) {
      const lineGeometry = new THREE.PlaneGeometry(config.laneWidth * config.numLanes, 0.1);
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, -0.95, -i * 10);
      gridGroup.add(line);
  }
  scene.add(gridGroup);
  
  // ==================== PLAYER ====================
  const playerGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const playerMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
  });
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(0, 0, 5);
  player.castShadow = true;
  scene.add(player);
  
  // Player glow effect
  const glowGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
  });
  const playerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  player.add(playerGlow);
  
  // ==================== OBSTACLES & COLLECTIBLES ====================
  const obstacles = [];
  const collectibles = [];
  
  function createObstacle() {
      const geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
      const material = new THREE.MeshStandardMaterial({
          color: 0xff0080,
          emissive: 0xff0080,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1,
      });
      const obstacle = new THREE.Mesh(geometry, material);
      
      const lane = Math.floor(Math.random() * config.numLanes);
      const laneX = (lane - 2) * config.laneWidth;
      obstacle.position.set(laneX, 0.5, -80);
      obstacle.userData.lane = lane;
      
      obstacles.push(obstacle);
      scene.add(obstacle);
  }
  
  function createCollectible() {
      const geometry = new THREE.SphereGeometry(0.6, 16, 16);
      const material = new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8,
          metalness: 1,
          roughness: 0,
      });
      const collectible = new THREE.Mesh(geometry, material);
      
      const lane = Math.floor(Math.random() * config.numLanes);
      const laneX = (lane - 2) * config.laneWidth;
      collectible.position.set(laneX, 0.5, -80);
      collectible.userData.lane = lane;
      
      collectibles.push(collectible);
      scene.add(collectible);
  }
  
  // ==================== LIGHTING ====================
  const ambientLight = new THREE.AmbientLight(0x4040ff, 0.3);
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.left = -30;
  dirLight.shadow.camera.right = 30;
  dirLight.shadow.camera.top = 30;
  dirLight.shadow.camera.bottom = -30;
  scene.add(dirLight);
  
  // Neon accent lights
  const neonLight1 = new THREE.PointLight(0xff00ff, 2, 50);
  neonLight1.position.set(-10, 5, 0);
  scene.add(neonLight1);
  
  const neonLight2 = new THREE.PointLight(0x00ffff, 2, 50);
  neonLight2.position.set(10, 5, 0);
  scene.add(neonLight2);
  
  // ==================== CAMERA ====================
  const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      200
  );
  camera.position.set(0, 6, 12);
  camera.lookAt(0, 0, 0);
  
  // ==================== RENDERER ====================
  const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.webgl'),
      antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // ==================== INPUT ====================
  const keys = { left: false, right: false };
  
  window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
      if ((e.key === 'r' || e.key === 'R') && gameState.isGameOver) restartGame();
      if (e.key === 'Escape') gameState.isPaused = !gameState.isPaused;
  });
  
  window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
  });
  
  // ==================== START BUTTON ====================
  document.getElementById('startBtn').addEventListener('click', () => {
      gameState.isPlaying = true;
      document.getElementById('startScreen').style.display = 'none';
  });
  
  // ==================== COLLISION DETECTION ====================
  function checkCollision(obj1, obj2, size1 = 0.6, size2 = 0.75) {
      return (
          Math.abs(obj1.position.x - obj2.position.x) < size1 + size2 &&
          Math.abs(obj1.position.z - obj2.position.z) < size1 + size2
      );
  }
  
  // ==================== GAME OVER ====================
  function triggerGameOver() {
      gameState.isGameOver = true;
      gameState.isPlaying = false;
      document.getElementById('gameOver').style.display = 'block';
      document.getElementById('finalScore').textContent = `Final Score: ${gameState.score}`;
  }
  
  function loseLife() {
      gameState.lives--;
      updateLives();
      
      if (gameState.lives <= 0) {
          triggerGameOver();
      } else {
          // Brief invincibility flash
          player.material.emissive.setHex(0xff0000);
          setTimeout(() => {
              player.material.emissive.setHex(0x00ff00);
          }, 200);
      }
  }
  
  // ==================== UI UPDATES ====================
  function updateScore(points) {
      gameState.score += points;
      document.getElementById('score').textContent = `SCORE: ${gameState.score}`;
  }
  
  function updateLives() {
      const hearts = '❤️ '.repeat(gameState.lives);
      document.getElementById('lives').textContent = hearts;
  }
  
  function updateSpeed() {
      const speedMultiplier = (gameState.speed / config.baseSpeed).toFixed(1);
      document.getElementById('speed').textContent = `SPEED: ${speedMultiplier}x`;
  }
  
  // ==================== RESTART ====================
  function restartGame() {
      gameState.isPlaying = true;
      gameState.isGameOver = false;
      gameState.score = 0;
      gameState.lives = 3;
      gameState.speed = config.baseSpeed;
      gameState.currentLane = 2;
      gameState.frameCount = 0;
      
      player.position.set(0, 0, 5);
      
      obstacles.forEach(obs => scene.remove(obs));
      obstacles.length = 0;
      
      collectibles.forEach(col => scene.remove(col));
      collectibles.length = 0;
      
      document.getElementById('gameOver').style.display = 'none';
      updateScore(0);
      updateLives();
      updateSpeed();
  }
  
  // ==================== ANIMATION LOOP ====================
  let waveOffset = 0;
  
  function animate() {
      requestAnimationFrame(animate);
      
      if (!gameState.isPlaying || gameState.isPaused) {
          renderer.render(scene, camera);
          return;
      }
      
      gameState.frameCount++;
      
      // Gradually increase speed
      if (gameState.speed < config.maxSpeed) {
          gameState.speed += config.speedIncrease;
          if (gameState.frameCount % 100 === 0) updateSpeed();
      }
      
      // -------- PLAYER MOVEMENT --------
      if (keys.left && gameState.currentLane > 0) {
          const targetX = (gameState.currentLane - 1 - 2) * config.laneWidth;
          if (Math.abs(player.position.x - targetX) > 0.1) {
              player.position.x -= 0.2;
          } else {
              player.position.x = targetX;
              gameState.currentLane--;
              keys.left = false;
          }
      }
      
      if (keys.right && gameState.currentLane < config.numLanes - 1) {
          const targetX = (gameState.currentLane + 1 - 2) * config.laneWidth;
          if (Math.abs(player.position.x - targetX) > 0.1) {
              player.position.x += 0.2;
          } else {
              player.position.x = targetX;
              gameState.currentLane++;
              keys.right = false;
          }
      }
      
      // Player rotation animation
      player.rotation.y += 0.02;
      playerGlow.rotation.y -= 0.03;
      
      // -------- ROAD WAVE ANIMATION --------
      waveOffset += 0.03;
      for (let i = 0; i < roadPos.count; i++) {
          const x = roadPos.getX(i);
          const y = roadPos.getY(i);
          const z = Math.sin(x * 0.2 + waveOffset) * 0.3 + Math.sin(y * 0.1) * 0.2;
          roadPos.setZ(i, z);
      }
      roadPos.needsUpdate = true;
      
      // -------- GRID MOVEMENT --------
      gridGroup.position.z += gameState.speed;
      if (gridGroup.position.z > 10) gridGroup.position.z = 0;
      
      // -------- SPAWN OBSTACLES --------
      if (gameState.frameCount % config.obstacleSpawnRate === 0) {
          createObstacle();
      }
      
      // -------- SPAWN COLLECTIBLES --------
      if (gameState.frameCount % config.collectibleSpawnRate === 0) {
          createCollectible();
      }
      
      // -------- UPDATE OBSTACLES --------
      for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.position.z += gameState.speed;
          obs.rotation.y += 0.03;
          
          if (checkCollision(player, obs)) {
              scene.remove(obs);
              obstacles.splice(i, 1);
              loseLife();
          } else if (obs.position.z > 10) {
              scene.remove(obs);
              obstacles.splice(i, 1);
              updateScore(5);
          }
      }
      
      // -------- UPDATE COLLECTIBLES --------
      for (let i = collectibles.length - 1; i >= 0; i--) {
          const col = collectibles[i];
          col.position.z += gameState.speed;
          col.rotation.y += 0.05;
          col.position.y = 0.5 + Math.sin(Date.now() * 0.003 + i) * 0.3;
          
          if (checkCollision(player, col, 0.6, 0.6)) {
              scene.remove(col);
              collectibles.splice(i, 1);
              updateScore(25);
          } else if (col.position.z > 10) {
              scene.remove(col);
              collectibles.splice(i, 1);
          }
      }
      
      // -------- CAMERA FOLLOW --------
      camera.position.x = player.position.x * 0.3;
      
      // -------- LIGHT ANIMATION --------
      neonLight1.position.z = player.position.z - 10;
      neonLight2.position.z = player.position.z - 10;
      
      renderer.render(scene, camera);
  }
  
  // ==================== RESIZE ====================
  window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
  });
  
  // ==================== START ====================
  animate();