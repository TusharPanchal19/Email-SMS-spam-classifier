document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('classifier-form');
    const input = document.getElementById('message-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    
    const resultContainer = document.getElementById('result-container');
    const resultCard = document.getElementById('result-card');
    const resultText = document.getElementById('result-text');
    const resultDesc = document.getElementById('result-desc');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = input.value.trim();
        if (!message) return;

        // Loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        
        // Hide previous result
        resultContainer.classList.add('hidden');
        
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update UI with result
                if (data.is_spam) {
                    resultCard.className = 'result-card spam';
                    resultText.textContent = 'Spam Detected';
                    resultDesc.textContent = 'This message looks suspicious and was classified as spam.';
                } else {
                    resultCard.className = 'result-card ham';
                    resultText.textContent = 'Safe Message';
                    resultDesc.textContent = 'This message appears to be normal and safe.';
                }
                
                // Show result
                resultContainer.classList.remove('hidden');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while connecting to the server.');
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });
});
