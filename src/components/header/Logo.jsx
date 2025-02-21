import { cloneElement } from 'react';
import Baleart from '../../assets/icons/Baleart.jsx';

export const Logo = ({ isSmallScreen }) => {
    return (
        <div className="flex-shrink-0 sm:pr-4 md:pr-8 lg:pr-20">
            <a href="/">
                {cloneElement(isSmallScreen ? Baleart.logo : Baleart.logoName, { className: "w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-12 lg:w-48 lg:h-14 pr-2 transition-all duration-200" })}
            </a>
        </div>
    );
};