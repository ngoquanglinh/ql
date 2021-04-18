const API_ENDPOINT = "http://localhost:3000"
const callApi = (endpoint, method, body = "") => {
    return fetch(API_ENDPOINT + "/" + endpoint, {
        method: method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

const uploads = (endpoint, method, formData) => {
    return fetch(API_ENDPOINT + "/" + endpoint, {
        method: method,
        body: formData || null,
    })
}