import { useState } from 'react';
import { ethers } from 'ethers';
import './style.css';

const contractAddress = "0x01F170967F1Ec9088c169b20e57a2Eb8A4352cd3";
const abi = [
  "function getTokenIds() view returns (uint256[])"
];

export default function App() {
  const [tokenId, setTokenId] = useState(null);
  const [raribleUrl, setRaribleUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomTokenId = async () => {
    setLoading(true);
    setTokenId(null);
    setRaribleUrl(null);

    try {
      const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const tokenIds = await contract.getTokenIds();
      if (tokenIds.length === 0) {
        setTokenId("Keine Token vorhanden 😬");
        setLoading(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * tokenIds.length);
      const randomTokenId = tokenIds[randomIndex];
      setTokenId(randomTokenId.toString());

      // Bild über Rarible
      const raribleLink = `https://rarible.com/token/polygon/${contractAddress}:${randomTokenId}`;
      setRaribleUrl(raribleLink);
    } catch (error) {
      console.error("Error fetching token:", error);
      setTokenId("Error 😕");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Pick a Random NFT</h1>
      <button onClick={fetchRandomTokenId} disabled={loading}>
        {loading ? 'Loading...' : 'Pick a Winner'}
      </button>

      {tokenId && (
        <div style={{ marginTop: '2rem' }}>
          <p>Zufällig gezogene Token ID: <strong>{tokenId}</strong></p>
          {raribleUrl ? (
            <>
              <p>
                <a href={raribleUrl} target="_blank" rel="noopener noreferrer">
                  NFT auf Rarible ansehen
                </a>
              </p>
              <iframe
                src={raribleUrl}
                style={{
                  border: 'none',
                  width: '100%',
                  height: '600px',
                  marginTop: '1rem',
                  borderRadius: '8px',
                }}
                title="Rarible NFT Viewer"
              />
            </>
          ) : (
            <p>Kein Bild gefunden 🤷‍♂️</p>
          )}
        </div>
      )}
    </div>
  );
}
