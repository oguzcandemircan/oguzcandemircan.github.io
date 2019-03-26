document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        /**
         * Loader
         */
        setTimeout(() => {
            var loader = document.querySelector(".loader-background");
            if(loader) {
                loader.remove();
                console.log('loader removed.');
            }
        }, 500);
        /**
         * Active class
         */
        var nav = document.getElementsByClassName('sub-nav')[0];
        var cond = nav.getElementsByClassName('active').length;
        if(cond == 0) {
            var el = document.getElementById('makaleler').setAttribute('class', 'active');
        }
    }
};

/**
 * Calculate article read time
 * @param {string\id} source 
 * @param {string\id} target 
 */
function readTime(source, target){
    var text = document.getElementById(source).innerText;
    var minutes = Math.floor(text.split(' ').length / 150 )
    if(minutes === 0) {
        minutes = 1
    }
    document.getElementById(target).innerHTML = '<i class="far fa-clock"></i> ' + minutes + " dk okuma süresi"
}