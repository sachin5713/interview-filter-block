<?php
/**
 * Plugin Name:       Interview Filter Block
 * Description:       A custom Gutenberg block that displays a list of posts with filtering by difficulty level. Each post shows title, excerpt, and a custom difficulty level field.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            It's Me Sachin Suthar!
 * Author URI:        https://wpsachin.wordpress.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       interview-filter-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function create_block_interview_filter_block_block_init() {
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_interview_filter_block_block_init' );

function interview_filter_block_register_meta() {
	register_post_meta(
		'post',
		'difficulty_level',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => '__return_true',
		)
	);
}
add_action( 'init', 'interview_filter_block_register_meta' );

function interview_filter_block_add_meta_box() {
	add_meta_box(
		'difficulty_level_meta_box',
		__( 'Difficulty Level', 'interview-filter-block' ),
		'interview_filter_block_meta_box_callback',
		'post',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'interview_filter_block_add_meta_box' );

function interview_filter_block_meta_box_callback( $post ) {
	wp_nonce_field( 'interview_filter_block_save_meta', 'interview_filter_block_meta_nonce' );
	$difficulty_level = get_post_meta( $post->ID, 'difficulty_level', true );
	?>
	<label for="difficulty_level">
		<?php esc_html_e( 'Select Difficulty Level:', 'interview-filter-block' ); ?>
	</label>
	<select name="difficulty_level" id="difficulty_level" style="width: 100%; margin-top: 5px;">
		<option value="" <?php selected( $difficulty_level, '' ); ?>>
			<?php esc_html_e( 'Select Difficulty', 'interview-filter-block' ); ?>
		</option>
		<option value="beginner" <?php selected( $difficulty_level, 'beginner' ); ?>>
			<?php esc_html_e( 'Beginner', 'interview-filter-block' ); ?>
		</option>
		<option value="intermediate" <?php selected( $difficulty_level, 'intermediate' ); ?>>
			<?php esc_html_e( 'Intermediate', 'interview-filter-block' ); ?>
		</option>
		<option value="advanced" <?php selected( $difficulty_level, 'advanced' ); ?>>
			<?php esc_html_e( 'Advanced', 'interview-filter-block' ); ?>
		</option>
	</select>
	<?php
}

function interview_filter_block_save_meta( $post_id ) {
	if ( ! isset( $_POST['interview_filter_block_meta_nonce'] ) ) {
		return;
	}

	if ( ! wp_verify_nonce( $_POST['interview_filter_block_meta_nonce'], 'interview_filter_block_save_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['difficulty_level'] ) ) {
		$difficulty_level = sanitize_text_field( $_POST['difficulty_level'] );
		$allowed_values   = array( '', 'beginner', 'intermediate', 'advanced' );
		
		if ( in_array( $difficulty_level, $allowed_values, true ) ) {
			if ( empty( $difficulty_level ) ) {
				delete_post_meta( $post_id, 'difficulty_level' );
			} else {
				update_post_meta( $post_id, 'difficulty_level', $difficulty_level );
			}
		}
	}
}
add_action( 'save_post', 'interview_filter_block_save_meta' );

function interview_filter_block_rest_api_filter( $args, $request ) {
	$difficulty = $request->get_param( 'difficulty_level' );
	if ( $difficulty && in_array( $difficulty, array( 'beginner', 'intermediate', 'advanced' ), true ) ) {
		$args['meta_query'] = array(
			array(
				'key'     => 'difficulty_level',
				'value'   => $difficulty,
				'compare' => '=',
			),
		);
	}
	return $args;
}
add_filter( 'rest_post_query', 'interview_filter_block_rest_api_filter', 10, 2 );

function interview_filter_block_clear_cache_on_post_update( $post_id ) {
	clean_post_cache( $post_id );
	wp_cache_delete( $post_id, 'post_meta' );
	delete_transient( 'interview_filter_block_posts_' . $post_id );
	wp_cache_flush_group( 'posts' );
}
add_action( 'save_post', 'interview_filter_block_clear_cache_on_post_update', 20 );
add_action( 'delete_post', 'interview_filter_block_clear_cache_on_post_update', 20 );
add_action( 'wp_insert_post', 'interview_filter_block_clear_cache_on_post_update', 20 );
