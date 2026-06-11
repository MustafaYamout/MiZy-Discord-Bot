const { DisTube } = require("distube");
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { SpotifyPlugin } = require("@distube/spotify")
// const { YtDlpPlugin } = require("@distube/yt-dlp")

module.exports = (client) => {

    client.distube = new DisTube(client, {
        leaveOnEmpty: true,
        emptyCooldown: 30,
        leaveOnFinish: false,
        emitNewSongOnly: true,
    //    youtubeDL: false,
    //    updateYouTubeDL: true,
        plugins: [new SoundCloudPlugin(), new SpotifyPlugin()]
    });
    
};