// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

// Simulated user database
const users = [
  { id: 1, username: 'user1', name: 'User One', email: 'user1@example.com' },
  { id: 2, username: 'user2', name: 'User Two', email: 'user2@example.com' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    // Find user in database
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json({ user });
  } catch (error) {
    console.error('Failed to authenticate token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
