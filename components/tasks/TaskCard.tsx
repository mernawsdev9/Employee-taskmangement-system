import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus, User } from '../../types';
import { ClockIcon, EditIcon, TrashIcon, BriefcaseIcon, LinkIcon } from '../../constants';

const TaskCard: React.FC<{
    task: Task;
    employees: User[];
    projectName?: string;
    onAssigneeChange?: (taskId: string, newAssigneeId?: string) => void;
    onStatusChange?: (taskId:string, newStatus: TaskStatus) => void;
    onDelete?: (taskId: string) => void;
    onEdit?: (task: Task) => void;
}> = ({ task, employees, projectName, onAssigneeChange, onStatusChange, onDelete, onEdit }) => {

    const statusStyles: Record<TaskStatus, string> = {
        [TaskStatus.TODO]: 'bg-yellow-100 text-yellow-800',
        [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
        [TaskStatus.ON_HOLD]: 'bg-slate-100 text-slate-800',
        [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
    };

    const priorityStyles = {
        low: 'bg-slate-100 text-slate-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onAssigneeChange?.(task.id, e.target.value || undefined);
    };
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusChange?.(task.id, e.target.value as TaskStatus);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
            onDelete?.(task.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 border border-slate-200 flex flex-col space-y-3">
            {/* Top Row */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">{projectName || task.category || 'General'}</span>
                <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[task.status]}`}>
                        {task.status}
                    </span>
                     {onEdit && (
                        <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-slate-600">
                            <EditIcon />
                        </button>
                    )}
                </div>
            </div>

            {/* Title & Description */}
            <div>
                 <Link to={`/tasks/${task.id}`} className="hover:text-indigo-600 transition-colors">
                    <h4 className="font-bold text-slate-800 text-lg">{task.name}</h4>
                </Link>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{task.description}</p>
            </div>

             {task.dependency && (
                <div className="p-2 bg-slate-50 rounded-md text-xs text-slate-600 flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold">Blocked:</span>
                    <span>{task.dependency.reason}</span>
                </div>
            )}

            {/* Deadline & Estimated Time */}
            <div className="flex items-center space-x-4 text-sm text-slate-500">
                {task.dueDate && (
                    <div className="flex items-center">
                        <ClockIcon className="h-4 w-4" />
                        <span className="ml-1.5">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
                {task.estimatedTime !== undefined && (
                    <div className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span className="ml-1.5">{task.estimatedTime} hours est.</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {task.priority && (
                    <span className={`capitalize text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
                        {task.priority}
                    </span>
                )}
                {task.tags?.map(tag => (
                     <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {tag}
                     </span>
                ))}
            </div>

            <div className="border-t border-slate-200 !mt-4 !mb-2"></div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center">
                { onAssigneeChange ? (
                    <select 
                        value={task.assigneeId || ''}
                        onChange={handleAssigneeChange}
                        className="text-sm border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Unassigned</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                ) : onStatusChange ? (
                    <select 
                        value={task.status}
                        onChange={handleStatusChange}
                        className="text-sm border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                ) : <div /> }
                
                <div className="flex items-center space-x-2">
                    {onDelete && (
                        <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                            <TrashIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;