import Cookies from 'js-cookie'

export const getToken = () => Cookies.get('token')
export const clearToken = () => Cookies.remove('token')
