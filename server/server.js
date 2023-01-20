import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';


dotenv.config();

// console.log(process.env.OPENAI_API_KEY)
// Configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
 

const openai = new OpenAIApi(configuration);

// Initialize express application

const app = express();

// Setting up middlewares
app.use(cors());

// Allow us pass Json from the frontend to the back end
app.use(express.json());


// Creating a dummy root route

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Welcome to CodeGPT'
    })
})


// Helps us to have a body like a payload
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        // Sen a response to the front end once recieved.
        res.status(200).send({
            bot: response.data.choices[0].text 
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})


// Ensure that server is always listening for new request.

app.listen(5000, () => console.log('Server started at port http://localhost:5000'));