document.addEventListener( 'DOMContentLoaded', function () {
    new Splide( '.splide', {
        rewind: true,
        'cover'      : true,
        'height'     : 285,
        perPage      : 3,
        perMove      : 1,
        focus        : 'center',
        gap          : '10px',
        pagination   : false,
        lazyLoad     : 'nearby',
        breakpoints  : {
            768: {
                'height'    : 350,
                perPage     : 2,
                perMove     : 1,
                fixedWidth  : '24rem',
            }
        }
    } ).mount();
} );