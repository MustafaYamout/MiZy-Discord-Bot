const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");

module.exports = (client) => {

    client.distube = new DisTube(client, {
        emitNewSongOnly: false,

        ffmpeg: {
            args: {
                global: {
                    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                    referer: "https://www.youtube.com/",
                },
            },
        },

        plugins: [
            new SoundCloudPlugin(),
            new SpotifyPlugin(),
            new YtDlpPlugin(),
        ],
    });

};
