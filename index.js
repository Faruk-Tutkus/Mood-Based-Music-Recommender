const rand = Math.floor(Math.random() * 2)
const promts = ['How do you feel?', 'What are you thinking?']
document.getElementById('mood').placeholder = promts[rand]
document.getElementById('moodForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const mood = document.getElementById('mood').value
    const selector = document.getElementById('language')
    let language = selector.options[selector.selectedIndex].text
    if (language == 'Random') {
      language = selector.options[Math.floor(Math.random() * 14) + 1].text
    }
    if (mood != '') {
      try {
        const response = await fetch('api/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood, language }),
        })
        const info = await response.json()
        const clientId = info.clientId;
        const clientSecret = info.clientSecret; 
        const text = info.response.replace('"', '').replace('.','')
        console.log(text)
        const trackUri = await getMusicForMood(text, clientId, clientSecret);
        playMusic(trackUri);
    } catch (error) {
        console.error('Error text:', error);
    }
  }
  else{
    document.getElementById('mood').placeholder = 'Give me a promt'
    const shakeAnim = [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0)" },
    ];
    const shakeTiming = {
      duration: 250,
      iterations: 2,
    };
    document.getElementById('mood').animate(shakeAnim,shakeTiming)
  }
});
async function getMusicForMood(mood, CLIENT_ID, CLIENTSECRET) {
    const clientId = CLIENT_ID;
    const clientSecret = CLIENTSECRET;
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const query = `${mood}`;
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    const albumCoverUrl = data.tracks.items[0].album.images[0].url
    //console.log(data)
    setAlbumCoverColor(albumCoverUrl)
    return data.tracks.items[0].uri;
}
async function playMusic(trackUri) {
    const element = document.getElementById('embed-iframe');
    const options = {
      uri: trackUri,
      theme: 'dark'
    };
  
    if (!window.embedController) {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        IFrameAPI.createController(element, options, (EmbedController) => {
          window.embedController = EmbedController;
          EmbedController.play()
          console.log(element)
        });
      };
    } else {
      window.embedController.loadUri(trackUri);
      window.embedController.play()
    }
}
function setAlbumCoverColor(albumCoverUrl) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = albumCoverUrl;
    img.onload = function() {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    };
  }
