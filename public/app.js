document.getElementById('video-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoLink = document.getElementById('videoLink').value;
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');

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
