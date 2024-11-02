const { format } = require('date-fns');

module.exports = {
    format_date: function(date) {
        // Format the date string without timezone conversion
        return format(new Date(date), 'EE, dd LLL yyyy @ HH:mm');
    }
};