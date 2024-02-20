/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { RequestData } from "../../models/requestModel";
import { ResponseData } from "../../models/responseModel";
import { API_URL } from "../config/constant";

class APIClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string =API_URL) {
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"*"
            }
        });
    }

    public async getData(endPoint: string, requestData: RequestData): Promise<ResponseData> {
        try {
            const axiosResponse: AxiosResponse = await this.axiosInstance.get(endPoint, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error");
        }
    }

    public async getAuthenticatedData(endPoint: string, requestData: RequestData, token: string): Promise<ResponseData> {
        try {
            if (requestData.headers === undefined) {
                requestData.headers = {
                    Authorization: token
                };
            } else {
                requestData.headers["Authorization"] = token;
            }
            const axiosResponse: AxiosResponse = await this.axiosInstance.get(endPoint, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error");
        }
    }

    public async postData(endPoint: string, requestData: RequestData, body: any): Promise<ResponseData> {
        try {
            const axiosResponse: AxiosResponse = await this.axiosInstance.post(endPoint, body, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }

    public async postAuthenticatedData(endPoint: string, requestData: RequestData, body: any, token: string): Promise<ResponseData> {
        try {
            if (requestData.headers === undefined) {
                requestData.headers = { Authorization: token };
            } else {
                requestData.headers["Authorization"] = token;
            }

            const axiosResponse: AxiosResponse = await this.axiosInstance.post(endPoint, body, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }

    public async putData(endPoint: string, requestData: RequestData, body: any): Promise<ResponseData> {
        try {
            const axiosResponse: AxiosResponse = await this.axiosInstance.put(endPoint, body, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }

    public async putAuthenticatedData(endPoint: string, requestData: RequestData, body: any, token: string): Promise<ResponseData> {
        try {
            if (requestData.headers === undefined) {
                requestData.headers = { Authorization: token };
            } else {
                requestData.headers["Authorization"] = token;
            }

            const axiosResponse: AxiosResponse = await this.axiosInstance.put(endPoint, body, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }

    public async deleteData(endPoint: string, requestData: RequestData): Promise<ResponseData> {
        try {
            const axiosResponse: AxiosResponse = await this.axiosInstance.delete(endPoint, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }

    public async deleteAuthenticatedData(endPoint: string, requestData: RequestData, token: string): Promise<ResponseData> {
        try {
            if (requestData.headers === undefined) {
                requestData.headers = { Authorization: token };
            } else {
                requestData.headers["Authorization"] = token;
            }

            const axiosResponse: AxiosResponse = await this.axiosInstance.delete(endPoint, requestData);

            return axiosResponse.data as ResponseData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error as AxiosError;
                return axiosError.response?.data as ResponseData;
            }

            throw new Error("Internal error")
        }
    }
}

export default APIClient;