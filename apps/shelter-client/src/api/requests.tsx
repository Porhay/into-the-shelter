import axios from 'axios';
import * as config from '../config';

const gatewayHost = axios.create({
  baseURL: config.gatewayUrl,
  timeout: config.timeout,
});
const accountsHost = axios.create({
  baseURL: config.accountsUrl,
  timeout: config.timeout,
});

export const getUser = async (userId: string) => {
  try {
    const user = await accountsHost.get(`/api/users/${userId}/`);
    return user.data;
  } catch (error) {
    console.log('Error while getting user', error);
  }
};

export const updateUser = async (userId: string | undefined, data: any) => {
  try {
    const user = await accountsHost.post(`/api/users/${userId}/`, data);
    return user.data;
  } catch (error) {
    console.log('Error while getting user', error);
  }
};

export const updateBackground = async (userId: string | undefined) => {
  try {
    const response = await fetch(
      `${config.gatewayUrl}/api/users/${userId}/files/update-background`,
      { method: 'POST' },
    ); // TODO: update to axios
    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Error fetching file:', error);
  }
};

export const handleUpload = async (
  userId: string | undefined,
  files: any[],
  type: string,
) => {
  if (files.length > 0) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
      formData.append('type', type);
    });

    try {
      const response = await gatewayHost.post(
        `api/users/${userId}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Files uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }
};

export const deleteFile = async (
  userId: string | undefined,
  fileId: string,
) => {
  try {
    return await gatewayHost.delete(`/api/users/${userId}/files/${fileId}`);
  } catch (error) {
    console.log(`Error while deleting file, id:${fileId}`, error);
  }
};

export const getAllPublicLobbies = async (userId: string | undefined) => {
  try {
    const res = await gatewayHost.get(`/api/users/${userId}/lobbies/`);
    return res.data;
  } catch (error) {
    console.log(
      `Error while getting all public lobbies, userId:${userId}`,
      error,
    );
  }
};

export const getActivityLogsByLobbyId = async (
  userId: string | undefined,
  lobbyId?: string | null,
) => {
  try {
    const res = await gatewayHost.get(
      `/api/users/${userId}/lobbies/${lobbyId}/activity-logs/`,
    );
    return res.data;
  } catch (error) {
    console.log(
      `Error while getting activity log, userId:${userId}, lobbyId:${lobbyId}`,
      error,
    );
  }
};

export const createActivityLog = async (data: any) => {
  try {
    const res = await gatewayHost.post(
      `/api/users/${data.userId}/lobbies/${data.lobbyId}/activity-logs/`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log('Error while createing activity log', error);
  }
};

export const captureOrder = async (data: { orderId: string }) => {
  try {
    const res = await accountsHost.post(
      `/api/paypal/orders/${data.orderId}/capture/`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log('Error while createing activity log', error);
  }
};

export const createOrder = async () => {
  try {
    const cart = [
      {
        id: '1',
        quantity: '2',
      },
    ];
    const res = await accountsHost.post(`/api/paypal/orders/`, { cart });
    return res.data;
  } catch (error) {
    console.log('Error while createing activity log', error);
  }
};
