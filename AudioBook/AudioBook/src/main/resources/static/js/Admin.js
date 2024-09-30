const mainContent = document.getElementById('mainContent');
const updateActiveMenu = (activeId) => {
    const menuItems = document.querySelectorAll('.sidebar a');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.id === activeId) {
            item.classList.add('active');
        }
    });
};
var selectedContent = "";
document.getElementById('userManagement').addEventListener('click', function () {
    // Ẩn nội dung chính
    if(selectedContent === ""){
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('userTable').classList.remove('d-none');
        selectedContent = "userTable";
    }
    else{
         document.getElementById(selectedContent).classList.add('d-none');
         // Hiện bảng người dùng
         document.getElementById('userTable').classList.remove('d-none');
         selectedContent = "userTable";
    }
    // Lấy dữ liệu người dùng
    fetchUsers();
    // Cập nhật menu hiện tại
    updateActiveMenu('userManagement');
});
let users = []; // Danh sách người dùng lấy từ API
let filteredUsers = []; // Danh sách người dùng sau khi tìm kiếm
let currentPage = 1;
const usersPerPage = 5; // Số người dùng trên mỗi trang
let totalPages = 0;
// Hàm để tìm kiếm người dùng
const searchUsers = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.fullname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    currentPage = 1; // Reset lại trang về 1
    displayUsers();
};
// Bắt sự kiện khi nhấn nút tìm kiếm
document.getElementById('searchButton').addEventListener('click', searchUsers);
// Khi trang được tải, mặc định danh sách người dùng đầy đủ
document.addEventListener('DOMContentLoaded', async () => {
    await fetchUsers();
    filteredUsers = users; // Hiển thị toàn bộ người dùng trước khi tìm kiếm
    displayUsers();
});
const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/user/get-user');
        users = await response.json();
        totalPages = Math.ceil(users.length / usersPerPage);
        displayUsers();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// Cập nhật hàm displayUsers() để sử dụng danh sách filteredUsers
const displayUsers = () => {
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    paginatedUsers.forEach(user => {
        const row = `
      <tr>
        <td>${user.username}</td>
        <td>${user.fullname}</td>
        <td>${user.phonenumber}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editUser('${user.username}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.username}')">Xóa</button>
        </td>
      </tr>
    `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
    document.getElementById('prevPage').style.display = currentPage === 1 ? 'none' : 'block';
    document.getElementById('nextPage').style.display = end >= filteredUsers.length ? 'none' : 'block';
    document.getElementById('pageInfo').innerHTML = `Trang ${currentPage} / ${totalPages}`;
};
const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    displayUsers();
};
// Gọi hàm fetchUsers() để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchUsers);
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayUsers();
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * usersPerPage < users.length) {
        currentPage++;
        displayUsers();
    }
});
///////////////////////Xoa nguoi dung/////////////////////////////////////////
let userToDelete = '';
function deleteUser(username) {
    // Tìm người dùng theo username
    const user = users.find(u => u.username === username);
    if (!user) {
        console.error('User not found');
        return;
    }
    // Lưu thông tin người dùng để xóa
    userToDelete = username;
    // Hiển thị đầy đủ thông tin người dùng trong modal
    document.getElementById('modalUsername').innerText = user.username;
    document.getElementById('modalFullname').innerText = user.fullname;
    document.getElementById('modalPhonenumber').innerText = user.phonenumber;
    document.getElementById('modalEmail').innerText = user.email;
    document.getElementById('modalRole').innerText = user.role;

    // Hiển thị modal
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();
}
// Xử lý khi người dùng nhấn nút Xác nhận trong modal
document.getElementById('confirmDeleteButton').addEventListener('click', async function () {
    try {
        // Gửi yêu cầu xóa người dùng qua API
        await fetch(`http://localhost:8080/user/${userToDelete}`, { method: 'DELETE' });
        // Sau khi xóa thành công, ẩn modal
        alert('Xóa người dùng thành công!');
        const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.hide();
        // Tải lại danh sách người dùng
        await fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
});
/////////////////////////update nguoi dung//////////////////////
let userToEdit = null; // User cần update
function editUser(username) {
    // Tìm người dùng theo username
    const user = users.find(u => u.username === username);
    if (!user) {
        console.error('User not found');
        return;
    }
    // Lưu thông tin người dùng để chỉnh sửa
    userToEdit = user;
    // Điền thông tin người dùng vào form chỉnh sửa
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editFullname').value = user.fullname;
    document.getElementById('editPhonenumber').value = user.phonenumber;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;
    // Hiển thị modal chỉnh sửa
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
}
// Xử lý khi người dùng nhấn nút "Lưu" trong modal
document.getElementById('saveUserButton').addEventListener('click', async function () {
    if (!userToEdit) return;
    // Map role (ADMIN or USER) to the corresponding roleId
    const roleMapping = {
        'ADMIN': 1, // Assuming 1 for ADMIN
        'USER': 2   // Assuming 2 for USER
    };
    // Lấy dữ liệu từ form và tạo request body theo DTO
    const updatedUser = {
        fullname: document.getElementById('editFullname').value,
        phonenumber: document.getElementById('editPhonenumber').value,
        email: document.getElementById('editEmail').value,
        roleId: roleMapping[document.getElementById('editRole').value], // Convert role to roleId
    };
    try {
        // Gửi yêu cầu cập nhật người dùng qua API
        const response = await fetch(`http://localhost:8080/user/${userToEdit.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser), // Send data in the correct DTO format
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        // Cập nhật thành công, ẩn modal và tải lại danh sách người dùng
        alert('Cập nhật người dùng thành công!');
        const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        editUserModal.hide();
        await fetchUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Cập nhật người dùng thất bại');
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('categoryManagement').addEventListener('click', function () {
    // Ẩn nội dung chính
    if(selectedContent === ""){
           document.getElementById('mainContent').classList.add('d-none');
            document.getElementById('categoryTable').classList.remove('d-none');
            selectedContent = "categoryTable";
     }
     else{
             document.getElementById(selectedContent).classList.add('d-none');
             // Hiện bảng category
             document.getElementById('categoryTable').classList.remove('d-none');
             selectedContent = "categoryTable";
        }
    updateActiveMenu('categoryManagement');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('bookManagement').addEventListener('click', function () {
    mainContent.innerHTML = `
    <h3>Quản lý sách</h3>
    <p>Chức năng quản lý sách: thêm, sửa, xóa sách.</p>
    <button class="btn btn-custom">Thêm sách</button>
  `;
    updateActiveMenu('bookManagement');
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('audioManagement').addEventListener('click', function () {
    mainContent.innerHTML = `
    <h3>Quản lý Audio</h3>
    <p>Chức năng quản lý audio: thêm, sửa, xóa audio.</p>
    <button class="btn btn-custom">Thêm audio</button>
  `;
    updateActiveMenu('audioManagement');
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    // Lấy dữ liệu từ localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    // Kiểm tra xem userData có tồn tại và role có phải là 'ADMIN'
    if (storedUserData && storedUserData.role === 'ADMIN') {
        document.querySelector('.user-info').innerText = `Xin chào, ${storedUserData.username}`;
    } else {
        // Nếu không phải admin, chuyển hướng về trang login
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = '/login';
    }
});
// Xử lý khi nhấn nút Đăng xuất
function logout() {
    // Xóa dữ liệu trong localStorage
    localStorage.removeItem('userData');
    // Thông báo và chuyển hướng về trang đăng nhập
    alert('Đăng xuất thành công!');
    window.location.href = '/login';
}