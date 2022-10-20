
/*
 All credits to https://github.com/jsososo/QQMusicApi
                https://github.com/xmcp/QRCD
*/

export function getConfig(cfg) {
    cfg.name = "QQ音乐";
    cfg.version = "0.1";
    cfg.author = "ohyeah";
}

export function getLyrics(meta, man) {

    evalLib("querystring/querystring.min.js");

    // query QRC lyrics
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_search_pc_lrc.fcg?';
    var data = {
        SONGNAME: meta.title,
        SINGERNAME: meta.artist,
        TYPE: 2,
        RANGE_MIN: 1,
        RANGE_MAX: 20
    };
    url += querystring.stringify(data);

    var headers = {};
    headers['Referer'] = 'https://y.qq.com';

    let settings = {
        method: 'get',
        url: url,
        headers: headers
    };

    var stageSongList = [];
    request(settings, (err, res, body) => {
        if (err || res.statusCode != 200) {
            return;
        }
        var xml_doc = mxml.loadString(body);
        var song_list = xml_doc.findElement('songinfo') || [];
        for (const song of song_list) {
            var id = song.getAttr('id');
            if (id == null) continue;
            var title = decodeURIComponent(getChildElementCDATA(song, 'name'));
            var artist = decodeURIComponent(getChildElementCDATA(song, 'singername'));
            var album = decodeURIComponent(getChildElementCDATA(song, 'albumname'));

            stageSongList.push({ id: id, title: title, artist: artist, album: album });
        }

    });

    // if (stageSongList.length > 0) {
    //     let lyricCount = queryLyricV3(meta, man, stageSongList);
    //     if (lyricCount == null || lyricCount < 1) {
    //         queryLyricV2(meta, man, stageSongList);
    //     }
    // }

    // obsolete
    queryLyric(meta, man, stageSongList);

}

function queryLyricV3(meta, man, songList) {
    let lyricCount = 0;
    let headers = {};
    headers['Referer'] = 'https://y.qq.com';
    headers['Host'] = 'u.y.qq.com';
    // notes: some params may not be required, I'm not tested.
    let postData = {
        comm: {
            _channelid: '0',
            _os_version: '6.2.9200-2',
            authst: '',
            ct: '19',
            cv: '1873',
            //guid: '30D1D7C616938DDB575AF16E56D44BD4',
            patch: '118',
            psrf_access_token_expiresAt: 0,
            psrf_qqaccess_token: '',
            psrf_qqopenid: '',
            psrf_qqunionid: '',
            tmeAppID: 'qqmusic',
            tmeLoginType: 2,
            uin: '0',
            wid: '0'
        },
        'music.musichallSong.PlayLyricInfo.GetPlayLyricInfo': {
            method: 'GetPlayLyricInfo',
            module: 'music.musichallSong.PlayLyricInfo'
        }
    };

    for (const song of songList) {
        let songID = song.id | 0;
        postData['music.musichallSong.PlayLyricInfo.GetPlayLyricInfo']['param'] = {
            albumName: btoa(song.album),
            crypt: 1,
            ct: 19,
            cv: 1873,
            interval: meta.duration | 0,
            lrc_t: 0,
            qrc: 1,
            qrc_t: 0,
            roma: 1,
            roma_t: 0,
            singerName: btoa(song.album),
            songID: songID,
            songName: btoa(song.artist),
            trans: 1,
            trans_t: 0,
            type: -1
        }

        let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?';
        let params = {
            pcachetime: new Date().getTime() | 0
        }
        url += querystring.stringify(params);
        let postDataString = JSON.stringify(postData);
        let settings = {
            method: 'post',
            url: url,
            headers: headers,
            body: postDataString
        };

        request(settings, (err, res, body) => {
            if (err || res.statusCode != 200) {
                return;
            }

            try {
                let obj = JSON.parse(body);
                if (obj['code'] != 0) {
                    return;
                }

                let lyricObjRoot = obj['music.musichallSong.PlayLyricInfo.GetPlayLyricInfo'];
                if (lyricObjRoot['code'] != 0) {
                    return;
                }

                let lyricObj = lyricObjRoot['data'];
                if (lyricObj['songID'] != songID) {
                    return;
                }

                var lyricMeta = man.createLyric();
                let lyricData = restoreQrc(lyricObj['lyric']);
                if (lyricData == null) {
                    return;
                }

                lyricMeta.title = song.title;
                lyricMeta.artist = song.artist;
                lyricMeta.album = song.album;
                lyricMeta.fileType = 'qrc';
                lyricMeta.lyricData = lyricData;
                man.addLyric(lyricMeta);
                ++lyricCount;

            } catch (e) {
                console.log("[qqmusic]request lyric exception: " + e.message);
            }
        });
    }

    return lyricCount;
}

