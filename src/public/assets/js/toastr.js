
// notifycation
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
const notify = (status, message) => {
    return toastr[status](message)
}
const swal = (title = "", type = "alert") => {
    if (type == "alert") {
        return Swal.fire(title);
    } else {
        return Swal.fire({
            title: title,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Xóa`,
            denyButtonText: `Hủy`
        }).then(res => {
            console.log(res);
            return res.value ? true : false
        });
    }

}
