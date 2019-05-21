const assert = require('assert');
const code = require('./index.js');

const rawData = {
    _id: 1,
    text_1: 'first',
    class_1: 'header',
    text_2: 'second',
    class_2: 'normal',
    text_3: 'third',
    class_3: 'bold',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
    styles: 'red.css'
}

const objectData = {
    _id: 1,
    styles: 'red.css',
    divs: [
        {
            text: 'first',
            classN: 'header'
        },
        {
            text: 'second',
            classN: 'normal'
        },
        {
            text: 'third',
            classN: 'bold'
        },
    ],
    image: {
        url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg'
    }
};
const personalHtml = `
<!DOCTYPE html>
     <html>
     <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>On Your Site</title>
        <link rel="stylesheet" href=red.css>
        </head>    
        <body><img src=https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg alt="Your image"><div class=header>first</div><div class=normal>second</div><div class=bold>third</div></body></html> 
`

describe('function generateData', () => {
    it('parses data', () => {
        assert.deepEqual(objectData, code.generateData(rawData));
    });
});

describe('function generatePersonalPage', () => {
    it('generates personal page html from data object', () => {
        assert.deepEqual(personalHtml, code.generatePersonalPage(objectData));
    });
});