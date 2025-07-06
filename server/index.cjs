// index.cjs

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ganeshbandla934790:Ganesh165@cluster0.s4phz48.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
    
    global.useMemoryStorage = false;
    await createDemoUser();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('🔄 Falling back to in-memory storage for demo...');
    
    global.useMemoryStorage = true;
    global.users = [
      {
        _id: 'demo-user-id',
        email: 'demo@wishlist.com',
        password: 'demo123',
        name: 'Demo User'
      }
    ];
    global.wishlists = [];
  }
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const wishlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  products: [{
    name: String,
    price: Number,
    imageUrl: String,
    description: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reactions: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: String
    }],
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String
    }]
  }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

const createDemoUser = async () => {
  try {
    if (global.useMemoryStorage) return;

    const demo = await User.findOne({ email: 'demo@wishlist.com' });
    if (!demo) {
      const newDemo = new User({
        email: 'demo@wishlist.com',
        password: 'demo123',
        name: 'Demo User'
      });
      await newDemo.save();
      console.log('✅ Demo user created');
    } else {
      console.log('✅ Demo user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create demo user:', error);
  }
};

// Connect to database before listening
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// WebSocket setup
const clients = new Map();
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'join' && data.userId) {
        clients.set(data.userId, ws);
        console.log(`👤 ${data.userId} joined WebSocket`);
      }
    } catch (err) {
      console.error('WebSocket error:', err);
    }
  });

  ws.on('close', () => {
    for (const [userId, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(userId);
        console.log(`👤 ${userId} disconnected`);
        break;
      }
    }
  });
});

const broadcast = (data) => {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
};

// Fallback memory helpers
const findUserInMemory = (email, password = null) => {
  return global.users.find(u => u.email === email && (!password || u.password === password));
};

const createUserInMemory = (userData) => {
  const user = { ...userData, _id: Date.now().toString() };
  global.users.push(user);
  return user;
};

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (global.useMemoryStorage) {
    if (findUserInMemory(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = createUserInMemory({ email, password, name });
    return res.json({ user });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = new User({ email, password, name });
  await user.save();
  res.json({ user: { id: user._id, email, name } });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (global.useMemoryStorage) {
    const user = findUserInMemory(email, password);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    return res.json({ user: { id: user._id, email: user.email, name: user.name } });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ user: { id: user._id, email, name: user.name } });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: global.useMemoryStorage ? 'Memory' : 'MongoDB',
    time: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('🧪 Demo login: demo@wishlist.com / demo123');
});
