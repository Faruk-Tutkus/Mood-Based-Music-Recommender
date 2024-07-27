import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
const apiKey = process.env.GEMINI_API_KEY;
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const genAI = new GoogleGenerativeAI(apiKey);
const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  }
];
  
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: safetySetting
});
  
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function hanedler(req, res) {
  const { mood, language } = req.body
  let prompt = ``
  let rand = Math.floor(Math.random() * 7);
  let rand_words = Math.floor(Math.random() * 15) + 3;
  console.log(rand)
  if (rand === 0) {
    prompt = `Generate a random ${language} song lyric and advice related to the mood "${mood}". The sentence should be ${rand_words} words long and must not contain the word "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 1) {
      prompt = `Generate a random ${language} song lyric and advice related to the mood "${mood}". The sentence must not contain the word "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 2) {
      prompt = `Generate a random ${language} song name related to the mood "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 3) {
      prompt = `Generate a random ${language} feeling or mood-based sentence related to "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 4) {
      prompt = `Generate a random ${language} sentence related to the mood "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 5) {
      prompt = `Generate a random ${language} advice related to the mood "${mood}". The sentence must not contain the word "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  } else if (rand === 6) {
      prompt = `Generate a random ${language} pithy saying related to the mood "${mood}". The sentence must not contain the word "${mood}". Provide this in one sentence without explanation. Use randomization seed: ${Date.now()}.`;
  }

  const result = await model.generateContent(prompt, generationConfig);
  console.log(result.response.text());
  const response = result.response.text()
  res.json({ response, clientId, clientSecret })
}
