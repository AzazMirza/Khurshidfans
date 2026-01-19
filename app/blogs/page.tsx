// app/blog/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Search, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock blog data - replace with your CMS/data fetching
const blogPosts = [
  {
    id: 1,
    title: "Building Modern UIs with shadcn/ui",
    excerpt: "Learn how to create beautiful, accessible interfaces using shadcn/ui and Tailwind CSS.",
    content: "Full content...",
    author: "Alex Johnson",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: ["React", "UI", "shadcn"],
    image: "/placeholder-blog-1.jpg",
    slug: "building-modern-uis"
  },
  {
    id: 2,
    title: "The Future of Web Development",
    excerpt: "Exploring emerging trends and technologies shaping the future of web development.",
    content: "Full content...",
    author: "Sam Chen",
    date: "2024-03-10",
    readTime: "8 min read",
    tags: ["Web Dev", "Future", "Tech"],
    image: "/placeholder-blog-2.jpg",
    slug: "future-web-development"
  },
  {
    id: 3,
    title: "Optimizing React Performance",
    excerpt: "Practical techniques to make your React applications faster and more efficient.",
    content: "Full content...",
    author: "Taylor Reed",
    date: "2024-03-05",
    readTime: "6 min read",
    tags: ["React", "Performance", "Optimization"],
    image: "/placeholder-blog-3.jpg",
    slug: "react-performance"
  }
];

const categories = ["All", "React", "Design", "Performance", "Tutorials", "News"];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, tutorials, and updates from our engineering team
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            className="pl-10" 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button 
              key={category} 
              variant="outline" 
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col h-full">
            <div className="relative h-48 w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
              <div className="flex justify-between w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardFooter>
            <Link href={`/blog/${post.slug}`} className="absolute inset-0">
              <span className="sr-only">Read {post.title}</span>
            </Link>
          </Card>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Get the latest posts delivered straight to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="your@email.com" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-2">
        <Button variant="outline" size="sm">Previous</Button>
        <Button variant="outline" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  );
}