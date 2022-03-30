const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const drive = google.drive('v3');



const auth = new google.auth.GoogleAuth({
    credentials: {
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCl0/QuP7ngjOox\nzglGmgyCat4C41Vj/fdiapHyup1+fQtIsuECn4eWh39BF504UEJMbSjzp7DWFEmz\n59AMLC3/bTOzth++NlKmyH9ug8FOCBR4H2kah0SNi3YKTQGZz2YfipKrLDn/CGcl\nBKpEZieW6PpBE+ZpAlaeUgEjYtZWDoNu/nWXO3ZyqdwbwwfzJiBsL7btBKZMJuQP\nuCNFcHM+F0W4mS17tf2vLeEFp55e/OPBycP/1SItF/u8in5Ri4ViT8hDzq5O2Et5\n59s93PshqWnhmhyPyd9ByyUiDlARGgi849OZKz++U8jxyh3+QMSg71/4PD8aqLSA\nA1EaAvcLAgMBAAECggEABTW6hzVzVo220efCPNicKgDHhtmzlheljQ8CFNkuF4pA\nL4GHNjji3qTVJ6thQiKrYpFPZxBOqvsqMZ/H1ooQy+SXaj7/kk9Mm3bTIhq7mQMB\n+aArAi1bxwKpq7stoLJ2Z+lHoF8cV1nhO7WAz/NRrRkWu7KvW386T3EOHhl92GhB\nXvdThhu0o45dXAfcAbE5EQEnr73MlRDt5oWGL4qVQjPK3TjzafguIHc1C53TLmvd\nrix/AzIhwgB3ZoVZZEPIpYguVUCqVcJ5wp0Ye0D4BDHKBD9L9puzZUAh1zgM6FWC\nlRFkGpKk902WI9NyFh0Mpjtyc4nel0K6jm2nMqKLuQKBgQDUeeRLq7sBSVFQtrvj\nVGupl7TJ0NUh2IcIGWmnDhZ1q1ngFV9CDYv6OyUAqD+Jy47JfiB28xLGSIo3niK0\ndJAYkYzHeQxKXGUz7emsgp5SPcUzbHgvzge7HEUkiOK1ewleWYXuk1b65FYVzowX\n4KLp1axkUmp2nZRkd7Rgi6yNhwKBgQDHy9yO8q887kmimHlmUruc+MH1VDL1XK8I\nKxhQEfTPGYJ0jjyzPflDZ2+C45O/ATWkpB8FOWBkFQP0u/cniInruCpXBlCNq3q8\nZnZmY4jaOtLngIg5W3mH3feBnIp0Hqd9rleoGr+QFDvvYzNXm6wurubkZj7uRPc9\n3ETKeXtLXQKBgH4YHGjf8GnyBeTdnSFrHz2VP4Apg+LDKlefJTkzvhZ06zB13oNH\noNOOuAXs01BGUmW3iTKuTG0J7aTWHwhyyHUcI6zZZHbY4GJyBaQQHD74U4iSDb1p\nCuN7AnmNFuXWr5ejjz0niY35ZjEo07Dz6hrVaKpc0ru0BrWc6JoHKg8PAoGBAJnp\na9EbFu/DSSpedzbiCPFVmGUbJd5qNdP/Ds2v530a06piYFRcK4dHSVn1Yr3DesWI\nQPVPS/gNUGzZ1/22azkROFyt2qQoM3arIA6kIqqqogoAs/ArjaWi0qYgJ3BopPJm\nudQgNu4RCFLTgpu8qpmT1v6f3V7D9grLgprPlrFpAoGAASeNO9shFVhpGcJ8/HCu\nUdLOrng0+oEIkBn00/gkR41FZwnxaMIjrckkminNY7EHlpDQNyH3azLYblj3s5E2\nzb2Bj3SGEuS/gWoEu8BrBgSC6Y6rvysuEyv0RR6TbjJnCEkTEq6n/bSYPzXsrb0D\nFP0uRSshtCmUEJOP8nNBHgs=\n-----END PRIVATE KEY-----\n",
        client_email: process.env.client_email,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
});


const uploadFile = function (file, title, type, id_folder) {

    console.log('xxxxxxxxxxxxxxxxxxx');
    console.log(file);
  

    return new Promise((resolve) => {
        drive.files.create({

            requestBody: {
                name: title,
                mimeType: type,
                parents: [id_folder],
            },  
            media: {
                mimeType: type,
                body: fs.createReadStream(path.join(file))
            },
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                drive.permissions.create({
                    fileId: file.data.id,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    }
                });
                resolve(file.data.id);
            }
        })
    }
    )
}


const createFolderDrive = function (title) {
    return new Promise((resolve) => {

            drive.files.create({
                requestBody: {
                    name: title,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: ['1kLhEy931zfSKMzCwg9jvOqNidRYazH05']
                },
            }, function (err, file) {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    resolve(file.data.id)
                }
            });
       
    }
    )
}



const deleteFile = function (id) {
    return new Promise((resolve) => {
        drive.files.delete({
            fileId: id
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                resolve(file)
            }
        });
    }
    )
}




const updateTitleFile = function (id, newTitle) {
    return new Promise((resolve) => {
        drive.files.update({
            fileId: id,
            requestBody: {
                name: newTitle,
            }
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                resolve(file)
            }
        });
    }
    )
}


const generatePublicUrl = function (id) {
    return new Promise((resolve) => {
        drive.files.get({
            fileId: id,
            fields: 'webViewLink, webContentLink'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                resolve(file.data)
            }
        });
    }
    )
}


auth.getClient().then(
    (resp) => {
      
        google.options({ auth: resp });
    });


module.exports = {
    generatePublicUrl,
    createFolderDrive,
    deleteFile,
    uploadFile,
    updateTitleFile
}