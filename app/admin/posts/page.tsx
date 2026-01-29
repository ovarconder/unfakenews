import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminPostsPage() {
  const posts = [
    {
      id: 1,
      title: "Global Tech Summit Unveils Revolutionary AI Platform",
      category: "Technology",
      author: "Sarah Johnson",
      date: "Jan 29, 2026",
      status: "Published",
      views: "12.5K",
    },
    {
      id: 2,
      title: "Economic Recovery Shows Strong Momentum in Q1",
      category: "Business",
      author: "Michael Chen",
      date: "Jan 28, 2026",
      status: "Published",
      views: "8.3K",
    },
    {
      id: 3,
      title: "Climate Action Summit: Nations Commit to Bold Targets",
      category: "Politics",
      author: "Emma Williams",
      date: "Jan 28, 2026",
      status: "Draft",
      views: "0",
    },
    {
      id: 4,
      title: "Cultural Renaissance: New Museum Opens Downtown",
      category: "Culture",
      author: "David Martinez",
      date: "Jan 27, 2026",
      status: "Published",
      views: "5.2K",
    },
    {
      id: 5,
      title: "Champions League Final Preview: Historic Matchup",
      category: "Sports",
      author: "James Wilson",
      date: "Jan 27, 2026",
      status: "Published",
      views: "15.8K",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your articles and content
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search posts..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {post.category}
                    </span>
                    <span>By {post.author}</span>
                    <span>{post.date}</span>
                    <span>{post.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
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
