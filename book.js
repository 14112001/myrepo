let flag = true;
const username = 'Phoolchand65';
const password = 'Ddep@k14112001';
const apiKey = 'REDACTED';

const train_no = "12860";
const coach = "SL";
const C = 0;
const end = "C SHIVAJI MAH T - CSMT (MUMBAI)";
const start = "GONDIA JN - G (GONDIA)";
const dateStr = "28/04/2026";

const passengers = [
  ['John Doe', '32', 'M', 'LB'],
  ['Jane Smith', '28', 'F', 'UB'],
  ['Arjun Singh', '45', 'M', 'SL']
];

async function get_res(img_src) {
    let b = {
        userid: 'deepakrajbhar655@gmail.com',
        apikey: 'QwqWtPA2fCWZtNwsETTV',
        data: img_src.split(',')[1]
    };
    try {
        let r = await fetch("https://api.apitruecaptcha.org/one/gettext", {
            method: 'POST',
            body: JSON.stringify(b)
        });
        let d = await r.json();
        return d.result;
    } catch (e) { return null; }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function chload(rep) {
  while (document.querySelector('.loading-bg')) {
    await sleep(rep);
  }
}

async function ld(element, inter) {
  while (element == null) {
     await sleep(inter);
  }
}

async function login() {
  document.querySelector('button.btn.btn-primary')?.click();
  await ld(document.querySelector('a.loginText'), 500);
  document.querySelector('a.loginText').click();
  
  await chload(300);
  
  const uin = document.querySelector('[formcontrolname="userid"]');
  await ld(uin, 300);
  const pin = document.querySelector('[formcontrolname="password"]');
  
  uin.value = username;
  uin.dispatchEvent(new Event('input', { bubbles: true }));
  
  pin.value = password;
  pin.dispatchEvent(new Event('input', { bubbles: true }));
  
  document.querySelector('button.search_btn.train_Search.train_Search_custom_hover').click();
  
  await tenter();
  
}

async function tenter() {
  await chload(500);
  const sin = document.querySelector('p-autocomplete[formcontrolname="origin"] input');
  await ld(sin, 400);
  const din = document.querySelector('p-autocomplete[formcontrolname="destination"] input');
  const dtin = document.querySelector('p-calendar[formcontrolname="journeyDate"] input');

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
    switch (C) {
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

  document.querySelector('button.search_btn.train_Search').click();
  
  await tselect();
}

async function tselect() {
  await chload(500);
  while (document.getElementById(`T_${train_no}`) == null) await sleep(400);

  const ttrain = document.getElementById(`T_${train_no}`).closest('app-train-avl-enq');
  const coachBtn = Array.from(ttrain.querySelectorAll('strong'))
    .find(el => el.innerText && el.innerText.includes(`${coach}`));
  
  if (coachBtn) coachBtn.click();

  await chload(100);

  const btn = document.querySelector('.train_Search');
  while (true) {
    if (coachBtn) coachBtn.click();
    await chload(200);

    const avlDiv = ttrain.querySelectorAll('div.pre-avl')[0];
    if (avlDiv) avlDiv.click();

    if (btn && !btn.classList.contains('disable-book')) {
      btn.click();
      break;
    }
  }
  await penter();
}


async function penter() {
   await chload(500);
   await ld(document.querySelector('p-radiobutton[id="2"] .ui-radiobutton-box'), 400);
  for (let i = 0; i < passengers.length; i++) {
    let rows = document.querySelectorAll('app-passenger');

    if (!rows[i]) {
      document.querySelector('span.prenext').parentElement.click();
      await new Promise(r => setTimeout(r, 600));
      rows = document.querySelectorAll('app-passenger');
    }

    const row = rows[i];
    const p = passengers[i];

    const name = row.querySelector('p-autocomplete[formcontrolname="passengerName"] input');
    name.value = p[0];
    name.dispatchEvent(new Event('input', { bubbles: true }));

    const age = row.querySelector('input[formcontrolname="passengerAge"]');
    age.value = p[1];
    age.dispatchEvent(new Event('input', { bubbles: true }));

    const gen = row.querySelector('select[formcontrolname="passengerGender"]');
    gen.value = p[2];
    gen.dispatchEvent(new Event('change', { bubbles: true }));

    const nat = row.querySelector('select[formcontrolname="passengerNationality"]');
    nat.value = 'IN';
    nat.dispatchEvent(new Event('change', { bubbles: true }));

    const berth = row.querySelector('select[formcontrolname="passengerBerthChoice"]');
    if (berth) {
      berth.value = p[3] || "";
      berth.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await new Promise(r => setTimeout(r, 300));
  }
  
  ['#autoUpgradation', '#confirmberths'].forEach(id => {
    const cb = document.querySelector(id);
    if (cb && !cb.checked) {
      cb.click();
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  document.querySelector('p-radiobutton[id="2"] .ui-radiobutton-box').click();
  
  document.querySelector('button.train_Search.btnDefault').click();
  await solve_cap();
}

async function solve_cap() {
    await chload(500);
    let c = 5;
    let ok = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let img = document.querySelector('.captcha-img');
    await ld (img, 300);
    let box = document.querySelector('#captcha');
    let err = document.querySelector('.ui-toast-detail');

    while (c > 0) {
        let res = await get_res(img.src);
        if (!res) { c--; continue; }

        let clean = "";
        res = res.trim().replace(/\s/g, "").replace(")", "J").replace("]", "J");
        for (let char of res) {
            if (ok.includes(char)) clean += char;
        }

        box.value = clean;
        box.dispatchEvent(new Event('input', { bubbles: true }));
        box.dispatchEvent(new Event('change', { bubbles: true }));

        if (err && err.innerText.includes("Invalid")) {
            continue;
            c--;
        } else {
            document.querySelector('button.train_Search.btnDefault').click();
            break;
        }
    }
    await payment();
}

async function payment() {
    await chload(500);
     await ld(document.querySelector('button.btn-primary.hidden-xs'), 400);
	Array.from(document.querySelectorAll('.bank-type')).find(el => el.textContent.includes('BHIM/ UPI/ USSD')).click();
	Array.from(document.querySelectorAll('span.col-pad')).find(el => el.textContent.includes('PAYTM')).click();
	document.querySelector('button.btn-primary.hidden-xs').click();
}

await login();
