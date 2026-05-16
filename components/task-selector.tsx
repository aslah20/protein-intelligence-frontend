"use client"

interface Task {
  id: number
  name: string
  model: string
}

interface TaskSelectorProps {
  tasks: Task[]
  selectedTasks: number[]
  onTaskToggle: (id: number) => void
}

export default function TaskSelector({ tasks, selectedTasks, onTaskToggle }: TaskSelectorProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskToggle(task.id)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedTasks.includes(task.id)
              ? "border-accent bg-accent/20"
              : "border-border/50 bg-background/30 hover:border-accent/50"
          }`}
        >
          <p className="font-medium">{task.name}</p>
          <p className="text-xs text-foreground/60 mt-1">Model: {task.model}</p>
        </div>
      ))}
    </div>
  )
}
