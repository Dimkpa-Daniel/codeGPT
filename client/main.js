import bot from './assets/robot.png';
import user from './assets/user.png';

const form = document.querySelector('form');
const chatContainer = document.querySelector('.myChat_Container');

// =====The Loading section before the answer shows up.
let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.'; 

    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 300);
}

// ======This section handles how the AI types out the response/answer=======
function typeText(element, text){
  let index = 0;

  let interval = setInterval(() => {

    if (index < text.length){
      element.innerHTML += text.charAt(index);
      index++
    } else {
      clearInterval(interval);
    }

  }, 20)
}



// ======Generating unique random ID for each message=====

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);


  return `id-${timestamp}-${hexadecimalString}`
}


// ======Chat stripe between the AI and users.======

function chatStripe (isAi, value, uniqueId ){
return (
  `
  <div class ="wrapper ${isAi && 'ai'}">
    <div class="chat">
      <div class="profile">
      <img 
      
      src="${isAi ? bot : user}"
      alt="${isAi ? 'bot' : 'user'}"
      />
      </div>
      <div class="message" id="${uniqueId}">${value} </div>
  </div>
</div>

  `
)
}


// ===Handlesubmit function which will trigger the AI generated response=====

const handleSubmit = async(e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Generate user's chat Stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

    // Generate bot's chat Stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;

const conversationDIV = document.getElementById(uniqueId);

loader(conversationDIV);

// Fetch data from the server to the front ==> Getting bot's response
const response = await fetch('https://codegpt-uf8j.onrender.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
}) 

clearInterval(loadInterval);
conversationDIV.innerHTML= '';

if (response.ok) {
  const data = await response.json();
  const parsedData = data.bot.trim();



  typeText(conversationDIV, parsedData)
} else {
  const err = await response.text();

  conversationDIV.innerHTML = "Oops Something went wrong";
 
  alert(err);
}
}

form.addEventListener('submit', handleSubmit);

// This is to enable us us the enter key to snd/submit a question
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13){
    handleSubmit(e)
  }
})


// Prevents right click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
 }, false);


//  Prevents the F12 and Ctrl12 from being clicked
 document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.keyCode==123) {
   e.stopPropagation();
   e.preventDefault();
  }
 });




  