import Pusher from "pusher";

const pusherCradentials: Pusher.Options = {
    key: process.env.PUSHER_KEY as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    appId: process.env.PUSHER_APP_ID as string,
    secret: process.env.PUSHER_SECRET as string
}
export const pusher = new Pusher(pusherCradentials)