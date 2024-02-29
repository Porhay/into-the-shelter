import axios from 'axios'
import * as config from '../config'

const gatewayHost = axios.create({ baseURL: config.gatewayUrl, timeout: config.timeout })
const accountsHost = axios.create({ baseURL: config.accountsUrl, timeout: config.timeout })


export const getUserReq = async (userId: string) => {
    try {
        const user = await accountsHost.get(`/api/users/${userId}/`)
        return user.data
    } catch (error) {
        console.log('Error while getting user', error);
    }
}

export const updateUserReq = async (userId: string | undefined, data: any) => {
    try {
        const user = await accountsHost.post(`/api/users/${userId}/`, data)
        return user.data
    } catch (error) {
        console.log('Error while getting user', error);
    }
}

export const updateBackgroundReq = async (userId: string | undefined) => {
    try {
        const response = await fetch(`${config.gatewayUrl}/api/users/${userId}/files/update-background`, { method: 'POST' }) // TODO: update to axios
        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        return url
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}

export const handleUploadReq = async (userId: string | undefined, files: any[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file); // Make sure 'files' matches the name expected by your NestJS backend
      });
  
      try {
        const response = await gatewayHost.post(`api/users/${userId}/files`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Files uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };
