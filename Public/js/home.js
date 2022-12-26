const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}
const sendmsgbtn = document.getElementById('sendmessage');
const input = document.getElementById("messagebox");
const chatlist = document.getElementById('chat-list');
const close = document.getElementById('close');
const closemembers = document.getElementById('close-add-members');
const message = document.getElementById('message');
const container = document.getElementById('popup-container');
const creategrpbtn = document.getElementById('create-grp');
const addmembersbtn = document.getElementById('add-grp-members');
const addmemberscontainer = document.getElementById('popup-container-addmembers');
const chatcontainer = document.getElementById('chatbox');
const savegrpbtn = document.getElementById('savegroup');
const groupslist = document.getElementById('contacts');
const memberslist = document.getElementById('memberslist');
const IP = "http://localhost:4000";

var openedgroupid;
var lastmessageid;

close.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
});

closemembers.addEventListener("click", (e)=> {
    e.preventDefault();
    addmemberscontainer.classList.remove("active");
});

creategrpbtn.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
})

savegrpbtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const groupname = document.getElementById('gname').value;
    if(groupname === ""){
        message.innerText = "❌ Please fill all fields";
    }else{
        try{
            const result = await axios.post(`${IP}/group`,{
                groupname : groupname
            }, headers);
            message.innerText = `✔️ ${groupname} group created Successfully`;
            document.getElementById('gname').value = "";
            getgroups();

        }catch(err){
            if(err){
                console.log(err);
            }
        }
    }
})

document.addEventListener("DOMContentLoaded", (e)=>{
    e.preventDefault();
    document.getElementById('chat-heading').style.visibility = "hidden";
    document.getElementById('messagebox').style.visibility = "hidden";
    document.getElementById('sendmessage').style.visibility = "hidden";
    document.getElementById('choosediv').style.visibility = "hidden";
    getusername();
    getgroups();
});

async function getgroups(){
    try{
        const result = await axios.get(`${IP}/group`, headers);
        const groups = result.data.groups;
        showgroups(groups);
    }catch(err){
        if(err){
            console.log(err);
        }
    }
}

function showgroups(groups){
    groupslist.innerHTML = ""
    for(let i=0; i<groups.length; i++){
        const btn = document.createElement('button');
        btn.id = groups[i].groupid;
        btn.innerText = groups[i].groupname;
        btn.className = "contact-item1";
        btn.value = groups[i].isadmin;
        groupslist.appendChild(btn);
        const br = document.createElement('br');
        groupslist.appendChild(br);
    }
}
// const socket = io('http://localhost:3000', { auth: { token: token}});

function getFile() {
    document.getElementById("choosefile").click();
}

setInterval(()=>{
    getmessages(openedgroupid);
}, 1000);

async function getmessages(openedgroupid){
    try{
        if(openedgroupid === undefined){
            return;
        }
        const data = localStorage.getItem(`${openedgroupid}`);
        let oldarray;
        if (data !== null){
            const jsondata = JSON.parse(data);
            oldarray = jsondata.messages;
            lastmessageid = oldarray[oldarray.length-1].id;
        }else {
            oldarray = []
            lastmessageid = 0;
        }
        const result = await axios.get(`${IP}/message?lastmessageid=${lastmessageid}&groupid=${openedgroupid}`, headers);
        // socket.emit('last-message-id', lastmessageid);
        // socket.on('messages', msgobj => {
        //     const messages = msgobj.msg;
        //     const username = msgobj.name;
        //     if (messages.length === 0){
        //         return;
        //     }
        //     lastmessageid = messages[messages.length-1].id;
        //     console.log(messages);
            
        //     const finalarray = getfinalarray(messages);
        //     const obj = {
        //         username : username,
        //         messages : finalarray
        //     }
        //     const stringifyobj = JSON.stringify(obj);
        //     localStorage.setItem("chatdata", stringifyobj);
        //     showmessages();
        // })
        const newarray = result.data.msg;
        const finalarray = oldarray.concat(newarray);
        while (finalarray.length > 10){
            finalarray.shift();
        }
        if (finalarray.length === 0){
            return;
        }
        const obj = {
            messages : finalarray
        }
        const stringifyobj = JSON.stringify(obj);
        localStorage.setItem(`${openedgroupid}`, stringifyobj);
        showmessages(openedgroupid);
    }catch(err){
        if(err){
            console.log(err);
        }
    }
}

function showmessages(openedgroupid){
    chatlist.innerHTML = "";
    const stringdata = localStorage.getItem(`${openedgroupid}`);
    const data = JSON.parse(stringdata);
    const messages = data.messages;
    for(let i=0; i<messages.length; i++){
        const li = document.createElement('li');
        if(messages[i].type === "msg"){
            li.innerText = `${messages[i].msg}`;
        }else if(messages[i].type === "file"){
            const arr = messages[i].msg.split('*');
            li.innerHTML = `${arr[0]} <a href="${arr[1]}">${messages[i].filename}</a>`
        }
        chatlist.appendChild(li);
    }
}

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendmsgbtn.click();
    }
});

