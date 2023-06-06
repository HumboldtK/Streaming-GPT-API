# Streaming GPT API

This project demonstrates how to stream API responses using plain JavaScript, HTML, and Node.js. 

View Live Code: https://app.jacobmanus.com/

## Setup and Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/HumboldtK/Streaming-GPT-API.git
    ```

2. Navigate to the project server directory:
    ```bash
    cd Streaming-GPT-API/Server
    ```

3. Install the necessary npm packages:
    ```bash
    npm install express cors dotenv axios stream
    ```

4. Add your OpenAI GPT API key to the `.env` file:
    ```makefile
    API_KEY=<your-api-key>
    ```

5. Run the server:
    ```bash
    node server.js
    ```

Now, open `index.html` in your browser. You can now submit requests and receive streaming responses directly from the server.


Feel free to adapt and utilize this example project.

## Customizable Features

- **Model Selection:** Located in `server.js` on line 76, you have the option to select the GPT model according to your preference. For instance, you could use `model: "gpt-3.5-turbo"` or `model: "gpt-4"`.

- **System Message Prompt:** Within `server.js` on line 23, a customizable system message prompt is present. This functionality enables you to tailor system messages, thereby enhancing user experiences through personalized instructions.

I recommend thoroughly reviewing these key lines to comprehend their function and modify them suitably to align with your specific objectives.

