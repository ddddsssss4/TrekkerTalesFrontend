import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Tag } from 'lucide-react'
import React from 'react'
import {config} from '../../config/config'

const tags = ['Travel', 'Food', 'Lifestyle', 'Photography', 'Adventure', 'Technology', 'Health', 'Fashion', 'Finance', 'Education', 'Beach']

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [posts, setPosts] = useState([])

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${config.BACKEND_URL}/api/blog/search`, { searchTerm, tags: selectedTags }, {
        headers: { 'Content-Type': 'application/json' }
      })
      setPosts(response.data.globalBlogs)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Blogs</h1>
      
      {/* Search input and button */}
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search by blogger or place"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow mr-2 border-gray-300"
        />
        <Button onClick={handleSearch} className="bg-gray-900 text-white hover:bg-gray-700">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Tag selection */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              onClick={() => toggleTag(tag)}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className={`${
                selectedTags.includes(tag) ? 'bg-gray-200 text-gray-900' : 'text-gray-700'
              } hover:bg-gray-200`}
            >
              <Tag className="w-4 h-4 mr-2" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog post results */}
      <div className="space-y-6 mt-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
            <p className="text-gray-700 mt-2">{post.description}</p>
            <p className="text-sm text-gray-500 mt-1">Place: {post.place}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
