const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('mainnet-beta'));

async function fetchWalletData(walletAddress) {
    try {
        const publicKey = new PublicKey(walletAddress);

        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey);
        console.log(`SOL Balance: ${(solBalance / 1e9).toFixed(2)} SOL`);

        // Fetch token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        const tokenHoldings = [];
        for (const accountInfo of tokenAccounts.value) {
            const { mint, amount } = accountInfo.account.data.parsed.info;

            // Fetch metadata for the token
            try {
                const metadataPDA = await Metadata.findPDA(new PublicKey(mint));
                const metadataAccount = await Metadata.load(connection, metadataPDA);

                const { data } = metadataAccount;
                tokenHoldings.push({
                    name: data.name,
                    symbol: data.symbol,
                    amount: parseFloat(amount) / Math.pow(10, data.decimals),
                });
            } catch (e) {
                console.warn(`Failed to fetch metadata for mint: ${mint}`);
            }
        }

        return {
            solBalance: (solBalance / 1e9).toFixed(2),
            tokenHoldings,
        };
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        throw error;
    }
}

// Export for use in Express API
module.exports = { fetchWalletData };
