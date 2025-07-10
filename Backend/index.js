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

app.post('/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        const compiledTemplate = handlebars.compile(templateHtml);
        const html = compiledTemplate(data);

        const browser = await puppeteer.launch();
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
