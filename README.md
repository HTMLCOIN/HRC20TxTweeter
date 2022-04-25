# Hrc20WhalePost
Node js project to post to twitter when HRC20 token transactions exceeds a specific transaction value

1. Go to https://dev.to/codesphere/using-the-twitter-api-with-nodejs-4p3c for tutorial if you want to follow it.

2. Go to https://developer.twitter.com/en/apply-for-access and create a developer account. This should be from the account where you want to tweet from.

3. Request elevated rights on your account.

4. Create a new project and also elevate the rights on the oAuth v1 API to read and write. You need to give a callback URL, I simply gave my static website as I won't be using oAuth in that way.

5. Generate access token and secret.

6. Extract zip file and run "npm install" from the root directory of the unzipped folder.
The following dependencies will be installed:

- `"node-fetch": "^2.6.7"`
- `"twitter-api-v2": "^1.12.0"`

7. Replace the values in the config.js for the following fields:
    - `appKey` - Retrieved from twitter developer account
    - `appSecret` - Retrieved from twitter developer account
    - `accessToken` - Retrieved from twitter developer account
    - `accessSecret` - Retrieved from twitter developer account
    - `hrc20Name` - Update HRC20's Token Symbol. You can retrieve token information at https://explorer.htmlcoin.com/tokens/search. Example - Codex
    - `hrc20Symbol` - Update HRC20's Token Symbol. You can retrieve token information at https://explorer.htmlcoin.com/tokens/search. Example - CDEX
    - `messageIcons` - Add icons that will be randomized for each tweet. Add more from https://getemoji.com/ .
    - `minimumTxnAmount` - Update minimum transaction value to trigger alert.

8. Run `node hrc20TokenGetLatestTxns.js` from the root directory of the unzipped folder.

## Console Outputs:

### New Tweets
````
Hrc20WhalePost roebou$ node hrc20TokenGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Processing 7b57f14e2a471044b14bedab95252edaa164d3c19927bf01cad8e110e08ab871
--------------------------------------------------------------------------------------------
Transaction Amount: 43 CDEX
Transaction Fee: 0.06524520 HTML
Transaction URL: https://info.htmlcoin.com/tx/7b57f14e2a471044b14bedab95252edaa164d3c19927bf01cad8e110e08ab871
Tweeting 7b57f14e2a471044b14bedab95252edaa164d3c19927bf01cad8e110e08ab871

Processing 07eeec1f76ac0d3e202ec2a61ff90a44e5f606efd363a6847ffb870cc4eefed4
--------------------------------------------------------------------------------------------
Transaction Amount: 871105 CDEX
Transaction Fee: 0.03960100 HTML
Transaction URL: https://info.htmlcoin.com/tx/07eeec1f76ac0d3e202ec2a61ff90a44e5f606efd363a6847ffb870cc4eefed4
Tweeting 07eeec1f76ac0d3e202ec2a61ff90a44e5f606efd363a6847ffb870cc4eefed4

Processing 656157181342df004ad57d8f42e972d2bcdcce92965d09b3c81b34a8e04e1568
--------------------------------------------------------------------------------------------
Transaction Amount: 76 CDEX
Transaction Fee: 0.06527080 HTML
Transaction URL: https://info.htmlcoin.com/tx/656157181342df004ad57d8f42e972d2bcdcce92965d09b3c81b34a8e04e1568
Tweeting 656157181342df004ad57d8f42e972d2bcdcce92965d09b3c81b34a8e04e1568

Done with transaction processing and tweets. Writing tweeted hashes to disk.
Hrc20WhalePost roebou$ node hrc20TokenGetLatestTxns.js 
````

### Nothing New To Tweet
````
Hrc20WhalePost roebou$ node hrc20TokenGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Done with transaction processing and tweets. Writing tweeted hashes to disk.
Hrc20WhalePost roebou$
````

### Trying to tweet the same thing again (Removed some of the error lines)
````
Hrc20WhalePost roebou$ node hrc20TokenGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Processing e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5

Transaction Amount: 500500.76036000
Transaction Fee: 0.00175200
Transaction Hash: e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Transaction URL: https://explorer.htmlcoin.com/tx/e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Tweeting e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Attempted to post Tweet for e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
ApiResponseError: Request failed with code 403 - Status is a duplicate. (Twitter code 187)

Transaction Amount: 500505.76211200
Transaction Fee: 0.00175200
Transaction Hash: 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Transaction URL: https://explorer.htmlcoin.com/tx/748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Tweeting 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Attempted to post Tweet for 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
ApiResponseError: Request failed with code 403 - Status is a duplicate. (Twitter code 187)
Hrc20WhalePost roebou$
````
