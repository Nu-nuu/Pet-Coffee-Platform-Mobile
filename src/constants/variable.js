const RESERVATIONS = {
    productMore: "Bạn có muốn đặt thêm gì không?",
    productAdd: "Bạn có muốn đặt trước đồ uống không?",
    productView: "Xem đồ uống đã đặt",
    noteAdd: "Bạn có muốn ghi chú điều gì không?",

    showLess: "Ẩn bớt",
    areaView: "Xem thông tin Khu vực",
    detailView: "Xem chi tiết giá",

    confirmOrder: 'Xác nhận thanh toán với',
    confirmProduct: 'Xác nhận đặt thêm Đồ uống với ',
    cancelOrder100: `Bạn chắc chắn muốn hủy Đặt chỗ?
                    ${'\n'}Lưu ý:
                    ${'\n'}  - Hoàn 100% tiền đồ uống đã đặt
                    ${'\n'}  - Hoàn 100% tiền đặt chỗ`,
    cancelInvoice: `Bạn chắc chắn muốn hủy Đặt đồ uống? 
                    ${'\n'}Lưu ý: 
                    ${'\n'}  - Thao tác sẽ hủy toàn bộ đồ uống bạn đã đặt
                    ${'\n'}  - Hoàn 100% tiền đồ uống đã đặt`
    ,
    cancelOrder60: `Bạn chắc chắn muốn hủy Đặt chỗ?
    ${'\n'}Lưu ý:
    ${'\n'}  - Hoàn 100% tiền đồ uống đã đặt
    ${'\n'}  - Hoàn 60% tiền đặt chỗ (*)
    ${'\n'}  *Lý do: bạn đang thực hiện hủy đặt trước 1 ngày `,

    cancelOrderShop: `Bạn chắc chắn muốn hủy đơn Đặt chỗ?
    ${'\n'}Lưu ý Quán sẽ phải:
    ${'\n'}  - Hoàn 100% tiền đồ uống và tiền đặt chỗ cho khách hàng đã đặt`,

    cancelOrderFull: `Bạn chắc chắn muốn hủy Đặt chỗ?
    ${'\n'}Lưu ý:
    ${'\n'}  - Hoàn 100% tiền đồ uống đã đặt
    ${'\n'}  - Hoàn 100% tiền đặt chỗ (*)
    ${'\n'}  *Lý do: quán thay đổi thú cưng của khu vực `,


    errorOrder: 'Không đủ số dư trong Ví, cần thêm ',
    selectArea: 'Chọn khu vực đặt chỗ',
    cancel: "Bạn chắc chắn muốn hủy?"


}

const AREAS = {
    noPet: 'Tầng chưa có Thú cưng'
}

const SHOPS = {
    noArea: "Quán chưa cập nhật Khu vực",
    noPet: "Quán chưa cập nhật Thú cưng",
    noPost: "Quán chưa đăng Bài viết",
    noReview: "Quán chưa có Lượt nhắc nào",
    noEvent: "Quán chưa cập nhật Sự kiện",
    noForm: "Quán chưa cập nhật biểu mẩu",
    noShop: 'Không tìm thấy kết quả'
}

const USERS = {
    noJoinEvent: "Bạn chưa tham gia Sự kiện nào",
    noPost: 'Bạn chưa đăng tải Bài viết nào',
    noItems: 'Bạn chưa có Quà tặng nào trong Ví',
    noTransaction: "Không tìm thấy Giao dịch nào",
    noReservation: "Không tìm thấy Lịch sử đặt chỗ nào",
    noNoti: "Hiện tại không có thông báo nào",
    noForm: "Biểu mẫu đăng ký của bạn không tồn tại"
}

const PLATFORMS = {
    noItems: 'Chúng tôi sẽ cập nhật Quà tặng sớm nhất'
}

const PETS = {
    noRate: "Thú cưng chưa có đánh giá",
    noMoment: "Quán chưa đăng tải Khoảnh khắc về Thú cưng",
    noVaccine: "Quán chưa câp nhật Thông tin tiêm phòng về Thú cưng",
    noDonate: "Thú cưng chưa được ủng hộ",
    noImage: "Thú cưng chưa cập nhật Thư viện ảnh",
}

const ALERTS = {
    loading: "Hệ thống đang xử lý",
    loading2: "xin chờ một lát..",

    success: "Thành công",
    cancel: "Đã hủy",
    processing: "Đang xử lý",
    return: "Hoàn tiền",

    orderRefund: "Đã hoàn tiền",
    orderSuccess: "Đã thanh toán",
    orderOvertime: "Đã hoàn thành",


    thanks: "Tặng quà thành công",
    thanks2: "Cảm ơn bạn ❤️",

    blank: "Không thể để trống",
    phone: "Số điện thoại không đúng định dạng",
    image: "Vui lòng chọn ảnh",
    number: "Nhập đúng định dạng số",
    more0: "Số phải lớn hơn 0",

    birth: "Năm sinh 4 số",
    year: "Năm sinh trong khoảng 1980 - hiện tại"

}


const ACCOUNTS = {
    ipPass: "Mật khẩu phải có ít nhất 8 ký tự",
    blankP: "Mật khẩu không thể trống",
    ipPassE: "Mật khẩu mới không khớp",
    ipEmail: "Email sai định dạng",
    blankE: "Email không thể trống",

}

const SOCIALS = {
    confirmDelPost: "Bạn chắn chắn muốn xóa bài viết này",
    confirmDelComment: "Bạn chắn chắn muốn xóa bình luận này"

}
//Bạn có muốn ... không?
//Xem ... 
export { RESERVATIONS, AREAS, SHOPS, USERS, ALERTS, PETS, ACCOUNTS, SOCIALS, PLATFORMS };
