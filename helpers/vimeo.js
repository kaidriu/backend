let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.client_id, process.env.client_secret, process.env.access_token);



const createFolder = function create(name) {
    return new Promise((resolve) => {
        setTimeout(() => {

            client.request({
                method: 'POST',
                path: '/me/projects',
                query: {
                    'name': name
                }
            }, function (error, body, status_code, headers, location) {
                resolve(headers.location)
            })



        }, 1000);
    })
        ;

}

const deleteFolder = function create(path,deleteclips) {
    return new Promise((resolve) => {
        setTimeout(() => {

            client.request({
                method: 'DELETE',
                path: path+'?should_delete_clips=true',              
            }, function (error, body, status_code, headers, location) {
                resolve('borrado')
            })
        }, 1000);
    })
        ;

}

const createVideo = function vimeo(file_name, title, description, uri_folder) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let link_video_topic;
            client.upload(
                file_name,
                {
                    'name': title,
                    'description': description
                },
                function (uri) {
                    client.request(uri + '?fields=link', function (error, body, _statusCode, _headers) {
                        if (error) {
                            console.log('There was an error making the request.');
                            console.log('Server reported: ' + error);
                            return;
                        }
                        // console.log('Your video link is: ' + body.link);
                        link_video_topic = body.link;
                    });
                    console.log('Your video URI is: ' + uri);
                    client.request({
                        method: 'PUT',
                        path: uri_folder + uri,
                    }, function (error, body, status_code, headers) {
                        resolve({link_video_topic,uri});
                    })
                },
                function (bytes_uploaded, bytes_total) {
                    var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
                    console.log(bytes_uploaded, bytes_total, percentage + '%');
                },
                function (error) {
                    console.log('Failed because: ' + error);
                }

            );
        }, 1000);
    });
}

const modifyFolder = function create(path,name) {
    return new Promise((resolve) => {
        setTimeout(() => {

            client.request({
                method: 'PATCH',
                path: path,
                query: {
                    'name': name,
                }
            }, function (error, body, status_code, headers, location) {
                resolve('ha sido cambiado')
            })
        }, 1000);
    })
        ;

}



const deleteVideo = function create(path) {
    return new Promise((resolve) => {
        setTimeout(() => {

            client.request({
                method: 'DELETE',
                path: path,
            }, function (error, body, status_code, headers, location) {
                resolve('borrado')
            })
        }, 1000);
    })
        ;

}








module.exports={
    createFolder,
    deleteFolder,
    createVideo,
    modifyFolder,
    deleteVideo
}