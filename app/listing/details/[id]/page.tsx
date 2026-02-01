"use client";

import { use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Wind,
  Zap,
  Shield,
  Award,
  Camera,
  Play,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dimg from "@/public/images/kingmodel.png";
import { useGSAP } from "@/app/hooks/useGSAP";
import { toast, useSonner } from "sonner";
import { Product, CartItem, CartItemAttributes, CartStore } from "@/app/types";
import AddToCartForm from "./AddToCartForm";
// import { CartSidebar } from "@/components/cartSidebar";

// const sonner = useSonner();

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Types matching your API

interface Review {
  id: number;
  userId: number;
  reviewTitle: string;
  rating: number;
  reviewDec: string;
  createdAt: string;
}

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // const [size, setsize] = useState(1);
  // const [color, setcolor] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [theme, setTheme] = useState({
    pr: "#009395",
    se: "#fef200",
    tx: "#000000",
    bg: "#eeeeee",
  });
  const [selectedSize, setSelectedSize] = useState<string | number>("");
  const [priceBySize, setPriceBySize] = useState<Record<string, number>>({});
  const [rating, setRating] = useState<number>(0);

 // Review form states
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDec, setReviewDec] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    if (product) {
      // Parse pricesBySize
      const priceMap: Record<string, number> = {};
      if (Array.isArray(product.pricesBySize)) {
        product.pricesBySize.forEach((pair) => {
          if (typeof pair === "string") {
            const [size, priceStr] = pair.split(":");
            priceMap[size] = Number(priceStr);
          }
        });
      }
      setPriceBySize(priceMap);

      // Set default size
      // const defaultSize = product.size?.[0] || '';
      const defaultSize =
        (Array.isArray(product.size) ? product.size[0] : product.size) || "";
      setSelectedSize(defaultSize);
    }
  }, [product]);

  const currentPrice = product
    ? (priceBySize[selectedSize] ?? product.price)
    : 0;

  // NEW FUNCTION: Fetch products in the same category
  // const fetchRelatedProducts = async (category: string) => {
  //   setRelatedLoading(true);
  //   try {
  //     const res = await fetch(`/api/products?category=${encodeURIComponent(category)}&limit=6`);

  //     if (!res.ok) {
  //       throw new Error(`Failed to fetch related products: ${res.status} ${res.statusText}`);
  //     }

  //     const data = await res.json();

  //     // Extract products array from the response object
  //     const productsArray: Product[] = data.products || [];

  //     // Filter out the current product and limit to 3
  //     const filteredProducts = productsArray
  //       .filter((p: Product) => p.id !== product?.id)
  //       .slice(0, 3);

  //     setRelatedProducts(filteredProducts);
  //   } catch (error) {
  //     console.error("Failed to fetch related products:", error);
  //     setRelatedProducts([]); // Fallback to empty array
  //   } finally {
  //     setRelatedLoading(false);
  //   }
  // };

  // NEW FUNCTION: Fetch products in the same category
  const fetchRelatedProducts = async (category: string) => {
    setRelatedLoading(true);
    try {
      const res = await fetch(
        `/api/products?category=${encodeURIComponent(category)}&limit=20`,
      ); // Increased limit for better randomness

      if (!res.ok) {
        throw new Error(
          `Failed to fetch related products: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();

      // Extract products array from the response object
      let productsArray: Product[] = data.products || [];

      // Filter out the current product
      const filteredProducts = productsArray.filter(
        (p: Product) => p.id !== product?.id,
      );

      // Shuffle the array and take up to 3 products
      const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, 3);

      setRelatedProducts(randomProducts);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      setRelatedProducts([]); // Fallback to empty array
    } finally {
      setRelatedLoading(false);
    }
  };

  let size = 0;
  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = async () => {
      const id = window.location.pathname.split("/").pop();
      try {
        // In production, replace with:
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.category && data.category.length > 0) {
          fetchRelatedProducts(data.category[0]);
        }

        const mockReviews: Review[] = [
          {
            id: 1,
            userId: 101,
            reviewTitle: "Alex Johnson",
            rating: 5,
            reviewDec:
              "Absolutely incredible! The silence is what sold me - I can barely hear it running on the lowest setting. Build quality is exceptional.",
            createdAt: "2025-10-28T09:15:00Z",
          },
          {
            id: 2,
            userId: 102,
            reviewTitle: "Maria Garcia",
            rating: 5,
            reviewDec:
              "Worth every penny. The remote control is intuitive and the design fits perfectly with my modern living room.",
            createdAt: "2025-10-22T14:30:00Z",
          },
          {
            id: 3,
            userId: 103,
            reviewTitle: "David Kim",
            rating: 4,
            reviewDec:
              "Great fan overall. The only minor issue is that the highest speed is a bit louder than advertised, but still much quieter than my old fan.",
            createdAt: "2025-10-15T18:45:00Z",
          },
        ];

        setProduct(data);
        setReviews(mockReviews);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // GSAP animations
  useGSAP(() => {
    if (loading || !product) return;

    // Hero animation
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll(".hero-text"), {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Floating product image
      const floatingImg = heroRef.current.querySelector(".floating-product");
      if (floatingImg) {
        gsap.to(floatingImg, {
          y: -25,
          rotate: 2,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }

    // Gallery animation
    if (galleryRef.current) {
      gsap.from(galleryRef.current.querySelectorAll(".gallery-thumb"), {
        opacity: 1,
        x: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }

    // Specs animation
    if (specsRef.current) {
      gsap.from(specsRef.current.querySelectorAll(".spec-item"), {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: specsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // Reviews animation
    if (reviewsRef.current) {
      gsap.from(reviewsRef.current.querySelectorAll(".review-card"), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // Floating elements (icons, cards)
    floatingElementsRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });

    // Custom cursor
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const moveCursor = (e: MouseEvent) => {
      if (cursor && cursorDot) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(cursorDot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power1.out",
        });
      }
    };

    const handleHover = () => {
      if (cursor)
        gsap.to(cursor, { scale: 2, duration: 0.3, ease: "power2.out" });
    };

    const handleLeave = () => {
      if (cursor)
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    // Apply cursor effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, .group, .tab-item",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [loading, product]);

  // const handleAdd = (
  //   product: Product,
  //   quantity: number,
  //   attributes: CartItemAttributes,
  //   cart: CartStore,
  //   stockCheck: boolean = true // enable/disable stock validation
  // ): void => {
  //   const { id, name, price, stock, sku } = product;

  //   // ✅ 1. Stock validation (if enabled)
  //   if (stockCheck && quantity > stock) {
  //     toast.error(
  //       `Only ${stock} ${name} ${stock === 1 ? "is" : "are"} in stock.`,
  //       { duration: 4000 }
  //     );
  //     return;
  //   }

  //   if (stockCheck && stock <= 0) {
  //     toast.error(`❌ ${name} is currently out of stock.`, {
  //       duration: 5000,
  //       icon: "📦",
  //     });
  //     return;
  //   }

  //   // ✅ 2. Generate attribute key
  //   const attributeKey = JSON.stringify(attributes);
  //   // ✅ 3. Check if identical variant already exists in cart
  //   const existingItem = cart.items.find(
  //     (item) =>
  //       item.id === id && JSON.stringify(item.attributes) === attributeKey
  //   );

  //   try {
  //     if (existingItem) {
  //       // ➕ Update quantity if same variant
  //       const newQty = existingItem.quantity + quantity;
  //       if (stockCheck && newQty > stock) {
  //         toast.error(
  //           `Cannot add: only ${stock - existingItem.quantity} more available.`,
  //           { duration: 4000 }
  //         );
  //         return;
  //       }
  //       cart.updateItemQuantity(existingItem.id, newQty);
  //       toast.success(
  //         `✅ ${name} (${
  //           existingItem.attributes.color || "Standard"
  //         }) quantity updated to ${newQty}`,
  //         { icon: "🛒" }
  //       );
  //     } else {
  //       // ➕ Add new item
  //       const newItem: CartItem = {
  //         id,
  //         name,
  //         price,
  //         quantity,
  //         attributes,
  //       };

  //       cart.addToCart(newItem);

  //       // 🎯 Friendly, brand-aligned success message
  //       const variantName = [
  //         attributes.color && `in ${attributes.color}`,
  //         attributes.size && `${attributes.size}”`,
  //         attributes.blades && `${attributes.blades} blades`,
  //       ]
  //         .filter(Boolean)
  //         .join(", ");

  //       toast.success(`✨ ${quantity} × ${name} ${variantName} added to cart`, {
  //         duration: 3500,
  //         icon: "🌬️", // AIRION-appropriate (gentle breeze)
  //         style: {
  //           background: "#fef6fb", // soft pastel pink
  //           color: "#5a2d4d",
  //           border: "1px solid #fbc6e4",
  //         },
  //       });
  //     }

  //   } catch (error) {
  //     console.error("[AIRION] Cart Add Error:", error);
  //     toast.error("⚠️ Failed to add item. Please try again.", {
  //       duration: 4000,
  //     });
  //   }
  // };

  const setFloatingRef = (index: number) => {
    return (el: HTMLDivElement | null) => {
      floatingElementsRef.current[index] = el;
    };
  };

// ✅ New: Submit Review API
  const handleSubmitReview = async () => {
    if (!rating ) {
      alert("Please fill all fields and select a rating.1");
      return;
    }
    if (!reviewTitle) {
      alert("Please fill all fields and select a rating.3");
      return;
    }

    if (!reviewDec) {
      alert("Please fill all fields and select a rating.2");
      return;
    }

    

    setSubmittingReview(true);

    try {
      const res = await fetch("/api/productReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          rating,
          reviewTitle: reviewTitle,
          reviewDec: reviewDec,
          createdAt: new Date().toISOString(),
          // userId: 999,
          // userName: "Guest",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      toast.success("Review submitted successfully!");
      setReviews([
        ...reviews,
        {
          id: data.id || reviews.length + 1,
          userId: 999,
          reviewTitle: reviewTitle,
          rating,
          reviewDec: reviewDec,
          createdAt: new Date().toISOString(),
        },
      ]);

      setRating(0);
      setReviewTitle("");
      setReviewDec("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };


  if (loading) {
    return (
      <div
        style={{ backgroundColor: theme.pr }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: theme.tx }}>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{ backgroundColor: theme.pr }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p style={{ color: theme.tx }} className="mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4 mr-2 -rotate-180" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    const index = Math.min(4, Math.max(0, Math.floor(review.rating) - 1));
    ratingDistribution[index]++;
  });
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* <CartSidebar /> */}
      {/* Custom Cursor — unchanged */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-white/30 rounded-full pointer-events-none z-[100] transition-transform duration-200 hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[100] hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Images */}
            <div className="relative">
              <div className="floating-product relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-linear-to-br from-[#fef200] to-[#009395]  ">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="object-cover transition-transform duration-700"
                />
                {/* <div style={{ 
                  background: `linear-gradient(to top, ${theme.pr}66, transparent, transparent)` 
                }} className="absolute inset-0" /> */}
              </div>

              {/* Image Thumbnails */}
              <div
                ref={galleryRef}
                className="flex gap-3 mt-6 overflow-scroll "
              >
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`gallery-thumb relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all `}
                    style={{
                      borderColor:
                        selectedImageIndex === index ? theme.pr : theme.tx + 80,
                      background: `linear-gradient(to bottom right, ${theme.se + 80}, ${theme.pr + 80}
                        )`,
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - View ${index + 1}`}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-[#009395] text-white">
                    Premium Collection
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm">
                      {product.rating.toFixed(1)} ({totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <h1 className="hero-text text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {product.name}
                </h1>
                <p className="hero-text text-xl"></p>
              </div>

              <div className="hero-text space-y-6">
                {/* <div className="text-3xl font-bold">
                  Rs. {product.price.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).replace(/\B(?=(\d{3})+\b)/g, ',')}
                   {product.stock < 10 && (
                     <span className="ml-4 text-sm font-normal text-red-400">
                      Only {product.stock} left!
                     </span>
                  )} 
                </div> */}

                {/* <div className="text-3xl font-bold">
                  Rs. {currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+\b)/g, ',')}
                </div> */}

                <div className="max-w-4xl mx-auto p-4">
                  {/* <h1 className="text-3xl font-bold mb-6">{product.name}</h1> */}
                  {/* <AddToCartForm product={product}  onAddToCart={handleAdd} /> */}
                  <AddToCartForm
                    product={{
                      ...product,
                      price: currentPrice,
                      size: selectedSize,
                    }}
                  />
                </div>

                {/* Product Badges — unchanged (no dynamic theme colors) */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">1-Year Return Warranty</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">Energy Efficient</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Wind className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Whisper Quiet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="border-t border-white/10 bg-linear-to-b from-transparent to-cyan-900/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex border-b border-white/10">
            {["overview", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`tab-item px-6 py-4 font-medium capitalize transition-colors relative mr-2`}
                style={{
                  // Base text color
                  color: activeTab === tab ? "#009395" : "#000000",
                  backgroundColor:
                    activeTab === tab ? "transparent" : "#009395" + 33,
                  border:
                    activeTab === tab
                      ? "1px solid " + "#009395"
                      : "1px solid transparent",
                  // Optional: add hover effect via JS if needed (or keep Tailwind for static parts)
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-0.5"
                    style={{ backgroundColor: theme.pr }} // or theme.tx if you want it dynamic
                  ></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-12">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Key Features */}
                <div className="lg:col-span-2 space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold">
                      Engineered for Excellence
                    </h2>
                    <p className=" text-lg leading-relaxed">
                      {/* The AeroFlow Pro X represents the pinnacle of fan
                      technology, combining cutting-edge engineering with
                      timeless design. Every component has been meticulously
                      crafted to deliver unparalleled performance in
                      whisper-quiet operation. */}
                      {product.description}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: <Wind className="w-8 h-8" />,
                        title: "Advanced BLDC/PMSM Motor",
                        desc: "Our proprietary brushless DC motor delivers powerful airflow with minimal energy consumption and near-silent operation. The brushless design reduces friction wihtin the motor which leads to almost no heat buildup and increases the motors life exponentially.",
                      },
                      {
                        icon: <Camera className="w-8 h-8" />,
                        title: "Sleek Modern Design",
                        desc: `Crafted from premium aluminum and high-grade plastics, the ${product.name.charAt(0).toUpperCase() + product.name.slice(1)} is as beautiful as it is functional.`,
                      },
                      {
                        icon: <Play className="w-8 h-8" />,
                        title: "Smart Controls",
                        desc: "Intuitive remote control with timer, oscillation, and 6 speed settings for perfect comfort in any environment.",
                      },
                      {
                        icon: <Shield className="w-8 h-8" />,
                        title: "Built to Last",
                        desc: "Rigorous quality testing ensures an extremely roboust product that can withstand a variety of environmental conditions. The word of mouth speaks for itself.",
                      },
                    ].map((feature, i) => (
                      <div
                        key={i}
                        ref={setFloatingRef(i)}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                      >
                        <div
                          style={{
                            backgroundColor: theme.pr + 33,
                            color: theme.pr,
                          }}
                          className={`w-12 h-12 rounded-xl  flex items-center justify-center mb-4  transition-colors`}
                        >
                          <div className="">{feature.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {feature.title}
                        </h3>
                        <p className={`text-[${theme.tx}]`}>{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Preview */}
                <div className="space-y-8">
                  <div
                    ref={setFloatingRef(4)}
                    className="p-6 rounded-2xl "
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${theme.pr + 33}, ${theme.se + 33})`,
                    }}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Award
                        className="w-6 h-6 mr-2 "
                        style={{ color: theme.pr }}
                      />
                      Award Winning Design
                    </h3>
                    <p className=" mb-4">
                      Recognized with the 2025 Red Dot Design Award for
                      exceptional innovation and user experience.
                    </p>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-white/20 rounded-lg"
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div
                    ref={setFloatingRef(5)}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <h3 className="text-xl font-bold mb-4">In the Box</h3>
                    <ul className="space-y-3 ">
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: theme.pr }}
                        ></span>
                        <span>1x Fan</span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: theme.pr }}
                        ></span>
                        <span>Premium Remote Control</span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: theme.pr }}
                        ></span>
                        <span>Mounting Hardware</span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: theme.pr }}
                        ></span>
                        <span>User Manual & Warranty Card</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div ref={specsRef} className="space-y-8">
                {/* Technical Diagram */}
                <div
                  className={`mt-12 p-8 rounded-3xl  border`}
                  style={{ backgroundColor: theme.pr + 33 }}
                >
                  <h3 className="text-2xl font-bold mb-6">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4
                        className="text-lg font-semibold mb-4 "
                        style={{ color: theme.pr }}
                      >
                        Performance
                      </h4>
                      <div className="space-y-3" style={{ color: theme.tx }}>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Max Airflow
                          </span>
                          <span className="font-medium">450 CFM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Power Consumption
                          </span>
                          <span className="font-medium">35W (Max)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Noise Level
                          </span>
                          <span className="font-medium">22-45 dB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Oscillation
                          </span>
                          <span className="font-medium">90° Horizontal</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4
                        className="text-lg font-semibold mb-4 "
                        style={{ color: theme.pr }}
                      >
                        Dimensions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>Height</span>
                          <span className="font-medium">120 cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Blade Diameter
                          </span>
                          <span className="font-medium">42 cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>
                            Base Diameter
                          </span>
                          <span className="font-medium">38 cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-[${theme.tx}]`}>Weight</span>
                          <span className="font-medium">6.8 kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div ref={reviewsRef} className="space-y-12">
                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review, i) => (
                    <div
                      key={review.id}
                      className="review-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold">{review.reviewTitle}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${
                                  j < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                            <span className={`ml-2 text-sm `}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className=" leading-relaxed">{review.reviewDec}</p>
                    </div>
                  ))}
                </div>

                {/* Add Review */}
                

                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="w-10 h-10 flex items-center justify-center"
                          >
                            <Star
                              className="w-6 h-6 hover:text-yellow-400 transition-colors"
                              style={{
                                color: star <= rating ? "#FACC15" : theme.tx,
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Review Title
                      </label>
                      <input
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                        type="text"
                        className="w-full px-4 py-3 bg-white/5 border border-black rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        placeholder="Summarize your experience"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <textarea
                      value={reviewDec}
                      onChange={(e) => setReviewDec(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-black rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        placeholder="Share details about your experience..."
                      ></textarea>
                    </div>

                    {/* <button
                      className="px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
                      style={{ backgroundColor: theme.pr }}
                    >
                      Submit Review
                    </button> */}
                    <button onClick={handleSubmitReview} disabled={submittingReview} className="px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto disabled:opacity-50" style={{ backgroundColor: theme.pr }}>
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${theme.pr}33, ${theme.se}33)`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            ref={setFloatingRef(6)}
            className="text-4xl font-bold mb-12 text-center"
          >
            You Might Also Like
          </h2>

          {relatedLoading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item, i) => (
                <Link href={`/listing/details/${item.id}`} key={item.id}>
                  <div
                    ref={setFloatingRef(7 + i)}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/5 to-white/0 border-2 border-white shadow-2xl hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                      <div className="relative overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 aspect-square">
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div
                          className="absolute top-4 right-4 bg-[#009395]/70 backdrop-blur-sm text-[#000000] text-xs px-2.5 py-1.5 rounded-full flex items-center space-x-1"
                          style={{
                            backgroundColor: `${theme.pr}70`,
                            color: theme.tx,
                          }}
                        >
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                          <span className="font-semibold">
                            {item.rating || "N/A"}
                          </span>
                        </div>
                        <div
                          className="absolute inset-0 bg-linear-to-t from-[#009395]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(to top, ${theme.pr}60, transparent, transparent)`,
                          }}
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-bold">
                            Rs. {item.price}
                          </div>
                          <button
                            className="px-4 py-2 bg-white text-[#009395] rounded-full text-sm font-semibold hover:bg-gray-200 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            style={{ color: theme.pr }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg">
              No similar products found in this category.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Wind className="w-8 h-8" />
                <span className="text-2xl font-bold">Khurshid</span>
              </div>
              <p className={`text-[${theme.tx}] mb-4`}>
                Redefining comfort through innovation and design excellence.
              </p>
              <div className="flex space-x-4">
                {["instagram", "linkedin", "youtube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/50 rounded-full" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Shop",
                links: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
              },
              {
                title: "Support",
                links: ["Contact", "FAQ", "Warranty", "Returns"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Sustainability"],
              },
            ].map((section, i) => (
              <div key={i}>
                <h3 className="font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-[${theme.tx}] hover:text-[${theme.tx}] transition-colors text-sm`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Khurshid Fans. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className={`hover:text-[${theme.tx}] transition-colors`}
              >
                Privacy
              </a>
              <a
                href="#"
                className={`hover:text-[${theme.tx}] transition-colors`}
              >
                Terms
              </a>
              <a
                href="#"
                className={`hover:text-[${theme.tx}] transition-colors`}
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
