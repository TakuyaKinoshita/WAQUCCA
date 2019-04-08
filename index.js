// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const dialogflow = require('dialogflow');
// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// Dialogflowのクライアントインスタンスを作成
const session_client = new dialogflow.SessionsClient({
    project_id: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }
});

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {

        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            events_processed.push(
                session_client.detectIntent({
                    session: sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, event.source.user_id),
                    queryInput: {
                        text: {
                            text: event.message.text,
                            languageCode: "ja",
                        }
                    }
                }).then((responses) => {
                    if (responses[0].queryResult && responses[0].queryResult.intent == "gomicounter"){
                            
                        let message_text
                        if (responses[0].queryResult.parameters.fields.gomi.stringValue){
                        
                            //日付取得
                            // let today = new Date().toFormat("MM/DD");
                            
                            //0-6 = 月曜日ー日曜日
                            // let dateOfWeek = today.getDate();
                            
                            // //何週目か
                            // let recode = event.recode;
                            // if (recode['日付']['value']){
                            //     var m = moment(recode['日付']['value']);
                            //     var WeekNum = Math.floor((m.date() - m.day() + 12) / 7);
                            // }

                            // if (dateOfWeek == 1 || dateOfWeek == 4){
                                message_text = "今日は燃えるゴミの日です。";
                            // }
                            // if (weekNum == 1){
                            //     if (dateOfWeek == 0){
                            //         message_text = "今日は燃えないゴミの日です";
                            //     }
                            // }
                            // if (weekNum == 2){
                            //     if (dateOfWeek == 0){
                            //         message_text = "今日は紙・布類・ビン・缶を捨てる日です";
                            //     } else if (dateOfWeek == 2){
                            //         message_text = "今日はペットボトルを出す日です";
                            //     }
                            // }
                            // if (weekNum == 3){
                            //     if (dateOfWeek == 0){
                            //         message_text = "今日は燃えないゴミの日です";
                            //     }
                            // }
                            // if (weekNum == 4){
                            //     if (dateOfWeek == 0){
                            //         message_text = "今日は紙・布類・ビン・缶を出す日です";
                            //     } else if (dateOfWeek = 2){
                            //         message_text = "今日はペットボトルを捨てる日です";
                            //     }
                            // }

                            } 
                        // else {
                        //     message_text = `今日のごみが何の日か尋ねてみて？今日のごみが何のゴミを出す日なのか教えてくれるよ～^^`;
                        // }
                        return bot.replyMessage(event.replyToken, {
                            type: "text",
                            text: message_text
                        });
                    }
                })
            );
        }
        // if (event.type == "message" && event.message.type == "text"){
        //     // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
        //     if (event.message.text == "こんにちは"){
        //         // replyMessage()で返信し、そのプロミスをevents_processedに追加。
        //         events_processed.push(bot.replyMessage(event.replyToken, {
        //             type: "text",
        //             text: "これはこれは"
        //         }));
        //     }
        // }
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
