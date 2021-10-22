const keys = [ 87, 38, 83, 40, 65, 37, 68, 39 ];
const keyCode = (code: number) => {
    switch (code) {
        case 87:
        case 38:
            return 'up';
        case 83:
        case 40:
            return 'down';
        case 65:
        case 37:
            return 'left';
        case 68:
        case 39:
            return 'right';
        default:
            return 'none';
    }
}

export {
    keys,
    keyCode
};