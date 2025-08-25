import { User, UserRole } from '../types';

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  managerId?: string;
  departmentIds?: string[];
  companyId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const USERS_KEY = 'ets_users';
const CURRENT_USER_KEY = 'ets_current_user';
const PASSWORDS_KEY = 'ets_passwords';

const getInitialUsers = (): User[] => {
    return [
        { 
            id: '1', name: 'Admin User', email: 'admin@test.com', role: UserRole.ADMIN, companyId: 'comp-1', departmentIds: ['dept-1'],
            jobTitle: 'Administrator', status: 'Active', joinedDate: '2022-01-10T00:00:00.000Z',
            skills: ['System Admin', 'Database Mgmt', 'Security'],
            stats: { completedTasks: 5, inProgressTasks: 1, efficiency: 95, totalHours: 45, workload: 'Light' },
            rating: 9.5
        },
        { 
            id: '2', name: 'Manager User', email: 'manager@test.com', role: UserRole.MANAGER, companyId: 'comp-1', departmentIds: ['dept-7', 'dept-5'],
            jobTitle: 'Project Manager', status: 'Active', joinedDate: '2022-05-20T00:00:00.000Z',
            skills: ['Agile', 'Scrum', 'JIRA', 'Leadership'],
            stats: { completedTasks: 25, inProgressTasks: 5, efficiency: 91, totalHours: 350, workload: 'Normal' },
            rating: 9.1,
            personalDetails: {
                dateOfBirth: '1985-08-15T00:00:00.000Z',
                nationality: 'American',
                maritalStatus: 'Married',
                gender: 'Female',
            },
            contactNumber: '+1 123-456-7890',
            address: {
                street: '456 Oak Avenue',
                city: 'Metropolis',
                state: 'CA',
                zipCode: '90210',
                country: 'USA'
            },
            familyMembers: [
                { id: 'fm-1', name: 'John Doe', relationship: 'Spouse', dateOfBirth: '1984-07-20T00:00:00.000Z' }
            ],
            education: [
                { id: 'edu-1', degree: 'MBA', institution: 'State University', yearOfCompletion: 2010 }
            ],
            compensation: {
                salary: 120000,
                payFrequency: 'Monthly',
                bankDetails: {
                    bankName: 'Metropolis Bank',
                    accountNumber: '**** **** **** 1234',
                    ifscCode: 'METB00001'
                }
            },
            documents: [
                { id: 'doc-1', name: 'Passport', status: 'Verified' },
                { id: 'doc-2', name: 'Degree Certificate', status: 'Submitted' },
                { id: 'doc-3', name: 'Address Proof', status: 'Pending' }
            ]
        },
        { 
            id: '3', name: 'Drone TV', email: 'drone@example.com', role: UserRole.EMPLOYEE, managerId: '2', companyId: 'comp-1', departmentIds: ['dept-7'],
            jobTitle: 'Developer', status: 'Active', joinedDate: '2024-01-15T00:00:00.000Z',
            skills: ['React', 'TypeScript', 'Node.js', 'Python'],
            stats: { completedTasks: 12, inProgressTasks: 3, efficiency: 92, totalHours: 156, workload: 'Normal' },
            rating: 9.2,
            personalDetails: {
                dateOfBirth: '1992-03-22T00:00:00.000Z',
                nationality: 'Canadian',
                maritalStatus: 'Single',
                gender: 'Male',
            },
            contactNumber: '+1 987-654-3210',
            address: {
                street: '123 Maple Street',
                city: 'Toronto',
                state: 'ON',
                zipCode: 'M5V 2E9',
                country: 'Canada'
            },
            education: [
                { id: 'edu-2', degree: 'B.Sc. Computer Science', institution: 'University of Toronto', yearOfCompletion: 2014 }
            ],
            compensation: {
                salary: 95000,
                payFrequency: 'Bi-Weekly',
                bankDetails: {
                    bankName: 'CIBC',
                    accountNumber: '**** **** **** 5678',
                    ifscCode: 'CIBCCATT'
                }
            },
            documents: [
                { id: 'doc-4', name: 'Work Permit', status: 'Verified' },
                { id: 'doc-5', name: 'Address Proof', status: 'Submitted' },
            ]
        },
        { 
            id: '4', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: UserRole.EMPLOYEE, managerId: '2', companyId: 'comp-1', departmentIds: ['dept-5'],
            jobTitle: 'Designer', status: 'Active', joinedDate: '2024-02-01T00:00:00.000Z',
            skills: ['UI/UX', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
            stats: { completedTasks: 8, inProgressTasks: 2, efficiency: 88, totalHours: 98, workload: 'Light' },
            rating: 8.8
        },
        { 
            id: '5', name: 'Mike Rodriguez', email: 'mike.rodriguez@example.com', role: UserRole.EMPLOYEE, managerId: '2', companyId: 'comp-1', departmentIds: ['dept-7'],
            jobTitle: 'Developer', status: 'Busy', joinedDate: '2023-11-10T00:00:00.000Z',
            skills: ['Vue.js', 'Python', 'Docker', 'AWS'],
            stats: { completedTasks: 18, inProgressTasks: 4, efficiency: 85, totalHours: 234, workload: 'Heavy' },
            rating: 8.5
        },
        { 
            id: '6', name: 'Jessica Brown', email: 'jessica.b@test.com', role: UserRole.EMPLOYEE, managerId: '2', companyId: 'comp-1', departmentIds: ['dept-7'],
            jobTitle: 'QA Engineer', status: 'Offline', joinedDate: '2023-03-12T00:00:00.000Z',
            skills: ['Jest', 'Cypress', 'Automation', 'CI/CD'],
            stats: { completedTasks: 35, inProgressTasks: 1, efficiency: 98, totalHours: 180, workload: 'Light' },
            rating: 9.8
        },
        { 
            id: '7', name: 'David Miller', email: 'david.m@test.com', role: UserRole.EMPLOYEE, companyId: 'comp-1', departmentIds: ['dept-7'], // Belongs to no manager
            jobTitle: 'DevOps Engineer', status: 'Active', joinedDate: '2022-08-01T00:00:00.000Z',
            skills: ['Kubernetes', 'Terraform', 'Jenkins', 'GCP'],
            stats: { completedTasks: 22, inProgressTasks: 2, efficiency: 93, totalHours: 210, workload: 'Normal' },
            rating: 9.3
        },
        { 
            id: '8', name: 'HR User', email: 'hr@test.com', role: UserRole.HR, companyId: 'comp-1', departmentIds: ['dept-3'],
            jobTitle: 'HR Specialist', status: 'Active', joinedDate: '2023-01-10T00:00:00.000Z',
            skills: ['Recruiting', 'Onboarding', 'Employee Relations'],
            stats: { completedTasks: 10, inProgressTasks: 2, efficiency: 96, totalHours: 40, workload: 'Normal' },
            rating: 9.6
        },
    ];
};

const getInitialPasswords = (): Record<string, string> => {
    return {
        'admin@test.com': 'password123',
        'manager@test.com': 'password123',
        'drone@example.com': 'password123',
        'sarah.chen@example.com': 'password123',
        'mike.rodriguez@example.com': 'password123',
        'jessica.b@test.com': 'password123',
        'david.m@test.com': 'password123',
        'employee@test.com': 'password123',
        'hr@test.com': 'password123',
    };
};

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (usersJson) {
    return JSON.parse(usersJson);
  }
  const initialUsers = getInitialUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

const getPasswords = (): Record<string, string> => {
    const passwordsJson = localStorage.getItem(PASSWORDS_KEY);
    if(passwordsJson) {
        return JSON.parse(passwordsJson);
    }
    const initialPasswords = getInitialPasswords();
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(initialPasswords));
    return initialPasswords;
}

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const savePasswords = (passwords: Record<string, string>) => {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
}

