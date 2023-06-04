const submitButton = document.getElementById("submitButton");
const questionInput = document.getElementById("questionInput");
const answerTextarea = document.getElementById("answerTextarea");

submitButton.addEventListener("click", function() {
  let question = questionInput.value.trim();
  if (question.length === 0) {
    return;
  }

  submitButton.disabled = true;
  answerTextarea.value = "";
  questionInput.value = "";

  const serverUrl = "http://localhost:3000/api/chat";

  fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: question
    }),
  })
  .then(response => {
    const reader = response.body.getReader();
    let resultText = "";
    let readChunk = ({ done, value }) => {
      let chunk = new TextDecoder().decode(value);
      let lines = chunk.split('\n');
      for(let line of lines) {
        if (line.startsWith('data: ')) {
          line = line.slice('data: '.length);
          if (line === '[DONE]') {
            continue;
          }
          let data;
          try {
            data = JSON.parse(line);
          } catch (error) {
            continue;
          }
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            resultText += data.choices[0].delta.content;
            answerTextarea.value = resultText; // Update the answer in real-time
          }
        }
      }
      if (done) {
        submitButton.disabled = false;
        return;
      }
      reader.read().then(readChunk);
    };
    reader.read().then(readChunk);
  })
  .catch((error) => {
    console.error('Error:', error);
    answerTextarea.value = "An error occurred. Please try again later.";
  });
});

questionInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    if (!event.shiftKey) {
      event.preventDefault();
      submitButton.click();
    }
  }
});
