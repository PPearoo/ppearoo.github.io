const subs = document.querySelector(".footer-subs")
const bar = document.querySelector(".bar-accent")
const subsbar = document.querySelector(".subs-bar")
const goal = 4000;

(async () => {
    const api = await fetch("https://api.socialcounts.org/youtube-live-subscriber-count/UCsBw4YIB40Zpiw4yVIqxtbg")
    const data = await api.json();
    subs.innerText = `${data['API_sub']}/${goal}`
    const barW = (data['API_sub'] * 100) / goal + "%"
    bar.style.width = barW
})();
