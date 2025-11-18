// src/data/setupData.js

const setupData = {
  id: 'my-gaming-rig',
  name: 'Ultimate Gaming & AI Workstation',
  description: 'A powerful setup optimized for high-performance gaming, AI development, and content creation, ensuring smooth operation and stunning visuals.',
  image: '/assets/MySetupImage.jfif', // Make sure you have an image for your setup in public/assets
  components: [
    { name: 'CPU', detail: 'Intel Core i9-14900K (24 Cores, 32 Threads)' },
    { name: 'GPU', detail: 'NVIDIA GeForce RTX 4090 (24GB GDDR6X)' },
    { name: 'Motherboard', detail: 'ASUS ROG Maximus Z790 Hero' },
    { name: 'RAM', detail: '64GB (2x32GB) DDR5 6400MHz CL32' },
    { name: 'Storage 1', detail: '2TB NVMe PCIe 5.0 SSD (Primary)' },
    { name: 'Storage 2', detail: '4TB NVMe PCIe 4.0 SSD (Secondary)' },
    { name: 'Power Supply', detail: 'Corsair HX1200 Platinum (1200W)' },
    { name: 'Cooling', detail: 'NZXT Kraken 360 RGB AIO Liquid Cooler' },
    { name: 'Case', detail: 'Lian Li O11 Dynamic EVO' },
    { name: 'Monitor 1', detail: 'LG UltraGear OLED 27GR95QE (27" QHD 240Hz OLED)' },
    { name: 'Monitor 2', detail: 'Dell S2721QS (27" 4K IPS)' },
    { name: 'Keyboard', detail: 'Keychron Q3 QMK Custom Mechanical Keyboard' },
    { name: 'Mouse', detail: 'Logitech G Pro X Superlight 2' },
    { name: 'Headset', detail: 'SteelSeries Arctis Nova Pro Wireless' },
  ],
  priceEstimate: '$6,500 - $7,500 USD (components only)',
  notes: 'This configuration provides extreme performance for demanding applications and games. Components are subject to market price fluctuations and availability.',
};

export default setupData;