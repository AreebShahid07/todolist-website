import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from './hooks/use-toast'
import { Toaster } from "@/components/ui/toaster"
import { motion, AnimatePresence } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const App = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState(null)
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false)
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
      toast({
        title: "Task added",
        description: "Your new task has been added to the list.",
      })
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    })
  }

  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
    setEditingTodo(null)
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    })
  }

  const completedTasks = todos.filter(todo => todo.completed).length
  const totalTasks = todos.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                placeholder="Add a new task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
              />
              <Button onClick={addTodo}>
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>

            <div className="flex justify-center mb-4">
              <div style={{ width: 90, height: 90 }}>
                <CircularProgressbar
                  value={completionPercentage}
                  text={`${Math.round(completionPercentage)}%`}
                  styles={buildStyles({
                    textColor: darkMode ? '#fff' : '#000',
                    pathColor: darkMode ? '#4ade80' : '#10b981',
                    trailColor: darkMode ? '#374151' : '#d1d5db',
                  })}
                />
              </div>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1, // Stagger animations for children
                  },
                },
              }}
            >
              <AnimatePresence>
                {todos.map((todo) => (
                  <motion.li
                    key={todo.id}
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }} // Hover effect
                    whileTap={{ scale: 0.98 }}   // Tap effect
                    transition={{
                      type: "spring", // Bounce effect
                      stiffness: 300,
                      damping: 20,
                      ease: "easeOut"
                    }}
                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditingTodo(todo)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <Label htmlFor="edit-todo">Task</Label>
                            <Input
                              id="edit-todo"
                              value={editingTodo?.text || ""}
                              onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                            />
                          </div>
                          <DialogFooter>
                            <Button onClick={() => updateTodo(editingTodo.id, editingTodo.text)}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {todos.length} task{todos.length !== 1 && 's'} remaining
            </p>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

export default App

