import * as THREE from 'three';

export const data = [
    {
      name: 'Necklace Nest',
      position: new THREE.Vector3(-30, 4, -40),
      size: { width: 20, height: 8, depth: 25 },
      colour: new THREE.Color(0xf211df),
      items: [
        { name: "Tiffany and Co - Bead Necklace", price: "$1000", description: "Inspired by the iconic key ring first introduced in 1969, the Return to Tiffany collection is a classic reinvented. A simple and elegant beaded necklace features an engraved heart tag, a symbol of the collection's rich history and iconic designs.", imageUrl: "images/tiffany.png" }, 
        { name: "Vivienne Westwood - Penis Necklace", price: "$680", description: "The Penis necklace recalls Vivienne's admiration for ancient art, where the bold motif was often used to symbolise themes of fertility or strength. The style is offered in a polished, silver-toned finish, complete with a chunky cable chain and a secure clasp fastening.", imageUrl: "images/penis.jpg" }, 
        { name: "En Route - Vanan Heart Necklace", price: "$32", description: "Ignite your style with our captivating Black Beaded Heart Necklace. Meticulously crafted with attention to every detail, this exquisite accessory showcases a delicate heart pendant with shimmering black beads.", imageUrl: "images/vanan.jpg" }, 
        { name: "En Route - Daisy Molecule Chain with Cross", price: "$102", description: "Step into the realm of reinterpreted \"Regency\" with this unique and contemporary necklace – A harmonious blend of ornate and edgy, street-inspired style, the daisy inspired charm and cross pendant commands attention and elevates any streetwear moment.", imageUrl: "images/daisy.png" }, 
        { name: "En Route - Aphrodite's Song Necklace", price: "$48", description: "Tapping into Psyche Vs. Aphrodite, this chain layered heart and cross necklace represents the goddess of love's envy but means so much more. The silver chain and black heart screams CyberPunk and Indie Sleeze.", imageUrl: "images/aphrodite.png" }, 
        { name: "En Route - Everette Cross Necklace", price: "$52", description: "An Old Italian inspired brass plated cross with a shell pearl droplet. An essence of royalty mixed with a touch of soft goth tapping into the maximalist trend and combines cottagecore to embrace rebellion.", imageUrl: "images/everette.png" }, 
        { name: "Emma Rae - Silver Small Heart Necklace", price: "$185", description: "Looking for a tiny heart necklace? The Mini Love-Lock heart necklace is a Victorian inspired treasure for lovers of dark beauty. The Mini Love-Lock necklace is composed of a handcrafted skull motif on a padlock pendant.", imageUrl: "images/red_heart.jpg" }, 
        { name: "Vivienne Westwood - Emerald Orb Pendant Necklace", price: "$230", description: "Our New Petite Orb Pendant necklace has become a signature style of the house. This season, the piece receives an update with silver-tone plating and a colourful three-dimensional orb encased with a crystal-encrusted Saturn ring.", imageUrl: "images/green_planet.jpeg" }, 
        { name: "Vivienne Westwood - Relief Pendant Necklace", price: "$200", description: "The orb is an essential element of the house's iconography, evoking Vivienne's vision of launching tradition into the future. Our Mini Bas Relief Pendant necklace features a crystal-encrusted orb at the centre of the design.", imageUrl: "images/silver_planet.jpg" }, 
        { name: "Vivienne Westwood - Black Diamante Heart Pendant Necklace", price: "$210", description: "The heart shape has become a signature style of the house, having appeared in many collections throughout our history, from political prints to cherished artworks. The New Diamante Heart Pendant necklace revives the motif.", imageUrl: "images/black_planet.jpg" }, 
        { name: "Vivienne Westwood - Pink Octavie Pendant Necklace", price: "$305", description: "Our Octavie Pendant necklace receives a bow-shaped design reminiscent of Georgian jewellery, adorned with pavé-set glistening crystals in a pink finish. This piece incorporates our signature three-dimensional dangle orb motif.", imageUrl: "images/pink_planet.jpg" }, 
        { name: "Pandora - Winged Heart Mini Dangle Charm", price: "$49", description: "Inspired by individuality and self-expression, this meaningful heart design features a heart-shaped black man-made crystal at its centre. Two wings cradle the stone, showcasing a cut-out heart design on the back.", imageUrl: "images/black_heart.jpg" }, 
        { name: "Pandora - Pink Elevated Heart Necklace", price: "$129", description: "A radiant pink heart-shaped stone, framed by pavé, symbolises love and gratitude. Suspended from an adjustable chain, this warm-toned piece adds a touch of sparkle to every moment.", imageUrl: "images/pink_heart.jpg" }
      ]
    },
    {
      name: 'Dresser the Better',
      position: new THREE.Vector3(0, 4, -30),
      size: { width: 20, height: 8, depth: 25 },
      colour: new THREE.Color(0x9a21eb),
      items: [
        { name: "Temple & Webster - 2 Piece Diana LED Dressing Table & Stool Set", price: "$249.99", description: "Featuring an arched mirror with 12 LED light bulbs offering 3 colour options and 10-level light intensity. Includes USB input for powering devices, ample storage with drawers, shelves, and a cabinet for beauty essentials.", imageUrl: "images/diana.jpg" }, 
        { name: "Temple & Webster - 2 Piece Eloise LED Dressing Table & Stool Set", price: "$249.99", description: "Features a spacious tabletop, two drawers for discrete storage, adjustable LED light brightness, matching upholstered stool, and USB power. Made with MDF and particleboard frame with stainless steel components.", imageUrl: "images/eloise.jpg" }, 
        { name: "Temple & Webster - 2 Piece Asse Dressing Table & Stool Set", price: "$369.99", description: "Includes 7 deep-set drawers, high-definition mirror, and detachable LED bulbs with 3 colour settings and 10-level adjustable brightness. Features USB input cable and generous leg room.", imageUrl: "images/asse.jpg" }, 
        { name: "Temple & Webster - Erslev Manicure Table", price: "$119.99", description: "Multifunctional table with ample drawer and shelf space for storing polishes, tools, and accessories. Features a sleek, faux marble surface that adds modern elegance while providing a spacious work surface.", imageUrl: "images/erslev.jpg" }, 
        { name: "Fantastic Furniture - Twilight Lowboy", price: "$219", description: "Suitable for children with blush pink and light oak tones. Features 3 spacious drawers and rattan-like textured panels. Can be styled amongst coastal, scandi or bohemian décor.", imageUrl: "images/twilight.jpg" }, 
        { name: "Big W - Costway Manicure Nail Table Station Nail Tech Desk", price: "$216.95", description: "Modern manicure table with large storage space and acetone-resistant tabletop. Includes 2 large storage cabinets with buffered damp hinges and 3 drawers. Features wrist rest cushion covered in skin-friendly PVC leather.", imageUrl: "images/costway.jpg" }, 
        { name: "Fantastic Furniture - Amirah Dresser", price: "$299", description: "Beautiful combination of glossy white and pale pink with rhinestone handles. Features four drawers and an extra cupboard, providing functional storage space with a touch of sparkle.", imageUrl: "images/amirah.jpg" }, 
        { name: "Advwin - Manicure Table Vanity Desk", price: "$199.90", description: "Versatile nail tech desk with electric dust collector, multiple storage options including open shelf, pull-out locker, and side cabinet. Features waterproof top, movable wheels, and soft sponge wrist pads.", imageUrl: "images/advwin.png" }, 
        { name: "Mocka - Watson 8 Cube", price: "$224.99", description: "Open cube design storage unit perfect for living spaces, home offices or bedrooms. Features white shelves that make your decor pop. Compatible with Storage Cubes, Loryn Cubes and Felt Cubes for added closed storage.", imageUrl: "images/watson.png" }, 
        { name: "Mocka - Betti Bobbin Tallboy", price: "$319.99", description: "Soft pink painted tallboy with five spacious drawers for ample storage. Features traditional solid wood bobbin details and elegant bronze finish handles, inspired by classic coastal style.", imageUrl: "images/betti.png" },       
      ]
    },
    {
      name: 'Cup of Tea',
      position: new THREE.Vector3(25, 4, -20),
      size: { width: 10, height: 10, depth: 15 },
      colour: new THREE.Color(0x215eeb),
      items: [
        { name: "UNSW Shiny Stainless Steel Bottle", price: "$100", description: "700mL Stainless Steel, laser carved UNSW Logo will leave everyone stunned and staring. Not to miss out", imageUrl: "images/bottle_unsw.jpg" },
        { name: "UNSW Glass Keep Cup", price: "$100", description: "Designed for pure drinking pleasure. Keep it and use it again. Use this reusable cup and enjoy your coffee, matcha or drink of choice on the go!", imageUrl: "images/cup_unsw.jpg" },
        { name: "h2go Blue Stainless Steel Bottle", price: "$100", description: "500mL stainless steel bottle. Double walled thermal bottle guaranteed to keep your ice water cold even through the blistering summer sun.", imageUrl: "images/bottle_blue.jpg" },
        { name: "IKEA - VARDAGEN with Straw", price: "$8", description: "Life's a party, but most days are pretty ordinary. Make the most of them by serving warm or cold beverages in this simple, timeless series made of tempered glass. Includes glass straw for ease of drinking.", imageUrl: "images/cup_glass.jpg" }
      ]
    },
    {
      name: 'Sue\'s House',
      position: new THREE.Vector3(0, 4, 160),
      size: { width: 25, height: 8, depth: 20 },
      colour: new THREE.Color(0xfffbd4),
      items: [
        { name: "", price: "", description: "", imageUrl: "images/sue1.jpg" },
        { name: "Lachy says:", price: "Happy Anniversary", description: "You're the best girlfriend and best friend", imageUrl: "images/sue2.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue3.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue4.jpg" },
        { name: "Sorry :(", price: "For being a robot", description: "I'm trying my best sometimes forget and become mean", imageUrl: "images/sue5.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue6.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue7.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue10.jpeg" },
        { name: "Anyways, to another great year", price: "Yippee, a toast", description: "To getting rich and retiring so we can have lots of fun", imageUrl: "images/sue9.jpg" },
        { name: "", price: "", description: "", imageUrl: "images/sue8.jpg" },

      ]
    },
  ];