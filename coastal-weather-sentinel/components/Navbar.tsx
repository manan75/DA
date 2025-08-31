import React from 'react';
import type { Page } from '../App';
import { WaveIcon } from './icons';

interface NavbarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, onNavigate, children }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-coast-blue text-white' 
                : 'text-gray-600 hover:bg-coast-blue/10 hover:text-coast-blue'
            }`}
        >
            {children}
        </button>
    );
};


const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
    return (
        <nav className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <button onClick={() => onNavigate('home')} className="flex items-center cursor-pointer">
                        <WaveIcon className="h-8 w-8 text-coast-blue" />
                        <span className="ml-3 text-xl font-bold text-coast-blue">Coastal Sentinel</span>
                    </button>
                    <div className="flex items-center space-x-2">
                       <NavItem page="home" currentPage={currentPage} onNavigate={onNavigate}>
                           Home
                       </NavItem>
                       <NavItem page="dashboard" currentPage={currentPage} onNavigate={onNavigate}>
                           Dashboard
                       </NavItem>
                       <NavItem page="alerts" currentPage={currentPage} onNavigate={onNavigate}>
                           Alerts
                       </NavItem>
                       <NavItem page="about" currentPage={currentPage} onNavigate={onNavigate}>
                           About
                       </NavItem>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;