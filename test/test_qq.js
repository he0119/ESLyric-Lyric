var bracket = [
	"「", //左括号
	"」"  //右括号
];

function lrc_merge(olrc, tlrc) {
	olrc = olrc.split("\n");
	tlrc = tlrc.split("\n");
	if (olrc[5].indexOf("[kana:") == 0) {
		olrc.splice(5,5);
		tlrc.splice(5,5);
	}
	var o_f = olrc[0].indexOf("[by:");
	if (o_f == 0) {
		var o_b = olrc[0].indexOf("]");
		var o = (o_f != -1 && o_b != -1) ? olrc[0].substring(4, o_b) : "";

		var t_f = tlrc[0].indexOf("[by:");
		var t_b = tlrc[0].indexOf("]");
		var t = (t_f != -1 && t_b != -1) ? olrc[0].substring(4, o_b) : "";
		olrc[0] = "[by:" + o + "/译:" + t + "]";
	}
	for (var ii = 5,set=0,counter; ii < 10; ii++) {//玄学取set...
		counter = olrc[ii].indexOf("]");
		counter = (counter == -1) ? 9 : counter;
		set+=counter;
	}
	set = Math.round(set/5);
	var i = 0;
	var l = tlrc.length;
	var lrc = [];
	for (var k in olrc) {
		var a = olrc[k].substring(1, set);
		while (i < l) {
			var j = 0;
			var tf = 0;
			while (j < 5) {
				if (i + j >= l) break;
				var b = tlrc[i + j].substring(1, set);
				if (a == b) {
					tf = 1;
					i += j;
					break;
				}
				j++;
			}
			if (tf == 0) {
				lrc[k] = olrc[k];
				break;
			}
			var c = tlrc[i].substr(set + 1);
			if (c) {
				lrc[k] = olrc[k] + bracket[0] + tlrc[i].substr(set + 1) + bracket[1];
				i++;
				break;
			} else {
				lrc[k] = olrc[k];
				break;
			}
		}
	}
	return lrc.join("\n");
}

olrc = `[ti:Sing My Pleasure]
[ar:八木海莉]
[al:Sing My Pleasure]
[by:]
[offset:0]
[kana:1や1ぎ1かい1り1し1ただ1の1な1つみ1きょく1こう1さき1さとる1ひかり1め1ざ1う1きずな1ほそ1いと1むす1し1めい1め1ざ1こう1ふく1つむ1ほこ1き1おく1せ1かい1かん1しゃ1う1ちゅう1はな1たば1しゅく1めい1うん1めい1かがや1たの1わら1もの1まも1よろこ1あこが1あこが1つよ1な1ごえ1うた1き1じ1かん1なみだ1あず1あめ1ふ1やみ1よ1あかつき1まわ1は1ぐるま1ねむ1いのち1か1いた1きず1ぬ1た1あ1かわ1ねが1もと1ぜん1ぶ1わたし1つく1しゅく1めい1うん1めい1すす1せつ1な1すこ1たび1い1す1ば1さん1か1ひび1いや1て1ふ1も1つ1とき1しず1め1と1ゆめ1あず1しん1か1しあわ1え1がお2きょうじ1きずな1やく1そく1は1かがや1たの1わら1もの1まも1よろこ1しゅく1めい1うん1めい1な1ごえ1うた1き1しず1め1と1ゆめ1あず]
[00:00.11]Sing My Pleasure - 八木海莉
[00:00.50]词：只野菜摘
[00:00.59]曲：神前暁（MONACA)
[00:00.61](As you like my pleasure)
[00:16.77]光を目指して生まれてきた
[00:21.74]絆 細い糸に結ばれて
[00:27.59]使命で目覚めた幸福から
[00:32.67]紡ぐ いくつもの誇らしい 記憶
[00:40.49]あなたのために
[00:43.13]この世界へ感謝と
[00:45.83]宇宙いっぱいの 花束を
[00:51.94]宿命さえ 運命さえも
[00:55.40]どうぞ輝かせて
[00:57.93]楽しんだり笑う者を守れる喜び
[01:02.85]憧れてる 憧れている
[01:06.36]もっと強くなれる
[01:08.88]泣き声さえ 歌のように
[01:11.67]聴かせてあげたい
[01:14.14]このめくるめく時間に
[01:19.24]涙まで 預けてほしい
[01:36.48]雨降る闇夜の暁にも
[01:41.21]回る 歯車は眠らない
[01:46.96]命に代えても痛みはない
[01:52.12]傷に濡れながら立ち上がる乾く
[02:00.02]あなたが願う
[02:02.85]求めるもの全部が
[02:05.27]私を作る そばにある
[02:11.64]宿命でも 運命でも
[02:14.90]どうぞ進んでいて
[02:17.45]さようならの 刹那まで
[02:20.11]健やかな旅を
[02:22.35]生きることを 素晴らしいって
[02:25.83]讃歌響いてても
[02:28.56]癒しの手に 触れもせず
[02:31.34]燃え尽きる時は
[02:33.72]そっと静かに目を閉じて
[02:38.69]その夢を 預けてほしい
[02:56.57](Ah yeah 進化して as you like my pleasure)
[03:31.48]どうぞ いつでも幸せを
[03:37.13]ずっと笑顔でありますように
[03:42.70]どんな矜持も 絆の約束を
[03:52.70]果たすために
[03:57.05]いま
[03:58.17]あなたと あなたでいる
[04:00.50]どうぞ輝かせて
[04:03.03]楽しんだり笑う者を守れる喜び
[04:07.93]宿命でも 運命でも
[04:11.36]もっともっともっと
[04:14.02]泣き声さえ 歌のように
[04:16.80]聴かせてあげたい
[04:19.26]そっと静かに目を閉じて
[04:24.25]その夢を 預けてほしい`

