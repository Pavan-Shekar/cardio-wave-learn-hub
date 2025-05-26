
import { supabaseService } from './supabaseService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  registeredDate: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const profiles = await supabaseService.getProfiles();
    return profiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      registeredDate: profile.created_at
    }));
  },
  
  getUserById: async (id: string): Promise<User | null> => {
    const profile = await supabaseService.getProfile(id);
    if (!profile) return null;
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      registeredDate: profile.created_at
    };
  },
  
  createUser: async (user: Omit<User, 'id' | 'registeredDate'>): Promise<User | null> => {
    // This will be handled by the Supabase trigger when user signs up
    console.log('User creation handled by Supabase auth trigger');
    return null;
  },
  
  updateUser: async (user: User): Promise<User | null> => {
    const updatedProfile = await supabaseService.updateProfile({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    if (!updatedProfile) return null;
    return {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      role: updatedProfile.role,
      registeredDate: updatedProfile.created_at
    };
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    // Note: This should be handled through Supabase auth admin functions
    console.log('User deletion should be handled through Supabase auth');
    return false;
  }
};
