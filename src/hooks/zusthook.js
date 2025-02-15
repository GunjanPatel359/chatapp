import { create } from 'zustand'

export const serverStore =create((set)=>({
    server: null,
    serverProfile: null,

    onsetServer:(server)=>set({server:server}),
    onsetServerProfile:(serverProfile)=>set({serverProfile:serverProfile})
}))

export const serverSetting =create((set)=>({
    userServerProfile: null,
    user: null,
    server: null,
    onsetServerSettingData:(userServerProfile=null,user=null,server=null)=>set({userServerProfile,user,server})
}))

export const useModal = create((set) => ({
    type: null,
    data: null,
    isOpen: false,

    onOpen:(type,data=null)=>set({ isOpen:true,type,data}),
    onClose:(data=null)=>set({ isOpen:false,type:null,data}),
}))