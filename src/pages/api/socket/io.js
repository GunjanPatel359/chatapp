import {Server as NetServer} from "http"
import { Server as ServerIO } from 'socket.io'

export const config={
    api:{
        bodyParser: false,
    }
}

const ioHandler=(req,res)=>{
    if(!res.socket.server.io){
        const path="/api/socket/io";
        const httpServer=res.socket.server
        const io=new ServerIO(httpServer,{
            path:path
        });
        res.socket.server.io=io;
    }
    res.end()
}

export default ioHandler