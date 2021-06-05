
const socket = io();
socket.on("documentary", function ({ action, data }) {
    if (action == "add") {
        console.log(data, "them");
        let pr = data.process.map(x => { return x.progess });
        pr = pr.reduce((a, b) => parseInt(a + b), 0);
        pr = pr / data.process.length;
        const row = `
              <div id="documentary-${data.idDocumentary}" class="detail-document row m-0 panel-body p-2 border-bottom mb-1" data-value="${encodeURIComponent(JSON.stringify(data.item))}">
                <div class="col-6" >
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="">
                            <div class="d-flex align-items-center">${data.name}</div>
                        </div>
                    </div>
                </div >
                <div class="col-6">
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.effectiveDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.expirationDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                        ${data.type == 1 ? `
                          <div class="progress mb-0 d-flex align-items-center mr-2">
                        <div class="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="${pr}" aria-valuemin="0" aria-valuemax="100" style="width:${pr}%" >
                            ${pr}%
                        </div>
                    </div>
                        `
                : ""
            }
                        </div >
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">
                            <button class="btn btn-primary">
                                ${data.status == 0 ? "Mới" : data.status == 1 ? "Chưa xử lý" : "Đã xử lý"}
                            </button>
                            </div>
                        </div>
                    </div >
                </div >
            </div>`;
        if (data.idDepartment) {
            if ($(`#dep-${data.idDepartment}`).length > 0) {
                $(`#dep-${data.idDepartment} .card-body`).append(row);
            }
        } else {
            if ($(`#depEmpty`).length > 0) {
                $(`#depEmpty .card-body`).append(row);
            }
        }
    } else if (action == "delete") {
        console.log(data, "xoa");
        if ($(`#doc-${data.id}`).length > 0) {
            $(`#doc-${data.id}`).remove();
        }
    } else if (action == "edit") {
        let pr = data.process.map(x => { return x.progess });
        pr = pr.reduce((a, b) => parseInt(a + b), 0);
        pr = pr / data.process.length;
        const row = `
              <div class="row p-3 m-0 border-top border-bottom" id="doc-${data.id}" data-id="${data.id}" onclick="detailDoc(${data.id})">
              <div class="col-6" >
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="">
                            <div class="d-flex align-items-center">${data.name}</div>
                        </div>
                    </div>
                </div >
                <div class="col-6">
                    <div class="d-flex justify-content-between h-100 align-items-center">
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.effectiveDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">${moment(data.expirationDate).format("DD-MM-YYYY")}</div>
                        </div>
                        <div class="flex-basis-25">
                        ${data.type == 1 ? `
                          <div class="progress mb-0 d-flex align-items-center mr-2">
                        <div class="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="${pr}" aria-valuemin="0" aria-valuemax="100" style="width:${pr}%" >
                            ${pr}%
                        </div>
                    </div>
                        `
                : ""
            }
                        </div >
                        <div class="flex-basis-25">
                            <div class="d-flex align-items-center">
                            <button class=btn  ${data.status == 0 ? "btn-primary" : data.status == 1 ? "btn-warning" : "btn-success"}">
                                ${data.status == 0 ? "Mới" : data.status == 1 ? "Chưa xử lý" : "Đã xử lý"}
                            </button>
                            </div>
                        </div>
                    </div >
                </div >
            </div>`;
        if ($(`#doc-${data.id}`).length > 0) {
            $(`#doc-${data.id}`).replaceWith(row);
        }
    }
})

socket.on("tags", function ({ action, data }) {
    if (action == "recives") {
        const row = `
            <div data-id=${data.items.id} class="p-2 ml-2 rounded pointer text-white"
                style="background-color:${data.items.code}">
                ${data.items.name}
            </div>
        `;

        if ($(`#documentary-${data.params.idDocumentary}`).length > 0) {
            $(`#documentary-${data.params.idDocumentary} .home-list-tags`).append(row);
        }
    } else {
        if ($(`#documentary-${data.params.idDocumentary}`).length > 0) {
            $(`#documentary-${data.params.idDocumentary} .home-list-tags`).find(`[data-id='${data.items.id}']`).remove();
        }
    }
})