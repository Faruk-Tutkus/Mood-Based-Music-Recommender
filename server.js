const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const dotenv = require('dotenv');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
dotenv.config()
const apiKey = process.env.GEMINI_API_KEY;
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
app.use(cors())
app.use(bodyParser.json())
app.post('/server', async (req, res) => {
    const { mood, language } = req.body
    let prompt = ``
    let rand = Math.floor(Math.random() * 5);
    console.log(rand)
    if (rand == 0)
        prompt = `give me random in ${language} song lyrics and advices related to "${mood}". It is in only one sentence without explanation and the sentence must not contain any word from "${mood}". Randomize by seed, Seed = (${Date.now()})`
    else if (rand == 1)
        prompt = `give me random in ${language} song lyrics and advices related to "${mood}". It is in only one sentence without explanation. Randomize by seed, Seed = (${Date.now()})`
    else if (rand == 2)
        prompt = `give me random in ${language} song related to "${mood}". It is in only one sentence without explanation. Randomize by seed, Seed = (${Date.now()})`
    else if (rand == 3)
        prompt = `give me random in ${language} singer related to "${mood}". It is in only one sentence without explanation. Randomize by seed, Seed = (${Date.now()})`
    else if (rand == 4)
        prompt = `give me random in ${language} sentence related to "${mood}". It is in only one sentence without explanation. Randomize by seed, Seed = (${Date.now()})`

    const result = await model.generateContent(prompt, generationConfig);
    console.log(result.response.text());
    const response = result.response.text()
    res.json({ response })
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})