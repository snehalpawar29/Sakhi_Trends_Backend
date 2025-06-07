import {useState,useContext,createContext,useEffect} from "react";
const CartContext=createContext();
const CartProvider =({children})=>{
    const [cart,setCart]=useState([]);

    useEffect(()=>{
        let existingCartitem = localStorage.getItem("cart");
        if(existingCartitem) setCart(JSON.parse(existingCartitem));
    },[])
    return(
        <CartContext.Provider value={[cart,setCart]}>
            {children}
        </CartContext.Provider>
    );
};

//custom hook
const useCart=()=>useContext(CartContext);
export {useCart,CartProvider};