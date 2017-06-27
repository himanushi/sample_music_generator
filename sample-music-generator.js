var smg = {}
;( function() {

  'use strict';

  var
    searchUrl       = 'https://itunes.apple.com/search',
    limit           = 5,
    offset          = 0,
    results_ele     = $( '#results' ),
    affiliate_param = '&at=',
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

  smg.result_list = [];

  function searchArtists() {
    $.getJSON(
      searchUrl,
      params,
      function( data, status ) {

        $.each( data.results, function( key, result ) {
          results_ele.append( build_result( result ) );
          smg.result_list.push( result );
        });

        set_params_offset( offset + limit );
      }
    )
  }

  function reset_result() {
    clear_result_list();
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

  function clear_result_list() {
    smg.result_list = [];
  }

  function set_params_term( value ) {
    params.term = value
  }

  function reset_params_offset() {
    params.offset = offset = 0
  }

  function build_result( result ) {
    return $( '<div>', {
      'data-song-no': smg.result_list.length
    }).append(
      $( '<img>', {
        src: result.artworkUrl100
      })
    ).append(
      $( '<p>', {
        text: result.artistName
      })
    ).append(
      $( '<p>', {
        text: result.collectionName
      })
    ).append(
      $( '<p>', {
        text: result.trackName
      })
    ).click( function( event ) {
      set_generator( event.currentTarget );
    })
  }

  function set_generator( div_ele ) {
    var
      generator = $( '#generator' ),
      preview = $( '#preview' ),
      result = smg.result_list[ div_ele.dataset.songNo ],
      sample = sample_generator( result );

    generator.children().remove();
    generator
      .append(
        $( '<textarea>', {
          id: 'generator_text',
          text: sample.prop( 'outerHTML' )
        })
      );

    preview.children().remove();
    preview.append( sample );

    $( '#copy' ).css( 'display', 'inline' ).text( 'コピー' );
  }

  function sample_generator( result ) {
    return $( '<div>',{
      class: 'itunes_sample_player'
    }).append(
      $( '<img>', {
        src: result.artworkUrl100
      })
    ).append(
      $( '<div>', {
        class: 'itunes_sample_info'
      }).append(
        $( '<p>', {
          class: 'itunes_sample_title'
        }).append(
          $( '<a>', {
            href: href_generator( result.trackViewUrl ),
            target: 'blank',
            text: result.trackName
          })
        )
      ).append(
        $( '<p>', {
          class: 'itunes_sample_artist',
          text: result.artistName
        })
      ).append(
        $( '<p>', {
          class: 'itunes_sample_date',
          text:  date_generator( result.releaseDate )
        })
      )
    ).append(
      $( '<audio>', {
        src: result.previewUrl,
        controls: true
      })
    );
  }

  function href_generator( url ) {
    var
      token = $( '#affiliate_token' ).val();

    if ( '' === token ) {
      return url
    } else {
      return url + affiliate_param + token
    }
  }

  function date_generator( str_date ) {
    var
      d = new Date( str_date );

    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
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

  $( '#copy' ).click( function() {
    $( '#generator_text' ).select();
    document.execCommand('copy');
    $( '#copy' ).text( 'コピーしました！' );
  });

})();
