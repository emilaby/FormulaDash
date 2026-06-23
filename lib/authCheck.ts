import { NextRequest } from "next/server"

export default function authCheck(req: NextRequest){
    const authHeader = req.headers.get("authorisation")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`){
        return false
    }
    return true
}