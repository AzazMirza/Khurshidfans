// // app/products/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Input } from '@/components/ui/input';
// import { Star } from 'lucide-react';
// import Image from 'next/image';

// // Define types
// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   category: string[];
//   sku: string;
//   color: string;
//   size: number;
//   rating: number;
//   description: string;
//   image: string;
//   images: string[];
// }

// interface ApiResponse {
//   products: Product[];
//   totalProds: number;
//   currentPage: number;
//   totalPages: number;
// }

// const API_BASE_URL = 'http://192.168.100.7:3000';

// export default function ProductsCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Debounced search
//   const fetchProducts = useCallback(async (query: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = query
//         ? `${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}`
//         : `${API_BASE_URL}/api/products`;

//       const res = await fetch(url);
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//       const data: ApiResponse = await res.json();
//       setProducts(data.products || []);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Failed to load products. Please try again.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Debounce effect
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       fetchProducts(searchQuery);
//     }, 400); // Wait 400ms after user stops typing

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchQuery, fetchProducts]);

//   // Fetch all products on initial load
//   useEffect(() => {
//     fetchProducts('');
//   }, [fetchProducts]);

//   // Helper: render stars
//   const renderRating = (rating: number) => {
//     return (
//       <div className="flex">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//           />
//         ))}
//       </div>
//     );
//   };

//   // Clean category display (remove extra quotes)
//   const cleanCategory = (cat: string) => cat.replace(/"/g, '').trim();

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6">Products Catalog</h1>

//       {/* Search Input */}
//       <div className="mb-6">
//         <Input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-md"
//         />
//         {searchQuery && (
//           <p className="text-sm text-muted-foreground mt-2">
//             Showing results for: <span className="font-medium">"{searchQuery}"</span>
//           </p>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
//           {error}
//         </div>
//       )}

//       {/* Product Grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <Card key={i} className="overflow-hidden">
//               <Skeleton className="w-full h-48" />
//               <CardHeader>
//                 <Skeleton className="h-5 w-3/4" />
//                 <Skeleton className="h-4 w-1/2 mt-2" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-4 w-full mb-2" />
//                 <Skeleton className="h-4 w-2/3" />
//               </CardContent>
//               <CardFooter>
//                 <Skeleton className="h-8 w-full" />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">No products found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <Card key={product.id} className="flex flex-col h-full overflow-hidden">
//               <div className="relative w-full h-48 bg-gray-100">
//                 {product.image ? (
//                   <Image
//                     src={product.image.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`}
//                     alt={product.name}
//                     fill
//                     className="object-contain p-2"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               <CardHeader className="p-4 pb-2">
//                 <CardTitle className="text-sm line-clamp-1">{product.name}</CardTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   {renderRating(product.rating)}
//                 </div>
//               </CardHeader>

//               <CardContent className="p-4 pt-0 flex-grow">
//                 <p className="text-lg font-semibold text-primary">${product.price}</p>
//                 <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//                   {product.description}
//                 </p>

//                 <Separator className="my-3" />

//                 <div className="flex justify-between text-xs text-muted-foreground">
//                   <span>Stock: {product.stock}</span>
//                   <span>Size: {product.size}</span>
//                 </div>

//                 <div className="mt-2 flex flex-wrap gap-1">
//                   {product.category.map((cat, idx) => (
//                     <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5">
//                       {cleanCategory(cat)}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>

//               <CardFooter className="p-4 pt-0">
//                 <Button className="w-full">View Details</Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// app/products/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import Link  from 'next/link';


// Define types
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string[];
  sku: string;
  color: string[];
  size: string[];
  rating: number;
  description: string;
  image: string;
  images: string[];
}

interface ApiResponse {
  products: Product[];
  totalProds: number;
  currentPage: number;
  totalPages: number;
}
export interface ThemeColors {
  
  pr: string;
  se: string;
  tx: string;
  bg: string;
}


const API_BASE_URL = 'http://192.168.100.7:3000';

