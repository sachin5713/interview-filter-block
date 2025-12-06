<?php
// This file is generated. Do not modify it manually.
return array(
	'interview-filter-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/interview-filter-block',
		'version' => '0.1.0',
		'title' => 'Interview Filter Block',
		'category' => 'widgets',
		'icon' => 'filter',
		'description' => 'Display a list of posts with filtering by difficulty level.',
		'example' => array(
			
		),
		'attributes' => array(
			'postsPerPage' => array(
				'type' => 'number',
				'default' => 10
			),
			'selectedDifficulty' => array(
				'type' => 'string',
				'default' => 'all'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'alignWide' => true
		),
		'textdomain' => 'interview-filter-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
