import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();

const products: any[] = [
  {
    id: 1,
    image: '/product-images/hp-laptop.jpg',
    imageAlt: 'HP Laptop',
    title: 'HP OmniBook 13 Laptop',
    price: 449.99,
    description: '17.3 inch Laptop PC, FHD Display, AMD Ryzen 3 30, 8 GB RAM, 512 GB SSD, AMD Radeon 610M Graphics, Windows 11 Home, Mica Silver, 17-dp0199nr',
    link: '/products/1',
  },
  {
    id: 2,
    image: '/product-images/samsung-monitor.jpg',
    imageAlt: 'Samsung 27" Monitor',
    title: 'Samsung 27" Curved Monitor',
    price: 109.97,
    description: 'Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor, 100Hz, Game Mode, Advanced Eye Comfort, HDMI and D-sub Ports, LS27D366GANXZA, 2024',
    link: '/products/2',
  },
  {
    id: 3,
    image: '/product-images/lexar-usb-key.jpg',
    imageAlt: 'Lexar USB Key',
    title: 'Lexar 1TB External SSD',
    price: 179.99,
    description: 'Lexar D70E 1TB Dual Drive External SSD, Up to 2000MB/s Read and 1800MB/s Write, Durable Metal Housing Design, Cable-Free Portable SSD for USB Type-C/Type-A Devices, Compatible with iPhone 17',
    link: '/products/3',
  },
  {
    id: 4,
    image: '/product-images/mini-pc.jpg',
    imageAlt: 'GEEKOM Mini PC',
    title: 'GEEKOM A5 2026 Edition Mini PC',
    price: 393.30,
    description: 'GEEKOM A5 2026 Edition Mini PC for Home Office & Multitasking, AMD Ryzen 5 7430U, 16GB RAM (Upgradable to 64GB) & 512GB M.2 NVMe SSD Desktop Computer, Windows 11 Pro, 8K, 6x USB Ports, 3-Year Coverage',
    link: '/products/4',
  },
  {
    id: 5,
    image: '/product-images/ibuypower-gaming-pc.jpg',
    imageAlt: 'Gaming PC',
    title: 'iBUYPOWER Element Gaming PC',
    price: 2099.99,
    description: 'iBUYPOWER Element Gaming PC Desktop Computer AMD Ryzen 7 7800X3D CPU, AMD Radeon RX 9070XT 16GB GPU, 32GB DDR5 RGB 5200MHz RAM, 1TB NVMe SSD, Windows 11 Home, Gamer Keyboard and Mouse - EBA7R97XT01',
    link: '/products/5',
  },
];

app.use(express.json());
// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/products', (req, res) => {
  res.send(products);
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }

  return res.send(product);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
