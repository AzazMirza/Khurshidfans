import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "192.168.100.7",
  //       port: "3000",
  //       pathname: "/uploads/**",
  //     },
  //     {
  //       protocol: "http",
  //       hostname: "192.168.100.64",
  //       port: "3000",
  //       pathname: "/**",
  //     },
  //   ],
  //   formats: ["image/avif", "image/webp"],
  //   // domains: ["192.168.100.7", "192.168.100.64", "localhost"],
  // },
  // images: {
  //   remotePatterns: [
  //     new URL('http://192.168.100.7:3000/**'),
  //     {
  //       protocol: "http",
  //       hostname: "192.168.100.7",
  //       port: "3000",
  //       pathname: "/uploads/**",
  //     },
  //     {
  //       protocol: "http",
  //       hostname: "192.168.100.64",
  //       port: "3000",
  //       pathname: "/**",
  //     },
  //   ],
  //   formats: ["image/avif", "image/webp"],
  //   // domains: ["192.168.100.7", "192.168.100.64", "localhost"],
  // },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
