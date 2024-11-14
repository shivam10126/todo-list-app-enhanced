import { ThemeProvider } from 'next-themes'
import AnimatedTodoList from './components/AnimatedTodoList'
import './globals.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4 min-h-screen">
        <AnimatedTodoList />
      </div>
    </ThemeProvider>
  )
}

export default App