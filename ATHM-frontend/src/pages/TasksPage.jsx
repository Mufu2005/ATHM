import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';
import SubjectModal from '../components/SubjectModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Plus, Calendar, CheckCircle2, Circle, Trash2, Edit2, Moon, Sun, Flame, Filter, X } from 'lucide-react';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const [editingTask, setEditingTask] = useState(null); 
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('pending');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const { theme, toggleTheme } = useTheme();

    const fetchData = async () => {
        try {
            const [tasksRes, subjectsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/subjects')
            ]);
            setTasks(tasksRes.data);
            setSubjects(subjectsRes.data);
        } catch { 
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const streak = useMemo(() => {
        if (tasks.length === 0) return 0;

        const tasksByDate = {};
        tasks.forEach(t => {
            if (!t.dueDate) return;
            const dateKey = new Date(t.dueDate).toLocaleDateString('en-CA');
            if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
            tasksByDate[dateKey].push(t);
        });

        let currentStreak = 0;
        const checkDate = new Date();

        for (let i = 0; i < 365; i++) {
            const dateKey = checkDate.toLocaleDateString('en-CA');
            const dayTasks = tasksByDate[dateKey];

            if (dayTasks && dayTasks.length > 0) {
                const allCompleted = dayTasks.every(t => t.isCompleted);
                if (allCompleted) {
                    currentStreak++;
                } else {
                    const isToday = i === 0;
                    if (!isToday) break; 
                }
            } else {
                if (i > 0) {
                    break;
                }
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        return currentStreak;
    }, [tasks]);

    const toggleTaskCompletion = async (id, currentStatus) => {
        try {
            setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
            await api.put(`/tasks/${id}`, { isCompleted: !currentStatus });
            if(!currentStatus) toast.success("Task completed!");
        } catch { 
             fetchData(); toast.error('Failed to update task');
        }
    };

    const initiateDelete = (id) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== taskToDelete));
        setIsDeleteModalOpen(false);

        try {
            await api.delete(`/tasks/${taskToDelete}`);
            toast.success("Task deleted");
        } catch { 
             setTasks(previousTasks);
             toast.error('Failed to delete task');
        }
    };

    const openCreateTaskModal = () => { setEditingTask(null); setIsTaskModalOpen(true); };
    const openEditTaskModal = (task) => { setEditingTask(task); setIsTaskModalOpen(true); };

    const filteredTasks = tasks
        .filter(t => {
            const isCompleted = t.isCompleted;
            const isOverdue = t.dueDate && new Date(t.dueDate) < new Date();

            let matchesStatus = false;
            if (statusFilter === 'completed') matchesStatus = isCompleted;
            else if (statusFilter === 'missed') matchesStatus = !isCompleted && isOverdue;
            else if (statusFilter === 'pending') matchesStatus = !isCompleted && !isOverdue;

            const matchesSubject = subjectFilter === 'all' || (t.subject && t.subject._id === subjectFilter);
            const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

            return matchesStatus && matchesSubject && matchesPriority;
        })
        .sort((a, b) => {
            if (!a.dueDate) return 1; if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50';
        if (p === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50';
        return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50';
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">Academic Tasks</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-100 dark:border-orange-900/50 mr-2" title="Days without missing a task">
                        <Flame className={`w-5 h-5 mr-1.5 ${streak > 0 ? 'fill-current animate-pulse' : ''}`} />
                        <span className="font-bold">{streak}</span>
                        <span className="text-xs ml-1 font-medium opacity-80">Day Streak</span>
                    </div>

                    <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button onClick={() => setIsSubjectModalOpen(true)} className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm font-medium">
                        Add Subject
                    </button>
                    <button onClick={openCreateTaskModal} className="flex-1 sm:flex-none flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> New Task
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-end sm:items-center bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-transparent dark:border-slate-800">
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                    {['pending', 'missed', 'completed'].map((f) => (
                        <button 
                            key={f}
                            onClick={()=>setStatusFilter(f)} 
                            className={`capitalize px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                statusFilter === f 
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                    
                    <select 
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map(sub => (
                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                    </select>

                    <select 
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                    >
                        <option value="all">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    {(subjectFilter !== 'all' || priorityFilter !== 'all') && (
                        <button 
                            onClick={() => { setSubjectFilter('all'); setPriorityFilter('all'); }}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {loading ? <div className="text-center text-slate-500 dark:text-slate-400 py-10">Loading your tasks...</div> : (
                <div className="space-y-3">
                    {filteredTasks.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                            {statusFilter === 'missed' ? "No missed tasks!" : `No tasks found matching your filters.`}
                        </div>
                    )}
                    
                    {filteredTasks.map(task => (
                        <div key={task._id} className={`group bg-white dark:bg-slate-800 rounded-xl p-4 border shadow-sm flex items-center transition-all hover:shadow-md 
                            ${task.isCompleted 
                                ? 'opacity-75 border-slate-200 dark:border-slate-700' 
                                : statusFilter === 'missed' 
                                    ? 'border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10' 
                                    : 'border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <button onClick={() => toggleTaskCompletion(task._id, task.isCompleted)} className="mr-4 flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-blue-600 transition-colors">
                                {task.isCompleted ? <CheckCircle2 className="w-7 h-7 text-blue-500 fill-current" /> : <Circle className="w-7 h-7" />}
                            </button>

                            <div className="flex-grow min-w-0">
                                <div className="flex items-center mb-1">
                                    <h3 className={`text-lg font-semibold truncate mr-3 ${task.isCompleted ? 'text-slate-500 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</h3>
                                    {task.subject && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${task.subject.color}20`, color: task.subject.color }}>
                                            {task.subject.name}
                                        </span>
                                    )}
                                    {statusFilter === 'missed' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Overdue</span>}
                                </div>
                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
                                    {task.dueDate && (
                                        <div className={`flex items-center ${statusFilter === 'missed' ? 'text-red-500 dark:text-red-400 font-medium' : ''}`}>
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>{task.priority} Priority</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditTaskModal(task)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <Edit2 className="w-4 h-4"/>
                                </button>
                                <button onClick={() => initiateDelete(task._id)} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isTaskModalOpen && <TaskModal onClose={() => setIsTaskModalOpen(false)} onTaskAdded={fetchData} subjects={subjects} taskToEdit={editingTask} />}
            {isSubjectModalOpen && <SubjectModal onClose={() => setIsSubjectModalOpen(false)} onSubjectAdded={fetchData} />}
            
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task?"
                message="Are you sure you want to delete this task? It will be removed from your history."
            />
        </div>
    );
};

export default TasksPage;