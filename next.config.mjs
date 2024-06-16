/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
        return [
            {
                source: '/fas',
                headers: [
                    { key: 'Expires', value: 'Mon, 26 Jul 1997 05:00:00 GMT' },
                    { key: 'Cache-Control', value: 'no-cache' },
                    { key: 'Pragma', value: 'no-cache' },
                ],
            },
        ];
    },
};

export default nextConfig;
