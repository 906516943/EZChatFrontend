import { AUTH_SERVER, USER_SERVER } from '../Global'

async function DoGet(endpoint) { 

    const response = await fetch(endpoint);

    if (response.status != 200)
        throw new Error("Access " + endpoint + " failed");

    return response;
}

export async function GenAccessToken() { 

    const response = await fetch(AUTH_SERVER + 'MakeGuestAuthToken', {method: 'PUT'});
    
    if (response.status != 200)
        throw new Error("Request access token failed");

    return response.text();
}

export async function GetAuthInfo(token) { 

    const response = await DoGet(AUTH_SERVER + 'AuthInfo?token=' + token);
    return response.json();
}

export async function GetUserInfo(clientId) { 
    const response = await DoGet(USER_SERVER + 'User/' + clientId)
    return response.json();
}

export async function GetUserGroups(clientId) { 
    const response = await DoGet(USER_SERVER + 'User/' + clientId + '/Groups');
    return response.json();
}