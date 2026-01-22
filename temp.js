let flag = true;
const username = 'Phoolchand65';
const password = 'Ddep@k261102';
const apiKey = 'AIzaSyDTRVgYemnWbBXzkzgb7VZmqOmLczp0IFE';

const train_no = "11061";
const coach = "3A";
const C = 0;
//const start = "VARANASI JN - BSB (BANARAS)";
const end = "JAYNAGAR - JYG ";
const start = "LOKMANYATILAK T - LTT (MUMBAI)";
//const end = "C SHIVAJI MAH T - CSTM ";
const dateStr = "27/02/2026";

const passengers = [{
    name: "Omprakash Pal",
    age: "54",
    genderIndex: 1,
    preferenceIndex: 1
}];

const log = [7, 59, 20, 0];
const ct = [7, 59, 59, 0];

function ptime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    toast(timeString);
}

function quotaTranslator(e) {
    return "GN" === e ? "GENERAL" : 
           "TQ" === e ? "TATKAL" : 
           "PT" === e ? "PREMIUM TATKAL" : 
           "LD" === e ? "LADIES" : 
           "SR" === e ? "LOWER BERTH/SR.CITIZEN" : e;
}

function toast(message, duration = 4000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:12px 20px;border-radius:4px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = 1, 10);
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gettext(xpath) {
    return getelem(xpath)?.textContent.trim() || '';
}

function hcnt() {
    const header = getelem('/html/body/app-root/app-home/div[1]/app-header[1]');
    return header ? header.querySelectorAll('div').length : 0;
}

async function chload(rep) {
    while (hcnt() > 22) {
        await sleep(rep);
    }
}

function clickButton(xpath) {
    const element = getelem(xpath);
    element?.click();
}

