async function fetchUsers() {
    try{
        const response = await fetch ('http://localhost:3002/users');
        if(!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        displayUsers(users);
    }catch (error){
        console.error('Error Fetching users', error)
    }
}
function displayUsers(users){
    const tableBody = document.querySelector('.table--container tbody');

    tableBody.innerHTML = '';

    users.forEach(user =>{
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> ${user.id}</td>
        <td> ${user.fullname} </td>
        <td> ${user.role} </td>
        <td> ${user.username} </td>
         <td>
         <div class="dropdown">
         <button class="dropbtn">Action</button>
         <div class="dropdown-content">
         <a href="#" class="delete">Deactivate</a>
         <a href="#" class="edit">Activate</a>
        </div>
        </div>
        </td>
 `;
 tableBody.appendChild(row);
    })
    const totalUserCount = document.querySelector('#Total');
    totalUserCount.textContent = `Total Users: ${users.lenght}`
}

document.addEventListener('DOMContentLoaded', fetchUsers)