import * as THREE from 'three';
import './style.css';
// import Game from './game.js';

export default class Shop {
  constructor(scene, position, size = { width: 20, height: 8, depth: 40 }, color = 0xcccccc, name = "Shop", items = []) {
    this.scene = scene;
    this.position = position;
    this.size = size;
    this.color = color;
    this.name = name;
    this.items = items;
    this.create();
  }

  invertColor(color) {
    // Extract hex value if it's a THREE.Color object
    const hexColor = (color.isColor) ? color.getHex() : color;
    // Invert by subtracting from 0xFFFFFF
    return 0xFFFFFF - hexColor;
  }

  create() {
    const { width, height, depth } = this.size;
    const wallMaterial = new THREE.MeshPhongMaterial({ color: this.color });
    const roofFloorMaterial = new THREE.MeshPhongMaterial({ color: this.color }); 
  
    const halfW = width / 2;
    const halfH = height / 2;
    const halfD = depth / 2;
  
    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, depth), roofFloorMaterial);
    roof.position.set(this.position.x, this.position.y + halfH, this.position.z);
    this.scene.add(roof);
  
    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.2), wallMaterial);
    backWall.position.set(this.position.x, this.position.y, this.position.z - halfD);
    this.scene.add(backWall);
  
    // Left wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, height, depth), wallMaterial);
    leftWall.position.set(this.position.x - halfW, this.position.y, this.position.z);
    this.scene.add(leftWall);
  
    // Right wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, height, depth), wallMaterial);
    rightWall.position.set(this.position.x + halfW, this.position.y, this.position.z);
    this.scene.add(rightWall);
  
    // Front wall split for door
    const doorWidth = 3;
    const wallSegmentWidth = (width - doorWidth) / 2;
    const doorHeight = 5;
  
    const frontLeft = new THREE.Mesh(
      new THREE.BoxGeometry(wallSegmentWidth, height, 0.2),
      wallMaterial
    );
    frontLeft.position.set(this.position.x - (doorWidth / 2 + wallSegmentWidth / 2), this.position.y, this.position.z + halfD);
    this.scene.add(frontLeft);
  
    const frontRight = new THREE.Mesh(
      new THREE.BoxGeometry(wallSegmentWidth, height, 0.2),
      wallMaterial
    );
    frontRight.position.set(this.position.x + (doorWidth / 2 + wallSegmentWidth / 2), this.position.y, this.position.z + halfD);
    this.scene.add(frontRight);
  
    // Top piece over the door
    const doorTop = new THREE.Mesh(
      new THREE.BoxGeometry(doorWidth, height - doorHeight, 0.2),
      wallMaterial
    );
    doorTop.position.set(this.position.x, this.position.y + doorHeight / 2, this.position.z + halfD);
    this.scene.add(doorTop);
  
    // Optional: Visible door mesh
    const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513, side: THREE.DoubleSide });
    this.door = new THREE.Mesh(doorGeometry, doorMaterial);
    this.door.position.set(this.position.x, this.position.y - (height / 2 - doorHeight / 2), this.position.z + halfD + 0.1);
    this.scene.add(this.door);
  
    this.createGableRoof();
    this.createItemFrames(this.items);
    this.createShopSign();
  }

  createGableRoof() {
    const width = this.size.width;
    const depth = this.size.depth;
    const height = this.size.height;
    const roofHeight = height * 0.6; // Height of the peak above the walls
    const overhang = 1; // Amount of overhang on all sides
    
    const roofMaterial = new THREE.MeshBasicMaterial({ 
      color: this.color,
      side: THREE.DoubleSide // Render both sides of the roof panels
    });
    
    // Left roof panel
    const leftRoofGeometry = new THREE.BufferGeometry();
    const leftVertices = new Float32Array([
      -(width/2 + overhang), height, -(depth/2 + overhang),  // Bottom left front (with overhang)
      0, height + roofHeight, -(depth/2 + overhang),         // Peak front (with overhang)
      -(width/2 + overhang), height, (depth/2 + overhang),   // Bottom left back (with overhang)
      0, height + roofHeight, (depth/2 + overhang)           // Peak back (with overhang)
    ]);
    leftRoofGeometry.setAttribute('position', new THREE.BufferAttribute(leftVertices, 3));
    leftRoofGeometry.setIndex([0, 1, 2, 2, 1, 3]);
    const leftRoof = new THREE.Mesh(leftRoofGeometry, roofMaterial);
    leftRoof.position.copy(this.position);
    leftRoof.position.y -=  roofHeight - overhang / 2;
    this.scene.add(leftRoof);
    
    // Right roof panel
    const rightRoofGeometry = new THREE.BufferGeometry();
    const rightVertices = new Float32Array([
      (width/2 + overhang), height, -(depth/2 + overhang),   // Bottom right front (with overhang)
      0, height + roofHeight, -(depth/2 + overhang),         // Peak front (with overhang)
      (width/2 + overhang), height, (depth/2 + overhang),    // Bottom right back (with overhang)
      0, height + roofHeight, (depth/2 + overhang)           // Peak back (with overhang)
    ]);
    rightRoofGeometry.setAttribute('position', new THREE.BufferAttribute(rightVertices, 3));
    rightRoofGeometry.setIndex([1, 0, 3, 3, 0, 2]); // Note: reversed indices for correct face orientation
    const rightRoof = new THREE.Mesh(rightRoofGeometry, roofMaterial);
    rightRoof.position.copy(this.position);
    rightRoof.position.y -=  roofHeight - overhang / 2;
    this.scene.add(rightRoof);
    
    // Add triangular front panel
    const frontPanelGeometry = new THREE.BufferGeometry();
    const frontVertices = new Float32Array([
      -(width/2 + overhang), height, -(depth/2 + overhang),  // Bottom left
      (width/2 + overhang), height, -(depth/2 + overhang),   // Bottom right
      0, height + roofHeight, -(depth/2 + overhang)          // Peak
    ]);
    frontPanelGeometry.setAttribute('position', new THREE.BufferAttribute(frontVertices, 3));
    frontPanelGeometry.setIndex([0, 1, 2]); // Counter-clockwise for front-facing
    
    // Create a slightly darker color for the gable panels
    const panelColor = new THREE.Color(this.color);
    panelColor.multiplyScalar(0.9); // Slightly darker
    
    const frontPanelMaterial = new THREE.MeshBasicMaterial({ 
      color: panelColor,
      side: THREE.DoubleSide
    });
    
    const frontPanel = new THREE.Mesh(frontPanelGeometry, frontPanelMaterial);
    frontPanel.position.copy(this.position);
    frontPanel.position.y -=  roofHeight - overhang / 2;
    this.scene.add(frontPanel);
    
    // Add triangular back panel
    const backPanelGeometry = new THREE.BufferGeometry();
    const backVertices = new Float32Array([
      -(width/2 + overhang), height, (depth/2 + overhang),   // Bottom left
      (width/2 + overhang), height, (depth/2 + overhang),    // Bottom right
      0, height + roofHeight, (depth/2 + overhang)           // Peak
    ]);
    backPanelGeometry.setAttribute('position', new THREE.BufferAttribute(backVertices, 3));
    backPanelGeometry.setIndex([2, 1, 0]); // Clockwise for back-facing
    
    const backPanel = new THREE.Mesh(backPanelGeometry, frontPanelMaterial); // Using same material
    backPanel.position.copy(this.position);
    backPanel.position.y -=  roofHeight - overhang / 2;
    this.scene.add(backPanel);
  }
 
  createShopSign() {
    // Create a larger canvas with extra padding
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1200; // Even larger width
    canvas.height = 400; // Taller height
    
    // Clear for transparency
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set your fancy font - ensure it's loaded first
    const fontSize = 100; // Slightly smaller font
    context.font = `${fontSize}px "Pacifico", cursive`;
    
    // Measure text to ensure we have enough space
    const textMetrics = context.measureText(this.name);
    const textWidth = textMetrics.width;
    
    // Get font metrics for better vertical positioning
    const fontHeight = fontSize * 1.2; // Approximate height based on font size
    
    // Draw text with proper centering
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.name, canvas.width/2, canvas.height/2);
    
    // Create texture with proper settings
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    // Create material with improved transparency
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.01 // Lower value for better text edges
    });
    
    // Create geometry with proper aspect ratio
    const signHeight = 2.0; // Increased height in THREE.js units
    const signWidth = signHeight * (canvas.width / canvas.height);
    const signGeometry = new THREE.PlaneGeometry(signWidth, signHeight);
    
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    
    // Position the sign with slight adjustment
    sign.position.set(
      this.position.x, 
      this.position.y + this.size.height/2 + 0.7, // Moved up slightly
      this.position.z + this.size.depth/2 + 1.1
    );
    
    this.scene.add(sign);
  }

  createItemFrames(items = []) {
    // Only use default items if this.items is empty and no items were passed
    if (!this.items.length && items.length === 0) {
      items = [
        { name: "Silver Pendant", price: "$29.99", description: "Elegant silver pendant with crystal accent", imageUrl: "images/pendant.jpg" },
        { name: "Gold Chain", price: "$49.99", description: "14K gold-plated chain, 18 inches", imageUrl: "images/chain.jpg" },
        { name: "Pearl Earrings", price: "$35.99", description: "Freshwater pearl studs with silver backing", imageUrl: "images/earrings.jpg" }
      ];
    } else {
      // Use either passed items or this.items
      items = items.length > 0 ? items : this.items;
    }
  
    // Frame dimensions and spacing - FURTHER INCREASED SIZES
    const frameWidth = 4.0;  // Increased from 3.5
    const frameHeight = 5.5; // Increased from 5.0
    const frameSpacing = 1.8; // Increased spacing
    const wallOffset = 0.15;
    
    // Calculate how many frames to put on each wall
    const totalItems = items.length;
    
    // If we have 3 or fewer items, put one on each wall
    if (totalItems <= 3) {
      if (totalItems > 0) this.createWallFrames('left', frameWidth, frameHeight, frameSpacing, wallOffset, [items[0]]);
      if (totalItems > 1) this.createWallFrames('back', frameWidth, frameHeight, frameSpacing, wallOffset, [items[1]]);
      if (totalItems > 2) this.createWallFrames('right', frameWidth, frameHeight, frameSpacing, wallOffset, [items[2]]);
    } else {
      // Distribute items evenly across walls
      const leftWallCapacity = Math.floor(this.size.depth / (frameWidth + frameSpacing));
      const backWallCapacity = Math.floor(this.size.width / (frameWidth + frameSpacing));
      const rightWallCapacity = Math.floor(this.size.depth / (frameWidth + frameSpacing));
      
      const totalCapacity = leftWallCapacity + backWallCapacity + rightWallCapacity;
      
      // If we have more items than capacity, we'll only show what fits
      const itemsToShow = Math.min(totalItems, totalCapacity);
      
      // Calculate items per wall proportionally
      let leftWallItems = Math.round(itemsToShow * (leftWallCapacity / totalCapacity));
      let backWallItems = Math.round(itemsToShow * (backWallCapacity / totalCapacity));
      let rightWallItems = Math.round(itemsToShow * (rightWallCapacity / totalCapacity));
      
      // Adjust if rounding causes issues
      const allocatedItems = leftWallItems + backWallItems + rightWallItems;
      if (allocatedItems < itemsToShow) {
        // Add remaining items to the wall with most capacity
        if (leftWallCapacity >= backWallCapacity && leftWallCapacity >= rightWallCapacity) {
          leftWallItems += (itemsToShow - allocatedItems);
        } else if (backWallCapacity >= leftWallCapacity && backWallCapacity >= rightWallCapacity) {
          backWallItems += (itemsToShow - allocatedItems);
        } else {
          rightWallItems += (itemsToShow - allocatedItems);
        }
      } else if (allocatedItems > itemsToShow) {
        // Remove excess items from the wall with least capacity
        if (leftWallCapacity <= backWallCapacity && leftWallCapacity <= rightWallCapacity) {
          leftWallItems -= (allocatedItems - itemsToShow);
        } else if (backWallCapacity <= leftWallCapacity && backWallCapacity <= rightWallCapacity) {
          backWallItems -= (allocatedItems - itemsToShow);
        } else {
          rightWallItems -= (allocatedItems - itemsToShow);
        }
      }
      
      // Create slices of the items array for each wall
      let itemIndex = 0;
      const leftWallItemsArray = items.slice(itemIndex, itemIndex + leftWallItems);
      itemIndex += leftWallItems;
      
      const backWallItemsArray = items.slice(itemIndex, itemIndex + backWallItems);
      itemIndex += backWallItems;
      
      const rightWallItemsArray = items.slice(itemIndex, itemIndex + rightWallItems);
      
      // Create frames for each wall
      if (leftWallItemsArray.length > 0) {
        this.createWallFrames('left', frameWidth, frameHeight, frameSpacing, wallOffset, leftWallItemsArray);
      }
      
      if (backWallItemsArray.length > 0) {
        this.createWallFrames('back', frameWidth, frameHeight, frameSpacing, wallOffset, backWallItemsArray);
      }
      
      if (rightWallItemsArray.length > 0) {
        this.createWallFrames('right', frameWidth, frameHeight, frameSpacing, wallOffset, rightWallItemsArray);
      }
    }
  }
  
  createWallFrames(wallType, frameWidth, frameHeight, frameSpacing, wallOffset, items) {
    let startPos, stepVector, rotationY;
    const maxFrames = items.length;
    
    // Calculate positions based on wall type
    switch(wallType) {
      case 'left':
        // Center frames on wall
        const leftWallTotalWidth = maxFrames * frameWidth + (maxFrames - 1) * frameSpacing;
        const leftWallCenterZ = this.position.z;
        const leftWallStartZ = leftWallCenterZ + leftWallTotalWidth/2 - frameWidth/2;
        
        startPos = new THREE.Vector3(
          this.position.x - this.size.width/2 + wallOffset,
          this.position.y - 0.5, // Lowered to eye level
          leftWallStartZ
        );
        stepVector = new THREE.Vector3(0, 0, -(frameWidth + frameSpacing));
        rotationY = Math.PI / 2;
        break;
      case 'right':
        // Center frames on wall
        const rightWallTotalWidth = maxFrames * frameWidth + (maxFrames - 1) * frameSpacing;
        const rightWallCenterZ = this.position.z;
        const rightWallStartZ = rightWallCenterZ + rightWallTotalWidth/2 - frameWidth/2;
        
        startPos = new THREE.Vector3(
          this.position.x + this.size.width/2 - wallOffset,
          this.position.y - 0.5, // Lowered to eye level
          rightWallStartZ
        );
        stepVector = new THREE.Vector3(0, 0, -(frameWidth + frameSpacing));
        rotationY = -Math.PI / 2;
        break;
      case 'back':
        // Center frames on wall
        const backWallTotalWidth = maxFrames * frameWidth + (maxFrames - 1) * frameSpacing;
        const backWallCenterX = this.position.x;
        const backWallStartX = backWallCenterX - backWallTotalWidth/2 + frameWidth/2;
        
        startPos = new THREE.Vector3(
          backWallStartX,
          this.position.y - 0.5, // Lowered to eye level
          this.position.z - this.size.depth/2 + wallOffset
        );
        stepVector = new THREE.Vector3(frameWidth + frameSpacing, 0, 0);
        rotationY = 0;
        break;
    }
    
    for (let i = 0; i < maxFrames; i++) {
      const item = items[i];
      
      // Create the main frame
      const frameGroup = new THREE.Group();
      
      // Wooden frame background
      const frameBackGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.1);
      const frameBackMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const frameBack = new THREE.Mesh(frameBackGeometry, frameBackMaterial);
      frameGroup.add(frameBack);
      
      // Product image area
      const imageWidth = frameWidth * 0.95;
      const imageHeight = frameHeight * 0.75; // Increased from 0.65 to make image larger
      const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
      
      // Create canvas for the product image
      const imageCanvas = document.createElement('canvas');
      const imageContext = imageCanvas.getContext('2d');
      imageCanvas.width = 1536; // High resolution
      imageCanvas.height = 1536;
      
      // Fill with placeholder color until image loads
      imageContext.fillStyle = '#FFFFFF';
      imageContext.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
      
      // Add placeholder text
      imageContext.fillStyle = '#000000';
      imageContext.font = '80px Arial';
      imageContext.textAlign = 'center';
      imageContext.fillText('Product Image', imageCanvas.width/2, imageCanvas.height/2);
      
      // Create texture from canvas
      const imageTexture = new THREE.CanvasTexture(imageCanvas);
      const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture });
      const imagePanel = new THREE.Mesh(imageGeometry, imageMaterial);
      imagePanel.position.z = 0.15; // Slightly in front of the frame
      imagePanel.position.y = frameHeight * 0.10; // Positioned lower in the frame
      frameGroup.add(imagePanel);
      
      // Load the actual image if URL is provided
      if (item.imageUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(item.imageUrl, (texture) => {
          imageMaterial.map = texture;
          imageMaterial.needsUpdate = true;
        }, undefined, (err) => {
          console.error('Error loading image:', err);
        });
      }
      
      // Product info area - More compact to fit under larger image
      const infoWidth = frameWidth * 0.95;
      const infoHeight = frameHeight * 0.22; // Reduced from 0.32 to save space
      const infoGeometry = new THREE.PlaneGeometry(infoWidth, infoHeight);
      
      // Create canvas for product info
      const infoCanvas = document.createElement('canvas');
      const infoContext = infoCanvas.getContext('2d');
      infoCanvas.width = 1536;
      infoCanvas.height = 768; // Reduced height for more compact text
      
      // Fill with light background
      infoContext.fillStyle = '#F5F5F5';
      infoContext.fillRect(0, 0, infoCanvas.width, infoCanvas.height);
      
      // Add product name with word wrapping
      infoContext.fillStyle = '#000000';
      infoContext.font = 'bold 64px Arial';
      infoContext.textAlign = 'center';
      
      // Word wrap function for product name (2 lines max)
      const wrapText = (context, text, x, y, maxWidth, lineHeight, maxLines) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
            lineCount++;
            
            if (lineCount >= maxLines - 1) {
              // If we're on the last allowed line, add ellipsis if needed
              if (n < words.length - 1) {
                // Check if the remaining text will fit
                const remainingText = words.slice(n).join(' ');
                const remainingMetrics = context.measureText(remainingText);
                
                if (remainingMetrics.width > maxWidth) {
                  // Trim and add ellipsis
                  let trimmedLine = line;
                  while (context.measureText(trimmedLine + '...').width > maxWidth) {
                    trimmedLine = trimmedLine.slice(0, -1);
                  }
                  context.fillText(trimmedLine + '...', x, currentY);
                  return currentY + lineHeight;
                }
              }
            }
          } else {
            line = testLine;
          }
        }
        
        context.fillText(line, x, currentY);
        return currentY + lineHeight;
      };
      
      // More compact text layout
      let currentY = 80; // Starting higher
      currentY = wrapText(infoContext, item.name, infoCanvas.width/2, currentY, infoCanvas.width - 100, 65, 2);
      
      // Add price with increased font size
      infoContext.font = 'bold 80px Arial';
      infoContext.fillStyle = '#E63946';
      infoContext.fillText(item.price, infoCanvas.width/2, currentY + 10); // Less vertical space
      currentY += 75; // Less space after price
      
      // Add description with increased font and up to 4 lines
      infoContext.font = '60px Arial';
      infoContext.fillStyle = '#333333';
      wrapText(infoContext, item.description, infoCanvas.width/2, currentY, infoCanvas.width - 100, 55, 4);
      
      // Create texture from info canvas
      const infoTexture = new THREE.CanvasTexture(infoCanvas);
      const infoMaterial = new THREE.MeshBasicMaterial({ map: infoTexture });
      const infoPanel = new THREE.Mesh(infoGeometry, infoMaterial);
      infoPanel.position.z = 0.15;
      infoPanel.position.y = -frameHeight * 0.39; // Positioned immediately under the image
      frameGroup.add(infoPanel);
      
      // Position and rotate the frame group
      frameGroup.position.copy(startPos.clone().add(stepVector.clone().multiplyScalar(i)));
      frameGroup.rotation.y = rotationY;
      frameGroup.position.z += (wallType === 'back' ? 0.15 : 0);
      frameGroup.position.x += (wallType === 'left' ? 0.15 : (wallType === 'right' ? -0.15 : 0));
      
      this.scene.add(frameGroup);
    }
  }
  

}