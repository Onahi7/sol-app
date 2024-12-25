document.getElementById('solanaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            wallet: form.wallet.value,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        const response = await fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;
    }, () => {
        alert("Unable to retrieve your location.");
    });
});
