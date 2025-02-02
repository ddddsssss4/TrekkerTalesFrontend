import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundImage from '../../../public/HomePage/nandhu-kumar-TwYX-EQRXQQ-unsplash 1.png';
import {config} from "../../config/config";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!email || !password || (!isLogin && (!confirmPassword || !username || !name))) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login request
        const response = await axios.post(`${config.BACKEND_URL}/api/signin`, { email, password }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        console.log('Login successful:', response.data);
        localStorage.setItem('userId', response.data.userId);

        setTimeout(() => {
          alert('Login successful');
          window.location.href = '/Profile-Page';
        }, 3000);
      } else {
        // Sign-up request
        const response = await axios.post(`${config.BACKEND_URL}/api/signup`, { username, email, password, name }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        console.log('Sign-up successful:', response.data);
        localStorage.setItem('userId', response.data.userId);

        setTimeout(() => {
          alert('Sign-up successful');
          window.location.href = '/Profile-Page';
        }, 3000);
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Sign Up'} error:`, error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <button onClick={() => window.location.href = '/'}>
        <div className='pt-8 pl-6'><span className='text-4xl font-bold text-[#EAAF62]'>travel</span><span className='text-4xl font-bold text-[#000000]'>talks</span></div>
      </button>
      <div className="min-h-screen bg-gray-100 bg-opacity-0 opacity-70 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Login to Trekkerll" : "Sign Up for Trekkerll"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? isLogin
                    ? "Logging in..."
                    : "Signing up..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </Button>
              <p className="text-sm text-center">
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setIsLogin(false)}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
