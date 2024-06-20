document.getElementById('video-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoLink = document.getElementById('videoLink').value;
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    document.getElementById('videoForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
    
        const videoUrl = document.getElementById('videoUrlInput').value;
        
        fetch('/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        })
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('videoContainer');
            videoContainer.innerHTML = `<video controls src="${data.videoUrl}"></video>`;
        })
        .catch(error => console.error('Error:', error));
    });
    
    if (isValidURL(videoLink)) {
        fetch(`/api/getVideoLink?url=${encodeURIComponent(videoLink)}`)
            .then(response => response.json())
            .then(data => {
                if (data.videoUrl) {
                    videoSource.src = data.videoUrl;
                    videoPlayer.load();
                    videoPlayer.play();
                } else {
                    alert('Invalid video link or unsupported platform.');
                }
            })
            .catch(error => {
                console.error('Error fetching video URL:', error);
            });
    } else {
        alert('Please enter a valid URL.');
    }
});

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
