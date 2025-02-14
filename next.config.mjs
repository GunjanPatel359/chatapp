/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {hostname:"utfs.io"},
            {hostname:"uploadthing.com"},
        ]
    }
};

export default nextConfig;
