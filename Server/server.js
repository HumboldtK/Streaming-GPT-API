import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from 'axios';
import { Writable } from 'stream';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '100mb' })); 
dotenv.config();

const API_URL = "https://api.openai.com/v1/chat/completions";

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  let messageHistory = [
    {
      'role': 'system',
      'content': 'You are a chatbot. Stay focused on what I ask.'
    },
    {
      'role': 'user',
      'content': userMessage
    }
  ];

  console.log(`[Incoming request: ${userMessage}`);

  let answerBuffer = [];

  const streamRes = new Writable({
    write(chunk, encoding, callback) {
      res.write(chunk);

      const lines = chunk.toString().split('\n');
      for (let line of lines) {
        if (line.startsWith('data: ')) {
          line = line.slice('data: '.length);
          if (line === '[DONE]') {
            const answer = answerBuffer.join("");
            console.log(`Outgoing response: ${answer}`);
            answerBuffer = []; // Clear the buffer
            res.end(); // Close the stream
            return;
          }
          let data;
          try {
            data = JSON.parse(line);
          } catch (error) {
            continue;
          }
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            const chunk = data.choices[0].delta.content;
            answerBuffer.push(chunk);
          }
        }
      }
      callback();
    }
  });

  try {
    axios({
      method: "POST",
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: messageHistory,
        temperature: 0.75,
        max_tokens: 2250,
        stream: true,
      },
      responseType: "stream",
    })
      .then((apiRes) => {
        res.setHeader("Content-Type", "text/event-stream");
        apiRes.data.pipe(streamRes);
      })
      .catch((error) => {
        console.error(`Error at ${req.path}:`, error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorData = error.response.data;
          const status = error.response.status;
          if (status === 429) {
            res.status(429).json({ error: errorData.error });
          } else if (status === 400) {
            res.status(400).json({ error: errorData.error });
          } else {
            res.status(500).json({ error: 'Server error' });
          }
        } else {
          // Something happened in setting up the request that triggered an Error
          res.status(500).json({ message: "Server error" });
        }
      });
  } catch (error) {
    console.error(`Error at ${req.path}:`, error);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});