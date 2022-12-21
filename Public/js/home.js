const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}
const sendmsgbtn = document.getElementById('sendmessage');
const chatlist = document.getElementById('chat-list');
const IP = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", async (e)=>{
    e.preventDefault();
    getmessages();
});

// setTimeInterval(() =>. call Api , 1000)

setInterval(()=>{
    getmessages();
}, 3000);

async function getmessages(){

    try{
        chatlist.innerHTML = "";
        const result = await axios.get(`${IP}/message`, headers);
        const messages = result.data.msg;
        const username = result.data.name;
        for(let i=0; i<messages.length; i++){
            const li = document.createElement('li');
            li.innerText = `${username}: ${messages[i].msg}`;
            chatlist.appendChild(li);
        }
    }catch(err){
        if(err){
            console.log(err);
        }
    }
}

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