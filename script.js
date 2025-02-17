const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

//getting user message and removing extra white space
let userMessage;
const API_Key = "";
const inputInHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  //create a chat <li> element with passed message and classname
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLI) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLI.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer${API_Key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      message: [{ role: "user", content: userMessage }],
    }),
  };
  //send post request to API and get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return; //return if the chat input fieled is empty
  chatInput.value = "";
  chatInput.style.height = `${inputInHeight}px`;
  chatbox.appendChild(createChatLi(userMessage, "outgoing")); //append the user message to the chatbox
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLI = createChatLi("Thinking..", "incoming");
    //display thinking message after few seconds
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLI);
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);
