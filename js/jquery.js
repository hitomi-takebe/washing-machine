// 現在時刻を表示する関数
function updateTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    $("#time").text(date.toLocaleTimeString()); // HTMLのid="time"の要素に現在時刻を表示
    return { hour: hours, minute: minutes, second: seconds }; // 時間データをオブジェクトとして返す
}

// 集合時間の取得
$(function () {
    $("#daytime").datetimepicker(); // datetimepicker 初期化
});

// グローバル変数として定義
let PlusTime = null;

// 入力情報の取得と表示
function finishTime() {
    // テキストボックスの値を取得
    const MtgTime = $("#daytime").val();
    const hours2 = parseInt($("#pre_hours").val(), 10) || 0; // 数値型に変換（デフォルトは0）
    const minutes2 = parseInt($("#pre_mins").val(), 10) || 0;

    // spanタグに値を設定
    $("#span1").text(MtgTime);
    $("#span2").text(hours2);
    $("#span3").text(minutes2);

    console.log("準備・移動の時間をdiffに取得");

    // 準備・移動時間の分数をミリ秒単位で計算
    let diff = hours2 * (60 * 60 * 1000) + minutes2 * (60 * 1000);
    console.log(diff);

    // 文字列からDateオブジェクトに変換
    const MtgTime_new = new Date(MtgTime);
    if (isNaN(MtgTime_new)) {
        console.error("有効な日時を入力してください。");
        return null;
    }

    // diffの時間を追加
    PlusTime = new Date(MtgTime_new.getTime() + diff);
    $("#start_time").text(PlusTime.toLocaleTimeString()); // 結果を表示

    return PlusTime;
}

// ボタンのクリックイベント
$("#button1").click(function () {
    const result = finishTime();
    if (result) {
        console.log("出発時間が設定されました:", result.toLocaleTimeString());
    }
});

// タイマーIDを保存
let alarmTimer = null;

// 出る時間になったことをお知らせする
function startAlarmCheck() {
    if (!PlusTime) {
        console.error("出発時間が設定されていません。");
        return;
    }

    // アラームチェックを1秒ごとに行う
    alarmTimer = setInterval(function () {
        const current = updateTime(); // 現在時刻を取得
        console.log(current);

        // 出発時間と現在時刻が一致するか確認
        if (
            current.hour === PlusTime.getHours() &&
            current.minute === PlusTime.getMinutes()
        ) {
            $("#alarm_text").text("準備を開始する時間になりました！");
            console.log(`現在の時刻が${PlusTime.getHours()}時${PlusTime.getMinutes()}分になりました。`);

            // 一度だけアラームを発動させるため、setIntervalをクリア
            clearInterval(alarmTimer);

            // 1分後にアラームメッセージを消す
            setTimeout(endAlarm, 60000);
        }
    }, 1000);
}

// アラームメッセージを非表示にする関数
function endAlarm() {
    console.log("1分経ったので表示が消えます。");
    $("#alarm_text").text("");
}

// 現在時刻の更新を開始
setInterval(updateTime, 1000);
