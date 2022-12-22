const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}
const sendmsgbtn = document.getElementById('sendmessage');
const input = document.getElementById("messagebox");
const chatlist = document.getElementById('chat-list');
const IP = "http://localhost:4000";

var lastmessageid;

document.addEventListener("DOMContentLoaded", async (e)=>{
    e.preventDefault();
    getmessages();
});

setInterval(()=>{
    showmessages();
}, 1000);

async function getmessages(){
    try{
        if(lastmessageid === undefined){
            lastmessageid = 0;
            localStorage.removeItem('chatdata');
        }
        const result = await axios.get(`${IP}/message?lastmessageid=${lastmessageid}`, headers);
        const messages = result.data.msg;
        const username = result.data.name;
        if (messages.length === 0){
            return;
        }
        lastmessageid = messages[messages.length-1].id;
        
        const finalarray = getfinalarray(messages);
        const obj = {
            username : username,
            messages : finalarray
        }
        const stringifyobj = JSON.stringify(obj);
        localStorage.setItem("chatdata", stringifyobj);
    }catch(err){
        if(err){
            console.log(err);
        }
    }
}

function showmessages(){
    chatlist.innerHTML = "";
    const data = localStorage.getItem("chatdata");
    const strigifydata = JSON.parse(data);
    const messages = strigifydata.messages;
    const username = strigifydata.username;
    for(let i=0; i<messages.length; i++){
        const li = document.createElement('li');
        li.innerText = `${username}: ${messages[i].msg}`;
        chatlist.appendChild(li);
    }
}

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendmsgbtn.click();
    }
});

sendmsgbtn.addEventListener("click", async (e)=> {
    e.preventDefault();
    const message = document.getElementById('messagebox').value;
    try{
        const result = await axios.post(`${IP}/message`, {
            msg : message
        }, headers);
        document.getElementById('messagebox').value = "";
        getmessages();
    }catch(err){
        if(err){
            console.log(err);
        }   
    }
})

function getfinalarray(msgs){
    const data = localStorage.getItem("chatdata");
    let oldarray
    if (data !== null){
        const jsondata = JSON.parse(data);
        oldarray = jsondata.messages;
    }else {
        oldarray = []
    }
    const newarray = msgs;
    const finalarray = oldarray.concat(newarray);
    while (finalarray.length > 10){
        finalarray.shift();
    }
    return finalarray; 
}