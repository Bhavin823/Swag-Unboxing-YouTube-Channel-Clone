const searchterm = '@swag_unboxing';
const videosContainer = document.querySelector('.videos');
let nextPageToken = '';

async function fetchVideos(pageToken = '') {
    // fetch channel data using @youtube_channel_handle'
    const channelUrl = `https://yt.lemnoslife.com/noKey/channels?forHandle=${searchterm}&part=snippet,contentDetails`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    const channelTumbnail = channelData.items[0].snippet.thumbnails.default.url
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // fetch all the playlistitems of the given playlistId  
    const videosUrl = `https://yt.lemnoslife.com/noKey/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=20&pageToken=${pageToken}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    nextPageToken = videosData.nextPageToken || '';

    // fetch video detail of the given videoId
    const videoIds = videosData.items.map(item => item.contentDetails.videoId).join(',');
    const videosDetailsUrl = `https://yt.lemnoslife.com/noKey/videos?id=${videoIds}&part=snippet,statistics`;
    const videosDetailsResponse = await fetch(videosDetailsUrl);
    const videosDetailsData = await videosDetailsResponse.json();
    
    return videosData.items.map((item, index) => ({
        id: item.contentDetails.videoId,
        thumbnail: item.snippet.thumbnails.high.url,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        views: videosDetailsData.items[index].statistics.viewCount,
        date: item.snippet.publishedAt,
        authorthmbnail :channelTumbnail,
    }));
}

async function loadVideos() {
    try {
        const videos = await fetchVideos();

        videos.forEach(video => {
            // create video div
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video');

            // create thumbnail div and add in the video div
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('thumbnail');
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = video.thumbnail;
            thumbnailDiv.appendChild(thumbnailImg);
            videoDiv.appendChild(thumbnailDiv);

            // create detailsDiv 
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');

            // create authorDiv 
            const authorDiv = document.createElement('div');
            authorDiv.classList.add('author');
            const authorthmbnailImg = document.createElement('img');
            authorthmbnailImg.src = video.authorthmbnail;

            // create title div
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('title');
            const titleHeading = document.createElement('h3');
            titleHeading.innerText = video.title;

            // create anchorLink
            const authorLink = document.createElement('a');
            authorLink.href = '#';
            authorLink.innerText = video.author;

            // creare viewspan
            const viewsSpan = document.createElement('span');
            viewsSpan.innerText = `${video.views} views • ${timeAgo(video.date)}`;

            // all elements to add to their parent div
            authorDiv.appendChild(authorthmbnailImg);
            detailsDiv.appendChild(authorDiv);
            titleDiv.appendChild(titleHeading);
            titleDiv.appendChild(authorLink);
            titleDiv.appendChild(viewsSpan);
            detailsDiv.appendChild(titleDiv);

            // deailsDiv add to videoDiv
            videoDiv.appendChild(detailsDiv);

            // videoDiv add to html div videosDiv
            videosContainer.appendChild(videoDiv);

            // add event onclick to open this youtube
            videoDiv.addEventListener('click',(e)=>{
                window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
            })
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        if (nextPageToken) {
            loadVideos();
        }
    }
});

loadVideos();


// search bar

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener('click',()=>{
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value
    }
})