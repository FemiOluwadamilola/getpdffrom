const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const puppeteer = require("puppeteer");
const htmlToImage = require("html-to-image");

router.get("/", (req, res) => {
  res.status(200).render("webToPdf", {
    title: "getPdf",
  });
});

router.get("/webToImage", (req, res) => {
  res.status(200).render("webToImage", {
    title: "webToImage",
  });
});

router.get("/htmlToPdf", (req, res) => {
  res.status(200).render("htmlToPdf", {
    title: "htmlToPdf",
  });
});

router.get("/htmlToImage", (req, res) => {
  res.status(200).render("htmlToImage", {
    title: "htmlToImage",
  });
});

// COVENT WEB PAGE TO PDF
router.post("/webToPdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.body.website, {
      waitUntil: "domcontentloaded",
    });
    const pageTitle = await page.evaluate(() => document.title);
    const fileName = pageTitle.split(" ").join("").slice(0, 5);
    const result = await page.pdf({
      path: `./convertedFile/${fileName}.pdf`,
      format: "A4",
    });
    fs.stat(`./convertedFile/${fileName}.pdf`, async (err) => {
      if (err) {
        return res.status(404).json({
          message: "file or directory does not exist",
        });
      } else {
        const filePath = `./convertedFile/${fileName}.pdf`;
        fs.readFile(filePath, (err, file) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Could not download file");
          }

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `inline; filename=${fileName}.pdf`
          );

          res.send(file);
        });
      }
      fs.unlinkSync(`./convertedFile/${fileName}.pdf`);
    });
    await browser.close();
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong! please try again later",
      error: err.message,
    });
  }
});

// GET SCREENSHOT OF WEB PAGE
router.post("/webToImage", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.body.website, {
      waitUntil: "domcontentloaded",
    });
    const pageTitle = await page.evaluate(() => document.title);
    const fileName = pageTitle.split(" ").join("").slice(0, 5);
    const result = await page.screenshot({
      path: `./convertedFile/${fileName}.png`,
      fullPage: true,
    });
    fs.stat(`./convertedFile/${fileName}.png`, async (err) => {
      if (err) {
        return res.status(404).json({
          message: "file or directory does not exist",
        });
      } else {
        const filePath = `./convertedFile/${fileName}.png`;
        fs.readFile(filePath, (err, file) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Could not download file");
          }

          res.setHeader("Content-Type", "application/png");
          res.setHeader(
            "Content-Disposition",
            `inline; filename=${fileName}.png`
          );

          res.send(file);
        });
      }
      fs.unlinkSync(`./convertedFile/${fileName}.png`);
    });
    await browser.close();
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong! please try again later",
      error: err,
    });
  }
});

// GET HTML OF WEB PAGE
router.post("/htmlToPdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.body.website);
    const pageTitle = await page.evaluate(() => document.title);
    const fileName = pageTitle.split(" ").join("").slice(0, 5);
    const html = await page.content();
    fs.writeFile(`./convertedFile/${fileName}.txt`, html, (err) => {
      if (err) return console.error(err);
      fs.stat(`./convertedFile/${fileName}.txt`, async (err) => {
        if (err) {
          return res.status(404).json({
            message: "file or directory does not exist",
          });
        } else {
          const filePath = `./convertedFile/${fileName}.txt`;
          fs.readFile(filePath, (err, file) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Could not download file");
            }

            res.setHeader("Content-Type", "application/txt");
            res.setHeader(
              "Content-Disposition",
              `inline; filename=${fileName}.txt`
            );

            res.send(file);
          });
        }
        fs.unlinkSync(`./convertedFile/${fileName}.txt`);
      });
    });
    await browser.close();
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong! please try again later",
      error: err,
    });
  }
});

router.post("/htmlToImage", async (req, res) => {
  try {
    const codeSnippet = req.body.code;
    // const htmlCodeSnippet = await htmlToImage.toPng(codeSnippet);

    // res.download(htmlCodeSnippet, 'code.png');
    // res.status(200).send(codeSnippet);

    console.log(codeSnippet);

    // Create a new canvas with the dimensions 100x100
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");

    // Draw a red rectangle
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 1280, 720);

    // Save the canvas to a file
    const out = fs.createWriteStream("./red-rectangle.png");
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("The PNG file was created."));
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong! please try again later",
      error: err.message,
    });
  }
});

module.exports = router;
