import React from 'react';
import DrawingLine from './DrawingLine';

const Drawing = ({line}) => (
    <svg className = "drawing">
        {<DrawingLine line={line} />}
    </svg>
)

export default Drawing;