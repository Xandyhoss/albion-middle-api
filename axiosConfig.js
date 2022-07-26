const axios = require("axios").default;
axios.defaults.baseURL = "https://gameinfo.albiononline.com/api/gameinfo/";

module.exports = axios;
