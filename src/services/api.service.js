import { AUTHENTICATION_TYPE } from "@utils/constants/api.contants";

export default class ApiService {

    getHeaders(authenticationType){
        let headers = {Accept: 'application/json', 'Content-Type': 'application/json'};

        if(
            authenticationType === AUTHENTICATION_TYPE.BASIC ||
            authenticationType === AUTHENTICATION_TYPE.BEARER
        ) {
            headers['Authentication'] = `${authenticationType} ${'token-here'}`;
        }

        return headers;
    }

    get(path, authenticationType, paramsObject = null) {
        const oneLineParams = paramsObject === null ? '' : new URLSearchParams(paramsObject).toString();
        const fullPath = paramsObject === null ? path : path + '?';
        return fetch(fullPath + oneLineParams, {headers: this.getHeaders(authenticationType)})
    }

    
}