export  default  function ProductsCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  // const color =  fetchTheme(); 

  // Filters
  const [filters, setFilters] = useState({
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 2000000,
    minRating: 0,
    inStockOnly: false,
  });


  // Fetch unique categories from all products (for filter options)

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const value = urlParams.get("category") || "";
  //   setCategory(value);
  // }, []);

  const urlFilterApplied = useRef(false);

  // Fetch unique categories from all products (for filter options)
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) =>
      p.category.forEach((c) => cats.add(c.replace(/"/g, '').trim()))
    );
    return Array.from(cats).sort();
  }, [products]);

  // Apply URL category only once on initial load
  useEffect(() => {
    if (!urlFilterApplied.current && allCategories.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const rawCategory = urlParams.get("category") || "";
      const urlCategory = rawCategory.replace(/"/g, '').trim();
      
      if (urlCategory && allCategories.includes(urlCategory)) {
        setFilters(prev => ({
          ...prev,
          categories: [urlCategory]
        }));
        urlFilterApplied.current = true;
      }
    }
  }, [allCategories]); // Only run when categories are loaded

  // const activateCategoryFilter = useCallback((category: string) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     categories: category != "" ? [category] : [],
  //   }));
  // }, []);

  useEffect(() => {
    // activateCategoryFilter(category);
    console.log('Category from URL:',category, 'Applied Filters:', filters.categories);
  }, [category]);


  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `/api/products?search=${encodeURIComponent(query)}`
        : `/api/products`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const  ApiResponse = await res.json();
      setProducts(ApiResponse.products || []);
      // useEffect(() => {
        console.log('Fetched products:', ApiResponse.products);
      // }, [ApiResponse.products]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.categories]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts('');
  }, [fetchProducts]);

  // Apply client-side filtering (optional: you could also extend API to support these)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const cleanCats = product.category.map((c) => c.replace(/"/g, ''));

      let failedCondition = null;

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.some((cat) => cleanCats.includes(cat))
      ) {
        failedCondition = 'category';
        return false;
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        failedCondition = 'price';
        return false;
      }

      // Rating filter
      if (product.rating < filters.minRating) {
        failedCondition = 'rating';
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && product.stock <= 0) {
        failedCondition = 'stock';
        return false;
      }

      if (failedCondition) {
        console.log(`Product ${product.id} failed filter condition: ${failedCondition}`);
      }

      return !failedCondition;
      return true;
    });
  }, [products, filters]);

  const renderRating = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const cleanCategory = (cat: string) => cat.replace(/"/g, '').trim();

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: 2000000,
      minRating: 0,
      inStockOnly: false,
    });
  };

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-6 ">
      <div className=' h-1/2'>
        <h3 className="font-semibold mb-2 ">Categories</h3>
        {/* <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {allCategories.length > 0 ? (
            <ul className="space-y-2 list-disc">
              {allCategories.map((cat) => (
                <li key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({
                          ...prev,
                          categories: [...prev.categories, cat],
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.filter((c) => c !== cat),
                        }));
                      }
                    }
                  }
                  />
                  <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                    {cat}
                  </Label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          )} 



        </div> */}

