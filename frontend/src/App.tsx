import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LessonPath from './pages/LessonPath'
import Exercise from './pages/Exercise'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<LessonPath />} />
        <Route path="/exercise/:lessonId" element={<Exercise />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
