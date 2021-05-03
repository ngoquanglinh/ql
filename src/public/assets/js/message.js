
//Kết nối tới server socket đang lắng nghe
const socket = io();
// socket.emit('join', { username: "linh" });
//Socket nhận data và append vào giao diện
socket.on("documentary", function ({ action, data }) {
    if (action == "add") {
        console.log(data, "add");
        if (data.users.length > 0) {
            const row = `
              <div id="documentary-${data.item.idDocumentary}" class="detail-document row m-0 panel-body p-2 border-bottom mb-1" data-value="${encodeURIComponent(JSON.stringify(data.item))}">
                <div class="col-6" >
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="">
                            <div class="d-flex align-items-center">${data.item.name}</div>
                        </div>
                    </div>
                </div >
                <div class="col-6">
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.item.effectiveDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.item.expirationDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                        ${data.item.type == 1 ? `
                          <div class="progress mb-0 d - flex align - items - center mr - 2">
                        <div class="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="${data.item.process}" aria-valuemin="0" aria-valuemax="100" style="width:${data.item.process}%" >
                            ${data.item.process}%
                        </div >
                    </div >
                        `
                    : ""
                }
                        </div >
            <div class="flex-basis-25">
                <div class="d-flex align-items-center">
                    ${data.item.status == 0 ? "Mới" : data.item.status == 1 ? "Chưa xử lý" : "Đã xử lý"}
                </div>
            </div>
                    </div >
                </div >
            </div > `;

            data.users.map(x => {
                $(`#documentaryUser${x.iduser} `).prepend(row);
                const total = $(`#userTotal${x.iduser} `).attr("data-total");
                $(`#userTotal${x.iduser} `).text(`${parseInt(total) + 1} công văn`);
            })
        }
    } else if (action == "delete") {
        if ($(`#documentary - ${data.id} `)) {
            data.users.map(x => {
                const total = $(`#userTotal${x.iduser} `).attr("data-total");
                $(`#userTotal${x.iduser} `).text(`${(parseInt(total) - 1) > 0 ? (parseInt(total) - 1) : 0} công văn`);
                $(`#documentary - ${data.id} `).remove();
            })
        }
    }
})

