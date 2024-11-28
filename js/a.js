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

};


// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

// メッセージをタイムスタンプ順に取得するクエリ
// 最新10件を取得するクエリ
const q = query(dbRef, orderByChild("timestamp"));

// ターゲットマシン
const targetMachine = "A";

console.log("Firebase initialized successfully!");

// データ登録（クリックイベント）
$("#send").on("click", function () {
    const msg = {
        machine: "A",
        uname: $("#uname").val(),
        text: $("#text").val(),
        timestamp: new Date().getTime(), // タイムスタンプ
        nowDate: new Date().toLocaleString(), // 現在日時をフォーマット
    };

    // Firebase Realtime Databaseに新しいデータを追加
    const newPostRef = push(dbRef);
    set(newPostRef, msg);

    // 音声追加
    $("#play-button").get(0).play();
    // 入力欄をリセット
    $("#uname").val("");
    $("#text").val("");
    console.log("データが送信されました:", msg);
    swal.fire({
    title: "登録しました！",
    text: "コメントを登録しました",
    icon: "success",
    });
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
                    <p class="text">${msg.text}</p>
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
