document.getElementById('video-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoLink = document.getElementById('videoLink').value;

    fetch(`/api/getVideoLink?url=${encodeURIComponent(videoLink)}`)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                const videoPlayer = document.getElementById('videoPlayer');
                const videoSource = document.getElementById('videoSource');
                videoSource.src = data.videoUrl;
                videoPlayer.load();
                videoPlayer.play();
            } else {
                alert('Invalid video link or unsupported platform.');
            }
        })
        .catch(error => {
            console.error('Error fetching video URL:', error);
            alert('Error fetching video URL. Please try again.');
        });
});
