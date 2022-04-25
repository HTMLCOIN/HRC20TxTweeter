// Sign up with the twitter account that you want to use at https://developer.twitter.com/en and follow the README on the repo.
const twitterClient = {
    appKey: "INSERTKEY",
    appSecret: "INSERTKEY",
    accessToken: "INSERTKEY",
    accessSecret: "INSERTKEY",
};

const Settings = {
    decimalView: 8, // HTMLCoin's decimal view, do not update.
    hrc20Name: '', // Update HRC20's Token Symbol. You can retrieve token information at https://explorer.htmlcoin.com/tokens/search. Example - Codex
    hrc20Symbol: '', // Update HRC20's Token Symbol. You can retrieve token information at https://explorer.htmlcoin.com/tokens/search. Example - CDEX
    messageIcons: ['🚨', '💰'], // Add icons that will be randomized for each tweet. Add more from https://getemoji.com/ .
    minimumTxnAmount: 1 // Update minimum transaction value to trigger alert.
};

module.exports = { 
    twitterClient,
    Settings
};