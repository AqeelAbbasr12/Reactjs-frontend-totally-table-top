import './App.css'
import { Route, Routes } from 'react-router-dom'
import { routing } from './constants/routing'

function App() {

  return (
    <Routes>
      {
        routing.map((i)=>(
          <Route path={i.link} key={i.id} element={i.element}/>
        ))
      }
    </Routes>
  )
}

export default App
