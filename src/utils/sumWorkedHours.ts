import convertHoursToMinutes from './convertHoursToMinutes'
export default function sumWorkedHours (firstTime: string, secondTime: string, thirdTime: string, fourthTime: string){
    const fHour = convertHoursToMinutes(firstTime)
    const sHour = convertHoursToMinutes(secondTime)
    const tHour = convertHoursToMinutes(thirdTime)
    const fouHour = convertHoursToMinutes(fourthTime)

    const firstHalf  = sHour - fHour
    const secondHalf = fouHour - tHour

    const final = firstHalf+secondHalf
    
    return final
}