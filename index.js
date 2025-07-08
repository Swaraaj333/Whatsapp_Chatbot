const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const token = "EAAZAZAbs3fsmUBPBq6ZAGoP9dyjekKcqK7KSKj586nSFGV0LnTZAQXNFR8Esn8mifAmFGgdQfiRsl9wmFMlCwaNKdoW671u7Bfb9RXQImNjFCxZCBd6DlGndZCPEKqGM90HuIHX9YMPjwA9VFbEFbDUO3BGG9HgBLlgdy0B5uZCckynMKLZBdZBYZA16erIFkrnsd4R3GmTZASDDy4RmZBzXCiDK0OpDAY4ZCBngtAkgiahJqM4YZD"; // replace with your token
const phone_number_id = "688213491048893"; // replace with your phone number ID
const VERIFY_TOKEN = "snsverify";

const recordFile = path.join(__dirname, "record.json");
let userStates = {};

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (mode === "subscribe" && verify_token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Save data to record.json
function saveResponse(phone, data) {
  let records = [];
  try {
    records = JSON.parse(fs.readFileSync(recordFile));
  } catch {
    records = [];
  }
  records.push({ phone, ...data, timestamp: new Date().toISOString() });
  fs.writeFileSync(recordFile, JSON.stringify(records, null, 2));
}

// Send reply using WhatsApp API
async function sendReply(to, message) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// Webhook for messages
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!entry || !entry.text || !entry.from) return res.sendStatus(200);

  const msg = entry.text.body.trim().toLowerCase();
  const from = entry.from;

  if (!userStates[from]) {
    if (msg === "hi" || msg === "hello") {
      userStates[from] = { step: "initial", data: {} };
      await sendReply(from, `Hey. Are you interested in:\n1. Volunteer\n2. Donate\n3. Help Seeking`);
    } else {
      await sendReply(from, `Please type "hi" to begin.`);
    }
    return res.sendStatus(200);
  }

  const state = userStates[from];

  // Main menu
  if (state.step === "initial") {
    if (msg === "1") {
      state.step = "age";
      state.data.type = "volunteer";
      return sendReply(from, `What is your age group?\n1. Under 18\n2. 18-25\n3. 25+`).then(() => res.sendStatus(200));
    } else if (msg === "2") {
      state.step = "donate_type";
      state.data.type = "donate";
      return sendReply(from, `Thank you for your help!\n1. One-time donation\n2. Donate goods\n3. Monthly support`).then(() => res.sendStatus(200));
    } else if (msg === "3") {
      state.step = "help_type";
      state.data.type = "helpseeker";
      return sendReply(from, `What support do you need?\n1. Child Study\n2. Women Empowerment\n3. Food`).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  // Volunteer Flow
  if (state.step === "age") {
    const ageMap = { "1": "Under 18", "2": "18-25", "3": "25+" };
    if (ageMap[msg]) {
      state.data.age = ageMap[msg];
      state.step = "interest";
      return sendReply(from, `What are you interested in?\n1. Teach Children\n2. Social Media\n3. Volunteer Management`).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  if (state.step === "interest") {
    const interestMap = { "1": "Teach Children", "2": "Social Media", "3": "Volunteer Management" };
    if (interestMap[msg]) {
      state.data.interest = interestMap[msg];
      state.step = "location";
      return sendReply(from, `Where are you located?\n1. South Delhi\n2. Dwarka\n3. Noida`).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  if (state.step === "location") {
    const locMap = { "1": "South Delhi", "2": "Dwarka", "3": "Noida" };
    if (locMap[msg]) {
      state.data.location = locMap[msg];
      saveResponse(from, state.data);
      delete userStates[from];
      return sendReply(from, `Thanks for your interest!\nPlease fill this form: https://example.com/form\nWe'll connect with you soon.`).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  // Donate Flow
  if (state.step === "donate_type") {
    const donateMap = {
      "1": "One-time donation",
      "2": "Donate goods",
      "3": "Monthly support"
    };
    if (donateMap[msg]) {
      state.data.donateType = donateMap[msg];
      state.step = "donate_payment";
      return sendReply(from, `Choose payment method:\n1. UPI\n2. Net Banking\n3. Pay on Website`).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  if (state.step === "donate_payment") {
    const payMap = { "1": "UPI", "2": "Net Banking", "3": "Website" };
    if (payMap[msg]) {
      state.data.payment = payMap[msg];
      saveResponse(from, state.data);
      delete userStates[from];
      const reply = msg === "1"
        ? `You can pay via UPI: xyz@upiid.com or request a QR code.\nOnce done, reply "done". Thank you!`
        : `Please visit https://example.com/donate to complete your donation.\nThank you for your support!`;
      return sendReply(from, reply).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  // Help Seeker Flow
  if (state.step === "help_type") {
    const helpMap = { "1": "Child Study", "2": "Women Empowerment", "3": "Food" };
    if (helpMap[msg]) {
      state.data.support = helpMap[msg];
      saveResponse(from, state.data);
      delete userStates[from];
      return sendReply(from,
        `You can:\n1. Fill this form: https://example.com/help-form\n2. Call us at +91-88123xxxxx for immediate help.\n\nThank you for seeking help. You are not alone — NGO Foundation is with you. ✅`
      ).then(() => res.sendStatus(200));
    } else {
      return sendReply(from, `Please choose 1, 2, or 3.`).then(() => res.sendStatus(200));
    }
  }

  // Fallback
  await sendReply(from, `Sorry, I didn’t understand. Type "hi" to begin again.`);
  return res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
