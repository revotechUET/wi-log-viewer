import React from 'react';

export default function FixedHeightComponent(props) {
    return (
        <div 
            style={{transform: `translateY(${props.currentIndex * props.fixedHeight}px)`, height: props.fixedHeight + 'px', overflow:'hidden'}}>
            {props.component}
        </div>
    );
}
