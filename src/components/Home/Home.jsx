import React from 'react';
import{ useState} from 'react'
import axios from 'axios';
import backgroundImage from '../../../public/HomePage/Green.png';
import vector from '../../../public/HomePage/Vector.png';
import Design from '../../../public/Homepage/Group 3.png';
import Gridphoto1 from '../../../public/HomePage/Rectangle 21.png';
import Gridphoto2 from '../../../public/HomePage/Rectangle 22.png';
import Gridphoto3 from '../../../public/HomePage/Rectangle 23.png';
import Gridphoto4 from '../../../public/HomePage/Rectangle 24.png';
import Gridphoto5 from '../../../public/HomePage/Rectangle 25.png';
import Gridphoto6 from '../../../public/HomePage/Rectangle 26.png';
import { FaCompass, FaChartLine, FaFlag } from 'react-icons/fa';
import ImageGridItem from '../GridComponents/ImageGridItem';
import Group from '../../../public/HomePage/Group.png';
import tilt1 from '../../../public/HomePage/Union.png';
import tilt2 from '../../../public/HomePage/Frame 9.png';
import tilt3 from '../../../public/HomePage/sudhin-santhosh-uNaaNnhzqns-unsplash 1.png';
import design from '../../../public/HomePage/GroupDesign.png';
import Footer from '../../../public/HomePage/Frame 16.png';
import Flower from '../../../public/HomePage/GroupFlower.png';
import submit from '../../../public/HomePage/gis_compass-rose.png'
import Plane  from '../../../public/HomePage/VectorPlane.png'
import { useNavigate } from 'react-router-dom';
const allowedCities = ['Mumbai', 'Pune', 'Vadora', 'Mathura', 'Surat'];
export const Home = () => {

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
 
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter suggestions based on input value
    if (value) {
      const filteredSuggestions = allowedCities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (city) => {
    setInputValue(city);
    setSuggestions([]);
    setSelectedCity(city);
  };
  const handleSubmit = async () => {
    if (!allowedCities.includes(inputValue)) {
      alert('Please select a valid city');
      return;
    }
    try {
      const response = await axios.post('/api/blogs', { searchQuery: inputValue });
      console.log('Response:', response.data);
      // Add any additional logic here (e.g., updating state based on response)
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  };
  console.log()
  return (
    <>
      <div className="bg-[#f5f5dc]">
        <div>
          <div 
            className="absolute w-full h-[847px] bg-center bg-cover flex items-center justify-center text-white "
            style={{ backgroundImage: `url(${backgroundImage})` }}
            
          >
            <div className='flex flex-row'>
              <div className='absolute top-[20px] left-[90px]   text-4xl font-bold  hover:text-black'><span className='text-[#C8AE7D]'>trekker</span><span>tales</span> </div>
                
                {/* Navigation Links */}
              <div className='flex flex-row  gap-6 absolute top-[22px] left-[500px]'>
                <button onClick={() => { navigate('/explore') }} className='text-2xl  text-white hover:text-[#C8AE7D]'>
                  Explore
                </button>
                
                <button onClick={() => { navigate('/pictures') }} className='text-2xl d text-white hover:text-[#C8AE7D]'>
                  Pictures
                </button>
                <button onClick={() => { navigate('/trips') }} className='text-2xl text-white hover:text-[#C8AE7D]'>
                  Trips
                </button>
                <button onClick={() => { navigate('/about-us') }} className='text-2xl  text-white hover:text-[#C8AE7D]'>
                  About Us
                </button>
              </div>

              <button onClick={()=>{ navigate('/login-signup')}}><div className='absolute  font-bold rounded-full px-4 pb-2 top-[20px] right-[90px]  text-2xl  opacity-90 hover:text-[#C8AE7D]'>Login / Signup</div></button>
            </div>
            <div className='absolute top-[230px] left-[140px]'>
              <img src={Plane} alt="" />
            </div>
            <div className=" absolute top-[360px] left-[120px] bg-opacity-50 p-4 rounded flex flex-col">
               <span className='text-white font-extrabold text-4xl'>Discover the World:</span>
               <span className='text-white font-extrabold text-4xl'>Stories from Global Explorers!</span>
               <span className='text-white '>Delve into captivating narratives and remarkable journeys curated by fearless global </span><span>explorers, offering a unique perspective on the world's wonders and wanderlust.</span>
            </div>
            <div
              className="absolute top-[732px] w-full h-[402px] bg-cover bg-center flex items-center justify-center text-white"
              style={{ backgroundImage: `url(${vector})` }}
            ></div>
          <div className="absolute top-[900px] flex  left-[200px] ">
            <div className='flex flex-row'>
              <div className='absolute flex flex-col left-[100px] '><span className="text-[#765827] font-mono font-bold text-xl w-[300px]">get blogs on the place you</span>
            <span className="text-[#C8AE7D] font-mono font-bold text-xl">want to wander on</span>
            </div>
            <input
          type="text"
          className="absolute left-[450px] top-[5px] border border-[#C8AE7D] rounded-md px-4 py-2 w-[600px] text-black"
          value={inputValue}
          onChange={handleInputChange}
         />
          <div className=' relative border-r border-[#C8AE7D] left-[960px] top-[9px]'></div>
        <img
          src={submit}
          alt="Submit"
          className="relative left-[980px] top-[9px] cursor-pointer w-8 h-8"
          onClick={handleSubmit}
        />
        {suggestions.length > 0 && (
        <div className="absolute left-[450px] top-[50px] w-[600px] bg-gray-900 border border-[#C8AE7D] rounded-md shadow-lg z-10">
          {suggestions.map((city) => (
            <div
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className="px-4 py-2 cursor-pointer hover:bg-[#C8AE7D] hover:text-black"
            >
              {city}
            </div>
          ))}
        </div>
      )}
            </div>
          </div>

            <div
              className="absolute top-[1050px] w-full h-[125.38px] text-white"
              style={{ backgroundImage: `url(${Design})` }}
            ></div>

            {/* Heading and Buttons */}
            <h1 className="absolute top-[1283px] w-full text-center text-3xl font-bold text-[#4a3b26]">
              Places to Visit in India
            </h1>
            <div className="absolute top-[1377.02px] w-full flex justify-center space-x-6 text-[#4a3b26]">
              <button className="flex items-center space-x-2 border border-[#4a3b26] px-4 py-2 rounded-md hover:bg-[#4a3b26] hover:text-white transition">
                <FaCompass />
                <span>Exploration.</span>
              </button>
              <div className="border-l border-[#4a3b26] h-8"></div>
              <button className="flex items-center space-x-2">
                <FaChartLine />
                <span>Trending.</span>
              </button>
              <div className="border-l border-[#4a3b26] h-8"></div>
              <button className="flex items-center space-x-2">
                <FaFlag />
                <span>Destinations.</span>
              </button>
            </div>
            <div className="absolute top-[1503px] flex justify-center">
              <div className="grid grid-cols-3 grid-rows-2 gap-4">
                <ImageGridItem src={Gridphoto1} alt="Image 1" />
                <ImageGridItem src={Gridphoto2} alt="Image 2" />
                <ImageGridItem src={Gridphoto3} alt="Image 3" />
                <ImageGridItem src={Gridphoto4} alt="Image 4" />
                <ImageGridItem src={Gridphoto5} alt="Image 5" />
                <ImageGridItem src={Gridphoto6} alt="Image 6" />
              </div>
            </div>
            <div className="absolute w-full ml-4 top-[1950px]">
          <img className='h-30' src={Flower} alt="" />
        </div>
            <div className="absolute top-[2070px] flex justify-center">
              <h2 className="text-[#3B2D14] text-2xl font-bold">Cultures in INDIA</h2>
            </div>
          </div>
        </div>
        <div className="absolute top-[2236px] flex flex-row space-x-32">
          <div className="ml-8 bg-[#F5ECE0] w-[600px] h-[450px] rounded">
            <p className="p-4 text-black text-justify">
              India is a land of incredible diversity, not only in its geography but also in its rich cultural heritage and secular values. From the towering Himalayan peaks in the north, which include popular trekking and spiritual destinations like Leh-Ladakh and the hill stations of Shimla and Manali, to the lush, tropical landscapes of Kerala in the south, famed for its tranquil backwaters, traditional Kathakali dance, and tea plantations, India offers a variety of landforms to explore. The Thar Desert in the west provides a stark contrast with its vast, arid expanses and vibrant cities like Jaisalmer and Jaipur, known for their grand forts, palaces, and colorful festivals. In the east, the Sundarbans mangrove forests and the serene beaches of the Andaman and Nicobar Islands offer unique experiences intertwined with local tribal cultures. Each region has its own distinct languages, cuisines, and customs, reflecting a tapestry of cultural diversity. India's secularism ensures that people of different religions live in harmony, celebrating a multitude of festivals and traditions. With its stunning coastlines, diverse ecosystems, and historical landmarks, India is a paradise for travelers seeking both adventure and a deep immersion into its cultural richness and secular spirit.
            </p>
          </div>
          <div>
            <div className="relative">
              <img src={Group} className="w-[409px] h-[438.94px]" alt="" />
              <div>
                <img src={tilt1} className="absolute top-[90px] left-[180px] w-[274.9px] h-[324.25px]" alt="" />
              </div>
              <div>
                <img src={tilt2} className="absolute top-[-40px] left-[40px] w-[274.9px] h-[324.25px]" alt="" />
              </div>
              <div>
                <img src={tilt3} className="absolute top-[190px] left-[20px] w-[196px] h-[264.24px]" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full  ml-4 top-[3100px]">
          <img className='h-50 w-[150px]' src={Flower} alt="" />
        </div>
        <div
          className="absolute top-[2900px] w-full h-[125.38px] text-white"
          style={{
            backgroundImage: `url(${design})`,
            backgroundRepeat: 'repeat-x', // Ensures horizontal repetition only
          }}
        ></div>
        <div className="relative w-full h ml-4 top-[3300px]">
          <img src={Footer} alt="" />
        </div>
      </div>
    </>
  );
};