// sendmsgbtn.addEventListener("click", async (e)=> {
//     e.preventDefault();
//     const message = document.getElementById('messagebox').value;
//     const file = document.getElementById('choosefile')
//     try{
//         const result = await axios.post(`${IP}/message`, {
//             msg : message,
//             groupid : openedgroupid
//         }, 
//         { 
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 'Authorization' : token
//             }
//         }
//         );
//         document.getElementById('messagebox').value = "";
//         getmessages(openedgroupid);
//     }catch(err){
//         if(err){
//             console.log(err);
//         }   
//     }
// })


const form = document.getElementById("messageform");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById('opengroupid').value = openedgroupid;
    const formData = new FormData(form);
    try{
        const result = await axios.post(`${IP}/message`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization' : token
            },
        });
        document.getElementById('messagebox').value = "";
        document.getElementById('opengroupid').value = "";
        document.getElementById('choosefile').value = "";
    }catch(err){
        if(err){
            console.log(err);
        }
    }
});

  


prevbtn = document.createElement('button');
document.getElementById('contacts').addEventListener("click", (e)=> {
    e.preventDefault();
    if(e.target.className === 'contact-item1'){
        currbtn = e.target;
        if(prevbtn !== currbtn){
            prevbtn.classList.remove('active');
            prevbtn = currbtn;
        }
        currbtn.classList.add('active');
        const groupname = e.target.innerText;
        document.getElementById('chat-heading').style.visibility = "visible";
        document.getElementById('messagebox').style.visibility = "visible";
        document.getElementById('sendmessage').style.visibility = "visible";
        document.getElementById('select-group').style.display = "none";
        document.getElementById('choosediv').style.visibility = "visible";
        openedgroupid = e.target.id;
        if(e.target.value === "true"){
            document.getElementById('chat-heading').innerHTML = `<h2 id="${e.target.id}">${groupname}</h2>
            <button id="add-grp-members" class="add-grp-members">Participants</button>`;
        }else{
            document.getElementById('chat-heading').innerHTML = `<h2 id="${e.target.id}">${groupname}</h2>`;
        }
        chatlist.innerHTML = "";
        getmessages(openedgroupid);
    }
})

document.getElementById('chat-heading').addEventListener("click", async (e)=> {
    e.preventDefault();
    if(e.target.className === 'add-grp-members'){
        addmemberscontainer.classList.add("active");
        getmembers();
    }
})

async function getmembers(){
    memberslist.innerHTML = "";
    const result = await axios.get(`${IP}/groupmembers?groupid=${openedgroupid}`,headers);
    const users = result.data.users;
    const li = document.createElement('li');
    li.id = "0";
    li.className = "memberslistitem";
    li.innerText = "You";
    memberslist.appendChild(li);
    for(let i=0; i<users.length; i++){
        const li = document.createElement('li');
        li.id = users[i].id;
        li.className = "memberslistitem";
        if(users[i].isgroupmember === true){
            if(users[i].isadmin === true){
                li.innerHTML = `${users[i].name} <button class="remove">Remove</button>`
            }else{
                li.innerHTML = `${users[i].name} <button class="make-admin">make admin</button> <button class="remove">Remove</button>`
            }
        }else{
            li.innerHTML = `${users[i].name} <button class="addmember">✙ Add</button>`
        }
        memberslist.appendChild(li);
    }
}

memberslist.addEventListener("click", async (e)=>{
    e.preventDefault();
    if(e.target.className === 'remove'){
        const userid = e.target.parentNode.id;
        try{
            const result = await axios.get(`${IP}/removefromgroup?userid=${userid}&groupid=${openedgroupid}`, headers);
            getmembers();
        }catch(err){
            if(err){
                console.log(err);
            }   
        } 
    }
    else if(e.target.className === 'make-admin'){
        const userid = e.target.parentNode.id;
        try{
            const result = await axios.get(`${IP}/makeadmin?userid=${userid}&groupid=${openedgroupid}`, headers);
            getmembers();
        }catch(err){
            if(err){
                console.log(err);
            }   
        }
    }
    else if(e.target.className === 'addmember'){
        const userid = e.target.parentNode.id;
        try{
            const result = await axios.get(`${IP}/addmembertogroup?userid=${userid}&groupid=${openedgroupid}`, headers);
            getmembers();
        }catch(err){
            if(err){
                console.log(err);
            }   
        }
    }
})

async function getusername(){
    try{
        const result = await axios.get(`${IP}/getusername`, headers);
        username = result.data.name;
        document.getElementById('greeting').innerText = `Welcome ${username}!`
    }catch(err){
        if(err){
            console.log(err);
        }   
    }
}
