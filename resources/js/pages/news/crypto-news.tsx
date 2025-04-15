import NewsPage from './news-page';

export default function CryptoNews() {
    return (
        <NewsPage
            title="Crypto"
            apiEndpoint="/news/crypto"
            category="crypto"
        />
    )
}