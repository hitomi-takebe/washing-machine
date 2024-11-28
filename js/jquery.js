console.log("データが送信されました");
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
// 最新のfinishTimeを持つデータを取得するためのクエリ
const queryRef = query(dbRef, orderByChild('finish_time'));


// ターゲットマシン
const targetMachine = "B";

console.log("Firebase initialized successfully!");



// ここから今までのデータと一緒
// 現在時刻を表示する関数
function formatDate(date){
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // yyyy/mm/dd hh:mm:ss の形式でフォーマット
    const formattedTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;// HTMLのid="time"の要素に現在時刻を表示
    return {time:date ,hour: hours, minute: minutes, second: seconds ,formattedTime:formattedTime}; // 時間データをオブジェクトとして返す
}

function updateTime() {
    const now = new Date();
    $("#time").text(formatDate(now).formattedTime);
    return { now: now }
}

// グローバル変数として定義
let PlusTime = null;

// 入力情報の取得と表示
function finishTime() {
    // テキストボックスの値を取得
    const MtgTime = updateTime().now;
    console.log(MtgTime,"updateTimeのデータを引っ張ってきている")
    // const  = $("#daytime").val();
    const hours2 = $("#pre_hours").val();
    const minutes2 = $("#pre_mins").val();

    // spanタグに値を設定
    $("#span1").text(formatDate(MtgTime).formattedTime);
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
    $("#finish_time").text(formatDate(PlusTime).formattedTime); // 結果を表示

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


// データ登録（クリックイベント）
$("#set").on("click", function () {
    const onOff = {
        machine: $("#targetMachine").val(),
        start_time: new Date($("#span1").val()).getTime(), // UNIX時間に変換
        finish_time: new Date($("#finish_time").val()).getTime(), // UNIX時間に変換
    };

    console.log(machine, start_time, finish_time);
    // Firebase Realtime Databaseに新しいデータを追加
    const newPostRef = push(dbRef);
    set(newPostRef, onOff);
    // 入力欄をリセット
    $("#targetMachine").val("");
    $("#time").val("");
    $("#finish_time").val("");
    swal.fire({
    title: "登録しました！",
    text: "利用情報を登録しました",
    icon: "success",
    });
});

// AはA,BはBのみに表示させるようにする


onChildAdded(queryRef, function (snapshot) {
    const data = snapshot.val();  // 取得したデータ
    // 現在時刻を取得
    const now = new Date().getTime();

    // start_timeとfinish_timeをUNIXタイムスタンプに変換
    const startTime = new Date(data.start_time).getTime();
    const finishTime = new Date(data.finish_time).getTime();

    // 現在時刻が start_time と finish_time の間にある場合、利用中と表示
    if (now >= startTime && now <= finishTime) {
        $("#output2").append(`
            <div class="in-use">
                <p>【${machine}】は現在利用中です。</p>
                <p>開始時間: ${start_time}</p>
                <p>終了予定時間: ${finish_time}</p>
            </div>
        `);
    } else {
        $("#output2").append(`
            <div class="available">
                <p>【${data.machine}】は現在空いています。</p>
            </div>
        `);
    }
    // 表示件数を制限する場合は以下を追加
    if ($("#output2 .in-use").length > 2) {
        $("#output2 .in-use").first().remove();
    };
});

