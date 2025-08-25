import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import * as DataService from '../../services/dataService';
import * as AuthService from '../../services/authService';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const AdminAttendanceView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [presentEmployees, setPresentEmployees] = useState<User[]>([]);

    useEffect(() => {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            const presentIds = DataService.getAttendanceByDate(dateString);
            const allUsers = AuthService.getUsers();
            const employees = allUsers.filter(u => presentIds.includes(u.id));
            setPresentEmployees(employees);
        } else {
            setPresentEmployees([]);
        }
    }, [selectedDate]);
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                    <h2 className="text-xl font-bold text-slate-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500 font-semibold mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const date = new Date(year, month, day);
                        const isToday = today.toDateString() === date.toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        
                        let baseClasses = "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors";
                        let selectedClasses = isSelected ? "bg-indigo-600 text-white font-bold shadow-lg" : "hover:bg-indigo-100";
                        let todayClasses = isToday && !isSelected ? "bg-slate-200 text-slate-800 font-bold" : "";
                        
                        return (
                            <div key={day} className="flex justify-center">
                                <button onClick={() => setSelectedDate(date)} className={`${baseClasses} ${selectedClasses} ${todayClasses}`}>{day}</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">{renderCalendar()}</div>
            <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">{selectedDate ? `Present on ${selectedDate.toLocaleDateString()}` : 'Select a date'}</h3>
                    {selectedDate ? (
                        presentEmployees.length > 0 ? (
                            <ul className="space-y-3">
                                {presentEmployees.map(emp => (
                                    <li key={emp.id} className="flex items-center space-x-3">
                                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold flex-shrink-0">{getInitials(emp.name)}</div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{emp.name}</p>
                                            <p className="text-xs text-slate-500">{emp.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-slate-500 text-center pt-8">No attendance records for this day.</p>
                    ) : <p className="text-slate-500 text-center pt-8">Select a date from the calendar to view attendance.</p>}
                </div>
            </div>
        </div>
    );
};

const EmployeeAttendanceView: React.FC<{ user: User }> = ({ user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent'>>({});

     useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const newStatus: Record<string, 'present' | 'absent'> = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date > today) continue; // Don't mark future dates

            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

            const dateString = date.toISOString().split('T')[0];
            const presentIds = DataService.getAttendanceByDate(dateString);
            
            if (presentIds.includes(user.id)) {
                newStatus[day] = 'present';
            } else {
                newStatus[day] = 'absent';
            }
        }
        setAttendanceStatus(newStatus);
    }, [currentDate, user.id]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                    <h2 className="text-xl font-bold text-slate-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500 font-semibold mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const status = attendanceStatus[day];
                        let statusClasses = "text-slate-800";
                        if (status === 'present') statusClasses = "bg-green-500 text-white font-bold";
                        else if (status === 'absent') statusClasses = "bg-red-500 text-white font-bold";
                        
                        return (
                            <div key={day} className="flex justify-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${statusClasses}`}>{day}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    
     return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">{renderCalendar()}</div>
             <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                     <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Legend</h3>
                     <ul className="space-y-3">
                        <li className="flex items-center"><div className="w-5 h-5 rounded-full bg-green-500 mr-3"></div><span className="text-slate-700">Present</span></li>
                        <li className="flex items-center"><div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div><span className="text-slate-700">Absent</span></li>
                        <li className="flex items-center"><div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3"></div><span className="text-slate-700">Weekend / Future Date</span></li>
                     </ul>
                 </div>
            </div>
        </div>
    );
}

const Attendance: React.FC = () => {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" />;

    const renderContent = () => {
        switch (user.role) {
            case UserRole.ADMIN:
            case UserRole.HR:
                return <AdminAttendanceView />;
            case UserRole.MANAGER:
            case UserRole.EMPLOYEE:
                return <EmployeeAttendanceView user={user} />;
            default:
                return <Navigate to="/" />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Attendance</h1>
            {renderContent()}
        </div>
    );
};

export default Attendance;