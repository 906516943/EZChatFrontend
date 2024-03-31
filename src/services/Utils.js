export function GenId() { 
    return Date.now() + Math.floor(Math.random() * 1000000);
}