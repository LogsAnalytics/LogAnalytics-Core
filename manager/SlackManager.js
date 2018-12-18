var Slack = require('slack-node');

webhookUri = "https://hooks.slack.com/services/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";

slack = new Slack();
slack.setWebhook(webhookUri);

module.exports = {
    slackSend:function(mensaje){
        slack.webhook({
            channel: "#logspre",
            username: "logspre",
            text: mensaje
        }, function(err, response) {
            console.log(response);
        });
    }
};
