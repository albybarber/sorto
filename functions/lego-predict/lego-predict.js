const axios = require('axios')


const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  let blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


exports.handler = async (event, context) => {

    let base64Img = event.body;
    let json = JSON.parse(base64Img);
    let ImageURL = json.image;

    // Split the base64 string in data and contentType
    let block = ImageURL.split(";");
    // Get the content type
    let contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    let realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

    // Convert to blob
    let blob = b64toBlob(realData, contentType);

    // Create a FormData and append the file
    let fd = new FormData();
    fd.append("query_image", blob);

    return axios.post('https://api.brickognize.com/predict/', fd, {
      headers: {
          'Accept-Encoding':'gzip, deflate, br',
          'Accept':'*/*',
          'Connection':'keep-alive',
          'Accept':'application/json',
          'Content-Type':'multipart/form-data'
      }
    })
    .then(function (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                items: response.data.items,
                message: 'we found it',
                event: event,
            })
          }
    })
    .catch(function (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({
              message: error.response.statusText,
              event: event,
            })
          }
    });

}