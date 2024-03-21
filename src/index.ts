import express, { Request, Response } from 'express';
import cors from 'cors';
import { generateText, ollama, OllamaApiConfiguration } from "modelfusion";
import { } from "./ressources"
import QueryString from 'qs';
import bodyParser from 'body-parser';
const api = new OllamaApiConfiguration({});
const app = express();
const port = process.env.PORT || 3000;

// const text = await generateText({
//   model: ollama
//     .CompletionTextGenerator({
//       model: "tinyllama:latest", // mistral base model without instruct fine-tuning (no prompt template)
//       temperature: 0.7,
//       maxGenerationTokens: 120,
//     })
//     .withTextPrompt(), // use text prompt style

//   prompt: "Write a short story about a robot learning to love:\n\n",
// });
// console.log(text);

function createText(promptText: string, temperatureChoice: number, maxGenerationTokensChoice: number): Promise<string> {
  if (temperatureChoice === undefined) {
    temperatureChoice = 0.7;
    console.log("temperature isn't defined, using default value");
  }
  if (maxGenerationTokensChoice === undefined) {
    maxGenerationTokensChoice = 100;
    console.log("maxGenerationTokens isn't defined, using default value");
  }
  if (promptText === undefined) {
    promptText = "Write a short story about a robot learning to love:\n\n";
    console.log("prompt isn't defined, using default value");
  }
  const text = generateText({
    model: ollama
      .CompletionTextGenerator({
        model: "tinyllama:latest", // mistral base model without instruct fine-tuning (no prompt template)
        temperature: temperatureChoice,
        maxGenerationTokens: maxGenerationTokensChoice,
      })
      .withTextPrompt(), // use text prompt style
    prompt: promptText,
  });
  return text;
}
function add(a: number, b: number): number {
  return a + b
}
function sub(a: number, b: number): number {
  return a - b
}
function mul(a: number, b: number): number {
  return a * b
}
function divi(a: number, b: number): number {
  return a / b
}



app.use(bodyParser.json());
app.use(cors());
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/divi', (req: Request, res: Response) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = {
    result: divi(a, b)
  };
  res.send(`The div of ${a} and ${b} is ${divi(a, b)}`).json(result);
});
//http://localhost:3000/divi?a=8&b=7

app.get('/sub', (req: Request, res: Response) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = {
    result: sub(a, b)
  };
  res.send(`The dif of ${a} and ${b} is ${sub(a, b)}`).json(result);
});
//http://localhost:3000/sub?a=8&b=7

app.get('/mul', (req: Request, res: Response) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = {
    result: mul(a, b)
  };
  res.send(`The mul of ${a} and ${b} is ${mul(a, b)}`).json(result);
});
//http://localhost:3000/mul?a=5&b=7

app.get('/add', (req: Request, res: Response) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = {
    result: add(a, b)
  };
  res.send(`The sum of ${a} and ${b} is ${add(a, b)}`).json(result);
});
//to use it : 
//http://localhost:3000/add?a=5&b=7


app.post('/addPost', (req: Request, res: Response) => {
  console.log("addPost", req.body)
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    res.status(400).send('Please provide a valid number');
  }
  const result = {
    result: add(a, b)
  };
  res.status(200).json(result);
});

//to use it :
//http://localhost:3000/addPost
//with body :
// {
//   "a": 5,
//   "b": 7
// }

app.get('/generate', async (req: Request, res: Response) => {
  const prompt: string = req.query.prompt as string;
  if (typeof prompt !== 'string') {
    res.status(400).send('Please provide a valid prompt');
  }
  const temperatureChoice: number = Number(req.query.temperature);
  if (typeof temperatureChoice !== 'number') {
    res.status(400).send('Please provide a valid temperature');
  }
  const maxGenerationTokensChoice: number = Number(req.query.maxGenerationTokens);
  if (typeof maxGenerationTokensChoice !== 'number') {
    res.status(400).send('Please provide a valid maxGenerationTokens');
  }
  const text = await createText(prompt, temperatureChoice, maxGenerationTokensChoice);
  console.log(text);
  res.send(text);
});

//to use it :
//http://localhost:3000/generate?prompt=Write a short story about a robot learning to love:

app.post('/generatePost', async (req: Request, res: Response) => {
  console.log("generatePost", req.body)
  const prompt = req.body.prompt;
  const temperatureChoice = req.body.temperature;
  const maxGenerationTokensChoice = req.body.maxGenerationTokens;
  if (typeof prompt !== 'string' || typeof temperatureChoice !== 'number' || typeof maxGenerationTokensChoice !== 'number') {
    res.status(400).send('Please provide a valid prompt, temperature and maxGenerationTokens');
  }
  console.log("generate", prompt, temperatureChoice, maxGenerationTokensChoice);

  const text: string = await createText(prompt, temperatureChoice, maxGenerationTokensChoice);
  console.log(text);
  const result = {
    result: text
  };
  console.log(result);
  res.status(200).json(result)
});

//to use it :
//http://localhost:3000/generatePost
//with body :
// {
//   "prompt": "Write a short story about a robot learning to love:"
// }


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

