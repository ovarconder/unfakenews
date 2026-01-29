import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@unfakenews.com",
      role: "EDITOR",
      posts: 24,
      joinDate: "Dec 15, 2025",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@unfakenews.com",
      role: "AUTHOR",
      posts: 18,
      joinDate: "Jan 5, 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.williams@unfakenews.com",
      role: "AUTHOR",
      posts: 32,
      joinDate: "Nov 20, 2025",
      status: "Active",
    },
    {
      id: 4,
      name: "David Martinez",
      email: "david.martinez@unfakenews.com",
      role: "AUTHOR",
      posts: 15,
      joinDate: "Jan 10, 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@unfakenews.com",
      role: "SUPER_ADMIN",
      posts: 0,
      joinDate: "Oct 1, 2025",
      status: "Active",
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "EDITOR":
        return "bg-blue-100 text-blue-800";
      case "AUTHOR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Posts</p>
                    <p className="font-semibold">{user.posts}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-semibold">{user.joinDate}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.status}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
