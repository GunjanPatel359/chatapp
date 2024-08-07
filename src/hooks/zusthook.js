import { create } from 'zustand'

export const useModal = create((set) => ({
    type: null,
    data:null,
    isOpen: false,
    reloadCommand:null,

    onOpen:(type,data=null)=>set({ isOpen:true,type,data}),
    reloadFunction:(data=null,reloadCommand=Date.now())=>set({isOpen:false,type:null,data,reloadCommand}),
    onlyReloadCom:(reloadCommand=Date.now())=>set({reloadCommand:reloadCommand}),
    onClose:(data=null)=>set({ isOpen:false,type:null,data})
    
}))