<div className="space-y-3  overflow-y-auto pr-2">
  <ul className={`space-y-2 border-2 border-input rounded-lg p-2           ${
            filters.categories.includes("Ceiling Fans")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
`}>
    {/* Ceiling Fans - Main Category */}
    <li>
      <label
        htmlFor="cat-Ceiling-Fans"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out 
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Ceiling-Fans"
          checked={filters.categories.includes("Ceiling Fans")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Ceiling Fans"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Ceiling Fans"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Ceiling Fans")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-semibold">
          Ceiling Fans
        </span>
      </label>
    {/* Eforce - Sub-brand or Variant */}


    </li>

    <li className='ml-4'>
      <label
        htmlFor="cat-Eforce"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Eforce")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Eforce"
          checked={filters.categories.includes("Eforce")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Eforce"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Eforce"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Eforce")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Eforce
        </span>
      </label>
    </li>
    {/* ----------------- */}

    <li className='ml-4'>
      <label
        htmlFor="cat-AC DC"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("AC DC")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-AC DC"
          checked={filters.categories.includes("AC DC")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "AC DC"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "AC DC"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("AC DC")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          AC/DC
        </span>
      </label>
    </li>
    {/* ----------------- */}
    <li className='ml-4'>
      <label
        htmlFor="cat-AC 220V"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("AC 220V")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-AC 220V"
          checked={filters.categories.includes("AC 220V")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "AC 220V"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "AC 220V"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("AC 220V")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          AC Capacitor 220V
        </span>
      </label>
    </li>
    {/* ----------------- */}
    <li className='ml-4'>
      <label
        htmlFor="cat-Designer"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Designer")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Designer"
          checked={filters.categories.includes("Designer")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Designer"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Designer"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Designer")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Designer Series
        </span>
      </label>
    </li>
    {/* ----------------- */}

  </ul>
  <ul className={`space-y-2 border-2 border-input rounded-lg p-2           ${
            filters.categories.includes("Pedestal Fans")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
`}>
    {/* Pedestal Fans - Main Category */}
    <li>
      <label
        htmlFor="cat-Pedestal Fans"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out 
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Pedestal Fans"
          checked={filters.categories.includes("Pedestal Fans")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Pedestal Fans"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Pedestal Fans"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Pedestal Fans")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-semibold">
          Pedestal Fans
        </span>
      </label>
    {/* Eforce - Sub-brand or Variant */}


    </li>

    <li className='ml-4'>
      <label
        htmlFor="cat-AC DC P"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("AC DC P")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-AC DC P"
          checked={filters.categories.includes("AC DC P")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "AC DC P"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "AC DC P"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("AC DC P")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          AC/DC 
        </span>
      </label>
    </li>
    {/* ----------------- */}
    <li className='ml-4'>
      <label
        htmlFor="cat-AC 220 P"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("AC 220 P")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-AC 220 P"
          checked={filters.categories.includes("AC 220 P")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "AC 220 P"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "AC 220 P"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("AC 220 P")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          AC Capacitor 220V
        </span>
      </label>
    </li>
    {/* ----------------- */}
    {/* <li className='ml-4'>
      <label
        htmlFor="cat-Designer"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Designer")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Designer"
          checked={filters.categories.includes("Designer")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Designer"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Designer"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Designer")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Designer Series
        </span>
      </label>
    </li> */}
    {/* ----------------- */}

  </ul>
  
  <ul className={`space-y-2 border-2 border-input rounded-lg p-2           ${
            filters.categories.includes("Bracket Fans")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
`}>
    {/* Bracket Fans - Main Category */}
    <li>
      <label
        htmlFor="cat-Bracket Fans"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out 
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Bracket Fans"
          checked={filters.categories.includes("Bracket Fans")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Bracket Fans"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Bracket Fans"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Bracket Fans")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-semibold">
          Bracket Fans
        </span>
      </label>
    {/* Eforce - Sub-brand or Variant */}


    </li>

    <li className='ml-4'>
      <label
        htmlFor="cat-18 Bracket"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("18 Bracket")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-18 Bracket"
          checked={filters.categories.includes("18 Bracket")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "18 Bracket"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "18 Bracket"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("18 Bracket")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          18" Wall Bracket 220V
        </span>
      </label>
    </li>
    {/* ----------------- */}

    <li className='ml-4'>
      <label
        htmlFor="cat-Mega Bracket"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Mega Bracket")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Mega Bracket"
          checked={filters.categories.includes("Mega Bracket")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Mega Bracket"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Mega Bracket"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Mega Bracket")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Mega Bracket 
        </span>
      </label>
    </li>
    {/* ----------------- */}

  </ul>

  <ul className={`space-y-2 border-2 border-input rounded-lg p-2           ${
            filters.categories.includes("False Ceiling Fans")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
`}>
    {/* False Ceiling Fans - Main Category */}
    <li>
      <label
        htmlFor="cat-False Ceiling Fans"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out 
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-False Ceiling Fans"
          checked={filters.categories.includes("False Ceiling Fans")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "False Ceiling Fans"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "False Ceiling Fans"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("False Ceiling Fans")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-semibold">
          False Ceiling Exhaust
        </span>
      </label>
    {/* Eforce - Sub-brand or Variant */}


    </li>

    {/* <li className='ml-4'>
      <label
        htmlFor="cat-2x2"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("2x2")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-2x2"
          checked={filters.categories.includes("2x2")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "2x2"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "2x2"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("2x2")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          2'x 2' False Ceiling
        </span>
      </label>
    </li> */}
    {/* ----------------- */}

    <li className='ml-4'>
      <label
        htmlFor="cat-False Ceiling Exhaust"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("False Ceiling Exhaust")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-False Ceiling Exhaust"
          checked={filters.categories.includes("False Ceiling Exhaust")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "False Ceiling Exhaust"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "False Ceiling Exhaust"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("False Ceiling Exhaust")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          False Ceiling Exhaust 
        </span>
      </label>
    </li>
    {/* ----------------- */}

  </ul>

  <ul className={`space-y-2 border-2 border-input rounded-lg p-2           ${
            filters.categories.includes("Exhaust Fans")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
`}>
    {/* Exhaust Fans - Main Category */}
    <li>
      <label
        htmlFor="cat-Exhaust Fans"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out 
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Exhaust Fans"
          checked={filters.categories.includes("Exhaust Fans")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Exhaust Fans"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Exhaust Fans"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Exhaust Fans")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-semibold">
          Exhaust Fans
        </span>
      </label>
    {/* Eforce - Sub-brand or Variant */}


    </li>

    <li className='ml-4'>
      <label
        htmlFor="cat-Metal Exhaust"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Metal Exhaust")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Metal Exhaust"
          checked={filters.categories.includes("Metal Exhaust")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Metal Exhaust"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Metal Exhaust"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Metal Exhaust")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Metal Exhaust
        </span>
      </label>
    </li>
    {/* ----------------- */}

    <li className='ml-4'>
      <label
        htmlFor="cat-Plastic Exhaust"
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            filters.categories.includes("Plastic Exhaust")
              ? "bg-primary/30 border-2 border-primary/70 text-primary shadow-sm"
              : "bg-background border border-input hover:bg-muted/60 hover:border-muted-foreground/30"
          }
          focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none
        `}
      >
        <Checkbox
          id="cat-Plastic Exhaust"
          checked={filters.categories.includes("Plastic Exhaust")}
          onCheckedChange={(checked) => {
            if (checked) {
              setFilters((prev) => ({
                ...prev,
                categories: [...prev.categories, "Plastic Exhaust"],
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== "Plastic Exhaust"),
              }));
            }
          }}
          className={`
            h-5 w-5 rounded border
            ${
              filters.categories.includes("Plastic Exhaust")
                ? "border-primary bg-primary text-background"
                : "border-input bg-background hover:border-primary"
            }
          `}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Plastic Exhaust 
        </span>
      </label>
    </li>
    {/* ----------------- */}

  </ul>
</div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="text-sm text-muted-foreground mb-2">
          Rs. {filters.minPrice} — Rs. {filters.maxPrice}
        </div>
        <Slider
        className='bg-[#009395]'
          min={0}
          max={2000000}
          step={10}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) =>
            setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Minimum Rating</h3>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              className="border-2 border-white"
              key={rating}
              variant={filters.minRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === rating ? 0 : rating,
                }))
              }
            >
              {rating}+
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* <div className="flex items-center justify-between">
        <Label htmlFor="inStock">In Stock Only</Label>
        <Switch
          id="inStock"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) =>
            setFilters((prev) => ({ ...prev, inStockOnly: checked }))
          }
        />
      </div> */}

      <Button variant="outline" onClick={resetFilters} className="w-full bg-red-500 text-white">
        Reset Filters
      </Button>
    </div>
  );

    const getGradientStyle = (opt: string) => {
    const [c1, c2] = opt.trim().split(/\s+/);
    if (!c1 || !c2) return {};
    return {
      background: `linear-gradient(to bottom right, var(--color-${c1}) 0%, var(--color-${c1}) 49%, var(--color-${c2}) 51%, var(--color-${c2}) 100%)`,
    };
  };


  return (
    
    <div className="px-5 mx-auto py-6 mt-20 "  >
      

      <span className="flex justify-between flex-col md:flex-row items-start md:items-center">
      <h1 className="text-3xl font-bold mb-6">Products Catalog</h1>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6 bg-white  rounded-md">
        <div className="relative md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-4">
              <FilterSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 max-w-2xl">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      </span>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products match your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col h-full overflow-hidden gap-0 pt-0 hover:scale-105 hover:shadow-lg hover:border-2 transition-transform">
                  <div className="relative w-full h-56 bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image.startsWith('http')
                          ? product.image
                          : `${API_BASE_URL}${product.image}`}
                        alt={product.name}
                        fill
                        className="object-contain p-2 transition-transform"
                        unoptimized 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2 ">
                    <CardTitle className="text-xl line-clamp-1 w-full flex justify-between ">{product.name}
                      {/* {renderRating(product.rating)} */}

          {(product.color).map((opt) => (
            <li
            key={opt}
            className="flex flex-row items-center gap-1"
            >
              <span
              key={opt}
                className="w-10 h-7 rounded-4xl border border-black/20 shrink-0"
                style={getGradientStyle(opt)}
                aria-hidden="true"
              />
              {/* <span>{opt}</span> */}
            </li>
          ))}


                    </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 grow">
                    <p className="text-lg font-semibold text-[#009395]">Rs. {product.price}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-bold">
                      {product.description}
                    </p>

                    <Separator className="my-3" />

                    <div className="flex justify-between text-xs text-muted-foreground font-bold">
                      {/* <span>Stock: {product.stock}</span> */}
                      {/* <span>
                        Size:&nbsp;
                        {product.size.map((size, idx) => (
                          <span key={idx} className="mr-2">
                             {size}" 
                          </span>
                        ))}
                      </span> */}
                    </div>

                    {/* <div className="mt-2 flex flex-wrap gap-1">
                      {product.category.map((cat, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5 bg-[#009395]/50">
                          {cleanCategory(cat)}
                        </Badge>
                      ))}
                    </div> */}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/listing/details/${product.id}`}>
                      <Button className="w-full bg-[#fef200] hover:bg-[#fde300]">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}