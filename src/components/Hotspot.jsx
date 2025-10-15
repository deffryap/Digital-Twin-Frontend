import React from 'react';
import { getStatusInfo } from '../utils/helpers';

const Hotspot = ({ component, onHover, onLeave, onClick }) => {
    const statusInfo = getStatusInfo(component.health);
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: component.position.top, left: component.position.left }}
            onMouseEnter={() => onHover(component)}
            onMouseLeave={onLeave}
            onClick={() => onClick(component.id)}
        >
            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer ${statusInfo.bgColor}`}>
                <div className={`animate-pulse-slow absolute inline-flex h-full w-full rounded-full ${statusInfo.bgColor} opacity-75`}></div>
                <div className="relative w-3 h-3 bg-white rounded-full"></div>
            </div>
        </div>
    );
};

export default Hotspot;
