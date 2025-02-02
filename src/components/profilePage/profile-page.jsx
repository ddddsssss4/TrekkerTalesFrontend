import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Home, FileText, Search, PlusCircle, Settings, User, MapPin, CheckCircle, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import config from '../../config/config';

// Modal Component
const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [newDescription, setNewDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(newDescription);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Change Description</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Put your new description"
            className="border border-gray-300 rounded p-2 w-full mb-4"
            required
          />
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} className="mr-2">Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [favorites, setFavorites] = useState(['Lonavala', 'Ladakh', 'Lakshwadeep', 'Goa']);
  const [profilePicture, setProfilePicture] = useState('/default-profile.jpg');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${config.BACKEND_URL}/api/user-information/${userId}`);
        const user = response.data.user;
        setUsername(user.username);
        setDescription(user.description);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchBlogPosts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${config.BACKEND_URL}/api/blogs/user/${userId}`);
        console.log(response.data.simplifiedBlogs)
        setBlogPosts(response.data.simplifiedBlogs);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchUserData();
    fetchBlogPosts();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      setLoading(true);

      try {
        const response = await axios.post(`${config.BACKEND_URL}/api/user/profile-pictur`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        localStorage.setItem('profilePicture', response.data.imageUrl);
        const imageUrl = localStorage.getItem('profilePicture');
        setProfilePicture(imageUrl);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangeDescription = () => {
    setIsModalOpen(true);
  };

  const handleDescriptionSubmit = async (newDescription) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`${config.BACKEND_URL}/api/update-description/${userId}`, {
        description: newDescription,
      });
      setDescription(newDescription);
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-white p-4 space-y-4">
        <div className="text-2xl font-bold text-amber-700">traveltalks.</div>
        <div className="space-y-2">
          {[{ icon: Home, label: 'Home', href: '/' }, { icon: FileText, label: 'Content', href: '/content' }, { icon: Search, label: 'Search', href: '/search-page' }, { icon: PlusCircle, label: 'Create', href: '/create-blog' }, { icon: Settings, label: 'Settings', href: '/settings' }].map(({ icon: Icon, label, href }) => (
            <Link key={label} to={href} className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
        <button className="flex items-center space-x-2 w-full p-2 rounded bg-gray-200 justify-center">
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                ) : profilePicture ? (
                  <img src={profilePicture} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <button onClick={handleChangeProfilePicture} className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                <Camera size={16} className="text-gray-600" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold flex items-center">
                    {username}
                    <CheckCircle className="ml-2 text-blue-500" size={20} />
                  </h1>
                  <div className="text-sm text-gray-500">Currently Exploring LADAKH</div>
                </div>
                <div className="space-x-2">
                  <Button onClick={handleChangeDescription}>Change description</Button>
                  <Button onClick={handleChangeProfilePicture}>Change Profile Picture</Button>
                </div>
              </div>
              <p className="mt-2">{description}</p>
              <div className="flex space-x-4 mt-4">
                <div>
                  <div className="font-bold">1,267</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div>
                  <div className="font-bold">240K</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div>
                  <div className="font-bold">36</div>
                  <div className="text-sm text-gray-500">Blogs</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Favorites</h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map(favorite => (
                <div key={favorite} className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1">
                  <MapPin size={16} className="mr-1" />
                  {favorite}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onChange={handleTabClick} className="mt-6">
          <TabsList className="space-x-4">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="blogs">
            <div className="mt-4 w-[400px] ">
              {blogPosts.length === 0 ? (
                <p>No blog posts available.</p>
              ) : (
                blogPosts.map(blog => (
                  <Card key={blog.id} className="mb-4">
                    <CardContent>
                      <h3 className="text-lg font-bold">{blog.place}</h3>
                      <p>{blog.description}</p>
                    </CardContent>
                    <CardFooter>
                      
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="photos">
            <div className="mt-4">Photos section under construction.</div>
          </TabsContent>
        </Tabs>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDescriptionSubmit}
      />
    </div>
  );
}
