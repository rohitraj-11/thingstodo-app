window.onload = function () {
    const element = document.getElementById('delete-form');
    if(element) {
        element.addEventListener('submit', event => {
            event.preventDefault();
            const url = window.location.href
            console.log(url)
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => {
                // HTTP 301 response
                // HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
                console.log('Is it working')
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(function(err) {
                console.info(err + " url: " + url);
            });
        });
    }
}