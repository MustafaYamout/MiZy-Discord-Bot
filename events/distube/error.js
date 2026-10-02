const { EmbedBuilder } = require("discord.js");

const AVERRORS = {
    INDA: "Invalid data found when processing input",
    "EOF ": "End of file (the stream ended early)",
    2: "No such file or directory (ENOENT)",
    11: "Resource temporarily unavailable (EAGAIN)",
    22: "Invalid argument (EINVAL)",
    32: "Broken pipe — the consumer went away (EPIPE)",
    104: "Connection reset by the media server (ECONNRESET)",
    110: "Connection timed out (ETIMEDOUT)",
};

const decodeFFmpegCode = (code) => {
    if (!Number.isInteger(code) || code === 0) return null;

    const known = AVERRORS[code];
    if (known) return known;

    const tag = (-(code | 0)) >>> 0;
    const chars = [tag & 0xff, (tag >>> 8) & 0xff, (tag >>> 16) & 0xff, (tag >>> 24) & 0xff]
        .map((byte) => String.fromCharCode(byte))
        .join("");

    if (/^[A-Z0-9]{4}$/.test(chars)) {
        return AVERRORS[chars] || `${chars} (unrecognised FFmpeg error)`;
    }

    return null;
};

const explain = (err) => {
    if (!err || err.code !== "FFMPEG_EXITED") return String(err);

    const match = /code (\d+)/u.exec(err.message || "");
    if (!match) return String(err);

    const raw = Number(match[1]);
    const decoded = decodeFFmpegCode(raw);
    const hex = `0x${(raw >>> 0).toString(16).toUpperCase()}`;

    return decoded
        ? `ffmpeg exited with code ${raw} (${hex}): ${decoded}`
        : `ffmpeg exited with code ${raw} (${hex})`;
};

module.exports = {
    name: "error",
    async execute(err, queue, song, client) {
        const message = explain(err);
        console.error(`[DisTube] >> ${message}`);

        if (!queue) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`❌ | An error occurred!`)
            .setDescription(`Error: ${message}`)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
