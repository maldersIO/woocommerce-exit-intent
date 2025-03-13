<?php
/**
* Plugin Name: WooCommerce Exit Intent Lite
* Plugin URI: https://github.com/maldersIO/woocommerce-exit-intent
* Description: Convert more first time users into sales, increasing conversion rates, customer base, and gross sales metrics. 
* Version: 1.0.0
* Author: maldersIO
* Author URI: https://malders.io/
* License: GNU v3.0
*/

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

/* WooCommerce Exit Intent Lite Start */
//______________________________________________________________________________
if (!defined('ABSPATH')) exit;

// Create Coupon on Activation
register_activation_hook(__FILE__, 'wceil_create_coupon');
function wceil_create_coupon() {
    if (!class_exists('WC_Coupon')) return;

    $coupon_code = 'wceil-20-off';
    $coupon = new WC_Coupon($coupon_code);

    if (!$coupon->get_id()) {
        $coupon = new WC_Coupon();
        $coupon->set_code($coupon_code);
        $coupon->set_description('WooCommerce Exit Intent lite');
        $coupon->set_discount_type('percent');
        $coupon->set_amount(20);
        $coupon->set_individual_use(true);
        $coupon->set_usage_limit_per_user(1);
        $coupon->set_free_shipping(true);
        $coupon->save();
    }
}

// Enqueue Scripts
add_action('wp_enqueue_scripts', 'wceil_enqueue_scripts');
function wceil_enqueue_scripts() {
    if (!is_cart() && !is_checkout()) return;

    wp_enqueue_script('wceil-script', plugins_url('includes/js/wceil-script.js', __FILE__), ['jquery'], '1.0', true);
    wp_localize_script('wceil-script', 'wceilData', [
        'couponCode' => 'wceil-20-off',
        'checkoutUrl' => wc_get_checkout_url()
    ]);

    wp_enqueue_style('wceil-style', plugins_url('wceil-style.css', __FILE__));
}

// Countdown Timer Ajax
add_action('wp_ajax_nopriv_wceil_get_timer', 'wceil_get_timer');
add_action('wp_ajax_wceil_get_timer', 'wceil_get_timer');
function wceil_get_timer() {
    echo json_encode(['time' => 60]);
    wp_die();
}

//______________________________________________________________________________
// All About Updates

//  Begin Version Control | Auto Update Checker
require 'plugin-update-checker/plugin-update-checker.php';
$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
// ***IMPORTANT*** Update this path to New Github Repository Master Branch Path
	'https://github.com/FreshyMichael/woocommerce-exit-intent',
	__FILE__,
// ***IMPORTANT*** Update this to New Repository Master Branch Path
	'woocommerce-exit-intent'
);
//Enable Releases
$myUpdateChecker->getVcsApi()->enableReleaseAssets();
//Optional: If you're using a private repository, specify the access token like this:
//
//
//Future Update Note: Comment in these sections and add token and branch information once private git established
//
//
//$myUpdateChecker->setAuthentication('your-token-here');
//Optional: Set the branch that contains the stable release.
//$myUpdateChecker->setBranch('stable-branch-name');

//______________________________________________________________________________
/* WooCommerce Exit Intent Lite End */
?>
