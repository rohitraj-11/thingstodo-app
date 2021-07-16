window.onload = function () {
    const element = document.getElementById('patch-form');
    console.log(element)
    console.log('sd')
    if(element) {
        element.addEventListener('submit', event => {
            event.preventDefault();
            const url = window.location.href
            //const form = new FormData(document.getElementById('patch-form'));
            console.log(url)
            var description = document.getElementById('description').value;
            var completed = document.getElementById('completed').value;
            let _data = {
                description,
                completed
            }
            console.log(_data)
            fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
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
    const element2 = document.getElementById('delete-form');
    if(element2) {
        element2.addEventListener('submit', event => {
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