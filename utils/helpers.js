const { format } = require('date-fns');
const { is } = require('date-fns/locale');

module.exports = {
    format_date: function(date) {
        // Format the date string without timezone conversion
        return format(new Date(date), 'EE, dd LLL yyyy @ HH:mm');
    },
    isAuthor: function(user_id, post_user_id) {
        return user_id === post_user_id;
    }
};