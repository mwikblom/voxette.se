export default {
    getCurrentTimestamp: () => {
        var today = new Date();
    
        var day = today.getDate();
        var month = today.getMonth() + 1; // starts at 0
        var year = today.getFullYear();
    
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        
        var hour = today.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
    
        var minutes = today.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
    
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
    },
    getFormattedDate: (date) => {
        var day = date.getDate();
        var month = date.getMonth() + 1;
    
        var year = date.getFullYear();
    
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return year + '-' + month + '-' + day;
    },
    getTimeNextFullHour: (plusHours = 0) => {
        // Next full hour
        var today = new Date();
        var hour = today.getHours() + 1;
        hour += plusHours;
        if (hour > 23) {
            hour = 0;
        }
    
        if (hour < 10) {
            hour = '0' + hour;
        }
        return hour + ':00';
    }    
};