export default async function getMeetings(query:string){
    const meetingsUrl = `https://api.openf1.org/v1/meetings?${query}`
    const meetingsRes = await fetch(meetingsUrl, { next: {revalidate: 1000} })

    if (!meetingsRes.ok){
        return null
    }

    const meetingData = await meetingsRes.json()

    return meetingData
}