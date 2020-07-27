let savedUrls;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("shortten-action").addEventListener("click", shortten);
    savedUrls = open();
    loadUrls();
});

function shortten(e) {
    e.preventDefault();
    const urlInput = document.getElementById("url-input");

    let urlValue = urlInput.value;

    if(urlValue != "") {
        console.log(urlValue);
        getShortUrl(urlValue);
    } else {
        console.log("Idiota, tienes que escribir algo!");
    }
}

function save() {
    console.log("Saving urls...");
    console.log(savedUrls);
    localStorage.setItem("urls", JSON.stringify(savedUrls));
}

function open() {
    urls = localStorage.getItem("urls");
    return urls != null ? JSON.parse(urls) : [];
}


function getShortUrl(fullUrl) {
    let postData= {
        "url": fullUrl
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            data = JSON.parse(this.response);
            shortUrl = "https://rel.ink/" + data['hashid'];
            let urlData = {url: fullUrl, shortUrl: shortUrl};

            savedUrls.pushIfNotExist(urlData, function (e) {
                return e.url === urlData.url && e.shortUrl === urlData.shortUrl; 
            });

            loadUrls();
            save();
        }
    };
    xhttp.open("POST", "https://rel.ink/api/links/", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(postData));
}

function loadUrls() {
    let wrapper = document.getElementById("urls-wrapper");
    wrapper.innerHTML = "";

    savedUrls.forEach(element => {
        let resultContainer = document.createElement("div");
        let urlParagraph = document.createElement("p");
        let shortUrlPara = document.createElement("p");
        let copyButton = document.createElement("button");

        urlParagraph.appendChild(document.createTextNode(element.url));
        urlParagraph.className = "url";

        shortUrlPara.appendChild(document.createTextNode(element.shortUrl));
        shortUrlPara.className = "short-url";

        copyButton.innerText = "Copy";
        copyButton.classList = "copy-button btn btn-smaller";
        copyButton.dataset.shortUrl = element.shortUrl;
        copyButton.onclick = copyShortUrl;

        resultContainer.className = "result";
        resultContainer.appendChild(urlParagraph);
        resultContainer.appendChild(shortUrlPara);
        resultContainer.appendChild(copyButton);

        wrapper.appendChild(resultContainer);
    });
}

function copyShortUrl(data) {
    let shortUrl = data.currentTarget.dataset.shortUrl;
    data.currentTarget.classList.add("copied");
    data.currentTarget.innerHTML = "Copied!";

    const el = document.createElement('textarea');
    el.value = shortUrl;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};