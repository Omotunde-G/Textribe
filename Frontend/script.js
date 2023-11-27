document.addEventListener('DOMContentLoaded', () =>{
    const signupForm = document.querySelector('form') 

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch ('/auth/register' ,{
               method: 'post',
               headers: {
                'content-Type': 'application/json' 
               },
               body: JSON.stringify({username, password})
            });
             const data = await response.json()
if (response.ok) {

    alert('login successfull')
  } else {
    const errorData = await response.json();
    console.log('Error:', errorData.message);
  
  }
  
             console.log(data)
        } catch (error) {
             console.error('Error', error)
        }
    })

})

