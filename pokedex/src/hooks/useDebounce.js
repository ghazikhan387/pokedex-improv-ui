function useDebounce(cb, delay=2000){
let timerid;

return(...arg)=>{
    clearTimeout(timerid);
    timerid = setTimeout(()=>{
        cb(...arg);
    }, delay)
}

}

export default useDebounce;