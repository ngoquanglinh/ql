
// var func = {
//     charAt: function (name) {
//         return name.charAt(0).toUpperCase();
//     },
//     length: function (data) {
//         console.log(data);
//         return data.length();
//     },
// };

function charAt(name) {
    return name.charAt(0).toUpperCase();
}
function length(data) {
    return data.length;
}
function formatDate(date) {
    return moment(date).format("DD-MM-YYYY");
}
module.exports = {
    charAt: charAt,
    length: length,
    formatDate: formatDate
}