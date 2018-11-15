export const startDrawing = (point) => ({
    type: 'NEW_DRAW',
    point
});

export const addLine = (line) => ({
    type: 'NEW_LINE',
    line
});

export const keepDrawing = (point) => ({
    type: 'KEEP_DRAW',
    point
});

export const stopDrawing = () => ({
    type: 'STOP_DRAW'
});