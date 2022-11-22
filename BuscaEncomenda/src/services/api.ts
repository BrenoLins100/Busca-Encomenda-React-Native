import axios from 'axios';

const api = axios.create({
    baseURL: 'https://proxyapp.correios.com.br/'
});

export default api;