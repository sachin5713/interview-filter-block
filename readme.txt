=== Interview Filter Block ===
Contributors:      Sachin Suthar
Tags:              block, posts, filter, gutenberg, custom-field, difficulty-level
Requires at least: 6.7
Tested up to:      6.7
Stable tag:        0.1.0
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A custom Gutenberg block that displays a filtered list of posts with difficulty level filtering. Perfect for showcasing posts with customizable difficulty levels.

== Description ==

**Interview Filter Block** is a powerful WordPress Gutenberg block that allows you to display a filtered list of posts based on a custom difficulty level field. Each post displays its title, excerpt, and difficulty level badge with beautiful styling.

**Key Features:**

* **Custom Difficulty Levels**: Assign difficulty levels (Beginner, Intermediate, Advanced) to posts via a custom meta box
* **AJAX-Based Filtering**: Fast, seamless filtering without page reloads using WordPress REST API
* **Client-Side Fallback**: Automatically falls back to client-side filtering if AJAX fails
* **Responsive Design**: Beautiful, modern grid layout that works on all devices
* **Alignment Support**: Supports wide and full-width alignments
* **No Post Limits**: Displays all posts without pagination limits
* **Editor Preview**: See filtered results in real-time within the Gutenberg editor
* **Clean Code**: Built following WordPress coding standards and best practices

**How It Works:**

1. Add the "Interview Filter Block" to any page or post
2. Assign difficulty levels to your posts using the custom meta box
3. Users can filter posts by difficulty level using the dropdown
4. Posts are filtered instantly via AJAX without page reloads


**Tools:**
1. Visual Code
2. ChatGPT
3. Cursor
4. Google


== Installation ==

**Method 1: Upload via WordPress Admin (Recommended)**

1. Download the plugin zip file
2. Log in to your WordPress admin dashboard
3. Navigate to **Plugins** → **Add New**
4. Click **Upload Plugin** at the top of the page
5. Choose the `interview-filter-block.zip` file
6. Click **Install Now**
7. After installation, click **Activate Plugin**

**Method 2: Manual Installation via FTP**

1. Extract the plugin zip file to your computer
2. Connect to your WordPress site via FTP
3. Navigate to `/wp-content/plugins/` directory
4. Upload the `interview-filter-block` folder
5. Log in to your WordPress admin dashboard
6. Navigate to **Plugins** → **Installed Plugins**
7. Find "Interview Filter Block" and click **Activate**

**Method 3: Install via WordPress Admin (Direct Upload)**

1. Download the plugin zip file (do NOT extract it)
2. Log in to your WordPress admin dashboard
3. Navigate to **Plugins** → **Add New**
4. Click **Upload Plugin** button
5. Click **Choose File** and select the zip file
6. Click **Install Now**
7. Click **Activate Plugin** after installation completes

**After Installation:**

1. The plugin is now active and ready to use
2. Go to any post editor to assign difficulty levels
3. Add the "Interview Filter Block" to any page or post using the block inserter
4. The block will appear in the **Widgets** category in the block inserter

**Important Testing Note:**

This plugin requires posts to be present in your WordPress site to function properly. The block displays and filters posts, so it will only work when there are posts available.

For testing purposes, you can:
* Create posts manually and assign difficulty levels to them
* Use a plugin like **FakePress** or similar dummy content generators to create multiple test posts
* Ensure you have at least a few posts with different difficulty levels (Beginner, Intermediate, Advanced) assigned for proper testing

Without posts in your site, the block will display "No posts found" message. Make sure to add dummy/test posts before testing the plugin functionality.

== Frequently Asked Questions ==

= How do I assign difficulty levels to posts? =

When editing any post, you'll see a new "Difficulty Level" meta box in the sidebar. Select a difficulty level from the dropdown (Beginner, Intermediate, or Advanced) and save the post. You can also select "Select Difficulty" to leave the post without a difficulty level.

= Can I filter posts by difficulty level in the editor? =

Yes! The block shows a live preview in the editor. You can select a difficulty level from the dropdown and see the filtered results immediately.

= Does the filter work on the front-end? =

Yes, the filter works perfectly on the front-end using AJAX. When users change the filter, posts are loaded dynamically without page reloads. If AJAX fails, it automatically falls back to client-side filtering.

= Can I show all posts without any limit? =

Yes! The block displays all posts by default with no pagination limits. All published posts are available for filtering.

= What happens if a post doesn't have a difficulty level assigned? =

Posts without a difficulty level will display "Not Set" with a gray badge. They will appear when "All Levels" is selected but won't appear in specific difficulty filters.

= Can I use this block multiple times on the same page? =

Yes, you can add multiple instances of the block on the same page. Each instance works independently with its own filter.

= Does the block support alignment options? =

Yes, the block supports wide and full-width alignments. You can find these options in the block toolbar when the block is selected.

= What if the AJAX filtering doesn't work? =

The plugin automatically detects AJAX failures and switches to client-side filtering. Your users won't see any errors, and filtering will continue to work seamlessly.

= Is the plugin compatible with caching plugins? =

Yes, the plugin disables query caching to ensure fresh data. However, if you're using page caching plugins, you may need to exclude pages containing this block from cache or clear cache after updating posts.

== Screenshots ==

1. Editor view showing the Interview Filter Block with filter dropdown set to "Beginner" displaying filtered posts
2. Front-end view showing all posts with "All Levels" filter selected, displaying posts with different difficulty badges (Beginner, Intermediate, Advanced)

== Changelog ==

= 0.1.0 =
* Initial release
* Custom difficulty level meta box for posts
* AJAX-based filtering with client-side fallback
* Editor preview with real-time filtering
* Responsive grid layout
* Alignment support (wide, full-width)
* No post limits - displays all posts
* Support for posts without difficulty level ("Not Set")
* Clean, optimized code following WordPress standards

== Upgrade Notice ==

= 0.1.0 =
Initial release of Interview Filter Block. Install and activate to start using the custom post filtering functionality.
