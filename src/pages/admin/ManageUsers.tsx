
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { userService, User } from "@/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import { UserPlus, Edit, UserX } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Manage Users", href: "/admin/users" },
  { title: "Manage Content", href: "/admin/content" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"student" | "admin">("student");

  // Protect this route for admins only
  useAuthRedirect("admin");

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await userService.deleteUser(id);
      if (success) {
        await fetchUsers();
        toast.success("User deleted successfully");
      } else {
        toast.error("User deletion is handled through Supabase auth");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewRole(user.role);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    
    const updatedUser = {
      ...editingUser,
      name: newName,
      email: newEmail,
      role: newRole,
    };
    
    const result = await userService.updateUser(updatedUser);
    if (result) {
      await fetchUsers();
      setEditingUser(null);
      toast.success("User updated successfully");
    } else {
      toast.error("Failed to update user");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Admin Portal">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-500">View and manage user accounts</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <Button size="sm" disabled>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User (Use Registration)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-4 text-center">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm border-b">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Registered</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(user => (
                    <tr key={user.id} className="text-sm">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3 capitalize">{user.role}</td>
                      <td className="py-3">{new Date(user.registeredDate).toLocaleDateString()}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} disabled>
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-center text-sm text-gray-500">
                        No users registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {editingUser && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-medium mb-3">Edit User</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded mt-1 p-2"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded mt-1 p-2"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-sm">Role</label>
                  <select
                    className="w-full border rounded mt-1 p-2"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "student" | "admin")}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleUpdate}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ManageUsers;
