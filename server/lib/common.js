export const getUUID = async ()=>{
    await new Promise((res)=>setTimeout(res, 2000))
    var date = new Date();
var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
];

return components.join("");

}