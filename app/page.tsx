'use client';

import { useState } from 'react';
import axios from 'axios';
import { setToken } from '@/redux/auth/auth.slice';
import useAuthSession from '../hooks/useAuthSession';
import { useAppDispatch } from '@/redux/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?:string, password?:string}>({});
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  const handleLogin = async () => {

    //Previous Errors are cleared first
    setErrors({});

    //Validation
    if (!username.trim()){
      setErrors((prevErrors)=>({...prevErrors, username: 'Username is required'}));
      toast.error('Username is required');
      return;
    }

    if (!password.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
      toast.error('Password is required');
      return;
    }

    try {
      const response = await axios.post('/api/login' , {
        username,
        password,
      });

      const {token} = response.data;

      dispatch(setToken(token));

      setUsername('');
      setPassword('');
      toast.success('Login successful');

    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.username}</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`w-full px-4 py-2 mt-4 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-2 mt-4 border rounded-md ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
             {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
        <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
          <h3 className="text-lg font-semibold">The hook should be usable like this: </h3>
          <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
            <code>
              {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
            </code>
          </pre>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
