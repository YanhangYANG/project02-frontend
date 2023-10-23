import { defineStore } from 'pinia';
// 导入你自定义的 apiClient 实例
import apiClient from '@/services/AxiosClient';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('access_token') || null,
    }),
    actions: {
        login(email: string, password: string) {
            // 使用导入的 apiClient 实例发送请求
            return apiClient
                .post('/api/v1/auth/authenticate', {
                    username: email,
                    password: password
                })
                .then((response) => {
                    // Set the token
                    this.token = response.data.access_token;
                    localStorage.setItem('access_token', this.token as string);
                    // 更新 apiClient 实例的 headers 而不是 axios.defaults
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                    return response;
                });
        },
        logout() {
            // 向服务器发送登出请求
            apiClient.post('/api/v1/auth/logout')
                .then(() => {
                    // 请求成功，清除客户端状态
                    console.log('logout')
                    this.token = null;
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                })
                .catch(error => {
                    // 处理请求失败的情况
                    console.error('Logout failed:', error);
                });
        },
    }
});
