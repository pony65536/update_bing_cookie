const { chromium } = require("playwright");
const fs = require("fs");

let cookie = [];
fs.readFile("full_cookie.json", (err, data) => {
    if (err) throw err;
    cookie = JSON.parse(data);
    cookie.map((item) => {
        delete item.sameSite;
    });
});

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1788.0",
    });
    await context.addCookies(cookie);
    const page = await context.newPage();
    await page.goto(
        "https://www.bing.com/search?form=MY0291&OCID=MY0291&q=Bing+AI&showconv=1"
    );

    await page
        .context()
        .cookies()
        .then((res) => {
            const dataString = JSON.stringify(res);
            fs.writeFile("full_cookie.json", dataString, (err) => {
                if (err) throw err;
            });
            res.map((item) => {
                if (item.name == "_U") {
                    fs.writeFile("cookie.txt", item.value, (err) => {
                        if (err) throw err;
                    });
                }
            });
        });
    await context.close();
    await browser.close();
})();
