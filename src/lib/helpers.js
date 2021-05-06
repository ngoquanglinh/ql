function charAt(name) {
    return name.charAt(0).toUpperCase();
}
function length(data) {
    return data.length;
}
function formatDate(date) {
    return moment(date).format("DD-MM-YYYY");
}
function hasCap(claims, caps) {
    caps = caps.split(/\||,|;/);
    if (claims.length == 0) return false;
    for (let i = 0; i <= claims.length - 1; i++) {
        if (caps.indexOf(claims[i].name) != -1) {
            return true;
        }
    }
    return false;
}
module.exports = {
    hasCap: hasCap,
    charAt: charAt,
    length: length,
    formatDate: formatDate,
}