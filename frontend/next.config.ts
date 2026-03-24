import type { NextConfig } from "next";

const nextConfig = {
    allowedDevOrigins: ["192.168.0.105"],
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
