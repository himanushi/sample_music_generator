/*!
 * https://himakan.net/tool/sample-music-generator
 * MIT license
 */
var smg = {}
;( function() {

  'use strict';

  var
    searchUrl       = 'https://itunes.apple.com/search',
    limit           = 20,
    offset          = 0,
    results_ele     = $( '#results' ),
    affiliate_param = '&at=',
    attribute_song  = 'songTerm',
    attribute_album = 'albumTerm',
    params = {
      term:      '',
      media:     'music',
      entity:    'song',
      attribute: '',
      country:   'jp',
      lang:      'ja_jp',
      offset:    offset,
      limit:     limit
    };

  smg.result_list = [];
  smg.attribute = '';

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

  function set_params_attribute( attribute ) {
    params.attribute = smg.attribute = attribute
  }

  function set_params_offset( value ) {
    params.offset = offset = value
  }

  function reset_result() {
    clear_result_list();
    set_params_term( '' );
    reset_params_offset();
    remove_results();
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

  function remove_results() {
    results_ele.children().remove();
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
  }

  function set_generator( div_ele ) {
    var
      generator = $( '#generator' ),
      preview = $( '#preview' ),
      result = smg.result_list[ div_ele.dataset.songNo ],
      id = id_generator(),
      sample = html_generator( result, id );

    generator.children().remove();
    generator
      .append(
        $( '<textarea>', {
          id: 'generator_text',
          text: script_generator( result, id )
        })
      );

    preview.children().remove();
    preview.append( sample );

    $( '#copy' ).css( 'display', 'inline' ).text( 'コピー' );
  }

  /**
   return "<div id=\"" + id + "\"><script>" +
   "(function(d){" +
      "function cE(e){return d.createElement(e)}" +
      "link=cE('a');" +
      "link.href='" + href_generator( result.trackViewUrl ) + "';" +
      "link.target='_blank';" +
      "link.innerText='" + escape_html( result.trackName ) + "';" +
      "title=cE('p');" +
      "title.className='itunes_sample_title';" +
      "title.appendChild(link);" +
      "artist=cE('p');" +
      "artist.className='itunes_sample_artist';" +
      "artist.innerText='" + escape_html( result.artistName ) + "';" +
      "date=cE('p');" +
      "date.className='itunes_sample_date';" +
      "date.innerText='" + date_generator( result.releaseDate ) + "';" +
      "info=cE('div');" +
      "artwork=cE('img');" +
      "artwork.src='" + result.artworkUrl100 + "';" +
      "info.className='itunes_sample_info';" +
      "info.appendChild(title);" +
      "info.appendChild(artist);" +
      "info.appendChild(date);" +
      "audio=cE('audio');" +
      "audio.src='" + result.previewUrl + "';" +
      "audio.controls=true;" +
      "player=cE('div');" +
      "player.className='itunes_sample_player';" +
      "player.appendChild(artwork);" +
      "player.appendChild(info);" +
      "player.appendChild(audio);" +
      "div=d.getElementById('" + id + "');" +
      "div.children[0].remove();" +
      "div.appendChild(player);})(document);" +
   "</script></div>"
   */
  function script_generator( result, id ) {
    return "<div id=\"" + id + "\"><script>" +
      "(function(d){" +
      "function cE(e){return d.createElement(e)}" +
      "l=cE('a');" +
      "l.href='" + href_generator( result.trackViewUrl ) + "';" +
      "l.target='_blank';" +
      "l.innerText='" + escape_html( result.trackName ) + "';" +
      "t=cE('p');" +
      "t.className='itunes_sample_title';" +
      "t.appendChild(l);" +
      "a=cE('p');" +
      "a.className='itunes_sample_artist';" +
      "a.innerText='" + escape_html( result.artistName ) + "';" +
      "e=cE('p');" +
      "e.className='itunes_sample_date';" +
      "e.innerText='" + date_generator( result.releaseDate ) + "';" +
      "i=cE('div');" +
      "w=cE('img');" +
      "w.src='" + result.artworkUrl100 + "';" +
      "i.className='itunes_sample_info';" +
      "i.appendChild(t);" +
      "i.appendChild(a);" +
      "i.appendChild(e);" +
      "u=cE('audio');" +
      "u.src='" + result.previewUrl + "';" +
      "u.controls=true;" +
      "p=cE('div');" +
      "p.className='itunes_sample_player';" +
      "p.appendChild(w);" +
      "p.appendChild(i);" +
      "p.appendChild(u);" +
      "v=d.getElementById('" + id + "');" +
      "v.children[0].remove();" +
      "v.appendChild(p);})(document);" +
      "</script></div>"
  }

  function escape_html( html ) {
    if(typeof html !== 'string') {
      return html;
    }
    return html.replace(/['`<>]/g, function(match) {
      return {
        "'": '\\\'',
        '`': '\\`',
        '<': '\\<',
        '>': '\\>'
      }[match]
    });
  }

  function html_generator( result, id ) {
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

  function id_generator() {
    var id = '', i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i === 8 || i === 12 || i === 16 || i === 20) {
        id += "-"
      }
      id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return id;
  }

  $( '#song' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      change_event( attribute_song );
      return false;
    }
  });

  $( '#album' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      change_event( attribute_album );
      return false;
    }
  });

  function change_event( attribute ) {
    if('' !== event.target.value){
      reset_result();
      set_params_attribute( attribute );
      set_params_term( event.target.value );
      $( '#more' ).css( 'display', 'inline' );
      searchArtists();
    }
  }

  $( '#more' ).click( function() {
    set_params_attribute( smg.attribute );
    searchArtists();
  });

  $( '#copy' ).click( function() {
    $( '#generator_text' ).select();
    document.execCommand( 'copy' );
    $( '#copy' ).text( 'コピーしました！' );
  });

})();
