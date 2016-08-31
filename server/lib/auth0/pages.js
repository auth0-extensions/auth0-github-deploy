import config from '../../lib/config';
import Promise from 'bluebird';
export const updatePasswordResetPage = (progress, client, data) => {
    let payload = {};
    data.map(file => {
        if (file.name == 'password_reset.html') {
        payload['change_password'] = {
            "enabled": getIsEnabled(file,data),
            "html": file.contents
        };
    }
    });
    return getClient(progress, client).then((clientId) => {
            client.tenant.tenant.patch({client_id: clientId}, payload);
    });
};

export const updateLoginPage = (progress, client, data) => {
    let payload = {};
    data.map(file => {
        if (file.name == 'login.html') {
        payload['custom_login_page'] = file.contents;
        payload['custom_login_page_on'] = getIsEnabled(file,data);
    }
    });
    return getClient(progress, client).then((clientId) => {
            client.clients.update({client_id: clientId}, payload);
    });
};

/*
 * Get current client id.
 */
const getClient = (progress, client) => {
    if (progress.client_id) return Promise.resolve(progress.client_id);
    return Promise.all(client.clients.getAll())
            .then(clients => {
            clients.map(client=> {
            if (client.global == true) {
        progress.client_id = client.client_id;
    }
    });
    return progress.client_id;
    });
};

/**
 * get current html template is enabled
 * @param currentFile
 * @param files
 * @returns {boolean}
 */
const getIsEnabled = (currentFile, files ) => {
    let isEnabled = false;
    files.map(file=>{
        if(file.name==currentFile.meta){
        isEnabled = JSON.parse(file.contents).enabled
    }
    });
    return isEnabled;
};