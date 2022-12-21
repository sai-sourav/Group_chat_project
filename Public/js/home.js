const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}
const sendmsgbtn = document.getElementById('sendmessage');

const IP = "http://localhost:4000"

sendmsgbtn.addEventListener("click", async (e)=> {
    e.preventDefault();
    const message = document.getElementById('messagebox').value;
    try{
        const result = await axios.post(`${IP}/message`, {
            msg : message
        }, headers);
        document.getElementById('messagebox').value = "";
        console.log(result);
    }catch(err){
        if(err){
            console.log(err);
        }
    }
})