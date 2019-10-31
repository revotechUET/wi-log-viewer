import React from 'react';

export default function FixedHeightComponent(Component, fixedHeight, key) {
    return (
        <div key = {key}  style={{height: fixedHeight + "px"}}>
            {Component}
        </div>
    );
}
