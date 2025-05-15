// module.exports.useMouse = useMouse;

var useMouse = function(){
    console.log('useMouse  useMouse')
}

// 或
// module.exports.useMouse = useMouse;

export function useMouse(){
    return useMouse;
};