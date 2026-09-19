import { useEffect, useState } from "react";

const SplashScreen = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <h1 className="text-4xl font-bold text-gray-800">Loading...</h1>
        </div>
    );
}

const AppProvider = ({ children }) => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Actual UI */}
            {children}

            {/* Splash Overlay */}
            {/* {showSplash && (
                <div className="fixed inset-0 z-50">
                    <SplashScreen />
                </div>
            )} */}
        </div>
    );
};

export default AppProvider;