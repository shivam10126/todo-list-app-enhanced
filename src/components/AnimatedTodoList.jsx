import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle, Search, SortAsc, Sun, Moon } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useTheme } from 'next-themes'

const priorityIcons = {
  high: <ArrowUpCircle className="h-4 w-4 text-red-500" />,
  medium: <ArrowRightCircle className="h-4 w-4 text-yellow-500" />,
  low: <ArrowDownCircle className="h-4 w-4 text-green-500" />
}

export default function AnimatedTodoList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [priority, setPriority] = useState('medium')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortCriteria, setSortCriteria] = useState('default')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTasks = localStorage.getItem('animatedTasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('animatedTasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: priority
      }
      setTasks([...tasks, task])
      setNewTask('')
      setPriority('medium')
      toast.success('Task added successfully!')
    } else {
      toast.error('Task title cannot be empty!')
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    const task = tasks.find(task => task.id === id)
    toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!')
  }

  const filteredAndSortedTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'completed':
          return a.completed === b.completed ? 0 : a.completed ? -1 : 1
        case 'incomplete':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl mx-auto mt-10 shadow-lg bg-card rounded-lg">
        <Toaster richColors />
        <div className="p-6 space-y-1">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-primary">Animated Todo List</h2>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-secondary" title="Toggle theme">
              {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
          <p className="text-center text-muted-foreground">Manage your tasks with style</p>
        </div>
        <div className="p-6 space-y-4">
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Enter a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-grow px-3 py-2 border rounded-md"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-[120px] px-3 py-2 border rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button onClick={addTask} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              <Plus className="mr-2 h-4 w-4 inline" /> Add Task
            </button>
          </motion.div>
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border rounded-md"
              />
            </div>
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="w-[180px] px-3 py-2 border rounded-md"
            >
              <option value="default">Default</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
              <option value="priority">Priority</option>
            </select>
          </motion.div>
          <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
            <AnimatePresence>
              {filteredAndSortedTasks.map(task => (
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between p-3 rounded-lg shadow transition-all hover:shadow-md mb-2 ${
                    task.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <motion.label
                      htmlFor={`task-${task.id}`}
                      className={task.completed ? 'line-through text-muted-foreground' : ''}
                      animate={{ opacity: task.completed ? 0.5 : 1 }}
                    >
                      {task.title}
                    </motion.label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {priorityIcons[task.priority]}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete task</span>
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}