function setValueByXPath(xpath, value, eventType = "input") {
    const element = getelem(xpath);
    if (element) {
        if (element.tagName.toLowerCase() === 'input') {
            element.value = value;
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        } else if (element.tagName.toLowerCase() === 'select') {
            element.selectedIndex = value;
            element.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
}

function checkCheckboxById(id) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
}

function getelem(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function MS(T) {
    return (new Date()).setHours(T[0], T[1], T[2], T[3]) - (new Date());
}

async function hold(xpath, rep) {
    while (getelem(xpath) == null) {
        await sleep(rep);
    }
}

async function solveCaptcha(ixpath, txpath, bxpath) {
    while (true) {
        await hold(ixpath, 200);
        //ptime();

        const captchaImgElement = document.querySelector(".captcha-img");
        if (!captchaImgElement) {
            alert("Captcha image element not found");
            continue;
        }

        const base64String = captchaImgElement.src;
        if (!base64String || !base64String.includes(",")) {
            alert("Invalid image src format for CAPTCHA.");
            continue;
        }

        const base64Data = base64String.split(",")[1];

        const requestBody = {
            requests: [{
                image: {
                    content: base64Data
                },
                features: [{
                    type: "TEXT_DETECTION"
                }],
                imageContext: {
                    languageHints: ["en"]
                }
            }]
        };

        try {
            const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!data.responses || !data.responses[0].textAnnotations || !data.responses[0].textAnnotations[0]) {
                document.querySelector(".glyphicon.glyphicon-repeat")?.parentElement?.click();
                await sleep(200);
                continue;
            }

            let captchaText = data.responses[0].textAnnotations[0].description;
            const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@";
            let cleanedText = "";
            captchaText = captchaText.trim().replace(/\s/g, "").replace(")", "J").replace("]", "J");

            for (const char of captchaText) {
                if (allowedChars.includes(char)) {
                    cleanedText += char;
                }
            }

            if (!cleanedText) {
                document.querySelector(".glyphicon.glyphicon-repeat")?.parentElement?.click();
                await sleep(200);
                continue;
            }
            
            await hold(txpath, 100);
            const captchaInput = getelem(txpath);
            if (!captchaInput) {
                alert("CAPTCHA input box not found.");
                return;
            }

            captchaInput.value = cleanedText;
            captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
            captchaInput.dispatchEvent(new Event("change", { bubbles: true }));
            
            await hold(txpath, 100);
            clickButton(bxpath);
            await chload(300);
            await sleep(200);
            if (getelem(txpath) == null)
                break;
            const errorElements = document.querySelectorAll('app-login, p-toast, [class*="error"], [class*="invalid"]');
            let hasCaptchaError = false;

            for (const element of errorElements) {
                if (element.textContent && element.textContent.toLowerCase().includes("captcha")) {
                    hasCaptchaError = true;
                    break;
                }
            }

            if (hasCaptchaError) {
                toast("CAPTCHA error detected, refreshing and retrying...");
                document.querySelector(".glyphicon.glyphicon-repeat")?.parentElement?.click();
                await sleep(200);
            }
        } catch (error) {
            alert("CAPTCHA API error: " + error);
            document.querySelector(".glyphicon.glyphicon-repeat")?.parentElement?.click();
            await sleep(200);
        }
    }
}

async function login() {
    await sleep(Math.max(1, MS(log)));
    clickButton('/html/body/app-root/app-home/div[1]/app-header/div[2]/div[2]/div[1]/a[1]');

    const utxp = '//*[@id="login_header_disable"]/div/div/div[2]/div[2]/div/div[2]/div/div[2]/form/div[2]';
    const ptxp = '//*[@id="login_header_disable"]/div/div/div[2]/div[2]/div/div[2]/div/div[2]/form/div[3]';

    await hold(utxp, 200);
    await hold(ptxp, 100);

    try {
        const uinput = getelem(utxp).querySelector('input');
        const pinput = getelem(ptxp).querySelector('input');

        uinput.value = username;
        uinput.dispatchEvent(new Event('input', { bubbles: true }));

        pinput.value = password;
        pinput.dispatchEvent(new Event('input', { bubbles: true }));

        await solveCaptcha(
            '//*[@id="login_header_disable"]/div/div/div[2]/div[2]/div/div[2]/div/div[2]/form/div[5]/div/app-captcha/div/div/div[2]/span[1]/img',
            '//*[@id="captcha"]',
            '//*[@id="login_header_disable"]/div/div/div[2]/div[2]/div/div[2]/div/div[2]/form/span/button');

        await tenter();
    } catch (error) {
        alert("Error during login: " + error);
        return;
    }
}

async function tenter() {
    const txp = '//*[@id="divMain"]/div/app-main-page/div/div/div[1]/div[2]/div[1]/app-jp-input/div/form/div[5]/div[1]/button';
    await hold(txp, 400);

    try {
        const sin = getelem('//*[@id="origin"]/span/input');
        const din = getelem('//*[@id="destination"]/span/input');
        const dtin = getelem('//*[@id="jDate"]/span/input');

        sin.value = start;
        sin.dispatchEvent(new Event("keydown"));
        sin.dispatchEvent(new Event("input"));

        din.value = end;
        din.dispatchEvent(new Event("keydown"));
        din.dispatchEvent(new Event("input"));

        dtin.value = dateStr;
        dtin.dispatchEvent(new Event("keydown"));
        dtin.dispatchEvent(new Event("input"));

        const quotaDropdown = document.querySelector("#journeyQuota");
        if (quotaDropdown) {
            let quotaText;
            switch(C) {
                case 0: quotaText = "GENERAL"; break;
                case 1: quotaText = "TATKAL"; break;
                case 2: quotaText = "PREMIUM TATKAL"; break;
                case 3: quotaText = "LADIES"; break;
                case 4: quotaText = "LOWER BERTH/SR.CITIZEN"; break;
                default: quotaText = "GENERAL";
            }
            
            const dropdownButton = quotaDropdown.querySelector("div > div[role='button']");
            if (dropdownButton) {
                dropdownButton.click();
                await sleep(300);
                
                const quotaOptions = quotaDropdown.querySelectorAll("ul li");
                for (let option of quotaOptions) {
                    if (option.innerText.trim() === quotaText) {
                        option.click();
                        break;
                    }
                }
                await sleep(300);
            }
        }

        const submitButton = document.querySelector("button.search_btn.train_Search[type='submit']");
        if (submitButton) {
            await sleep(300);
            submitButton.click();
        } else {
            clickButton(txp);
        }

    } catch (error) {
        alert("Error in tenter: " + error);
        return;
    }
    await tselect();
}

async function tselect() {
    const txp = '//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[3]/div[1]/app-train-avl-enq/div[1]/div[1]/div[1]/strong';
    await hold(txp, 400);

    const trainCountResult = document.evaluate('count(//*[@id="divMain"]/div/app-train-list/div[4]/div/div[5]/div)', document, null, XPathResult.NUMBER_TYPE, null);
    const R = trainCountResult.numberValue;

    let r = '';
    let c = '';

    for (let i = 3; i <= R; i++) {
        let trainText = gettext(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${i}]/div[1]/app-train-avl-enq/div[1]/div[1]/div[1]/strong`);
        if (trainText.includes(train_no)) {
            r = i;
            break;
        }
    }

    if (!r) {
        alert("Train not found");
        return;
    }

    clickButton(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[5]/div[1]/table/tr/td[1]/div`);
    await chload(200);

    const coachElements = getelem(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[7]/div[1]/p-tabmenu/div/ul`)?.getElementsByTagName('li') || [];
    const coachCount = coachElements.length;

    for (let i = 1; i <= coachCount; i++) {
        let coachText = gettext(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[7]/div[1]/p-tabmenu/div/ul/li[${i}]/a/div/div/strong/span[1]`);
        if (coachText.includes(coach)) {
            c = i;
            break;
        }
    }

    if (!c) {
        alert("Coach not found");
        return;
    }

    clickButton(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[7]/div[1]/p-tabmenu/div/ul/li[${c}]/a/div/div/strong/span[1]`);
    await chload(100);
    await sleep(Math.max(1, MS(ct)));
    
    while (true) {
        //toast("Clicking Couch");
        clickButton(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[7]/div[1]/p-tabmenu/div/ul/li[${c}]/a/div/div/strong/span[1]`);
        await chload(100);
        //toast("Clicking Mid");
        clickButton(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[1]/div[7]/div[1]/div[3]/table/tr/td[2]/div`);

        const bookButton = getelem(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[2]/div/span/span[1]/button`);
        if (bookButton && window.getComputedStyle(bookButton).backgroundColor === "rgb(251, 121, 43)") {
            break;
        }
    }
    //toast("Clicking submit");
    await sleep(100);
    //ptime();
    clickButton(`//*[@id="divMain"]/div/app-train-list/div[4]/div[3]/div[5]/div[${r}]/div[1]/app-train-avl-enq/div[2]/div/span/span[1]/button`);
    //ptime();
    if (getelem('//*[@id="divMain"]/div/app-train-list/p-confirmdialog[2]/div/div/div[3]/button[1]/span[2]')) {
    	clickButton('//*[@id="divMain"]/div/app-train-list/p-confirmdialog[2]/div/div/div[3]/button[1]/span[2]');
    }
    await penter();
}

