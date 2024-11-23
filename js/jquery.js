console.log("現在時刻を表示");
// 現在時刻を表示する関数
function updateTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // HTMLのid="time"の要素に現在時刻を表示
    $("#time").text(date.toLocaleTimeString());
    // 時間データをオブジェクトとして返す
    return { hour: hours, minute: minutes, second: seconds };
}

// 集合時間の取得
$(function () {
    $("#daytime").datetimepicker();
});
// 集合時間のエラーを解消させる
// $('#daytime').datetimepicker({
//     format: 'YYYY-MM-DD',
//     language: 'ja'
// }).on('dp.error', function(e) {
//     $(e.target).val('');
// });


// 入力情報の取得と表示
$("#button1").click(function () {
    // テキストボックスのvalue値を取得
    const MtgTime = $("#daytime").val();
    const hours2 = $("#pre_hours").val();
    const minutes2 = $("#pre_mins").val();  
    // spanタグに値を設定
    $("#span1").text(MtgTime);
    $("#span2").text(hours2);
    $("#span3").text(minutes2);      

    console.log("準備・移動の時間をdiffに取得");
    // diffに準備・移動時間の分数を入力
    let diff = hours2 * (60 * 60 * 1000) + minutes2 * (60 * 1000);
    console.log(diff);
    // 文字列からDateオブジェクトに変換
    const MtgTime_new = new Date(MtgTime);
    // diffの時間を追加
    const PlusTime = new Date(MtgTime_new.getTime() - diff);
    // 結果を表示
    $("#start_time").text(PlusTime.toLocaleTimeString());
// }); 

// 出る時間になったことをお知らせする
// アラームチェックを1秒ごとに行う
// $(function () {    
    setInterval(function () {
        const current = updateTime(); // 現在時刻を取得
        console.log(current);
        // 出発時間と現在時刻が一致するか確認
        if (current.hour === PlusTime.getHours() && current.minute === PlusTime.getMinutes()) {
            $("#alarm_text").text("準備を開始する時間になりました！");
            console.log(`現在の時刻が${PlusTime.getHours()}時${PlusTime.getMinutes()}分になりました。`);
            
            // 一度だけアラームを発動させるため、setIntervalをクリア
            clearInterval(this);

            // 1分後にアラームメッセージを消す
            setTimeout(endAlarm, 60000);
        }
    }, 1000);
});
    // アラームメッセージを非表示にする関数
    function endAlarm() {
        console.log("1分経ったので表示が消えます。");
        $("#alarm_text").text("");
    }

    setInterval(updateTime, 1000);
