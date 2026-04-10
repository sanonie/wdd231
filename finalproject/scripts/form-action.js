const resultsElement = document.getElementById('formResults');
const params = new URLSearchParams(window.location.search);

if (resultsElement) {
    if ([...params].length === 0) {
        resultsElement.innerHTML = '<li>No submission data was received.</li>';
    } else {
        resultsElement.innerHTML = [...params]
            .map(([key, value]) => `
        <li><strong>${key.replace(/^[a-z]/, c => c.toUpperCase())}:</strong> ${value || 'Not provided'}</li>
      `)
            .join('');
    }
}
