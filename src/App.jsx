import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ProfilePage from './components/profilePage/profile-page'
import CreateBlog from './components/create-blog/create-blog'
import AuthPage from './components/login/login-signup'
import SearchPage from './components/search-page/search-page'
import {Home} from './components/Home/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Profile-Page" element={<ProfilePage />} />
        <Route path='/' element ={<Home />}/>
        <Route path="/create-blog" element={<CreateBlog />}/>     
        <Route path="/login-signup" element={<AuthPage />} />
        <Route path="/search-page" element={<SearchPage />} />
       
        </Routes>
    </BrowserRouter>
  )
}

