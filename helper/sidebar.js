function toggleSidebar() {
    var sidebar = document.getElementById("profileSidebar");
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
    }
}

// Close the sidebar if clicking outside of it
document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("profileSidebar");
    var profileContainer = document.querySelector(".profile-container");

    // Check if the click was outside the sidebar and profile-container
    if (!sidebar.contains(event.target) && !profileContainer.contains(event.target)) {
        if (sidebar.style.width === '250px') {
            sidebar.style.width = '0'; // Close the sidebar
        }
    }
});

// Close the sidebar if clicking outside of it
document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("profileSidebar");
    var profileContainer = document.querySelector(".profile-container");

    // Check if the click was outside the sidebar and profile-container
    if (!sidebar.contains(event.target) && !profileContainer.contains(event.target)) {
        if (sidebar.style.width === '250px') {
            sidebar.style.width = '0'; // Close the sidebar
        }
    }
});

