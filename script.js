const chatInput = document.querySelector(".chart-input textarea");
const sendChartBtn = document.querySelector(".chart-input span");
const chatbox = document.querySelector(".chatbox")

let userMessage = null; // variable to store user's message
const API_KEY = "";
const inputInitHeight = chatInput.scrollHeight

const createChatLi = (message, className) => {
    // create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : ` <span class="material-symbols-outlined">smart_toy </span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_ENDPOINT = "https://api.edenai.run/v2/text/chat";
    const aiResEl = incomingChatLi.querySelector("p")

    // Define the properties and message for the API request
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${API_KEY} `
        },
        body: JSON.stringify({
          response_as_dict: true,
          attributes_as_list: false,
          show_original_response: false,
          temperature: 0,
          max_tokens: 1000,
          providers: 'meta',
          text: `${ userMessage}`
        })
      };


    // send post request to API, get response
    fetch(API_ENDPOINT, options).then(res => res.json()).then(data => {
        console.log(data)
        console.log(data.meta)
        console.log(data.meta.generated_text)
        aiResEl.textContent = data.meta.generated_text
    }).catch((error) => {
        aiResEl.classList.add("error")
        aiResEl.texContent = "Oops! Something went wrong. please try again" 
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))

}

    const handleChart = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // display thinking while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight)
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`

});

chatInput.addEventListener("keydown", (e) => {
    // if Enter key is pressed without shift key and the window
    // width greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 280) {
        e.preventDefault();
        handleChart();
    }
})

sendChartBtn.addEventListener('click', handleChart);

