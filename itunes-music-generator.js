/*!
 * https://himakan.net/tool/apple-music-generator
 * MIT license
 */
function searchResult(r) {
  $.each( r.results, function( key, result ) {
    $( '#results' ).append( img.build_result( result ) );
    img.result_list.push( result );
  });
}

var img = {};
( function() {

  'use strict';

  var
    appleToolUrl     = 'https://tools.applemusic.com/embed/v1/song/',
    appleToolCountry = '?country=jp',
    searchUrl        = 'https://itunes.apple.com/search',
    limit            = 30,
    offset           = 0,
    results_ele      = $( '#results' ),
    affiliate_param  = '&at=',
    attribute_artist = 'artistTerm',
    attribute_album  = 'albumTerm',
    attribute_song   = 'songTerm',
    params = {
      term:      '',
      media:     'music',
      entity:    'song',
      attribute: '',
      country:   'jp',
      lang:      'ja_jp',
      offset:    offset,
      limit:     limit,
      callback:  'searchResult'
    };

  img.result_list = [];
  img.attribute = '';

  function searchArtists() {
    var script = document.createElement('script');
    script.setAttribute('src', searchUrl + '?' + $.param(params));
    document.head.appendChild(script);
    document.head.removeChild(script);
  }

  function set_params_attribute( attribute ) {
    params.attribute = img.attribute = attribute
  }

  img.set_params_offset = function( value ) {
    params.offset = offset = value
  };

  function reset_result() {
    clear_result_list();
    set_params_term( '' );
    reset_params_offset();
    remove_results();
  }

  function clear_result_list() {
    img.result_list = [];
  }

  function set_params_term( value ) {
    params.term = value
  }

  function reset_params_offset() {
    params.offset = offset = 0
  }

  function remove_results() {
    results_ele.children().remove();
  }

  img.build_result = function ( result ) {
    return $( '<div>', {
      'data-song-no': img.result_list.length
    }).append(
      $( '<img>', {
        src: result.artworkUrl100
      })
    ).append(
      $( '<p>', {
        text: 'アーティスト名:' + result.artistName
      })
    ).append(
      $( '<p>', {
        text: 'アルバム名:' + result.collectionName
      })
    ).append(
      $( '<p>', {
        text: '曲名:' + result.trackName
      })
    ).click( function( event ) {
      set_generator( event.currentTarget );
    })
  };

  function set_generator( div_ele ) {
    var
      generator = $( '#generator' ),
      preview = $( '#preview' ),
      result = img.result_list[ div_ele.dataset.songNo ],
      sample = html_generator( result );

    generator.children().remove();
    generator
      .append(
        $( '<textarea>', {
          id: 'generator_text',
          text: sample.prop('outerHTML').replace(/&amp;/g,'&')
        })
      );
    preview.children().remove();
    preview.append( sample );

    $( '#copy' ).css( 'display', 'inline' ).text( 'コピー' );
  }

  function html_generator( result ) {
    return $( '<iframe>',{
      src: src_generator( appleToolUrl + result.trackId + appleToolCountry ),
      frameborder: 0
    }).attr('height', '110px').attr('width', '100%');
  }

  function src_generator( url ) {
    var
      token = get_affiliate_token();

    $.cookie( 'affiliate_token', token );
    if ( '' === token ) {
      return url
    } else {
      return url + affiliate_param + token
    }
  }

  function get_affiliate_token() {
    var
      token = $( '#affiliate_token' ).val();
    $.cookie( 'affiliate_token', token );
    return token
  }

  $( '#artist' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      search( attribute_artist, e.target.value );
      return false;
    }
  });

  $( '#album' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      search( attribute_album, e.target.value );
      return false;
    }
  });

  $( '#song' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      search( attribute_song, e.target.value );
      return false;
    }
  });

  function search( attribute, team ) {
    reset_result();
    set_params_attribute( attribute );
    set_params_term( team );
    $( '#more' ).css( 'display', 'inline' );
    searchArtists();
  }

  $( '#more' ).click( function() {
    set_params_attribute( img.attribute );
    searchArtists();
  });

  $( '#copy' ).click( function() {
    $( '#generator_text' ).select();
    document.execCommand( 'copy' );
    $( '#copy' ).text( 'コピーしました！' );
  });

  $( '#affiliate_token' ).val( $.cookie( 'affiliate_token' ) );
})();
