// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
require('date-utils');
// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {

        if (event.type == "message" && event.message.type == "text"){

            // if (event.message.text.match(/.*ゴミ.*/)){

                //日付取得
                let today = new Date()
                //曜日取得
                let weekofday = today.getDate();

                //何回目の曜日取得
                let weekNum = Math.floor((weekofday + 6) / 7)

                if (weekofday == 1 || weekofday == 4){
                    message_text = "今日は燃えるゴミの日です。";
                }
                if (weekNum == 1){
                    if (weekofday == 2){
                        message_text = "今日は紙・布類・ビン・缶の日です";
                    } else if (weekofday == 3){
                        message_text = "今日はペットボトルの日です";
                    }
                }
                if (weekNum == 2){
                    if (weekofday == 2){
                        message_text = "今日は燃えないゴミの日です";
                    }
                }
                if (weekNum == 3){
                    if (weekofday == 2){
                        message_text = "今日は紙・布類・ビン・缶の日です";
                    } else if (weekofday = 3){
                        message_text = "今日はペットボトルの日です";
                    }
                }
                if (weekNum == 4){
                    if (weekofday == 2){
                        message_text = "今日は燃えないゴミの日です";
                    }
                }
            // } else {
            //         message_text = `今日のごみが何の日か尋ねてみて？今日のごみが何のゴミを出す日なのか教えてくれるよ～^^`;
            // }
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});

// // -----------------------------------------------------------------------------
// // モジュールのインポート
// const server = require("express")();
// const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

// // -----------------------------------------------------------------------------
// // パラメータ設定
// const line_config = {
//     channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
//     channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
// };

// // -----------------------------------------------------------------------------
// // Webサーバー設定
// server.listen(process.env.PORT || 3000);

// // APIコールのためのクライアントインスタンスを作成
// const bot = new line.Client(line_config);

// // -----------------------------------------------------------------------------
// // ルーター設定
// server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
//     // 先行してLINE側にステータスコード200でレスポンスする。
//     res.sendStatus(200);

//     // すべてのイベント処理のプロミスを格納する配列。
//     let events_processed = [];

//     // イベントオブジェクトを順次処理。
//     req.body.events.forEach((event) => {
//         // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
//         if (event.type == "message" && event.message.type == "text"){
//             // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
//             if (event.message.text == "こんにちは"){
//                 // replyMessage()で返信し、そのプロミスをevents_processedに追加。
//                 events_processed.push(bot.replyMessage(event.replyToken, {
//                     type: "text",
//                     text: "これはこれは"
//                 }));
//             }
//         }
//     });

//     // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
//     Promise.all(events_processed).then(
//         (response) => {
//             console.log(`${response.length} event(s) processed.`);
//         }
//     );
// });
