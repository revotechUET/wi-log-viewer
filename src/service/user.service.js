//user service
const jwt = require('jwt-decode');
let Subject = require('rxjs').Subject;
let config = require('../config');

let token = null;
let decoded = null;

let tokenSub = new Subject();

module.exports = {
    getToken: function() {
        if (token) return token;
        let readToken = localStorage.getItem("token");
        if (readToken) {
            token = readToken;
        }
        return token;
    },
    isLogin: function() {
        return this.getToken();
    },
    setToken: function(newToken) {
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        token = newToken;
        decoded = null;
        tokenSub.next(token);
    },
    getTokenSub() {
        return tokenSub;
    },
    getRole() {
        if (decoded) return decoded.role;
        let token = this.getToken();
        if (token) {
            try {
                decoded = jwt(token);
                return decoded.role;
            } catch (e) {
                this.setToken(null);
                decoded = null;;
                return null; 
            }
        }
        return decoded.role;
    },
    getUsername() {
        if (decoded) return decoded.username;
        let token = this.getToken();
        if (token) {
            try {
                decoded = jwt(token);
                return decoded.username;
            } catch (e) {
                this.setToken(null);
                decoded = null;;
                return null; 
            }
        }
        return (decoded || {}).username;
    }
}