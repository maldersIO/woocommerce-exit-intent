jQuery(document).ready(function($) {
    let discountApplied = false;

    $(document).on('mouseleave', function(e) {
        if (discountApplied || e.clientY > 10 || !$('.woocommerce-cart-form').length) return;

        $('body').append(`
            <div id="wceil-popup">
                <div class="wceil-inner">
                    <h3>Wait, Don't leave just yet!</h3>
                    <p>Take an additional 20% off of your first order, and get free shipping too!</p>
                    <button id="wceil-apply-discount">Click here to apply discount</button>
                    <span id="wceil-close">✖</span>
                </div>
            </div>
        `);
        $('#wceil-popup').fadeIn();

        discountApplied = true;
    });

    $('body').on('click', '#wceil-close', function() {
        $('#wceil-popup').fadeOut();
        $('body').prepend('<div id="wceil-top-bar">Act fast to get 20% off your first order and free shipping. Offer expires in: <span id=\"wceil-countdown\">60</span>s</div>');
        
        let timer = 60;
        let countdown = setInterval(() => {
            timer--;
            $('#wceil-countdown').text(timer);
            if (timer <= 0) {
                clearInterval(countdown);
                $('#wceil-top-bar').slideUp();
            }
        }, 1000);
    });

    $('body').on('click', '#wceil-apply-discount', function() {
        let url = wceilData.checkoutUrl + '?coupon_code=' + wceilData.couponCode;
        window.location.href = url;
    });
});
