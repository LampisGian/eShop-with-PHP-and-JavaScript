const profileForm = document.querySelector("#profileForm");
const profileFullName = document.querySelector("#profileFullName");
const profileEmail = document.querySelector("#profileEmail");

async function loadProfile() {
    try {
        const response = await fetch("../api/get_profile.php");
        const result = await response.json();

        if (!result.success) {
            await Swal.fire({
                icon: "warning",
                title: "Login required",
                text: result.message,
                confirmButtonText: "Go to login",
                confirmButtonColor: "#38bdf8",
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "auth/login.html";
            return;
        }

        profileFullName.value = result.user.full_name || "";
        profileEmail.value = result.user.email || "";
    } catch (error) {
        await Swal.fire({
            icon: "error",
            title: "Connection error",
            text: "Could not load profile details.",
            confirmButtonColor: "#ef4444",
            background: "#111820",
            color: "#f5f5f0"
        });

        window.location.href = "home.html";
    }
}

if (profileForm) {
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(profileForm);
        const newPassword = formData.get("new_password");
        const confirmPassword = formData.get("confirm_password");

        if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords do not match",
                text: "Please make sure both password fields are the same.",
                confirmButtonColor: "#ef4444",
                background: "#111820",
                color: "#f5f5f0"
            });

            return;
        }

        try {
            const response = await fetch("../api/update_profile.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Update failed",
                    text: result.message,
                    confirmButtonColor: "#ef4444",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                return;
            }

            profileForm.reset();
            profileFullName.value = result.user.name || "";
            profileEmail.value = result.user.email || "";

            const menuWelcomeName = document.querySelector("#menuWelcomeName");
            const userInfo = document.querySelector("#userInfo");

            if (menuWelcomeName) {
                menuWelcomeName.textContent = `Welcome, ${result.user.name}`;
            }

            if (userInfo) {
                userInfo.textContent = `Welcome, ${result.user.name}. Your role is ${result.user.role}.`;
            }

            Swal.fire({
                icon: "success",
                title: "Profile updated",
                text: result.message,
                confirmButtonColor: "#22c55e",
                background: "#111820",
                color: "#f5f5f0"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Connection error",
                text: "Could not update profile.",
                confirmButtonColor: "#ef4444",
                background: "#111820",
                color: "#f5f5f0"
            });
        }
    });
}

loadProfile();