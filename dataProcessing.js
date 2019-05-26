function generatePersonalPage(data) {
  let output;
  try {
    output = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>On Your Site</title>
            <link rel="stylesheet" href=${data.styles}>
        </head>    
        <body>`;
    data.divs.forEach(e => {
      if (e.type === 'image') {
        if (e.url) {
          output += `<img src=${e.url} alt="Your image" class=${e.classN}>`;
        }
      } else if (e.type === 'text') {
        output += `<div class=${e.classN}>${e.text}</div>`;
      }
    });
    output += '</body></html>';
  } catch (err) {
    console.log(err);
  }
  return output;
}

function sortData(rawData) {
  //sort according to the number xxx_number
  //TO IMPLEMENT
  return rawData;
}

function generateData(rawData) {
  let data = {
    divs: []
  };

  // rawData = sortData(rawData);

  Object.keys(rawData).forEach(k => {
    if (k === '_id' || k === 'styles') {
      data[k] = rawData[k];
    } else if (/text/.test(k)) {
      data.divs.push({
        type: 'text',
        text: rawData[k],
        classN: rawData['class_' + k.match(/\d+/)[0]]
      });
    } else if (/image/.test(k)) {
      data.divs.push({
        type: 'image',
        url: rawData[k],
        classN: rawData['class_' + k.match(/\d+/)[0]]
      });
    }
  });
  return data;
}

module.exports = {
  generateData,
  generatePersonalPage,
  sortData
};