function queryLyricV2(meta, man, songList) {
    let headers = {};
    headers['Referer'] = 'https://y.qq.com';

    for (const song of songList) {
        let url = 'https://c.y.qq.com/qqmusic/fcgi-bin/lyric_download.fcg?';
        let data = {
            version: '15',
            miniversion: '82',
            lrctype: '4',
            musicid: song.id,
        };
        url += querystring.stringify(data);

        let settings = {
            method: 'get',
            url: url,
            headers: headers
        };

        request(settings, (err, res, body) => {
            if (err || res.statusCode != 200) {
                return;
            }

            body = body.replace('<!--', '').replace('-->', '').replace(/<miniversion.*\/>/, '').trim();
            let xmlRoot = mxml.loadString(body);
            if (xmlRoot != null) {
                let lyricMeta = man.createLyric();
                let lyrics = xmlRoot.findElement('lyric') || [];
                for (const lyricEntry of lyrics) {
                    let content = getChildElementCDATA(lyricEntry, 'content');
                    if (content == null) continue;
                    let lyricData = restoreQrc(content);
                    if (lyricData == null) continue;
                    lyricMeta.title = song.title;
                    lyricMeta.artist = song.artist;
                    lyricMeta.album = song.album;
                    lyricMeta.lyricData = lyricData;
                    lyricMeta.fileType = 'qrc';
                    man.addLyric(lyricMeta);
                }
            }
        });
    }
}

function queryLyric(meta, man, songList) {
    let headers = {};
    headers['Referer'] = 'https://c.y.qq.com/';

    // qury LRC lyrics
    // https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songid=" +Song_id + "&tpl=yqq_song_detail
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?';

    let stageSongList = [];
    for (const result of songList) {
        let data = {
            format: 'json',
            tpl: 'yqq_song_detail',
            songid: result.id,
        };
        url += querystring.stringify(data);

        var settings = {
            method: 'get',
            url: url,
            headers: headers
        };

        request(settings, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                try {
                    var obj = JSON.parse(body);
                    for (const song of obj.data) {
                        if (song.id == result.id) {
                            result.id = song.mid;
                            stageSongList.push(result);
                        }
                    }
                } catch (e) {
                    console.log('qqmusic exception: ' + e.message);
                }
            }
        });
    }

    var lyricMeta = man.createLyric();
    for (const result of stageSongList) {
        url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?';
        let data = {
            songmid: result.id,
            pcachetime: new Date().getTime(),
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 1,
            format: 'json'
        };
        url += querystring.stringify(data);
        settings = {
            method: 'get',
            url: url,
            headers: headers
        };

        request(settings, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                lyricMeta.title = result.title;
                lyricMeta.artist = result.artist;
                lyricMeta.album = result.album;
                try {
                    var obj = JSON.parse(body);
                    var b64lyric = obj['lyric'] || '';
                    var b64tlyric = obj['trans'] || '';
                    var lyric = atob(b64lyric);
                    var tlyric = atob(b64tlyric);
                    if (tlyric != '') lyric += "\n" + tlyric;
                    lyricMeta.lyricText = lyric;
                    man.addLyric(lyricMeta);
                } catch (e) {
                    console.log('qqmusic parse lyric response exception: ' + e.message);
                }
            }
        });
    }
}

function getChildElementCDATA(node, name) {
    var child = node.findElement(name);
    if (child == null) {
        return '';
    }
    var schild = child.getFirstChild();
    if (schild == null) {
        return '';
    }
    return schild.getCDATA() || '';
}

function restoreQrc(hexText) {
    if (hexText.length % 2 != 0) return null;

    const sig = "[offset:0]\n";
    var arrBuf = new Uint8Array(hexText.length / 2 + sig.length);
    for (var i = 0; i < sig.length; ++i) {
        arrBuf[i] = sig.charCodeAt(i);
    }

    const offset = sig.length;
    for (var i = 0; i < hexText.length; i += 2) {
        arrBuf[offset + i / 2] = parseInt(hexText.slice(i, i + 2), 16);
    }

    return arrBuf.buffer;
}
