
// Firebase SDKをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    set, 
    onChildAdded, 
    query, 
    orderByChild 
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Firebaseの設定情報（Firebaseプロジェクトから取得）
const firebaseConfig = {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyAzgo4GGX8YmFoFDoFO1oa8rSEltSJWs0I",
    authDomain: "dev28-27322.firebaseapp.com",
    databaseURL: "https://dev28-27322-default-rtdb.firebaseio.com",
    projectId: "dev28-27322",
    storageBucket: "dev28-27322.firebasestorage.app",
    messagingSenderId: "47494104071",
    appId: "1:47494104071:web:33edcdd84cbbf9963fd6a2",
    measurementId: "G-NTE1SBFX7R"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "time");

// メッセージをタイムスタンプ順に取得するクエリ
// 最新10件を取得するクエリ
const q = query(dbRef, orderByChild("timestamp"));

// ターゲットマシン
const targetMachine = "B";

console.log("Firebase initialized successfully!");

// データ登録（クリックイベント）
$("#set").on("click", function () {
    const msg = {
        machine:$("#targetMachine").val(),
        time: $("#time").val(),
        finish_time: $("#finish_time").val(),
    };

    // Firebase Realtime Databaseに新しいデータを追加
    const newPostRef = push(dbRef);
    set(newPostRef, msg);

    // 入力欄をリセット
    $("#targetMachine").val("");
    $("#time").val("");
    $("#finish_time").val("");
    console.log("データが送信されました:", msg);
});

// データ取得（リアルタイムで表示）
onChildAdded(q, function (data) {
    const msg = data.val();

    // 指定のマシンに一致するデータのみを表示
    if (msg.machine === targetMachine) {
        const html = `
            <div class="message">
                <p class="uname">${msg.uname} さん</p>
                <div class="text_box"> 
                    <p class="text">${msg.machine}についてです。${msg.text}</p>
                </div>
                <p class="nowDate">${msg.nowDate}</p> 
            </div>
        `;
        // 最新メッセージを先頭に表示
        $("#output").prepend(html);
        // メッセージが10件を超えた場合、古いメッセージを削除
        if ($("#output .message").length > 10) {
            $("#output .message").last().remove();
        }
    }
});

// ここから今までのデータと一緒

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
    const hours2 = $("#pre_hours").val();
    const minutes2 = $("#pre_mins").val();

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
    $("#finish_time").text(PlusTime.toLocaleTimeString()); // 結果を表示

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
