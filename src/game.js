import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import './style.css';
import Shop from './shop.js';
import { data } from './data.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Light blue sky color
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.prevTime = performance.now();
    this.shops = [];
    this.collisionDistance = 2; // Minimum distance to keep from objects
    this.isRunning = false;
    this.walkSpeed = 0.1;
    this.runSpeed = 0.5;
    this.currentSpeed = this.walkSpeed;
    this.raycaster = new THREE.Raycaster();
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.audioListener = new THREE.AudioListener();
    this.soundEffects = {};
    this.uiElements = {};
    this.interactableObjects = [];
    this.isJumping = false;
    this.jumpHeight = 1.0; // Maximum jump height
    this.jumpSpeed = 15.0; // Initial jump velocity
    this.gravity = 120.0; // Gravity force
    this.verticalVelocity = 0;
    this.groundLevel = 2; // Default camera height
    
    this.stats = new Stats();
    this.stats.dom.style.transform = 'scale(0.1)';
    this.stats.dom.style.transformOrigin = 'top left';
    document.body.appendChild(this.stats.dom);

    this.init(); 
  }

  init() {
    // Setup loading screen
    this.setupLoadingScreen();
    
    // Setup renderer with improved quality
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.shadowMap.enabled = false;
    // this.renderer.shadowMap.type = THREE.BasicShadowMap; // Use BasicShadowMap for better performance
    this.renderer.outputEncoding = THREE.LinearEncoding; // Use LinearEncoding for better performance
    this.renderer.toneMapping = THREE.NoToneMapping; // Disable tone mapping for better performance
    // this.renderer.toneMappingExposure = 1.2;
    document.getElementById('app').appendChild(this.renderer.domElement);

    // Handle window resizing
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.updateUIPositions();
    });

    // Setup camera and audio
    this.camera.add(this.audioListener);
    
    // Setup controls with improved settings
    this.controls = new PointerLockControls(this.camera, document.body);
    this.controls.pointerSpeed = 0.8; // Slightly slower mouse sensitivity for better control
    
    // Create welcome UI
    this.createWelcomeUI();
    
    // Setup fog for depth perception
    // this.scene.fog = new THREE.Fog(0xC8D8E8, 20, 100); // Linear fog is less intensive

    // Create realistic ground with texture
    this.createGround();

    // Create skybox
    this.createSkybox();

    // Create some shops
    this.createShops();

    // Add realistic lighting
    this.setupLighting();

    // Set camera position
    this.camera.position.y = 2; // Average human height
    this.camera.position.z = 180;

    // Setup movement controls
    this.setupMovementControls();
    
    // Setup interaction system
    this.setupInteractionSystem();
    
    // Setup UI elements
    this.createGameUI();
    
    // Setup ambient sounds
    this.setupAmbientSounds();

    // Start animation loop
    this.animate();
  }
  
  setupLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.position = 'absolute';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.backgroundColor = '#000';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.flexDirection = 'column';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.zIndex = '1000';
    loadingScreen.style.color = '#fff';
    loadingScreen.style.fontFamily = 'Arial, sans-serif';
    
    const loadingText = document.createElement('h1');
    loadingText.textContent = 'Loading...';
    
    const progressBar = document.createElement('div');
    progressBar.style.width = '50%';
    progressBar.style.height = '20px';
    progressBar.style.backgroundColor = '#333';
    progressBar.style.borderRadius = '10px';
    progressBar.style.overflow = 'hidden';
    progressBar.style.marginTop = '20px';
    
    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.width = '0%';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = '#4CAF50';
    progressFill.style.transition = 'width 0.3s ease';
    
    progressBar.appendChild(progressFill);
    loadingScreen.appendChild(loadingText);
    loadingScreen.appendChild(progressBar);
    document.body.appendChild(loadingScreen);
    
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      document.getElementById('progress-fill').style.width = progress + '%';
    };
    
    this.loadingManager.onLoad = () => {
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
      }, 500);
    };
  }
  
  createWelcomeUI() {
    const welcomeScreen = document.createElement('div');
    welcomeScreen.id = 'welcome-screen';
    welcomeScreen.style.position = 'absolute';
    welcomeScreen.style.width = '100%';
    welcomeScreen.style.height = '100%';
    welcomeScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    welcomeScreen.style.top = '0';
    welcomeScreen.style.left = '0';
    welcomeScreen.style.display = 'flex';
    welcomeScreen.style.flexDirection = 'column';
    welcomeScreen.style.alignItems = 'center';
    welcomeScreen.style.justifyContent = 'center';
    welcomeScreen.style.zIndex = '100';
    welcomeScreen.style.color = '#fff';
    welcomeScreen.style.fontFamily = 'Arial, sans-serif';
    
    const title = document.createElement('h1');
    title.textContent = 'Hi Sue! Happy Anniversary:)';
    title.style.marginBottom = '20px';
    title.style.fontSize = '3em';
    title.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <p>Its retail therapy time but irl but online</p>
      <p>Use <strong>W, A, S, D</strong> to move around</p>
      <p>Press <strong>Shift</strong> to run</p>
      <p>Press <strong>Space</strong> to jump</p>
      <p>Press <strong>ESC</strong> to pause</p>
    `;
    instructions.style.textAlign = 'center';
    instructions.style.marginBottom = '30px';
    instructions.style.lineHeight = '1.6';
    
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Exploring';
    startButton.style.padding = '15px 30px';
    startButton.style.fontSize = '1.2em';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'background-color 0.3s';
    
    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = '#45a049';
    });
    
    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = '#4CAF50';
    });
    
    startButton.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      this.controls.lock();
    });
    
    welcomeScreen.appendChild(title);
    welcomeScreen.appendChild(instructions);
    welcomeScreen.appendChild(startButton);
    document.body.appendChild(welcomeScreen);
    
    // Show welcome screen when controls are unlocked
    this.controls.addEventListener('unlock', () => {
      welcomeScreen.style.display = 'flex';
    });
  }
  
  createGround() {
    const texture = this.textureLoader.load('textures/grass_diffuse.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 20);
  
    const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
  
    const geometry = new THREE.PlaneGeometry(100, 400);
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = Math.PI / 2;
    this.scene.add(ground);
  
    this.createPath();
  }
  
  createPath() {
    const texture = this.textureLoader.load('textures/path_diffuse.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 100);
  
    const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
  
    const geometry = new THREE.PlaneGeometry(6, 400);
    const path = new THREE.Mesh(geometry, material);
    path.rotation.x = Math.PI / 2;
    path.position.y = 0.05; // Prevent z-fighting
    this.scene.add(path);
  }
  
  
  createSkybox() {
    const skyboxLoader = new THREE.CubeTextureLoader(this.loadingManager);
    const skyboxTexture = skyboxLoader.load([
      'textures/skybox/px.jpg', 'textures/skybox/nx.jpg',
      'textures/skybox/py.jpg', 'textures/skybox/ny.jpg',
      'textures/skybox/pz.jpg', 'textures/skybox/nz.jpg'
    ]);
    
    this.scene.background = skyboxTexture;
  }
  
  setupLighting() {
    // Basic ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
  
    // Basic directional light (sun) with lightweight shadows
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
  
    // Simplified shadow settings for performance
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.bias = -0.0005;
  
    this.scene.add(sunLight);
  }
  
  
  setupMovementControls() {
    // Keyboard controls
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isRunning = true;
          this.currentSpeed = this.runSpeed;
          this.playFootstepSound(true);
          break;
        case 'Space':
          if (!this.isJumping && this.camera.position.y <= this.groundLevel) {
            this.isJumping = true;
            this.verticalVelocity = this.jumpSpeed;
          }
          break;
        case 'KeyE':
          this.tryInteract();
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isRunning = false;
          this.currentSpeed = this.walkSpeed;
          this.playFootstepSound(false);
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  updateJump(deltaTime) {
    if (this.isJumping) {
      // Apply gravity to vertical velocity
      this.verticalVelocity -= this.gravity * deltaTime;
      
      // Move camera vertically
      this.camera.position.y += this.verticalVelocity * deltaTime;
      
      // Check if we've landed
      if (this.camera.position.y <= this.initialY) {
        this.camera.position.y = this.initialY;
        this.isJumping = false;
        this.verticalVelocity = 0;
        // Play landing sound if implemented
        this.playLandSound();
      }
    }
  }
  
  setupInteractionSystem() {
    // Create interaction indicator
    const interactionIndicator = document.createElement('div');
    interactionIndicator.id = 'interaction-indicator';
    interactionIndicator.style.position = 'absolute';
    interactionIndicator.style.top = '50%';
    interactionIndicator.style.left = '50%';
    interactionIndicator.style.transform = 'translate(-50%, -50%)';
    interactionIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    interactionIndicator.style.color = '#000';
    interactionIndicator.style.padding = '10px 15px';
    interactionIndicator.style.borderRadius = '5px';
    interactionIndicator.style.fontFamily = 'Arial, sans-serif';
    interactionIndicator.style.fontSize = '14px';
    interactionIndicator.style.display = 'none';
    interactionIndicator.style.zIndex = '5';
    document.body.appendChild(interactionIndicator);
    
    this.uiElements.interactionIndicator = interactionIndicator;
  }
  
  // tryInteract() {
  //   // Cast a ray from the camera to detect interactive objects
  //   this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
  //   const intersects = this.raycaster.intersectObjects(this.interactableObjects);
    
  //   if (intersects.length > 0 && intersects[0].distance < 5) {
  //     const interactedObject = intersects[0].object;
      
  //     if (interactedObject.userData.type === 'shop') {
  //       this.enterShop(interactedObject.userData.shopId);
  //     }
  //   }
  // }
  
  // enterShop(shopId) {
  //   // Create shop UI
  //   const shopUI = document.createElement('div');
  //   shopUI.id = 'shop-ui';
  //   shopUI.style.position = 'absolute';
  //   shopUI.style.top = '50%';
  //   shopUI.style.left = '50%';
  //   shopUI.style.transform = 'translate(-50%, -50%)';
  //   shopUI.style.width = '80%';
  //   shopUI.style.maxWidth = '800px';
  //   shopUI.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  //   shopUI.style.color = '#fff';
  //   shopUI.style.padding = '20px';
  //   shopUI.style.borderRadius = '10px';
  //   shopUI.style.fontFamily = 'Arial, sans-serif';
  //   shopUI.style.zIndex = '50';
    
  //   const shopName = document.createElement('h2');
  //   shopName.textContent = `Shop #${shopId}`;
  //   shopName.style.textAlign = 'center';
  //   shopName.style.marginBottom = '20px';
    
  //   const shopContent = document.createElement('div');
  //   shopContent.style.display = 'grid';
  //   shopContent.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
  //   shopContent.style.gap = '15px';
  //   shopContent.style.maxHeight = '400px';
  //   shopContent.style.overflowY = 'auto';
    
  //   // Add sample products
  //   for (let i = 0; i < 12; i++) {
  //     const product = document.createElement('div');
  //     product.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  //     product.style.padding = '10px';
  //     product.style.borderRadius = '5px';
  //     product.style.textAlign = 'center';
  //     product.style.cursor = 'pointer';
  //     product.style.transition = 'background-color 0.2s';
      
  //     const productImage = document.createElement('div');
  //     productImage.style.width = '100%';
  //     productImage.style.height = '100px';
  //     productImage.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
  //     productImage.style.borderRadius = '3px';
  //     productImage.style.marginBottom = '10px';
      
  //     const productName = document.createElement('p');
  //     productName.textContent = `Product ${i + 1}`;
  //     productName.style.margin = '0 0 5px 0';
      
  //     const productPrice = document.createElement('p');
  //     productPrice.textContent = `$${(Math.random() * 100).toFixed(2)}`;
  //     productPrice.style.fontWeight = 'bold';
  //     productPrice.style.margin = '0';
      
  //     product.appendChild(productImage);
  //     product.appendChild(productName);
  //     product.appendChild(productPrice);
      
  //     product.addEventListener('mouseover', () => {
  //       product.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  //     });
      
  //     product.addEventListener('mouseout', () => {
  //       product.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  //     });
      
  //     product.addEventListener('click', () => {
  //       alert(`Added ${productName.textContent} to cart!`);
  //     });
      
  //     shopContent.appendChild(product);
  //   }
    
  //   const closeButton = document.createElement('button');
  //   closeButton.textContent = 'Exit Shop';
  //   closeButton.style.display = 'block';
  //   closeButton.style.margin = '20px auto 0';
  //   closeButton.style.padding = '10px 20px';
  //   closeButton.style.backgroundColor = '#4CAF50';
  //   closeButton.style.border = 'none';
  //   closeButton.style.borderRadius = '5px';
  //   closeButton.style.color = 'white';
  //   closeButton.style.cursor = 'pointer';
    
  //   closeButton.addEventListener('click', () => {
  //     document.body.removeChild(shopUI);
  //     this.controls.lock();
  //   });
    
  //   shopUI.appendChild(shopName);
  //   shopUI.appendChild(shopContent);
  //   shopUI.appendChild(closeButton);
  //   document.body.appendChild(shopUI);
    
  //   this.controls.unlock();
  // }
  
  createGameUI() {
    // Create a minimalistic HUD
    const hud = document.createElement('div');
    hud.id = 'game-hud';
    hud.style.position = 'absolute';
    hud.style.bottom = '20px';
    hud.style.left = '50%';
    hud.style.transform = 'translateX(-50%)';
    hud.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    hud.style.color = '#fff';
    hud.style.padding = '10px 20px';
    hud.style.borderRadius = '20px';
    hud.style.fontFamily = 'Arial, sans-serif';
    hud.style.fontSize = '14px';
    hud.style.zIndex = '5';
    hud.style.display = 'flex';
    hud.style.alignItems = 'center';
    hud.style.gap = '15px';
    
    // Add a mini-map or location indicator
    const locationIndicator = document.createElement('div');
    locationIndicator.textContent = 'Shopping District';
    locationIndicator.style.display = 'flex';
    locationIndicator.style.alignItems = 'center';
    
    const locationIcon = document.createElement('span');
    locationIcon.innerHTML = '📍';
    locationIcon.style.marginRight = '5px';
    locationIndicator.prepend(locationIcon);
    
    // Add a crosshair
    const crosshair = document.createElement('div');
    crosshair.id = 'crosshair';
    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.width = '5px';
    crosshair.style.height = '5px';
    crosshair.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    crosshair.style.borderRadius = '50%';
    crosshair.style.zIndex = '1';
    
    hud.appendChild(locationIndicator);
    document.body.appendChild(hud);
    document.body.appendChild(crosshair);
    
    this.uiElements.hud = hud;
    this.uiElements.crosshair = crosshair;
  }
  
  updateUIPositions() {
    // Update UI positions if needed when window is resized
    if (this.uiElements.hud) {
      this.uiElements.hud.style.bottom = '20px';
      this.uiElements.hud.style.left = '50%';
    }
  }
  
  setupAmbientSounds() {
    // Create ambient background sounds
    const ambientSound = new THREE.Audio(this.audioListener);
    const audioLoader = new THREE.AudioLoader(this.loadingManager);
    
    audioLoader.load('sounds/ambient_outdoor.mp3', (buffer) => {
      ambientSound.setBuffer(buffer);
      ambientSound.setLoop(true);
      ambientSound.setVolume(0.5);
      ambientSound.play();
    });
    
    // Create footstep sounds
    this.soundEffects.footstepsWalk = new THREE.Audio(this.audioListener);
    this.soundEffects.footstepsRun = new THREE.Audio(this.audioListener);
    
    audioLoader.load('sounds/footsteps_walk.mp3', (buffer) => {
      this.soundEffects.footstepsWalk.setBuffer(buffer);
      this.soundEffects.footstepsWalk.setLoop(true);
      this.soundEffects.footstepsWalk.setVolume(0.3);
    });
    
    audioLoader.load('sounds/footsteps_run.mp3', (buffer) => {
      this.soundEffects.footstepsRun.setBuffer(buffer);
      this.soundEffects.footstepsRun.setLoop(true);
      this.soundEffects.footstepsRun.setVolume(0.4);
    });
  }
  
  playFootstepSound(isRunning) {
    const isMoving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
    
    // Stop all footstep sounds if not moving or if jumping
    if (!isMoving || this.isJumping) {
      if (this.soundEffects.footstepsWalk?.isPlaying) {
        this.soundEffects.footstepsWalk.stop();
      }
      if (this.soundEffects.footstepsRun?.isPlaying) {
        this.soundEffects.footstepsRun.stop();
      }
      return;
    }

    // Handle running state change
    if (isRunning) {
      if (this.soundEffects.footstepsWalk?.isPlaying) {
        this.soundEffects.footstepsWalk.stop();
      }
      if (this.soundEffects.footstepsRun?.buffer && !this.soundEffects.footstepsRun.isPlaying) {
        this.soundEffects.footstepsRun.setVolume(0.4);
        this.soundEffects.footstepsRun.play();
      }
    } else {
      if (this.soundEffects.footstepsRun?.isPlaying) {
        this.soundEffects.footstepsRun.stop();
      }
      if (this.soundEffects.footstepsWalk?.buffer && !this.soundEffects.footstepsWalk.isPlaying) {
        this.soundEffects.footstepsWalk.setVolume(0.3);
        this.soundEffects.footstepsWalk.play();
      }
    }
  }

  createShops() {
    data.forEach(shopData => {
      const shop = new Shop(
        this.scene,
        shopData.position,
        shopData.size,
        shopData.colour,
        shopData.name,
        shopData.items
      );
      this.shops.push(shop);
    });
  }

  checkShopCollision(position, shop) {
    const bounds = {
      minX: shop.position.x - shop.size.width/2 - this.collisionDistance,
      maxX: shop.position.x + shop.size.width/2 + this.collisionDistance,
      minZ: shop.position.z - shop.size.depth/2 - this.collisionDistance,
      maxZ: shop.position.z + shop.size.depth/2 + this.collisionDistance
    };

    // Check if we're near the door area
    const doorWidth = 3;
    const isDoorArea = 
      position.x > (shop.position.x - doorWidth/2) &&
      position.x < (shop.position.x + doorWidth/2) &&
      Math.abs(position.z - (shop.position.z + shop.size.depth/2)) < this.collisionDistance;

    // If we're near the door, allow movement
    if (isDoorArea) {
      // Check if we're crossing the threshold
      const isEntering = position.z < shop.position.z + shop.size.depth/2;
      if (isEntering !== shop.isPlayerInside) {
        shop.isPlayerInside = isEntering;
        if (shop.isPlayerInside) {
          this.scene.background = new THREE.Color(0x333333); // Dark interior
        } else {
          this.scene.background = new THREE.Color(0x87CEEB); // Sky color
        }
      }
      return false; // Always allow movement in door area
    }

    // If we're inside the shop
    if (shop.isPlayerInside) {
      // Only check collision with outer walls
      const isCollidingWithWall = 
        (Math.abs(position.x - bounds.minX) < this.collisionDistance ||
         Math.abs(position.x - bounds.maxX) < this.collisionDistance ||
         Math.abs(position.z - bounds.minZ) < this.collisionDistance ||
         Math.abs(position.z - bounds.maxZ) < this.collisionDistance);
      
      // Only return true (block movement) if we're trying to go through a wall
      // AND we're actually inside the shop bounds (to prevent getting stuck on corners)
      return isCollidingWithWall &&
             position.x > bounds.minX && position.x < bounds.maxX &&
             position.z > bounds.minZ && position.z < bounds.maxZ;
    }

    // If outside, prevent walking through walls (except door)
    return position.x > bounds.minX && position.x < bounds.maxX &&
           position.z > bounds.minZ && position.z < bounds.maxZ;
  }

  updateMovement() {
    const time = performance.now();
    const delta = Math.min((time - this.prevTime) / 1000, 0.1);

    // Apply damping
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    // Get movement direction
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.direction.x !== 0 || this.direction.z !== 0) {
      // Get camera's forward direction (excluding Y component)
      const cameraDirection = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraDirection.normalize();

      // Calculate right vector
      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

      // Combine forward/back and left/right movement
      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(cameraDirection, this.direction.z);
      moveVector.addScaledVector(rightVector, this.direction.x);
      moveVector.normalize();

      // Apply movement force
      const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
      this.velocity.x = moveVector.x * speed * 50 * delta;
      this.velocity.z = moveVector.z * speed * 50 * delta;
    }

    // Calculate next position
    const nextPosition = new THREE.Vector3();
    nextPosition.copy(this.camera.position);
    nextPosition.x += this.velocity.x;
    nextPosition.z += this.velocity.z;

    // Check for collisions
    let canMove = true;
    for (const shop of this.shops) {
      if (this.checkShopCollision(nextPosition, shop)) {
        canMove = false;
        break;
      }
    }

    // Move if no collision
    if (canMove) {
      this.camera.position.copy(nextPosition);
    }

    this.prevTime = time;
  }

  animate() {
    this.stats.begin();
    
    requestAnimationFrame(this.animate.bind(this));
  
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;
    
    // Skip frames if FPS is too low
    if (delta > 0.1) {
      this.prevTime = time;
      return;
    }
    
    if (this.controls.isLocked) {
      // Update horizontal movement
      this.updateMovement();
      
      // Update footstep sounds based on current movement state
      this.playFootstepSound(this.isRunning);
      
      // Update vertical movement (jumping)
      if (this.isJumping || this.camera.position.y > this.groundLevel) {
        // Apply gravity
        this.verticalVelocity -= this.gravity * delta;
        
        // Update vertical position
        this.camera.position.y += this.verticalVelocity * delta;
        
        // Check for landing
        if (this.camera.position.y <= this.groundLevel) {
          this.camera.position.y = this.groundLevel;
          this.isJumping = false;
          this.verticalVelocity = 0;
        }
      }
    }
    
    this.renderer.render(this.scene, this.camera);

    this.shops.forEach(shop => {
      const distance = this.camera.position.distanceTo(shop.position);
      if (distance > 100) {
        shop.visible = false;
      } else {
        shop.visible = true;
      }
    });

    this.prevTime = time;
    this.stats.end();
  }
}
