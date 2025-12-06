import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { SelectControl, Spinner, Placeholder } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
export default function Edit( { attributes, setAttributes } ) {
	const { postsPerPage, selectedDifficulty } = attributes;
	const [ posts, setPosts ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	const difficultyOptions = [
		{ label: __( 'All Levels', 'interview-filter-block' ), value: 'all' },
		{ label: __( 'Beginner', 'interview-filter-block' ), value: 'beginner' },
		{ label: __( 'Intermediate', 'interview-filter-block' ), value: 'intermediate' },
		{ label: __( 'Advanced', 'interview-filter-block' ), value: 'advanced' },
	];

	const difficultyLabels = {
		beginner: __( 'Beginner', 'interview-filter-block' ),
		intermediate: __( 'Intermediate', 'interview-filter-block' ),
		advanced: __( 'Advanced', 'interview-filter-block' ),
	};

	useEffect( () => {
		setLoading( true );
		setError( null );

		let apiUrl = `/wp/v2/posts?per_page=${ postsPerPage }&_embed`;
		
		if ( selectedDifficulty !== 'all' ) {
			apiUrl += `&difficulty_level=${ selectedDifficulty }`;
		}
		
		apiFetch( { path: apiUrl } )
			.then( ( fetchedPosts ) => {
				setPosts( fetchedPosts );
				setLoading( false );
			} )
			.catch( ( err ) => {
				setError( err.message );
				setLoading( false );
			} );
	}, [ postsPerPage, selectedDifficulty ] );

	const blockProps = useBlockProps( {
		className: 'wp-block-create-block-interview-filter-block',
	} );

	return (
		<div { ...blockProps }>
			<div className="interview-filter-block-header">
				<h3 className="interview-filter-block-title">
					{ __( 'Filtered Posts', 'interview-filter-block' ) }
				</h3>
				<SelectControl
					label={ __( 'Filter by Difficulty Level', 'interview-filter-block' ) }
					value={ selectedDifficulty }
					options={ difficultyOptions }
					onChange={ ( value ) => setAttributes( { selectedDifficulty: value } ) }
				/>
			</div>

			{ loading && (
				<div className="interview-filter-block-loading">
					<Spinner />
					<p>{ __( 'Loading posts...', 'interview-filter-block' ) }</p>
				</div>
			) }

			{ error && (
				<div className="interview-filter-block-error">
					<p>{ __( 'Error loading posts:', 'interview-filter-block' ) } { error }</p>
				</div>
			) }

			{ ! loading && ! error && posts.length === 0 && (
				<Placeholder>
					<p>{ __( 'No posts found. Please create some posts with difficulty levels assigned.', 'interview-filter-block' ) }</p>
				</Placeholder>
			) }

			{ ! loading && ! error && posts.length > 0 && (
				<div className="interview-filter-block-posts">
					{ posts.map( ( post ) => {
						const difficulty = post.meta?.difficulty_level || '';
						const difficultyClass = difficulty || 'not-set';
						const difficultyLabel = difficulty && difficultyLabels[ difficulty ] 
							? difficultyLabels[ difficulty ] 
							: __( 'Not Set', 'interview-filter-block' );

						return (
							<article key={ post.id } className="interview-filter-block-post">
								<h4 className="interview-filter-block-post-title">
									{ post.title?.rendered || __( '(No Title)', 'interview-filter-block' ) }
								</h4>
								<div className="interview-filter-block-post-meta">
									<span className={ `interview-filter-block-difficulty difficulty-${ difficultyClass }` }>
										{ difficultyLabel }
									</span>
								</div>
								{ post.excerpt?.rendered && (
									<div
										className="interview-filter-block-post-excerpt"
										dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } }
									/>
								) }
							</article>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
