require("dotenv").config();

const puppeteer = require('puppeteer');
const path = require('path');
const {readFile, writeFile, unlink} = require('fs').promises;

const templatePath =  path.join(__dirname+'/certificates/template')
const destinePath =  path.join(__dirname+'/certificates/example.png')

function genCertificate(
    userName,
    courseTitle,
    date
){
    readFile(templatePath+'.html', 'UTF-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }else{
        const temPath = templatePath+date+'.html'
        let result = contents.replace(/{{userName}}/g, userName);
        result = result.replace(/{{courseTitle}}/g, courseTitle);
        result = result.replace(/{{date}}/g, date);
        writeFile(temPath, result,(err)=>{
            if(err)
            console.log(err);
            else {
                htmlToImage(temPath).then(()=>{
                    unlink(temPath).then(()=>{
                        console.log(temPath+ ' Borrado');
                    })
                });
            }
        });
    }});
};

async function htmlToImage(path){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 875,
    height: 675,
    deviceScaleFactor: 1
  });
  /* await page.setContent(html,{
    waitUntil: 'networkidle2',
  }); */
  /* const content = await page.$("body");
  const imageBuffer = await content.screenshot({ omitBackground: false });
  writeFile(destinePath, imageBuffer, function(err) {
    if (err) throw err;
    }); */
  await page.goto('file:///' + path);
  await page.screenshot({path: destinePath});
  await browser.close();
};

const fecha = new Date(); 
let fechaesp = fecha.getDate() + "-" + (fecha.getMonth() +1) + "-" + fecha.getFullYear();

genCertificate('Juan Perez', 'Programación en JAVA', fechaesp);

/* (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(templatePath);
  
    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
  
    console.log('Dimensions:', dimensions);
  
    await browser.close();
  })(); */

/*   (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(templatePath, {
      waitUntil: 'networkidle2',
    });
    await page.pdf({path: destinePath, format: 'tabloid'});
  
    await browser.close();
  })(); */

module.exports={
    genCertificate
}