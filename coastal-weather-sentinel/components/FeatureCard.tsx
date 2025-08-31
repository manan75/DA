import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center h-full flex flex-col items-center"
        >
            <div className="text-coast-blue mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-coast-blue-dark mb-2">{title}</h3>
            <p className="text-sm text-gray-600 flex-grow">{description}</p>
        </motion.div>
    );
};

export default FeatureCard;
