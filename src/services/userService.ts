
import { initializeStorage, getFromStorage, setInStorage } from './baseService';

const USER_STORAGE_KEY = 'ecgUsers';

// Initialize empty users array if not present
initializeStorage(USER_STORAGE_KEY, []);

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  registeredDate: string;
}

export const userService = {
  getUsers: (): User[] => {
    return getFromStorage<User[]>(USER_STORAGE_KEY);
  },
  
  getUserById: (id: string): User | null => {
    const users = userService.getUsers();
    return users.find(user => user.id === id) || null;
  },
  
  createUser: (user: Omit<User, 'id' | 'registeredDate'>): User => {
    const users = userService.getUsers();
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      registeredDate: new Date().toISOString()
    };
    users.push(newUser);
    setInStorage(USER_STORAGE_KEY, users);
    return newUser;
  },
  
  updateUser: (user: User): User => {
    const users = userService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      setInStorage(USER_STORAGE_KEY, users);
    }
    return user;
  },
  
  deleteUser: (id: string): void => {
    const users = userService.getUsers();
    const filtered = users.filter(user => user.id !== id);
    setInStorage(USER_STORAGE_KEY, filtered);
  }
};
