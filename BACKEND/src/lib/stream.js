import { StreamChat } from "stream-chat"


let streamclient = null

// Function to get or create the Stream client
const getStreamClient = () => {
    if (!streamclient) {
        const stream_apikey = process.env.STREAM_API_KEY
        const stream_secretkey = process.env.STREAM_SECRET_KEY
        
        if (!stream_apikey || !stream_secretkey){
            throw new Error("STREAM_API_KEY and STREAM_SECRET_KEY must be set in environment variables")
        }
        
        streamclient = new StreamChat(stream_apikey, stream_secretkey)
    }
    return streamclient
}

export const upsertstreamuser = async (userdata) => {
    try {
        const client = getStreamClient()
        await client.upsertUser(userdata)
        console.log("Stream user created/updated:", userdata.id)
        return userdata
    } catch (error) {
        console.error("Error upserting stream user:", error)
        throw error
    }
}

export const generatestreamtoken = (userid) => {
    const useridstr = userid.toString()
    const client = getStreamClient()
    return client.createToken(useridstr)
}