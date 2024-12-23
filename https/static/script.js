document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email })
            });
            
            if (response.ok) {
                document.getElementById('userForm').reset();
                loadUsers();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

async function loadUsers() {
    try {
        const response = await fetch('/users');
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <strong>ID:</strong> ${user.id}<br>
                <strong>Username:</strong> ${user.username}<br>
                <strong>Email:</strong> ${user.email}<br>
                <button onclick="deleteUser('${user.id}')" class="delete-btn">Delete</button>
            `;
            usersList.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log('Success:', data.message);
                loadUsers(); // Refresh the list
            } else {
                console.error('Server error:', data.error);
                alert(data.error || 'Error deleting user');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error while deleting user');
        }
    }
}
