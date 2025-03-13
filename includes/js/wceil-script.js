jQuery(document).ready(function($) {
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
        }
        return "";
    }

    let discountApplied = getCookie('wceil_popup_displayed') === 'yes';

    $(document).on('mouseleave', function(e) {
        if (discountApplied || e.clientY > 10 || !$('.woocommerce-cart-form').length) return;

        $('body').append('<div id="wceil-popup"><div class="wceil-inner"><h3>Wait, Don\'t leave just yet!</h3><p>Take an additional 20% off of your first order, and get free shipping too!</p><button id="wceil-apply-discount">Click here to apply discount</button><span id="wceil-close">✖</span></div></div>');
        $('#wceil-popup').fadeIn();

        setCookie('wceil_popup_displayed', 'yes', 30);
        discountApplied = true;
    });

    $('body').on('click', '#wceil-close', function() {
        $('#wceil-popup').fadeOut();
        $('body').prepend('<div id="wceil-top-bar">Act fast to get 20% off your first order and free shipping.<button id="wceil-apply-discount">Click here to apply discount</button> Offer expires in: <span id=\"wceil-countdown\">60</span>s</div> ');
        
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
        $.ajax({
            url: wc_cart_params.ajax_url,
            type: 'POST',
            data: {
                action: 'wceil_apply_coupon',
                coupon_code: wceilData.couponCode
            },
            success: function(response) {
                if(response.success) {
                    window.location.href = wceilData.checkoutUrl;
                } else {
                    alert(response.data);
                }
            }
        });
    });
});
