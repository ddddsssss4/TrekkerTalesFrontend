import { useState } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundImage from '/HomePage/Property 1=slider 2.png';
import {config} from "../../config/config";

const predefinedTags = [
  'Travel',
  'Food',
  'Lifestyle',
  'Photography',
  'Adventure',
  'Technology',
  'Health',
  'Fashion',
  'Finance',
  'Education'
];

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const mstiid = localStorage.getItem('userId');
  console.log(mstiid);

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    console.log(userId);
    try {
      const response = await axios.post(`${config.BACKEND_URL}/api/blogs`, {
        title,
        description,
        place,
        tags: selectedTags,
        userId: userId
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Blog created:', response.data);
      window.location.href = '/Profile-Page';
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="pt-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    > <button onClick={() => window.location.href = '/'}>
        <div className=' pl-6'><span className='text-4xl font-bold text-[#EAAF62]'>travel</span><span className='text-4xl font-bold text-white'>talks</span></div></button>
      <div className="bg-black bg-opacity-0 opacity-90  flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full bg-white bg-opacity-90 backdrop-blur-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create a New Blog Post</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter the title of your blog post"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Write a brief description of your blog post"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-col space-y-2">
                  {predefinedTags.map((tag) => (
                    <div key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        id={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                        className="mr-2"
                      />
                      <Label htmlFor={tag}>{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="place">Place You are Visiting</Label>
                <Input
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                  placeholder="Enter the place you're writing about"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Blog Post
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
