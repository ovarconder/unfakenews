import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminMediaPage() {
  const mediaItems = [
    {
      id: 1,
      name: "tech-summit-2026.jpg",
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      size: "2.4 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "Jan 29, 2026",
    },
    {
      id: 2,
      name: "economic-growth.jpg",
      url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      size: "1.8 MB",
      uploadedBy: "Michael Chen",
      uploadDate: "Jan 28, 2026",
    },
    {
      id: 3,
      name: "climate-summit.jpg",
      url: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=300&fit=crop",
      size: "3.1 MB",
      uploadedBy: "Emma Williams",
      uploadDate: "Jan 28, 2026",
    },
    {
      id: 4,
      name: "museum-opening.jpg",
      url: "https://images.unsplash.com/photo-1565306049090-e5f2c4c8a2b5?w=400&h=300&fit=crop",
      size: "2.7 MB",
      uploadedBy: "David Martinez",
      uploadDate: "Jan 27, 2026",
    },
    {
      id: 5,
      name: "football-final.jpg",
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
      size: "2.2 MB",
      uploadedBy: "James Wilson",
      uploadDate: "Jan 27, 2026",
    },
    {
      id: 6,
      name: "mars-mission.jpg",
      url: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=300&fit=crop",
      size: "3.5 MB",
      uploadedBy: "Lisa Anderson",
      uploadDate: "Jan 26, 2026",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage your images and media files
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Search and View Options */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search media..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Media ({mediaItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate mb-2">
                    {item.name}
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Size: {item.size}</p>
                    <p>
                      By {item.uploadedBy} • {item.uploadDate}
                    </p>
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
