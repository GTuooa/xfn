export default function currentDate ()  {
    let date = new Date();
    const newYear = date.getFullYear();
    let newMonth = date.getMonth() + 1;
    let newDay = date.getDate();
    if(newMonth<10){
        newMonth = '0' + newMonth
    }
    if(newDay<10){
        newDay = '0' + newDay
    }
    const currentdate = newYear + '-' + newMonth + '-' + newDay;

	return currentdate;
}
