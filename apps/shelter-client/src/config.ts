export default {
    port: process.env.REACT_APP_CLIENT_PORT || 3000,
    baseURL: `http://localhost:${process.env.REACT_APP_CLIENT_PORT}/` || `http://localhost:3000/`,
    timeout: 1000,
}