const axios = require('axios')

// const API_ENDPOINT = 'https://cat-fact.herokuapp.com/facts'


const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


exports.handler = async (event, context) => {

    let base64Img = event.body;
    let json = JSON.parse(base64Img);
    let ImageURL = json.image;

    // Split the base64 string in data and contentType
    var block = ImageURL.split(";");
    // Get the content type
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

    // Convert to blob
    var blob = b64toBlob(realData, contentType);

    // Create a FormData and append the file
    var fd = new FormData();
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
        // console.log(error);
        // return error.response.statusText;

        return {
            statusCode: 200,
            body: JSON.stringify({
              message: error.response.statusText,
              event: event,
            })
          }
    });

}