function displayStories(stories) {
  if (!Array.isArray(stories)) {
    console.error("Invalid data format- Expect an array");
    return;
  }
  const tableBody = document.querySelector(".table--container tbody");
  tableBody.innerHTML = "";
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  stories.forEach((story) => {
    const row = document.createElement("tr");
    const createdAt = new Date(story.created_at);
    const formattedDate = dateFormatter.format(createdAt);
    row.innerHTML = ` 
         <td>${formattedDate}</td>
         <td>${story.title}</td>
         <td>${story.content}</td>
         <td>${story.author}</td>
         <td></td> <!-- Fill this column with status data -->
         <td>
           <div class="dropdown">
             <button class="dropbtn">Action</button>
             <div class="dropdown-content">
               <a href="#" class="delete">Delete</a>
             </div>
           </div>
         </td>`;
    tableBody.appendChild(row);
  });

  const totalCompleted = document.querySelector("tfoot tr td:nth-child(1)");
  totalCompleted.textContent = `Total Stories: ${stories.length} `;
}

fetchStoriesByUsers();
async function fetchStoriesByUsers() {
  try {
    const response = await fetch(`http://localhost:3005 /stories/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }
    const stories = await response.json();
    displayStories(stories.stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
}

//    fix
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3005 /users");
    if (!response.ok) {
      console.error("Failed to fetch users. Response status:", response.status);
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error("Error Fetching users", error);
  }
}

function displayUsers(users) {
  const tableBody = document.querySelector(".table--container tbody");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
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
  });
  const totalUserCount = document.querySelector("#Total");
  totalUserCount.textContent = `Total Users: ${users.length}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  fetchStoriesByUsers();
});
