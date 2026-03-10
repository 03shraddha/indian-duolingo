import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LanguageSelect from './pages/LanguageSelect'
import Home from './pages/Home'
import LessonPath from './pages/LessonPath'
import Exercise from './pages/Exercise'

// Apply saved font-size preference before first render so there's no flash
const savedFontSize = localStorage.getItem('idl-font-size') ?? 'normal'
document.documentElement.setAttribute('data-fontsize', savedFontSize)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/learn" element={<LessonPath />} />
        <Route path="/exercise/:lessonId" element={<Exercise />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
