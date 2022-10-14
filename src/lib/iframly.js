function youtubeParser(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([A-Za-z0-9_-]{11}).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
}

function constructYoutubeEmbedURL(url) {
    const youtubeVideoID = youtubeParser(url.toString());
    // If we can't find the videoID, return the empty string which stops the iframe from loading.
    return youtubeVideoID
        ? `https://www.youtube.com/embed/${youtubeVideoID}`
        : '';
}

function mousaiParser(url) {
    const regExp = /^.*mousai\.stream\/((album|playlist|track)\/[0-9]+(\/[a-z0-9-_,#%]+){1,2}?)(?=(\/embed|$))/;
    const match = url.match(regExp);
    return match ? match[1] : false;
}

function constructMousaiEmbedURL(url) {
    const mousaiPath = mousaiParser(url.toString());
    return typeof mousaiPath === 'string'
        ? `https://mousai.stream/${mousaiPath
            .split('/')
            .map((s) => encodeURIComponent(s))
            .join('/')}/embed`
        : '';
}

// Vimeo video URLs are simple -- anything after the last "/" in the url indicates the videoID.
function vimeoParser(url) {
    const regExp = /^.*((player\.)?vimeo\.com\/)(video\/)?(\d{0,15}).*/;
    const match = url.match(regExp);
    return match && match[4] ? match[4] : false;
}

function constructVimeoEmbedURL(url) {
    const vimeoVideoID = vimeoParser(url.toString());
    return vimeoVideoID ? `https://player.vimeo.com/video/${vimeoVideoID}` : '';
}

function giphyParser(url) {
    const regExp = /^.*((media\.)?giphy\.com\/(gifs|media|embed|clips)\/)([A-Za-z0-9]+-)*([A-Za-z0-9]{0,20}).*/;
    const match = url.match(regExp);
    return match && match[5] ? match[5] : false;
}

function constructGiphyEmbedURL(url) {
    const giphyId = giphyParser(url.toString());
    return giphyId ? `https://giphy.com/embed/${giphyId}` : '';
}

function spotifyParser(url) {
    const regExp = /^.*(open\.)?spotify\.com\/(((embed\/)?(track|artist|playlist|album))|((embed-podcast\/)?(episode|show)))\/([A-Za-z0-9]{0,25}).*/;
    const match = url.match(regExp);
    if (match && match[9]) {
        if (match[8]) {
        return `embed-podcast/${match[8]}/${match[9]}`;
        }
        if (match[5]) {
        return `embed/${match[5]}/${match[9]}`;
        }
    }
    return false;
}

function constructSpotifyEmbedURL(url) {
    const spotifyEmbedSuffix = spotifyParser(url.toString());
    return spotifyEmbedSuffix
        ? `https://open.spotify.com/${spotifyEmbedSuffix}`
        : '';
}

function soundCloudParser(url) {
    const regExp = /^.*(soundcloud.com\/([a-z0-9-_]+)\/(sets\/)?([a-z0-9-_]+)).*/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : false;
}

function constructSoundCloudEmbedURL(url) {
    const soundCloudURL = soundCloudParser(url.toString());
    return soundCloudURL
        ? `https://w.soundcloud.com/player/?url=https://${soundCloudURL}?hide_related=true&show_comments=false`
        : '';
}

function twitchParser(url) {
    const regExp = /^.*((player\.|clips\.)?twitch\.tv)\/(videos\/(\d{8,12})|\?video=(\d{8,12})|\?channel=([A-Za-z0-9_]{1,30})|collections\/([A-Za-z0-9]{10,20})|\?collection=([A-Za-z0-9]{10,20}(&video=\d{8,12})?)|embed\?clip=([A-Za-z0-9_-]{1,80})|([A-Za-z0-9_]{1,30}(\/clip\/([A-Za-z0-9_-]{1,80}))?)).*/;
    const match = url.match(regExp);
    if (match && match[3]) {
        // https://www.twitch.tv/videos/1234567890
        if (match[3].startsWith('videos') && match[4]) {
        return `player.twitch.tv/?video=${match[4]}`;
        }
        // https://player.twitch.tv/?video=1234567890&parent=www.example.com
        if (match[3].startsWith('?video=') && match[5]) {
        return `player.twitch.tv/?video=${match[5]}`;
        }
        // https://player.twitch.tv/?channel=xxxyyy123&parent=www.example.com
        if (match[3].startsWith('?channel=') && match[6]) {
        return `player.twitch.tv/?channel=${match[6]}`;
        }
        // https://www.twitch.tv/xxxyyy123
        if (
        match[3] &&
        match[11] &&
        match[3] === match[11] &&
        !match[12] &&
        !match[13]
        ) {
        return `player.twitch.tv/?channel=${match[11]}`;
        }
        // https://www.twitch.tv/xxyy_1234m/clip/AbCD123JMn-rrMMSj1239G7
        if (match[12] && match[13]) {
        return `clips.twitch.tv/embed?clip=${match[13]}`;
        }
        // https://clips.twitch.tv/embed?clip=AbCD123JMn-rrMMSj1239G7&parent=www.example.com
        if (match[10]) {
        return `clips.twitch.tv/embed?clip=${match[10]}`;
        }
        // https://www.twitch.tv/collections/11jaabbcc2yM989x?filter=collections
        if (match[7]) {
        return `player.twitch.tv/?collection=${match[7]}`;
        }
        // https://player.twitch.tv/?collection=11jaabbcc2yM989x&video=1234567890&parent=www.example.com
        if (match[8]) {
        return `player.twitch.tv/?collection=${match[8]}`;
        }
    }
    return false;
}

function constructTwitchEmbedURL(url) {
    const twitchParsed = twitchParser(url.toString());
    return twitchParsed ? `https://${twitchParsed}` : '';
}

function extractTikTokVideoID(fullTikTokURL) {
    const regExp = /^.*((tiktok\.com\/)(v\/)|(@[A-Za-z0-9_-]{2,24}\/video\/)|(embed\/v2\/))(\d{0,30}).*/;
    const match = fullTikTokURL.match(regExp);
    return match && match[6] ? match[6] : false;
}

function tiktokParser(url) {
    let tiktokURL;
    try {
        tiktokURL = new URL(url);
    } catch (e) {
        return false;
    }
    if (tiktokURL.hostname === 'vm.tiktok.com') {
        const regExp = /^.*(vm\.tiktok\.com\/)([A-Za-z0-9]{6,12}).*/;
        const match = url.match(regExp);
        if (!match || !match[2]) {
        return false;
        }
        return getFullTikTokURL(match[2]).then((res) => {
            return extractTikTokVideoID(res);
        });
    } else {
        return extractTikTokVideoID(url);
    }
}

async function getFullTikTokURL(id) {
    const request = {
        'TikTokShortVideoID': id
    }
    const { data } = await axios.post(`https://node.deso.org/api/v0/get-full-tiktok-url`, request)
    console.log(data);
}

function constructTikTokEmbedURL(url) {
    const res = tiktokParser(url.toString())
    return res ? `https://www.tiktok.com/embed/v2/${res}` : '';
}

export function getEmbedURL(embedURL){
    if (!embedURL) {
        return null;
    }
    let url;
    try {
        url = new URL(embedURL);
    } catch (e) {
        // If the embed video URL doesn't start with http(s), try the url with that as a prefix.
        if (!embedURL.startsWith('https://') && !embedURL.startsWith('http://')) {
            return getEmbedURL(`https://${embedURL}`);
        }
        return null;
    }
    if (isYoutubeFromURL(url)) {
        return constructYoutubeEmbedURL(url);
    }
    if (isMousaiFromURL(url)) {
        return constructMousaiEmbedURL(url);
    }
    if (isVimeoFromURL(url)) {
        return constructVimeoEmbedURL(url);
    }
    if (isTiktokFromURL(url)) {
        return constructTikTokEmbedURL(url);
    }
    if (isGiphyFromURL(url)) {
        return constructGiphyEmbedURL(url);
    }
    if (isSpotifyFromURL(url)) {
        return constructSpotifyEmbedURL(url);
    }
    if (isSoundCloudFromURL(url)) {
        return constructSoundCloudEmbedURL(url);
    }
    if (isTwitchFromURL(url)) {
        return constructTwitchEmbedURL(url).pipe(
        map((embedURL) =>
            embedURL
            ? embedURL + `&autoplay=false&parent=${location.hostname}`
            : ''
        )
        );
    }
    return null;
}

function isVimeoLink(link) {
    try {
        const url = new URL(link);
        return isVimeoFromURL(url);
    } catch (e) {
        return false;
    }
}

function isVimeoFromURL(url) {
    const pattern = /\bvimeo\.com$/;
    return pattern.test(url.hostname);
}

function isYoutubeLink(link) {
    try {
        const url = new URL(link);
        return isYoutubeFromURL(url);
    } catch (e) {
        return false;
    }
}

function isYoutubeFromURL(url) {
    const patterns = [/\byoutube\.com$/, /\byoutu\.be$/];
    return patterns.some((p) => p.test(url.hostname));
}

function isMousaiLink(link) {
    try {
        const url = new URL(link);
        return isMousaiFromURL(url);
    } catch (e) {
        return false;
    }
}

function isMousaiFromURL(url) {
    const pattern = /\bmousai\.stream$/;
    return pattern.test(url.hostname);
}

function isTikTokLink(link) {
    try {
        const url = new URL(link);
        return isTiktokFromURL(url);
    } catch (e) {
        return false;
    }
}

function isTiktokFromURL(url) {
    const pattern = /\btiktok\.com$/;
    return pattern.test(url.hostname);
}

function isGiphyLink(link) {
    try {
        const url = new URL(link);
        return isGiphyFromURL(url);
    } catch (e) {
        return false;
    }
}

function isGiphyFromURL(url) {
    const pattern = /\bgiphy\.com$/;
    return pattern.test(url.hostname);
}

function isSpotifyLink(link) {
    try {
        const url = new URL(link);
        return isSpotifyFromURL(url);
    } catch (e) {
        return false;
    }
}

function isSpotifyFromURL(url) {
    const pattern = /\bspotify\.com$/;
    return pattern.test(url.hostname);
}

function isSoundCloudLink(link) {
    try {
        const url = new URL(link);
        return isSoundCloudFromURL(url);
    } catch (e) {
        return false;
    }
}

function isSoundCloudFromURL(url) {
    const pattern = /\bsoundcloud\.com$/;
    return pattern.test(url.hostname);
}

function isTwitchLink(link) {
    try {
        const url = new URL(link);
        return isTwitchFromURL(url);
    } catch (e) {
        return false;
    }
}

function isTwitchFromURL(url) {
    const pattern = /\btwitch\.tv$/;
    return pattern.test(url.hostname);
}

function isValidVimeoEmbedURL(link) {
    const regExp = /(https:\/\/player\.vimeo\.com\/video\/(\d{0,15}))$/;
    return !!link.match(regExp);
}

function isValidYoutubeEmbedURL(link) {
    const regExp = /(https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11})$/;
    return !!link.match(regExp);
}

function isValidMousaiEmbedURL(link) {
    const regExp = /https:\/\/mousai\.stream\/((album|playlist|track)\/[0-9]+(\/[a-z0-9-_,%]+){1,2}?)\/embed$/;
    return !!link.match(regExp);
}

function isValidTiktokEmbedURL(link) {
    const regExp = /(https:\/\/www\.tiktok\.com\/embed\/v2\/(\d{0,30}))$/;
    return !!link.match(regExp);
}

function isValidGiphyEmbedURL(link) {
    const regExp = /(https:\/\/giphy\.com\/embed\/([A-Za-z0-9]{0,20}))$/;
    return !!link.match(regExp);
}

function isValidSpotifyEmbedURL(link) {
    const regExp = /(https:\/\/open.spotify.com\/(((embed\/)(track|artist|playlist|album))|((embed-podcast\/)(episode|show)))\/[A-Za-z0-9]{0,25})$/;
    return !!link.match(regExp);
}

function isValidSoundCloudEmbedURL(link) {
    const regExp = /(https:\/\/w\.soundcloud\.com\/player\/\?url=https:\/\/soundcloud.com\/([a-z0-9-_]+)\/(sets\/)?([a-z0-9-_]+))\?hide_related=true&show_comments=false$/;
    return !!link.match(regExp);
}

function isValidTwitchEmbedURL(link) {
    const regExp = /(https:\/\/(player|clips)\.twitch\.tv\/(\?channel=[A-Za-z0-9_]{1,30}|\?video=\d{8,12}|embed\?clip=[A-Za-z0-9_-]{1,80}|\?collection=[A-Za-z0-9]{10,20}(&video=\d{8,12})?))$/;
    return !!link.match(regExp);
}

function isValidTwitchEmbedURLWithParent(link) {
    const regExp = new RegExp(
        `https:\/\/(player|clips)\.twitch\.tv\/(\\?channel\=[A-Za-z0-9_]{1,30}|\\?video=\\d{8,12}|embed\\?clip=[A-Za-z0-9_-]{1,80}|\\?collection=[A-Za-z0-9]{10,20}(\&video=\\d{8,12})\?)\&autoplay=false\&parent=${location.hostname}$`
    );
    return !!link.match(regExp);
}

export function isValidEmbedURL(link) {
    if (link) {
        return (
            isValidVimeoEmbedURL(link) ||
            isValidYoutubeEmbedURL(link) ||
            isValidMousaiEmbedURL(link) ||
            isValidTiktokEmbedURL(link) ||
            isValidGiphyEmbedURL(link) ||
            isValidSpotifyEmbedURL(link) ||
            isValidSoundCloudEmbedURL(link) ||
            isValidTwitchEmbedURL(link) ||
            isValidTwitchEmbedURLWithParent(link)
        );
    }
    return false;
}

export function getEmbedWidth(link) {
    return isValidTiktokEmbedURL(link) ? '325px' : '';
}

export function getEmbedHeight(link) {
    if (isValidTiktokEmbedURL(link)) {
      return 740;
    }
    if (isValidSpotifyEmbedURL(link)) {
      return link.indexOf('embed-podcast') > -1 ? 232 : 380;
    }
    if (isValidSoundCloudEmbedURL(link)) {
      return link.indexOf('/sets/') > -1 ? 350 : 180;
    }
    if (isValidMousaiEmbedURL(link)) {
      return 165;
    }
    return 315;
}