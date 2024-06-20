const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/getVideoLink', async (req, res) => {
    const { url } = req.query;

    console.log('Received video URL:', url);
    
    let videoUrl;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        videoUrl = await getYouTubeVideoUrl(url);
    } else if (url.includes('instagram.com')) {
        videoUrl = await getInstagramVideoUrl(url);
    } else if (url.includes('facebook.com')) {
        videoUrl = await getFacebookVideoUrl(url);
    }

    if (videoUrl) {
        res.json({ videoUrl });
    } else {
        res.status(400).json({ error: 'Invalid video link or unsupported platform.' });
    }
});

async function getYouTubeVideoUrl(url) {
    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        return format.url;
    } catch (error) {
        console.error('Error fetching YouTube video URL:', error);
        return null;
    }
}

async function getInstagramVideoUrl(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const videoUrl = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video ? video.src : null;
        });
        await browser.close();
        return videoUrl;
    } catch (error) {
        console.error('Error fetching Instagram video URL:', error);
        return null;
    }
}

async function getFacebookVideoUrl(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const videoUrl = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video ? video.src : null;
        });
        await browser.close();
        return videoUrl;
    } catch (error) {
        console.error('Error fetching Facebook video URL:', error);
        return null;
    }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
