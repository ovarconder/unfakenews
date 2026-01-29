import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application settings
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Site Name</label>
              <Input defaultValue="UnfakeNews" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Site Description
              </label>
              <Input defaultValue="Premium news and magazine platform" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Contact Email
              </label>
              <Input defaultValue="contact@unfakenews.com" type="email" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Primary Color
              </label>
              <Input type="color" defaultValue="#18181b" className="h-10" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode for the website
                </p>
              </div>
              <Button variant="outline">Toggle</Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Facebook</label>
              <Input placeholder="https://facebook.com/unfakenews" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Twitter</label>
              <Input placeholder="https://twitter.com/unfakenews" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Instagram</label>
              <Input placeholder="https://instagram.com/unfakenews" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
