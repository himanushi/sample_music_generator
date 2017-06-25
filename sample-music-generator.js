;(function() {

  'use strict';

  var
    searchUrl   = 'https://itunes.apple.com/search',
    limit       = 5,
    offset      = 0,
    results     = [],
    results_ele = $( '#results' ),
    params = {
      term:      '',
      media:     'music',
      entity:    'song',
      attribute: 'songTerm',
      country:   'jp',
      lang:      'ja_jp',
      offset:    offset,
      limit:     limit
    };

  function searchArtists() {
    $.getJSON(
      searchUrl,
      params,
      function( data, status ) {

        $.each( data.results, function( key, result ) {
          console.dir(result);
          results_ele.append( build_result( result ) );
          results.push( result );
        });

        set_params_offset( offset + limit );
      }
    )
  }

  function reset_result() {
    clear_results();
    set_params_term( '' );
    reset_params_offset();
    remove_results();
  }

  function set_params_offset( value ) {
    params.offset = offset = value
  }

  function remove_results() {
    results_ele.children().remove();
  }

  function clear_results() {
    results = [];
  }

  function set_params_term( value ) {
    params.term = value
  }

  function reset_params_offset() {
    params.offset = offset = 0
  }

  function build_result( result ) {
    return $('<div>', {
      'data-song-no': results.length
    }).append(
      $('<img>', {
        src: result.artworkUrl100
      })
    ).append(
      $('<p>', {
        text: result.artistName
      })
    ).append(
      $('<p>', {
        text: result.collectionName
      })
    ).append(
      $('<p>', {
        text: result.trackName
      })
    )
  }

  $( '#term' ).change( function( event ) {
    if('' !== event.target.value){
      reset_result();
      set_params_term( event.target.value );
      $( '#more' ).css( 'display', 'inline' );
      searchArtists();
    }
  });

  $( '#more' ).click( function() {
    searchArtists();
  });
})();
