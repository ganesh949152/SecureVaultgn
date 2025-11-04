
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        
               const passwordInput = form.querySelector('input[type="password"]');
        const usernameInput = form.querySelector('input[type="email"], input[type="text"][name*="user"]');

        if (passwordInput && usernameInput && passwordInput.value.length > 0) {
            
            const site = window.location.hostname;
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            chrome.runtime.sendMessage({
                action: "NEW_CREDENTIAL_SUBMITTED",
                data: { site, username, password }
            });
        }
    });
});