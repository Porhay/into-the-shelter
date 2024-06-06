import axios, { AxiosError } from 'axios';
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
    const response = await accountsHost.get(`/api/users/${userId}/`);
    return response.data;
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

export const captureOrder = async (
  userId: string | undefined,
  data: { orderId: string | null },
) => {
  try {
    const res = await accountsHost.post(
      `/api/users/${userId}/paypal/orders/${data.orderId}/capture/`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log('Error while createing activity log', error);
  }
};

export const createOrder = async (
  userId: string | undefined,
  productId: string | null,
) => {
  try {
    const cart = [
      {
        productId: productId,
      },
    ];
    const res = await accountsHost.post(`/api/users/${userId}/paypal/orders/`, {
      cart,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log('Error while activity log creation.', error);
  }
};

export const createUserProduct = async (
  userId: string | undefined,
  productId: string,
) => {
  try {
    const res = await accountsHost.post(`/api/users/${userId}/user-products/`, {
      productId: productId,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error ||
        'An unknown error occurred while creating user product.';
      throw new Error(errorMessage);
    }
  }
};

// do not use if can get from getUser request
export const getUserProducts = async (userId: string | undefined) => {
  try {
    const res = await accountsHost.get(`/api/users/${userId}/user-products/`);
    return res.data;
  } catch (error) {
    console.log(`Error while getting user products, userId:${userId}`, error);
  }
};

export const getChatMessages = async (lobbyId: string | undefined | null) => {
  try {
    const res = await gatewayHost.get(`/api/lobbies/${lobbyId}/chat-messages/`);
    return res.data;
  } catch (error) {
    console.log(`Error while getting chat messages, lobbyId:${lobbyId}`, error);
  }
};
