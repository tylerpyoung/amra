<?php

class Footer_Navwalker extends Walker_Nav_menu {

	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat("\t", $depth);
		$output .= "\n$indent\n";
 	}

	function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ){
		// $sidemenu_image = get_field('background_image', $item);

		// $indent = ( $depth ) ? str_repeat("\t",8) : '';

		// if ($depth == 1) {
		// 	$depth = $depth + 10;
		// } else {
		// 	$depth = $depth + 8;
		// }
		$indent = str_repeat("\t", $depth );

		$link_attributes = ' itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement"';
		$class_names = $value = '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;

		// $classes[] = ($args->walker->has_children) ? 'dropdown' : '';
		// $classes[] = ($item->current || $item->current_item_ancestor) ? 'active' : '';
		$classes[] = 'menu-item-' . $item->ID;
		if( $depth && $args->walker->has_children ){
			$classes[] = 'dropdown-submenu';
		}

		$class_names =  join(' ', apply_filters('nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = '';

		$id = apply_filters('nav_menu_item_id', 'menu-item-'.$item->ID, $item, $args);
		$id = strlen( $id ) ? ' id="' . esc_attr( $id ) . '"' : '';

		// $output .= $indent . '<li' . $id . $value . $class_names . $link_attributes . '>';

		$attributes = ! empty( $item->attr_title ) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
		$attributes .= ! empty( $item->target ) ? ' target="' . esc_attr($item->target) . '"' : '';
		$attributes .= ! empty( $item->xfn ) ? ' hrel="' . esc_attr($item->xfn) . '"' : '';
		if ($depth == 0) {
			$output .= $indent . "<div class='footer-link-col'>\n" . $indent . "<h4>";
			$attributes .= ! empty( $item->url ) ? ' href="' . esc_attr($item->url) . '"' : '';
		} else {
			// $output .= $indent . '<li' . $id . $value . $class_names . $link_attributes . '>';
			$attributes .= ! empty( $item->url ) ? ' href="' . esc_attr($item->url) . '"' : '';
			$attributes .=  $id . $value . $class_names . $link_attributes;
		}

		// $attributes .= ( $args->walker->has_children ) ? ' data-bg-img="' . $sidemenu_image . '"' : '';

		$item_output = $args->before;
		$item_output .= $depth > 0 ? '<li><a' . $attributes . '>' : '';
		// $item_output .= '<a' . $attributes . '>';
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= ( $args->walker->has_children ) ? '</h4>
			<ul class="list-unstyled">' : ($depth > 0 ?  '</a></li>' : '</h4></div>');
		$item_output .= $args->after;
		$output .= apply_filters ( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );

	}

	function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= "";
	}

	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$depth = $depth + 8;
	    $indent = str_repeat("\t", $depth );
	    $output .= "\t\t$indent</ul>\n$indent</div>";
	}

}