tlrc = `[ti:Sing My Pleasure]
[ar:八木海莉]
[al:Sing My Pleasure]
[by:]
[offset:0]
[kana:1や1ぎ1かい1り1し1ただ1の1な1つみ1きょく1こう1さき1さとる1ひかり1め1ざ1う1きずな1ほそ1いと1むす1し1めい1め1ざ1こう1ふく1つむ1ほこ1き1おく1せ1かい1かん1しゃ1う1ちゅう1はな1たば1しゅく1めい1うん1めい1かがや1たの1わら1もの1まも1よろこ1あこが1あこが1つよ1な1ごえ1うた1き1じ1かん1なみだ1あず1あめ1ふ1やみ1よ1あかつき1まわ1は1ぐるま1ねむ1いのち1か1いた1きず1ぬ1た1あ1かわ1ねが1もと1ぜん1ぶ1わたし1つく1しゅく1めい1うん1めい1すす1せつ1な1すこ1たび1い1す1ば1さん1か1ひび1いや1て1ふ1も1つ1とき1しず1め1と1ゆめ1あず1しん1か1しあわ1え1がお2きょうじ1きずな1やく1そく1は1かがや1たの1わら1もの1まも1よろこ1しゅく1めい1うん1めい1な1ごえ1うた1き1しず1め1と1ゆめ1あず]
[00:00.11]//
[00:00.50]//
[00:00.59]//
[00:00.61]（一切如您所愿 这是我的荣幸）
[00:16.77]追寻着光明而诞生于这世上
[00:21.74]被名为“羁绊”的丝线牵系在了一起
[00:27.59]由使命而苏醒的幸福
[00:32.67]编织出细数不尽的令人自豪的回忆
[00:40.49]为了你
[00:43.13]我要为这个世界献上感谢
[00:45.83]以及充满整片宇宙的花束
[00:51.94]无论宿命 还是命运
[00:55.40]恳求继续散发光辉吧
[00:57.93]守护人们的快乐与欢笑 那正是我的欢喜
[01:02.85]内心怀有着憧憬 也正是因为这份憧憬
[01:06.36]才能使我更加强大
[01:08.88]但愿哭声 也能如同我的歌一般
[01:11.67]让您聆听
[01:14.14]令人眼花缭乱的时间中
[01:19.24]希望泪水也能留存于此
[01:36.48]暴雨如注的长夜破晓之时
[01:41.21]命运的齿轮依旧不曾停歇
[01:46.96]哪怕付出生命的代价也不痛不痒
[01:52.12]任雨水打湿我的伤口 我也会再度振作 待其风干
[02:00.02]您所祈愿的
[02:02.85]您所渴求的所有一切
[02:05.27]造就了此刻伴您身旁的我
[02:11.64]无论宿命 还是命运
[02:14.90]恳请继续向前迈进吧
[02:17.45]直至道别的刹那到来
[02:20.11]愿您的旅途平安顺遂
[02:22.35]“活着是一件美好的事情”
[02:25.83]即使如此咏唱的赞歌响起
[02:28.56]终究无法触及那治愈的掌心
[02:31.34]直至燃为灰烬的那一刻到来
[02:33.72]请静静地闭上双眼吧
[02:38.69]把您的梦想托付于我
[02:56.57](我将不断进化 一切如您所愿 这是我的荣幸）
[03:31.48]恳请您 无论何时都要幸福
[03:37.13]愿不变的笑容常伴您左右
[03:42.70]所有的矜持 都是为了实现
[03:52.70]那份羁绊的约定
[03:57.05]此刻
[03:58.17]您依旧是独一无二的您
[04:00.50]恳请继续绽放光辉
[04:03.03]守护人们的快乐与欢笑 那正是我的欢喜
[04:07.93]无论宿命 还是命运
[04:11.36]我都渴望更多 渴望更多
[04:14.02]但愿哭声 也能如同我的歌一般
[04:16.80]让您聆听
[04:19.26]请静静地闭上双眼吧
[04:24.25]把您的梦想托付于我`

console.log(lrc_merge(olrc, tlrc))