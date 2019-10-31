let config = require('./../config/config');
let axios = require('axios');
let userService = require('./user.service');
let from = require('rxjs').from;


let rootApi = process.env.BACKEND || config.service.backend || "http://localhost:3000";
let authApi = process.env.AUTH || config.service.auth || "http://localhost:2999";


function get(url) {
    let token = userService.getToken();
    let configHeaders = {};
    if (token) {
        configHeaders = {
            headers: {
                Authorization: token
            }
        }
    }
    return from(new Promise((resolve, reject) => {
        axios.get(url, configHeaders)
        .then((res) => {
            res = res.data;
            if (parseInt(res.code) === 401) {
                userService.setToken(null);
                resolve(res);
            }
            if (parseInt(res.code) === 200) {
                resolve(res);
            } else {
                reject({
                    message: res.reason
                });
            }
        })
        .catch((e)=>{
            reject(e);
        });
    }));
}

function post(url, payload) {
    let token = userService.getToken();
    let configHeaders = {};
    if (token) {
        configHeaders = {
            headers: {
                Authorization: token
            }
        }
    }
    return from(new Promise((resolve, reject) => {
        axios.post(url, payload, configHeaders)
        .then((res) => {
            res = res.data;
            if (parseInt(res.code) === 401) {
                userService.setToken(null);
                resolve(res);
            }
            if (parseInt(res.code) === 200) {
                resolve(res);
            } else {
                reject({
                    message: res.reason
                });
            }
        })
        .catch((e)=>{
            reject(e);
        });
    }));
}

function login(username, password) {
    return post(authApi + '/login', {
        username: username,
        password: password
    });
}

function searchLog(payload) {
    return post(rootApi + '/log-view/search', payload);
}


module.exports = {
    login,
    searchLog
}





// export function get(url) {
//     let token = userService.getTokenValue();
//     if (token) {
//         configHeaders = {
//             headers: {
//                 Authorization: token
//             }
//         }
//         return axios.get(url, configHeaders);
//     } else return axios.get(url);
// }


// export function post(url, payload) {
//     let token = userService.getTokenValue();
//     if (token) {
//         configHeaders = {
//             headers: {
//                 Authorization: token
//             }
//         }
//         return axios.post(url, payload, configHeaders);
//     } else return axios.get(url, payload);
// }

// export function search(payload) {
//     return post(rootApi + '/log-view/search', payload);
// }


// export function login(username, password) {
//     return post(rootApi + '/', {
//         username: username,
//         password: password
//     });
// }


