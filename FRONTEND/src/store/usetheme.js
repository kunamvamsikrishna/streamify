import {create} from "zustand"


export const usetheme = create((set)=>({theme: localStorage.getItem("theme-s")||"coffee",
     setTheme: (theme)=> {
        localStorage.setItem("theme-s",theme)
        set({theme})},  
}))