export const register = (credentials: RegisterCredentials): User => {
  const users = getUsers();
  const passwords = getPasswords();
  if (users.find(u => u.email === credentials.email)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: String(Date.now()),
    name: credentials.name,
    email: credentials.email,
    role: credentials.role,
    companyId: credentials.companyId,
    managerId: credentials.managerId,
    departmentIds: credentials.departmentIds,
    jobTitle: 'New Employee',
    status: 'Active',
    joinedDate: new Date().toISOString(),
    skills: [],
    stats: {
        completedTasks: 0,
        inProgressTasks: 0,
        efficiency: 0,
        totalHours: 0,
        workload: 'Light'
    }
  };
  
  users.push(newUser);
  passwords[credentials.email] = credentials.password;
  
  saveUsers(users);
  savePasswords(passwords);

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const updatePassword = (email: string, oldPass: string, newPass: string): void => {
    const passwords = getPasswords();
    if (passwords[email] !== oldPass) {
        throw new Error("Incorrect current password.");
    }
    if (newPass.length < 6) {
        throw new Error("New password must be at least 6 characters long.");
    }
    passwords[email] = newPass;
    savePasswords(passwords);
};

export const updateUser = (userId: string, updates: Partial<User>): User | undefined => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        saveUsers(users);

        const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            if (currentUser.id === userId) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
            }
        }

        return users[userIndex];
    }
    return undefined;
};

export const deleteUser = (userId: string): void => {
    let users = getUsers();
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
        let passwords = getPasswords();
        delete passwords[userToDelete.email];
        savePasswords(passwords);
    }
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
};


export const login = (email: LoginCredentials['email'], password: LoginCredentials['password']): User => {
  const users = getUsers();
  const passwords = getPasswords();
  const user = users.find(u => u.email === email);
  
  const storedPassword = passwords[email];

  if (!user || storedPassword !== password) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  // Prime the user and password stores if they don't exist
  getUsers();
  getPasswords();
  
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const getUserById = (userId: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.id === userId);
};

export const getTeamMembers = (managerId: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.role === UserRole.EMPLOYEE && user.managerId === managerId);
};

export const getManagers = (): User[] => {
    const users = getUsers();
    return users.filter(user => user.role === UserRole.MANAGER);
};