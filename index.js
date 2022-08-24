require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./file_cv"));

app.get("/export-cv/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const fileName = `cv${new Date().toString().replace(/ /g, "_")}.pdf`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${process.env.FE_END_POINT}generated/${hash}`);
    await page.pdf({
      path: `./file_cv/${fileName}`,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.close();
    res.status(200).json({ url: `${process.env.BE_END_POINT}${fileName}` });
  } catch (err) {
    res.status(500).json({ message: "somthing went wrong!", err: err. });
  }
});

app.listen(port, () =>
  console.log(`server run with ${process.env.BE_END_POINT}`)
);
