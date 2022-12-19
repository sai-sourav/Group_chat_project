const signupbtn = document.getElementById('signupbtn');
const message = document.getElementById("exists");
const container = document.getElementById('container');
const ok = document.getElementById('ok');

const IP = "localhost:4000";

ok.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
});

signupbtn.addEventListener("click", async (e) => {
    e.preventDefault();
    message.innerText = "";
    const name = document.getElementById('name').value;
    const emailid = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const pswd = document.getElementById('pswd').value;
    if( name === "" || emailid === "" || phone === "" || pswd === "" ){
        message.innerText = "❌ Please fill all the fields";
    } else{
        try{
            const response = await axios.post(`http://${IP}/signup`,{
                name : name,
                emailid : emailid,
                phone : phone,
                pswd : pswd
            });
            if(response.data.found === true){
                message.innerText = "❌ User already exists!";
            } else{
                container.classList.add("active");
                document.getElementById('name').value = "";
                document.getElementById('email').value = "";
                document.getElementById('pswd').value = "";
                document.getElementById('phone').value = "";
            }
        }catch(err){
            if(err){
                message.innerText = "❌ Something Went wrong";
            }
        }
    }
})
