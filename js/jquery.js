console.log("紐付けチェック");

// 現在時刻の取得関数
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
// 1秒ごとに実行
setInterval(updateTime, 1000);

// 集合時刻の入力をdatetimepickerを使って行う
$(function () {
    $("#daytime").datetimepicker();
});

// No.の表示(ローカルストレージの数を表示)
$(function () {
    $("#span1").text((localStorage.length)+1);
});



// cal_buttonにて準備を開始する時間を計算して表示
$("#cal_button").click(function () {
    const startTime = calculateStartTime(); // 準備を開始する時間を取得
    // 結果を表示
    $("#start_time").text(startTime.toLocaleString());
    console.log(startTime);
});

//save_button クリックイベント
$("#save_button").on("click", function () {
    // テキストボックスのvalue値を取得    
    const key = localStorage.length + 1;  //keyの番号を取得
    const titles = $("#title").val();
    const daytime = $("#daytime").val();
    const pre_hours = $("#pre_hours").val();
    const pre_mins = $("#pre_mins").val();
    const startTime = (calculateStartTime()).toLocaleString(); // 準備を開始する時間を取得、表示形式も同時に変更
    // オブジェクトを定義
    const data = { key1: key, key2: titles, key3: daytime, key4: pre_hours, key5: pre_mins , key6: startTime};
    // ローカルストレージに情報を格納する
    localStorage.setItem(key, JSON.stringify(data));
    // span1に次のNoを振り分ける
    $("#span1").text((localStorage.length) + 1);
    // 表示を更新
    load();
});


// アラームメッセージを非表示にする関数
function endAlarm() {
console.log("1分経ったので表示が消えます。");
$("#alarm_text").text("");
};
// 準備を開始時刻を計算する関数
function calculateStartTime(){
    // テキストボックスの値を取得
    const daytime = $("#daytime").val();
    const pre_hours = $("#pre_hours").val();
    const pre_mins = $("#pre_mins").val();

    // spanタグに値を設定
    $("#span3").text(daytime);
    $("#span4").text(pre_hours);
    $("#span5").text(pre_mins);

    console.log("準備・移動の時間をdiffに取得");

    // 準備・移動時間をミリ秒単位で計算
    const diff = pre_hours * (60 * 60 * 1000) + pre_mins * (60 * 1000);
    console.log(diff);
    // ミーティング時刻をDateオブジェクトに変換
    const mtgDate = new Date(daytime);
    // 準備・移動時間を引いて、開始時刻を計算
    const startTime = new Date(mtgDate.getTime() - diff);
    return startTime
}

            // <li>
            //     <p>①No: ${data.key1}</p>
            //     <p>②タイトル: ${data.key2}</p>
            //     <p>③集合時刻: ${data.key3}</p>
            //     <p>④準備＆移動にかかる時間: ${data.key4}時間 ${data.key5}分</p>
            //     <p>⑤準備を開始する時間: ${data.key6}</p>
            // </li>
// 読込関数
function load() {
    // リストをクリア
    $("#list").empty();
    // localStorageに保存されたすべてのデータを表示
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(key));
        // 表示用のHTMLを生成
        const html = `
            <tbody>
                <td>${data.key1}</td>
                <td>${data.key2}</td>
                <td>${data.key3}</td>
                <td>${data.key4}時間 ${data.key5}分</td>
                <td>${data.key6}</td>
            </tbody>
        `;
        $("#list").append(html);
    }
}

// ページ読み込み時にデータを表示
$(document).ready(function () {
    load();
});

    //2.clear クリックイベント
$("#clear_button").on("click", function () {
    // ローカルストレージの内容を削除
    localStorage.clear();
    $("#list").empty();
    // 「入力」の情報をリセット
    $("#span1").text("1");
    $("#title").val("");
    $("#daytime").val("");
    $("#pre_hours").val("");
    $("#pre_mins").val("");
    $("#start_time").text("");
});





// ここから先は要修正
// 出る時間になったことをお知らせする
// $(function () {
//     // 出発時間（準備を開始する時間）を1度計算
//     const startTime = calculateStartTime(); // 出発時刻を取得
//     const current = updateTime(); // 現在時刻を取得

//     // アラームを1秒ごとにチェック
//     const alarmInterval = setInterval(function alarm() {
//         // 出発時間と現在時刻が一致するか確認
//         if (current.hour === startTime.getHours() && current.minute === startTime.getMinutes()) {
//             $("#alarm_text").text("準備を開始する時間になりました！");
//             console.log(`現在の時刻が${startTime.getHours()}時${startTime.getMinutes()}分になりました。`);
//             // アラームを1度だけ発動させるため、setIntervalをクリア
//             clearInterval(alarmInterval);
//             // 1分後にアラームメッセージを消す
//             setTimeout(endAlarm, 60000);
//         }
//     }, 1000);
// });
