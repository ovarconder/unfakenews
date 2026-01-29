import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Posts",
      value: "245",
      change: "+12%",
      icon: FileText,
    },
    {
      title: "Total Users",
      value: "1,234",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Page Views",
      value: "45.2K",
      change: "+23%",
      icon: Eye,
    },
    {
      title: "Engagement",
      value: "89%",
      change: "+5%",
      icon: TrendingUp,
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Global Tech Summit Unveils Revolutionary AI Platform",
      author: "Sarah Johnson",
      date: "Jan 29, 2026",
      status: "Published",
    },
    {
      id: 2,
      title: "Economic Recovery Shows Strong Momentum in Q1",
      author: "Michael Chen",
      date: "Jan 28, 2026",
      status: "Published",
    },
    {
      id: 3,
      title: "Climate Action Summit: Nations Commit to Bold Targets",
      author: "Emma Williams",
      date: "Jan 28, 2026",
      status: "Draft",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{stat.change}</span> from last
                  month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    By {post.author} • {post.date}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
