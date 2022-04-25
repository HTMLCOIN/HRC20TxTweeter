// Load modules and constants
const fs = require("fs");
const fetch = require("node-fetch");
const { TwitterApi } = require("twitter-api-v2");
const BASEDIR = process.cwd();
const { twitterClient, Settings } = require(`${BASEDIR}/config.js`);

const client = new TwitterApi({
  appKey: twitterClient.appKey,
  appSecret: twitterClient.appSecret,
  accessToken: twitterClient.accessToken,
  accessSecret: twitterClient.accessSecret,
});

// Check if the tracking directory exists and if not, then create it.
if (!fs.existsSync(`${BASEDIR}/tracking/`)) {
  fs.mkdirSync(`${BASEDIR}/tracking/`);
}

// Check if the tweeted hashes json file exists and if not, then create it.
if (!fs.existsSync(`${BASEDIR}/tracking/tweetedHashes.json`)) {
  // Write the tweetedHashes array to the tracking directory
  fs.writeFileSync(
    `${BASEDIR}/tracking/tweetedHashes.json`,
    JSON.stringify([], null, 2)
  );
}

// Main function - called asynchronously
async function main() {
  console.log("Loading tweeted hashes");

  // Load the tweeted hashes json file and parse it as JSON
  const tweetedHashesFile = fs.readFileSync(
    `${BASEDIR}/tracking/tweetedHashes.json`
  );
  const tweetedHashes = JSON.parse(tweetedHashesFile);

  try {
    console.log("Retrieving latest transactions");

    // Setup the API details
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Call the fetchWithRetry function that will perform the API call
    const response = await fetchWithRetry(
      "https://info.htmlcoin.com/api/recent-txs",
      options
    );
    
    console.log("Looping through latest transactions");

    // Loop through the transactions returned from the API call
    for (const transaction of response) {

      let processTweet = false;
      let hrc20TokenValue = 0;
      let hrc20DecimalValue = 0;

      // Only check transaction contents if HRC20 token transfer is part of transaction
      if (transaction.hasOwnProperty('hrc20TokenTransfers')) {

        // Check if transaction contains specific HRC20 transfers
        for (i = 0; i < transaction.hrc20TokenTransfers.length; i++) {
          if (transaction.hrc20TokenTransfers[i].symbol === Settings.hrc20Symbol && transaction.hrc20TokenTransfers[i].name === Settings.hrc20Name) {
            processTweet = true;
            hrc20TokenValue = transaction.hrc20TokenTransfers[i].value;
            hrc20DecimalValue = transaction.hrc20TokenTransfers[i].decimals;
            break;
          }
        }   
      }

      // Only tweet the transaction if none of the addresses are blocked
      if(processTweet) {
        // Check if the transaction hash can be found in the tweeted hashes file and only process it if it is not in the file
        if (!tweetedHashes.includes(transaction.id)) {
          // Format the value fields
          const transactionValue = (
            Math.floor(parseFloat(hrc20TokenValue) / Math.pow(10, hrc20DecimalValue))
          );
          
          const transactionFee = (
            parseFloat(transaction.fees) / Math.pow(10, Settings.decimalView)
          ).toFixed(Settings.decimalView);

          // Check if the transaction value is greater than the minimumTxnAmount amount
          if (transactionValue >= Settings.minimumTxnAmount) {

            console.log(`Processing ${transaction.id}`);

            console.log(
              "--------------------------------------------------------------------------------------------"
            );
            console.log(`Transaction Amount: ${transactionValue} ${Settings.hrc20Symbol}`);
            console.log(`Transaction Fee: ${transactionFee} HTML`);
            console.log(
              `Transaction URL: https://explorer.htmlcoin.com/tx/${transaction.id}`
            );

            // Build tweet text
            const tweetIcon = Settings.messageIcons[Math.floor(Math.random()*Settings.messageIcons.length)]
            const tweetText = `${tweetIcon}${Settings.hrc20Symbol} Transaction Alert${tweetIcon}\r\n\r\nTransaction Amount: ${transactionValue} ${Settings.hrc20Symbol}\r\nTransaction Fee: ${transactionFee} HTML\r\n\r\n\r\nTransaction URL: https://explorer.htmlcoin.com/tx/${transaction.id}\r\n`;
            
            console.log(`Tweeting ${transaction.id}`);

            // Tweet from account
            await client.v1
              .tweet(tweetText)
              .then((val) => {
                console.log(`Tweet posted for ${transaction.id}`);
              
                // If tweet was successful, then add the transaction hash to the tweeted hashes array
                tweetedHashes.push(transaction.id);
              })
              .catch((err) => {
                console.log(`Attempted to post Tweet for ${transaction.id}`);
                console.log(err);
              });
          }
        }
      }
    }

    console.log(
      "Done with transaction processing and tweets. Writing tweeted hashes to disk."
    );

    // Write the updated tweetedHashes array to the tracking directory
    fs.writeFileSync(
      `${BASEDIR}/tracking/tweetedHashes.json`,
      JSON.stringify(tweetedHashes, null, 2)
    );
  } catch (error) {
    console.log(error);

    // Write the tweetedHashes array to the tracking directory
    fs.writeFileSync(
      `${BASEDIR}/tracking/tweetedHashes.json`,
      JSON.stringify(tweetedHashes, null, 2)
    );
  }
}

// Start the main process.
main();

// fetchWithRetry function - This function is used to perform API calls
function fetchWithRetry(url, options) {
  return new Promise((resolve, reject) => {
    // Set maximum number of retries for the API call
    let numberOfRetries = 1;

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_url, _options, _numberOfRetries) => {
      // Perform the API call
      return fetch(_url, _options)
        .then(async (res) => {
          // Create a variable that will contain the HTTP Status code
          const status = res.status;

          // Check the status and if 200, then move to the processing part of the object
          if (status === 200) {
            return resolve(res.json());
          } // If the status is not 200, throw an error and move to the catch block
          else {
            throw `ERROR STATUS: ${status}`;
          }
        })
        .catch(async (error) => {
          console.error(`CATCH ERROR: ${error}`);

          // Check if there are any retry attempts left
          if (_numberOfRetries !== 0) {
            console.log(`Retrying api call`);

            fetch_retry(_url, _options, _numberOfRetries - 1);
          } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
            console.log("All requests were unsuccessful for current item.");
            reject(error);
          }
        });
    };

    // Call the fetch_retry constant. Pass in the meta JSON object and the total number of retries for the API call should it experience any issues.
    return fetch_retry(url, options, numberOfRetries);
  });
}
