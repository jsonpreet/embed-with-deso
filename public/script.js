window.addEventListener("message", function (e) {
    if ("desoembed" != e.data.t) return;
    const t = [...document.getElementsByTagName("iframe")].find(t => t.src == e.data.o); t.width = e.data.w, t.height = e.data.i
}),
window.addEventListener("DOMContentLoaded", function () {
    console.log('hello')
    document.querySelectorAll("#deso-embed[data-post-hash]").forEach(function (e) {
        // const t = document.createElement("iframe");
        // t.src = "http://localhost:3000/embed/" + e.dataset.postHash, t.width = e.dataset.width, t.height = e.dataset.height, t.frameBorder = "0", t.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", t.allowFullscreen = !0, e.appendChild(t)
       e.outerHTML = '<iframe src="http://localhost:3000/embed/' + e.getAttribute("data-post-hash") + '" frameBorder="0" />'
    })
})

