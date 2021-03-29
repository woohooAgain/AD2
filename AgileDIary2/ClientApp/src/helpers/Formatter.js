export default class Formatter extends Object{
    static mapDate(date) {
        if (date)
        {
            let a = new Date(Date.parse(date));
            const year = a.getFullYear();
            const month = a.getMonth();
            const day = a.getDate();
    
            // Creating a new Date (with the delta)
            const finalDate = new Date(year, month, day);
            return finalDate.toISOString().substr(0, 10);
        }        
    }
}