import type { NextConfig } from "next";

const nextConfig = {
    allowedDevOrigins: ["10.253.8.169"],
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/media/**",
            },
            {
                protocol: "https",
                hostname: "corretoruemapi.pythonanywhere.com",
            },
        ],
        dangerouslyAllowSVG: true,
        ...(process.env.NODE_ENV === "development" && {
            unoptimized: true,
        }),
    },
};
export default nextConfig;
