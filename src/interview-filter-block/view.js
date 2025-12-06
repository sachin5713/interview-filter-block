( function() {
	'use strict';

	const difficultyLabels = {
		beginner: 'Beginner',
		intermediate: 'Intermediate',
		advanced: 'Advanced',
	};

	function getRestApiUrl() {
		if ( typeof wpApiSettings !== 'undefined' && wpApiSettings.root ) {
			return wpApiSettings.root;
		}
		return '/wp-json/wp/v2/';
	}
	function fetchPosts( difficulty, block, callback ) {
		const restBase = getRestApiUrl();
		let apiUrl = restBase + 'posts?per_page=-1&_embed';
		
		if ( difficulty && difficulty !== 'all' ) {
			apiUrl += '&difficulty_level=' + encodeURIComponent( difficulty );
		}

		const loadingElement = block.querySelector( '.interview-filter-block-loading' );
		const postsContainer = block.querySelector( '.interview-filter-block-posts' );
		
		if ( loadingElement ) {
			loadingElement.style.display = 'flex';
		}
		if ( postsContainer ) {
			postsContainer.style.opacity = '0.5';
		}

		fetch( apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
		} )
			.then( ( response ) => {
				if ( ! response.ok ) {
					return response.json().then( ( errorData ) => {
						throw new Error( errorData.message || 'Network response was not ok' );
					} ).catch( () => {
						throw new Error( 'Network response was not ok (Status: ' + response.status + ')' );
					} );
				}
				return response.json();
			} )
			.then( ( posts ) => {
				if ( loadingElement ) {
					loadingElement.style.display = 'none';
				}
				if ( postsContainer ) {
					postsContainer.style.opacity = '1';
				}
				callback( null, posts );
			} )
			.catch( ( error ) => {
				console.error( 'AJAX Error fetching posts:', error );
				if ( loadingElement ) {
					loadingElement.style.display = 'none';
				}
				if ( postsContainer ) {
					postsContainer.style.opacity = '1';
				}
				callback( error, null );
			} );
	}

	function escapeHtml( text ) {
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}
	function renderPosts( posts, container ) {
		if ( ! container ) {
			return;
		}

		if ( posts.length === 0 ) {
			container.innerHTML = '<div class="interview-filter-block-no-posts"><p>No posts found for the selected difficulty level.</p></div>';
			return;
		}

		let html = '';
		posts.forEach( ( post ) => {
			let difficulty = '';
			if ( post.meta && post.meta.difficulty_level ) {
				difficulty = post.meta.difficulty_level;
			} else if ( post.difficulty_level ) {
				difficulty = post.difficulty_level;
			}
			
			const difficultyClass = difficulty || 'not-set';
			const difficultyLabel = difficulty && difficultyLabels[ difficulty ] 
				? difficultyLabels[ difficulty ] 
				: 'Not Set';
			const excerpt = post.excerpt && post.excerpt.rendered ? post.excerpt.rendered : '';
			const title = post.title && post.title.rendered ? post.title.rendered : '(No Title)';
			const link = post.link || '#';

			const escapedTitle = escapeHtml( title );
			const escapedDifficultyLabel = escapeHtml( difficultyLabel );
			const escapedLink = escapeHtml( link );

			html += `
				<article class="interview-filter-block-post" data-difficulty="${ escapeHtml( difficulty ) }">
					<h4 class="interview-filter-block-post-title">
						<a href="${ escapedLink }">${ escapedTitle }</a>
					</h4>
					<div class="interview-filter-block-post-meta">
						<span class="interview-filter-block-difficulty difficulty-${ escapeHtml( difficultyClass ) }">
							${ escapedDifficultyLabel }
						</span>
					</div>
					${ excerpt ? `<div class="interview-filter-block-post-excerpt">${ excerpt }</div>` : '' }
				</article>
			`;
		} );

		container.innerHTML = html;
	}

	function filterPostsClientSide( difficulty, postsContainer ) {
		if ( ! postsContainer ) {
			return;
		}

		const posts = postsContainer.querySelectorAll( '.interview-filter-block-post' );
		let visibleCount = 0;

		posts.forEach( ( post ) => {
			const postDifficulty = post.getAttribute( 'data-difficulty' ) || '';
			if ( difficulty === 'all' || postDifficulty === difficulty ) {
				post.style.display = '';
				visibleCount++;
			} else {
				post.style.display = 'none';
			}
		} );

		let noPostsMessage = postsContainer.parentElement.querySelector( '.interview-filter-block-no-posts' );
		if ( visibleCount === 0 ) {
			if ( ! noPostsMessage ) {
				noPostsMessage = document.createElement( 'div' );
				noPostsMessage.className = 'interview-filter-block-no-posts';
				noPostsMessage.innerHTML = '<p>No posts found for the selected difficulty level.</p>';
				postsContainer.parentElement.insertBefore( noPostsMessage, postsContainer.nextSibling );
			} else {
				noPostsMessage.style.display = 'block';
			}
		} else if ( noPostsMessage ) {
			noPostsMessage.style.display = 'none';
		}
	}

	function initFilters() {
		const filterBlocks = document.querySelectorAll( '.wp-block-create-block-interview-filter-block' );

		filterBlocks.forEach( ( block ) => {
			const select = block.querySelector( '.interview-filter-block-select' );
			const postsContainer = block.querySelector( '.interview-filter-block-posts' );

			if ( ! select || ! postsContainer ) {
				return;
			}

			select.value = 'all';
			block.setAttribute( 'data-selected-difficulty', 'all' );

			const existingPosts = postsContainer.querySelectorAll( '.interview-filter-block-post' );
			existingPosts.forEach( ( post ) => {
				post.style.display = '';
			} );

			const existingNoPosts = block.querySelector( '.interview-filter-block-no-posts' );
			if ( existingNoPosts ) {
				existingNoPosts.remove();
			}

			let ajaxWorking = true;

			select.addEventListener( 'change', function() {
				const selectedValue = this.value;

				if ( ajaxWorking ) {
					fetchPosts( selectedValue, block, function( error, posts ) {
						if ( error ) {
							console.warn( 'AJAX failed, falling back to client-side filtering:', error );
							ajaxWorking = false;
							filterPostsClientSide( selectedValue, postsContainer );
							return;
						}

						if ( postsContainer ) {
							renderPosts( posts, postsContainer );
						}
					} );
				} else {
					filterPostsClientSide( selectedValue, postsContainer );
				}
			} );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initFilters );
	} else {
		initFilters();
	}

	if ( typeof jQuery !== 'undefined' ) {
		jQuery( document ).on( 'ajaxComplete', initFilters );
	}
} )();
