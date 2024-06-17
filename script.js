document.addEventListener('DOMContentLoaded', () => {
    // Initialize the typing effect
    new Typed('#typing', {
        strings: ['Welcome to DABL Club', 'Welcome to Crypto Friends'],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 500,
        loop: true
    });

    document.getElementById('connectWallet').addEventListener('click', async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                document.getElementById('status').innerText = `Connected: ${account}`;
                document.getElementById('connectWallet').style.display = 'none';
                document.getElementById('disconnectWallet').style.display = 'inline-block';

                // Retrieve and display ETH balance
                const balance = await web3.eth.getBalance(account);
                const ethBalance = web3.utils.fromWei(balance, 'ether');
                document.getElementById('balance').innerText = `ETH Balance: ${ethBalance} ETH`;

                // Retrieve and display NFT balance
                const nfts = await fetchNFTs(account);
                displayNFTs(nfts);

                // Retrieve points from local storage
                let points = localStorage.getItem('points');
                points = points ? parseInt(points) : 0;

                // Increment points
                points += 1;

                // Store updated points in local storage
                localStorage.setItem('points', points);

                // Display updated points
                document.getElementById('points').innerText = `Points: ${points}`;
            } catch (error) {
                document.getElementById('status').innerText = `Error: ${error.message}`;
            }
        } else {
            document.getElementById('status').innerText = 'MetaMask not detected. Please install MetaMask.';
        }
    });

    // Disconnect wallet
    document.getElementById('disconnectWallet').addEventListener('click', () => {
        document.getElementById('status').innerText = 'Disconnected';
        document.getElementById('balance').innerText = '';
        document.getElementById('nfts').innerText = '';
        document.getElementById('connectWallet').style.display = 'inline-block';
        document.getElementById('disconnectWallet').style.display = 'none';
    });

    // On page load, display points
    window.addEventListener('load', () => {
        let points = localStorage.getItem('points');
        points = points ? parseInt(points) : 0;
        document.getElementById('points').innerText = `Points: ${points}`;
    });

    // Simple click game to earn points
    document.getElementById('clickGame').addEventListener('click', () => {
        // Retrieve points from local storage
        let points = localStorage.getItem('points');
        points = points ? parseInt(points) : 0;

        // Increment points
        points += 1;

        // Store updated points in local storage
        localStorage.setItem('points', points);

        // Display updated points
        document.getElementById('points').innerText = `Points: ${points}`;
    });

    // Fetch NFTs using OpenSea API
    async function fetchNFTs(account) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&offset=0&limit=20`;
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        return data.assets;
    }

    // Display NFTs
    function displayNFTs(nfts) {
        const nftsContainer = document.getElementById('nfts');
        nftsContainer.innerHTML = '<h3>NFTs:</h3>';
        nfts.forEach(nft => {
            const nftElement = document.createElement('div');
            nftElement.className = 'nft';
            nftElement.innerHTML = `
                <img src="${nft.image_url}" alt="${nft.name}" width="100">
                <p>${nft.name}</p>
            `;
            nftsContainer.appendChild(nftElement);
        });
    }
});
