const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Backend server is running');
});

const templateHtml = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

let executablePath;

(async () => {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const localRevisions = await browserFetcher.localRevisions();
    const revision = localRevisions[0]; // Pick the first downloaded revision
    const info = await browserFetcher.revisionInfo(revision);
    executablePath = info.executablePath;
    console.log("Chromium path set to:", executablePath);
})();

app.post('/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        const compiledTemplate = handlebars.compile(templateHtml);
        const html = compiledTemplate(data);

        const puppeteer = require('puppeteer');

        // const browser = await puppeteer.launch({
        //     headless: true,
        //     args: ['--no-sandbox', '--disable-setuid-sandbox']
        // });
        // const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/google-chrome' });
        const browser = await puppeteer.launch({
            headless: true,
            executablePath,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('Using executable path:', executablePath);
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=sale-deed.pdf',
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send(`PDF generation failed ${err}`);
    }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