async function penter() {
    const txp = '//*[@id="psgn-form"]/form/div/div[1]/p-sidebar/div/div/div[2]/button';
    await hold(txp, 400);

    const elements = document.querySelectorAll('[id^="ui-panel-"]');
    const panelId = elements[6]?.getAttribute("id") || "";
    let X = "";

    for (let i = 9; i < panelId.length; i++) {
        if (isNaN(panelId[i]))
            break;
        X += panelId[i];
    }

    const N = parseInt(X, 10) || 0;

    for (let index = 0; index < passengers.length; index++) {
        const passenger = passengers[index];
        const baseXPath = `//*[@id="ui-panel-${N}-content"]/div/div[${index + 1}]/div[2]/div/app-passenger/div/div[1]`;

        setValueByXPath(`${baseXPath}/span/div[1]/p-autocomplete/span/input`,
            passenger.name.length > 16 ? passenger.name.slice(0, 16) : passenger.name);
        setValueByXPath(`${baseXPath}/span/div[2]/input`, passenger.age);
        setValueByXPath(`${baseXPath}/span/div[3]/select`, passenger.genderIndex);
        setValueByXPath(`${baseXPath}/div[1]/select`, passenger.preferenceIndex);

        if (index + 1 < passengers.length) {
            clickButton(`//*[@id="ui-panel-${N}-content"]/div/div[${index + 2}]/div[1]/a/span[2]`);
        }
    }

    checkCheckboxById("confirmberths");
    clickButton('//*[@id="2"]/div/div[2]');
    clickButton('//*[@id="psgn-form"]/form/div/div[1]/p-sidebar/div/div/div[2]/button');

    await capt();
}

async function capt() {
    await sleep(34000);
    const txpath = '//*[@id="captcha"]';
    const ixpath = '//*[@id="review"]/div[1]/form/div[1]/div/div/app-captcha/div/div/div[2]/span[1]/img';
    const bxpath = '//*[@id="review"]/div[1]/form/div[3]/div/button[2]';
    await solveCaptcha(ixpath, txpath, bxpath);
    await payment();
}

async function payment() {
    await hold('//*[@id="pay-type"]/span', 200);
    const T = document.evaluate('count(//*[@id="pay-type"]/span/div)', document, null, XPathResult.NUMBER_TYPE, null).numberValue;
    for (let i = 1; i <= T; i++) {
        if (gettext(`//*[@id="pay-type"]/span/div[${i}]/span`).toLowerCase().includes('bhim')) {
            clickButton(`//*[@id="pay-type"]/span/div[${i}]/span`);
            break;
        }
    }
    chload(100);
    const C = document.evaluate('count(//*[@id="bank-type"]/div/table/tr/span)', document, null, XPathResult.NUMBER_TYPE, null).numberValue;

    for (let i = 1; i <= C; i++) {
        if (gettext(`//*[@id="bank-type"]/div/table/tr/span[${i}]/td/div/div/span`).toLowerCase().includes('paytm')) {
            clickButton(`//*[@id="bank-type"]/div/table/tr/span[${i}]/td/div/div/span`);
            break;
        }
    }

    chload(100);
    clickButton('//*[@id="psgn-form"]/div[1]/div[1]/app-payment/div[2]/button[2]');
}

async function bot() {
    try {
        await login();
    } catch (error) {
        alert("Bot execution failed: " + error);
    }
}

bot();