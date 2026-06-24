// Returns short version of driver name (first letter of first name + last name)
const getShortDriverName = (fname:string, lname:string) => `${fname.slice(0,1).toUpperCase()} ${lname.slice(0,1)}${lname.slice(1)}`
export default getShortDriverName