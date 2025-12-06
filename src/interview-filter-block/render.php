<?php
$selected_difficulty = isset( $attributes['selectedDifficulty'] ) ? sanitize_text_field( $attributes['selectedDifficulty'] ) : 'all';

$query_args = array(
	'post_type'      => 'post',
	'posts_per_page' => -1,
	'post_status'    => 'publish',
	'orderby'        => 'date',
	'order'          => 'DESC',
	'no_found_rows'  => false,
	'cache_results'  => false,
	'update_post_meta_cache' => false,
	'update_post_term_cache' => false,
);

$posts_query = new WP_Query( $query_args );

$all_difficulties = array( 'all' => __( 'All Levels', 'interview-filter-block' ) );
$difficulty_labels = array(
	'beginner'     => __( 'Beginner', 'interview-filter-block' ),
	'intermediate' => __( 'Intermediate', 'interview-filter-block' ),
	'advanced'     => __( 'Advanced', 'interview-filter-block' ),
);

$block_id = uniqid( 'filter-block-' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-create-block-interview-filter-block',
		'data-selected-difficulty' => esc_attr( $selected_difficulty ),
	)
);
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="interview-filter-block-header">
		<h3 class="interview-filter-block-title">
			<?php esc_html_e( 'Filtered Posts', 'interview-filter-block' ); ?>
		</h3>
		<div class="interview-filter-block-controls">
			<label for="difficulty-filter-<?php echo esc_attr( $block_id ); ?>" class="screen-reader-text">
				<?php esc_html_e( 'Filter by Difficulty Level', 'interview-filter-block' ); ?>
			</label>
			<select 
				id="difficulty-filter-<?php echo esc_attr( $block_id ); ?>"
				class="interview-filter-block-select" 
				data-block-id="<?php echo esc_attr( $block_id ); ?>"
			>
				<?php foreach ( array_merge( $all_difficulties, $difficulty_labels ) as $value => $label ) : ?>
					<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $selected_difficulty, $value ); ?>>
						<?php echo esc_html( $label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
	</div>

	<div class="interview-filter-block-posts" data-block-container>
		<?php if ( $posts_query->have_posts() ) : ?>
			<?php
			while ( $posts_query->have_posts() ) :
				$posts_query->the_post();
				$difficulty = get_post_meta( get_the_ID(), 'difficulty_level', true );
				$difficulty_label = ! empty( $difficulty ) && isset( $difficulty_labels[ $difficulty ] ) 
					? $difficulty_labels[ $difficulty ] 
					: __( 'Not Set', 'interview-filter-block' );
				$difficulty_class = ! empty( $difficulty ) ? $difficulty : 'not-set';
				?>
				<article class="interview-filter-block-post" data-difficulty="<?php echo esc_attr( $difficulty ?: '' ); ?>">
					<h4 class="interview-filter-block-post-title">
						<a href="<?php echo esc_url( get_permalink() ); ?>">
							<?php the_title(); ?>
						</a>
					</h4>
					<div class="interview-filter-block-post-meta">
						<span class="interview-filter-block-difficulty difficulty-<?php echo esc_attr( $difficulty_class ); ?>">
							<?php echo esc_html( $difficulty_label ); ?>
						</span>
					</div>
					<?php if ( has_excerpt() ) : ?>
						<div class="interview-filter-block-post-excerpt">
							<?php the_excerpt(); ?>
						</div>
					<?php endif; ?>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<div class="interview-filter-block-no-posts">
				<p><?php esc_html_e( 'No posts found.', 'interview-filter-block' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
	
	<div class="interview-filter-block-loading" style="display: none;">
		<div class="interview-filter-block-spinner"></div>
		<p><?php esc_html_e( 'Loading posts...', 'interview-filter-block' ); ?></p>
	</div>

	<?php wp_reset_postdata(); ?>
</div>
