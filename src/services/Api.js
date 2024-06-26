import { AUTH_SERVER, USER_SERVER, IMAGE_SERVER } from '../Global'

async function DoGet(endpoint) { 

    const response = await fetch(endpoint);

    if (response.status != 200)
        throw new Error("Access " + endpoint + " failed");

    return response;
}

async function DoPost(endpoint, body) { 

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });

    if (response.status != 200)
        throw new Error("Access " + endpoint + " failed");

    return response;
}

async function DoPutArrayBufferBody(endpoint, body) { 
    const response = await fetch(endpoint, {
        method: 'PUT',
        body: new Blob([body])
    });

    if (response.status != 200)
        throw new Error("Put " + endpoint + " failed");

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

export async function GetGroupInfo(groupId) { 
    const response = await DoGet(USER_SERVER + 'Group/' + groupId)
    return response.json();
}

export async function GetUserGroups(clientId) { 
    const response = await DoGet(USER_SERVER + 'User/' + clientId + '/Groups');
    return response.json();
}

export async function GetImageIds(imgHashes) { 
    const response = await DoPost(IMAGE_SERVER + 'FindImage', imgHashes);
    return response.json();
}

export async function PutImage(imgBuffer) { 
    await DoPutArrayBufferBody(IMAGE_SERVER + 'Image', imgBuffer);
}

export async function GetImage(imgId, thumbnail) { 
    const response = await DoGet(IMAGE_SERVER + 'Image/' + imgId + '?thumbnail=' + thumbnail);
    return response.blob();
}